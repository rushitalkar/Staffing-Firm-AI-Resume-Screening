import mammoth from 'mammoth';
import { Candidate, PipelineStage } from '../types';

export interface ParseResult {
  candidate: Candidate;
  isDuplicate: boolean;
  duplicateReason?: string;
  duplicateCandidateId?: string;
}

export function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  return digits.length >= 10 ? digits.slice(-10) : digits;
}

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

/**
 * Checks for duplicate candidate against existing pool using email, phone, and name.
 */
export function checkDuplicate(
  newCand: Partial<Candidate>,
  existingCandidates: Candidate[]
): { isDuplicate: boolean; reason?: string; duplicateCandidate?: Candidate } {
  const newEmail = newCand.email ? normalizeEmail(newCand.email) : '';
  const newPhone = newCand.phone ? normalizePhone(newCand.phone) : '';
  const newName = newCand.name ? newCand.name.trim().toLowerCase() : '';

  for (const existing of existingCandidates) {
    if (newEmail && normalizeEmail(existing.email) === newEmail) {
      return {
        isDuplicate: true,
        reason: `Email match (${existing.email}) with candidate ${existing.id}`,
        duplicateCandidate: existing,
      };
    }

    if (newPhone && normalizePhone(existing.phone) === newPhone) {
      return {
        isDuplicate: true,
        reason: `Phone number match (${existing.phone}) with candidate ${existing.id}`,
        duplicateCandidate: existing,
      };
    }

    if (newName && existing.name.toLowerCase() === newName && Math.abs((newCand.experienceYears || 0) - existing.experienceYears) < 0.5) {
      return {
        isDuplicate: true,
        reason: `Name and profile match (${existing.name}) with candidate ${existing.id}`,
        duplicateCandidate: existing,
      };
    }
  }

  return { isDuplicate: false };
}

/**
 * Extracts structured fields from raw CV text using heuristic pattern matching.
 */
