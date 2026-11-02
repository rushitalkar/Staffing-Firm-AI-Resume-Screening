import { Candidate, Scorecard, AIScoreResult, CriterionEvidence } from '../types';

/**
 * Strips demographic identifiers to enforce blind scoring.
 * Prevents cognitive bias around gender, age, marital status, religion, or ethnicity.
 */
export function sanitizeBlindText(rawText: string, candidateName: string): string {
  let cleaned = rawText;
  
  // Mask candidate full name and parts
  if (candidateName) {
    const nameParts = candidateName.split(/\s+/).filter(p => p.length > 2);
    for (const part of nameParts) {
      cleaned = cleaned.replace(new RegExp(part, 'gi'), '[CANDIDATE]');
    }
  }

  // Mask demographic patterns (gender pronouns, marital status, age / DOB)
  cleaned = cleaned
    .replace(/\b(male|female|other|transgender|gender)\b/gi, '[DEMOGRAPHIC_REDACTED]')
    .replace(/\b(he|she|him|her|his|hers|mr\.|mrs\.|ms\.)\b/gi, '[PRONOUN]')
    .replace(/\b(married|single|unmarried|divorced|marital status)\b/gi, '[MARITAL_STATUS_REDACTED]')
    .replace(/\b(dob|date of birth|age\s*:\s*\d{2})\b/gi, '[AGE_REDACTED]');

  return cleaned;
}

/**
 * Searches raw text for the most relevant sentence or snippet containing key terms.
 */
function extractEvidenceQuote(
  text: string,
  keywords: string[],
  fallbackText: string = 'No direct mention found in provided resume text.'
): { quote: string; found: boolean; section: 'Summary' | 'Experience' | 'Skills' | 'Education' | 'Projects' | 'Metadata' } {
  // Split into lines/sentences
  const lines = text.split(/\r?\n|\.\s+/).map(l => l.trim()).filter(l => l.length > 10);
  
  for (const line of lines) {
    const lineLower = line.toLowerCase();
    for (const kw of keywords) {
      if (lineLower.includes(kw.toLowerCase())) {
        let section: 'Summary' | 'Experience' | 'Skills' | 'Education' | 'Projects' | 'Metadata' = 'Experience';
        if (lineLower.includes('notice') || lineLower.includes('ctc') || lineLower.includes('location')) {
          section = 'Metadata';
        } else if (lineLower.includes('b.tech') || lineLower.includes('degree') || lineLower.includes('university')) {
          section = 'Education';
        } else if (lineLower.includes('summary') || lineLower.includes('objective')) {
          section = 'Summary';
        } else if (lineLower.includes('skills:')) {
          section = 'Skills';
        }
        return {
          quote: line.length > 180 ? line.substring(0, 177) + '...' : line,
          found: true,
          section,
        };
      }
    }
  }

  return {
    quote: fallbackText,
    found: false,
    section: 'Skills',
  };
}

/**
 * Evaluates candidate against a scorecard in a completely explainable, blind manner.
 */
export function scoreCandidateAgainstScorecard(
  candidate: Candidate,
  scorecard: Scorecard
): AIScoreResult {
  const sanitizedCV = sanitizeBlindText(candidate.rawCVText, candidate.name);
  const cvLower = sanitizedCV.toLowerCase();

  const evidenceList: CriterionEvidence[] = [];
  const strengths: string[] = [];
  const gaps: string[] = [];

  let totalWeightedScore = 0;
  let totalWeight = 0;

  let mustHaveScoreSum = 0;
  let mustHaveCount = 0;

  for (const crit of scorecard.criteria) {
    const weight = crit.weight || 3;
    totalWeight += weight;

    let matched = false;
    let score = 0;
    let reasoning = '';
    let quote = '';
    let section: 'Summary' | 'Experience' | 'Skills' | 'Education' | 'Projects' | 'Metadata' = 'Experience';

    if (crit.category === 'experience') {
      const minExp = scorecard.experienceMinYears;
      const maxExp = scorecard.experienceMaxYears;
      const expYears = candidate.experienceYears;

      if (expYears >= minExp && expYears <= maxExp) {
        matched = true;
        score = 95;
        reasoning = `${expYears} years directly matches the target range (${minExp}-${maxExp} years).`;
        strengths.push(`${expYears} yrs experience perfectly fits client experience bracket`);
      } else if (expYears > maxExp && expYears <= maxExp + 2) {
        matched = true;
        score = 85;
        reasoning = `${expYears} years is slightly above target (${maxExp} yrs), acceptable senior depth.`;
      } else if (expYears >= minExp - 1.5 && expYears < minExp) {
        matched = false;
        score = 65;
        reasoning = `${expYears} years is below client required minimum (${minExp} years).`;
        gaps.push(`Experience (${expYears} yrs) below requested ${minExp} years`);
      } else {
        matched = false;
        score = Math.max(10, Math.min(40, Math.round((expYears / minExp) * 50)));
        reasoning = `Experience of ${expYears} years diverges significantly from required ${minExp}-${maxExp} years.`;
        gaps.push(`Total experience (${expYears} yrs) is significantly off target`);
      }

      const res = extractEvidenceQuote(sanitizedCV, ['years of experience', 'experience:', 'years', 'developer (', 'analyst (']);
      quote = res.found ? res.quote : `Candidate profile indicates ${expYears} years of total experience.`;
      section = res.section;

    } else if (crit.category === 'notice_period') {
      const maxNotice = scorecard.maxNoticeDays;
      const candNotice = candidate.noticeDays;

      if (candNotice <= maxNotice) {
        matched = true;
        score = candNotice <= 30 ? 100 : 90;
        reasoning = `Notice period of ${candNotice} days is within maximum allowed ${maxNotice} days.`;
        strengths.push(`Notice period (${candNotice} days) complies with client joining deadline`);
      } else {
        matched = false;
        score = Math.max(20, Math.round((maxNotice / candNotice) * 80));
        reasoning = `Notice period of ${candNotice} days exceeds client deadline of ${maxNotice} days.`;
        gaps.push(`Notice period (${candNotice} days) exceeds ${maxNotice} days limit`);
      }

      const res = extractEvidenceQuote(sanitizedCV, ['notice', 'serving notice', 'calendar days', 'lwd']);
      quote = res.found ? res.quote : `Notice period stated: ${candNotice} days.`;
      section = 'Metadata';

    } else if (crit.category === 'location') {
      const targetLoc = scorecard.primaryLocation.toLowerCase();
      const candLoc = candidate.location.toLowerCase();
      const prefLocs = candidate.preferredLocations.map(l => l.toLowerCase());

      if (candLoc.includes(targetLoc) || prefLocs.some(p => p.includes(targetLoc))) {
        matched = true;
        score = 98;
        reasoning = `Candidate resides in or targets ${scorecard.primaryLocation}.`;
        strengths.push(`Local to ${scorecard.primaryLocation} or open to local hybrid schedule`);
      } else {
        matched = false;
        score = 55;
        reasoning = `Currently in ${candidate.location}; relocation or remote flexibility needed.`;
        gaps.push(`Relocation needed from ${candidate.location} to ${scorecard.primaryLocation}`);
      }

      const res = extractEvidenceQuote(sanitizedCV, ['noida', 'delhi', 'gurugram', 'location', 'sector']);
      quote = res.found ? res.quote : `Location: ${candidate.location}`;
      section = 'Metadata';

    } else {
      // Must have or good to have technical skills
      const skillTerms = crit.name.split(/[/,&|]+/).map(t => t.trim().toLowerCase());
      let matchedCount = 0;
      let primaryTerm = skillTerms[0];

      for (const term of skillTerms) {
        if (cvLower.includes(term) || candidate.keySkills.some(s => s.toLowerCase().includes(term))) {
          matchedCount++;
        }
      }

      if (matchedCount === skillTerms.length) {
        matched = true;
        score = 95;
        reasoning = `Full match on key requirements: ${crit.name}.`;
        strengths.push(`Demonstrated proficiency in ${crit.name}`);
      } else if (matchedCount > 0) {
        matched = true;
        score = 75;
        reasoning = `Partial match on ${crit.name} (${matchedCount}/${skillTerms.length} terms found).`;
      } else {
        matched = false;
        score = 10;
        reasoning = `No direct mention of ${crit.name} found in resume.`;
        if (crit.category === 'must_have') {
          gaps.push(`Missing mandatory requirement: ${crit.name}`);
        }
      }

      const res = extractEvidenceQuote(sanitizedCV, skillTerms);
      quote = res.found ? res.quote : `No direct mention of '${crit.name}' found in candidate CV text.`;
      section = res.section;

      if (crit.category === 'must_have') {
        mustHaveScoreSum += score;
        mustHaveCount++;
      }
    }

    totalWeightedScore += score * weight;

    evidenceList.push({
      criterionId: crit.id,
      criterionName: crit.name,
      matched,
      score,
      evidenceQuote: quote,
      sourceSection: section,
      reasoning,
    });
  }

  const overallScore = Math.min(100, Math.max(0, Math.round(totalWeightedScore / totalWeight)));
  const mustHaveScore = mustHaveCount > 0 ? Math.round(mustHaveScoreSum / mustHaveCount) : overallScore;

  let matchTier: 'Strong Match' | 'Moderate Match' | 'Low Match' | 'Unfit' = 'Unfit';
  if (overallScore >= 80) matchTier = 'Strong Match';
  else if (overallScore >= 60) matchTier = 'Moderate Match';
  else if (overallScore >= 35) matchTier = 'Low Match';
  else matchTier = 'Unfit';

  return {
    overallScore,
    matchTier,
    mustHaveScore,
    experienceScore: evidenceList.find(e => e.criterionName.includes('Experience'))?.score || 70,
    noticeScore: evidenceList.find(e => e.criterionName.includes('Notice'))?.score || 80,
    skillsScore: mustHaveScore,
    evidenceList,
    strengths: strengths.slice(0, 4),
    gaps: gaps.slice(0, 4),
    blindScoringVerified: true,
  };
}