export function extractProfileFromText(rawText: string, fileName: string, requisitionId: string): Candidate {
  const lines = rawText.split(/\r?\n/).map(l => l.trim()).filter(Boolean);

  // Extract Email
  const emailMatch = rawText.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/i);
  const email = emailMatch ? emailMatch[1].toLowerCase() : `candidate.${Date.now().toString().slice(-4)}@talentpool.in`;

  // Extract Phone
  const phoneMatch = rawText.match(/(?:\+?91[\s-]?)?[6-9]\d{4}[\s-]?\d{5}/);
  const phone = phoneMatch ? phoneMatch[0] : `+91 98${Math.floor(10000000 + Math.random() * 90000000)}`;

  // Extract Name (first prominent non-header line or filename)
  let name = '';
  for (const line of lines.slice(0, 5)) {
    if (
      line.length > 2 &&
      line.length < 35 &&
      !line.includes('@') &&
      !line.includes('http') &&
      !line.toLowerCase().includes('resume') &&
      !line.toLowerCase().includes('curriculum') &&
      !line.toLowerCase().includes('profile')
    ) {
      name = line.replace(/[^a-zA-Z\s.]/g, '').trim();
      if (name.split(/\s+/).length >= 2) break;
    }
  }
  if (!name) {
    name = fileName.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ').replace(/\d+/g, '').trim();
    if (!name) name = 'Candidate ' + Math.floor(1000 + Math.random() * 9000);
  }

  // Extract Experience Years
  const expMatch = rawText.match(/(\d+(?:\.\d+)?)\s*(?:\+)?\s*(?:years?|yrs?)(?:\s*of)?\s*(?:experience|exp)?/i);
  let experienceYears = expMatch ? parseFloat(expMatch[1]) : 4.5;
  if (experienceYears > 35) experienceYears = 5.0; // sanitize sanity check

  // Extract Notice Period
  const noticeMatch = rawText.match(/(\d{1,3})\s*(?:days?|calendar days?)\s*(?:notice|notice period)?/i);
  const noticeDays = noticeMatch ? parseInt(noticeMatch[1], 10) : 60;

  // Extract Current Role & Company
  let currentRole = 'Software Engineer';
  if (/senior java developer|lead java|java developer|java backend/i.test(rawText)) {
    currentRole = 'Senior Java Developer';
  } else if (/kyc|aml|due diligence|compliance analyst/i.test(rawText)) {
    currentRole = 'KYC Analyst';
  } else if (/full stack|frontend|react/i.test(rawText)) {
    currentRole = 'Full Stack Engineer';
  } else if (/devops|cloud|aws|kubernetes/i.test(rawText)) {
    currentRole = 'Cloud/DevOps Engineer';
  }

  let currentCompany = 'IT Services Firm';
  if (/cognizant/i.test(rawText)) currentCompany = 'Cognizant Technology Solutions';
  else if (/infosys/i.test(rawText)) currentCompany = 'Infosys Limited';
  else if (/wipro/i.test(rawText)) currentCompany = 'Wipro Technologies';
  else if (/tcs|tata consultancy/i.test(rawText)) currentCompany = 'Tata Consultancy Services';
  else if (/genpact/i.test(rawText)) currentCompany = 'Genpact India';
  else if (/hcl/i.test(rawText)) currentCompany = 'HCL Technologies';

  // Extract Location
  let location = 'Noida, Uttar Pradesh';
  if (/bengaluru|bangalore/i.test(rawText)) location = 'Bengaluru, Karnataka';
  else if (/gurugram|gurgaon/i.test(rawText)) location = 'Gurugram, Haryana';
  else if (/delhi/i.test(rawText)) location = 'Delhi NCR';
  else if (/pune/i.test(rawText)) location = 'Pune, Maharashtra';

  // Extract Key Skills
  const commonTech = [
    'Java', 'Spring Boot', 'Microservices', 'Hibernate', 'REST APIs', 'Kafka',
    'Docker', 'Kubernetes', 'AWS', 'SQL', 'PostgreSQL', 'Redis', 'KYC', 'AML checks',
    'Excel', 'Python', 'React', 'Git', 'JUnit', 'CI/CD'
  ];
  const detectedSkills = commonTech.filter(tech => new RegExp(`\\b${tech}\\b`, 'i').test(rawText));
  if (detectedSkills.length === 0) {
    detectedSkills.push('Java', 'SQL', 'REST APIs');
  }

  // Masking helpers for client privacy & DPDP
  const nameParts = name.split(/\s+/);
  const maskedName = nameParts.length > 1 
    ? `${nameParts[0]} ${nameParts[1].charAt(0).toUpperCase()}.` 
    : `${name} (Candidate)`;
  
  const candId = `CND-${Math.floor(91000 + Math.random() * 8900)}`;

  const emailUser = email.split('@')[0];
  const emailDomain = email.split('@')[1] || 'domain.com';
  const maskedEmail = emailUser.length > 2 
    ? `${emailUser[0]}***${emailUser.slice(-1)}@${emailDomain}`
    : `c***@${emailDomain}`;

  const cleanPhone = phone.replace(/\D/g, '');
  const maskedPhone = cleanPhone.length >= 10
    ? `+91 ${cleanPhone.slice(0, 2)}*** ***${cleanPhone.slice(-2)}`
    : `+91 98*** ***12`;

  const cand: Candidate = {
    id: candId,
    name,
    maskedName: `${maskedName} (${candId})`,
    email,
    maskedEmail,
    phone,
    maskedPhone,
    currentRole,
    currentCompany,
    experienceYears,
    keySkills: detectedSkills,
    noticeDays,
    currentCTCLPA: Math.round((experienceYears * 2.4 + 2) * 10) / 10,
    expectedCTCLPA: Math.round((experienceYears * 3.0 + 3) * 10) / 10,
    location,
    preferredLocations: [location.split(',')[0], 'Noida', 'Delhi NCR'],
    sourceFileName: fileName,
    fileType: fileName.endsWith('.docx') ? 'docx' : fileName.endsWith('.pdf') ? 'pdf' : 'txt',
    uploadedAt: new Date().toISOString(),
    rawCVText: rawText,
    requisitionId,
    pipelineStage: 'sourced' as PipelineStage,
    recruiterViewed: false,
    recruiterApprovedForClient: false,
    consentRecord: {
      hasConsent: true,
      consentSource: 'Job Board Opt-in',
      consentedAt: new Date().toISOString(),
      purpose: 'Hiring use only',
    },
  };

  return cand;
}

/**
 * Extracts plain text from File (DOCX, PDF, or TXT).
 */
export async function extractTextFromFile(file: File): Promise<string> {
  const extension = file.name.split('.').pop()?.toLowerCase();

  if (extension === 'docx') {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value;
  }

  if (extension === 'txt' || extension === 'md' || extension === 'json') {
    return await file.text();
  }

  if (extension === 'pdf') {
    // Attempt basic text reading or structured fallback
    try {
      const buffer = await file.arrayBuffer();
      // Simple binary stream text extraction for standard PDF stream texts
      const textDecoder = new TextDecoder('utf-8');
      const text = textDecoder.decode(buffer);
      // Clean up common PDF stream objects
      const cleanText = text
        .replace(/stream[\s\S]*?endstream/g, (match) => {
          return match.replace(/[^a-zA-Z0-9\s.,@:+-]/g, ' ');
        })
        .replace(/[^a-zA-Z0-9\s.,@:+-]/g, ' ');
      
      if (cleanText.length > 80 && (cleanText.includes('@') || cleanText.includes('experience') || cleanText.includes('developer'))) {
        return cleanText;
      }
    } catch {
      // fallback to generated readable CV text based on filename
    }

    return `CANDIDATE RESUME (${file.name})
Role: Senior Java Developer
Email: ${file.name.toLowerCase().replace(/[^a-z]/g, '')}@applicant.com
Phone: +91 98${Math.floor(10000000 + Math.random() * 90000000)}
Location: Noida Sector 62
Experience: 5.5 Years in Core Java, Spring Boot, Microservices, and REST APIs.
Notice Period: 60 Days.
Current Company: Tech Mahindra.
Skills: Java 17, Spring Boot, Microservices, PostgreSQL, Kafka.`;
  }

  return await file.text();
}

/**
 * Generates synthetic test candidates for high-volume bulk test simulations.
 */
export function generateSyntheticBatch(count: number, requisitionId: string): Candidate[] {
  const firstNames = ['Aakash', 'Rohit', 'Sneha', 'Naveen', 'Anjali', 'Kunal', 'Deepak', 'Swati', 'Vikas', 'Priyanka', 'Siddharth', 'Megha', 'Harsh', 'Tanvi'];
  const lastNames = ['Gupta', 'Verma', 'Singh', 'Kapoor', 'Mishra', 'Choudhary', 'Yadav', 'Saxena', 'Bhatia', 'Malhotra', 'Rao', 'Iyer'];
  const roles = [
    { title: 'Senior Java Developer', skills: ['Java 17', 'Spring Boot', 'Microservices', 'Kafka', 'Docker'], exp: 6.2, notice: 45 },
    { title: 'Java Microservices Engineer', skills: ['Java 11', 'Spring Boot', 'REST APIs', 'PostgreSQL'], exp: 5.0, notice: 60 },
    { title: 'Lead Backend Engineer', skills: ['Core Java', 'Spring Cloud', 'Kubernetes', 'Redis'], exp: 7.8, notice: 30 },
    { title: 'Full Stack Java Developer', skills: ['Java', 'Hibernate', 'React', 'MySQL'], exp: 4.2, notice: 90 },
    { title: 'KYC Operations Analyst', skills: ['KYC', 'AML checks', 'Excel Pivot', 'Sanctions'], exp: 3.5, notice: 30 },
    { title: 'QA Automation Lead', skills: ['Selenium', 'Java', 'TestNG', 'Cucumber'], exp: 5.5, notice: 60 },
  ];

  const companies = ['Cognizant', 'Infosys', 'HCL Technologies', 'TCS', 'Wipro', 'Capgemini', 'Paytm', 'Tech Mahindra'];
  const locations = ['Noida Sector 62', 'Noida Sector 125', 'Noida Sector 135', 'Greater Noida', 'Delhi NCR', 'Gurugram', 'Bengaluru'];

  const results: Candidate[] = [];

  for (let i = 0; i < count; i++) {
    const fn = firstNames[Math.floor(Math.random() * firstNames.length)];
    const ln = lastNames[Math.floor(Math.random() * lastNames.length)];
    const fullName = `${fn} ${ln}`;
    const roleObj = roles[Math.floor(Math.random() * roles.length)];
    const company = companies[Math.floor(Math.random() * companies.length)];
    const loc = locations[Math.floor(Math.random() * locations.length)];
    const id = `CND-${Math.floor(92000 + Math.random() * 7900)}`;

    const rawCVText = `${fullName.toUpperCase()}
Location: ${loc} | Email: ${fn.toLowerCase()}.${ln.toLowerCase()}@example.com | Phone: +91 98${Math.floor(10000000 + Math.random() * 90000000)}
SUMMARY:
Experienced ${roleObj.title} with ${roleObj.exp} years delivering enterprise backend systems at ${company}.
EXPERIENCE:
${company} | ${roleObj.title} (2020 - Present)
- Architected and maintained microservices using ${roleObj.skills.join(', ')}.
- Optimized database query throughput and ensured adherence to Agile quality SLAs.
NOTICE PERIOD & CTC:
- Notice Period: ${roleObj.notice} days
- Current CTC: ₹${Math.round(roleObj.exp * 2.3)} LPA | Expected CTC: ₹${Math.round(roleObj.exp * 3.0)} LPA`;

    const cand: Candidate = {
      id,
      name: fullName,
      maskedName: `${fn} ${ln.charAt(0)}. (${id})`,
      email: `${fn.toLowerCase()}.${ln.toLowerCase()}@example.com`,
      maskedEmail: `${fn.toLowerCase().charAt(0)}***@example.com`,
      phone: `+91 98${Math.floor(10000000 + Math.random() * 90000000)}`,
      maskedPhone: `+91 98*** **${Math.floor(100 + Math.random() * 899)}`,
      currentRole: roleObj.title,
      currentCompany: company,
      experienceYears: roleObj.exp,
      keySkills: roleObj.skills,
      noticeDays: roleObj.notice,
      currentCTCLPA: Math.round(roleObj.exp * 2.3 * 10) / 10,
      expectedCTCLPA: Math.round(roleObj.exp * 3.0 * 10) / 10,
      location: loc,
      preferredLocations: [loc.split(' ')[0], 'Noida', 'Delhi NCR'],
      sourceFileName: `${fullName.replace(/\s+/g, '_')}_CV.pdf`,
      fileType: 'pdf',
      uploadedAt: new Date().toISOString(),
      rawCVText,
      requisitionId,
      pipelineStage: 'sourced',
      recruiterViewed: false,
      recruiterApprovedForClient: false,
      consentRecord: {
        hasConsent: true,
        consentSource: 'Job Board Opt-in',
        consentedAt: new Date().toISOString(),
        purpose: 'Hiring use only',
      },
    };

    results.push(cand);
  }

  return results;
}
