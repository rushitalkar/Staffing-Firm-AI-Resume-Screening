export type Role = 'recruiter' | 'client' | 'delivery_head' | 'ceo';

export type PipelineStage = 
  | 'sourced'
  | 'ai_screened'
  | 'recruiter_verified'
  | 'submitted_to_client'
  | 'client_shortlisted'
  | 'interview_scheduled'
  | 'offer_extended'
  | 'joined'
  | 'rejected'
  | 'archived';

export interface ScorecardCriterion {
  id: string;
  name: string;
  category: 'must_have' | 'good_to_have' | 'experience' | 'notice_period' | 'location' | 'compensation';
  targetValue: string;
  weight: number; // 1 to 5
  description: string;
}

export interface Scorecard {
  id: string;
  requisitionId: string;
  jobTitle: string;
  clientName: string;
  department: string;
  experienceMinYears: number;
  experienceMaxYears: number;
  maxNoticeDays: number;
  budgetMinLPA: number;
  budgetMaxLPA: number;
  primaryLocation: string;
  workMode: 'Onsite' | 'Hybrid' | 'Remote';
  criteria: ScorecardCriterion[];
  rawJDText?: string;
  extractedAt: string;
  lastUpdated: string;
}

export interface CriterionEvidence {
  criterionId: string;
  criterionName: string;
  matched: boolean;
  score: number; // 0 - 100
  evidenceQuote: string; // Exact sentence from CV
  sourceSection: 'Summary' | 'Experience' | 'Skills' | 'Education' | 'Projects' | 'Metadata';
  reasoning: string;
}

export interface AIScoreResult {
  overallScore: number; // 0 - 100
  matchTier: 'Strong Match' | 'Moderate Match' | 'Low Match' | 'Unfit';
  mustHaveScore: number;
  experienceScore: number;
  noticeScore: number;
  skillsScore: number;
  evidenceList: CriterionEvidence[];
  strengths: string[];
  gaps: string[];
  blindScoringVerified: boolean; // Confirms name, gender, age, marital status were omitted
}

export interface Candidate {
  id: string; // e.g. CND-91022
  name: string;
  maskedName: string; // e.g. Ritika B. (CND-91022)
  email: string;
  maskedEmail: string; // e.g. r***@gmail.com
  phone: string;
  maskedPhone: string; // e.g. +91 98****022
  currentRole: string;
  currentCompany: string;
  experienceYears: number;
  keySkills: string[];
  noticeDays: number;
  currentCTCLPA: number;
  expectedCTCLPA: number;
  location: string;
  preferredLocations: string[];
  sourceFileName?: string;
  fileType?: 'pdf' | 'docx' | 'txt';
  uploadedAt: string;
  rawCVText: string;
  
  // Requisition specific state
  requisitionId: string;
  pipelineStage: PipelineStage;
  aiScore?: AIScoreResult;
  recruiterViewed: boolean;
  recruiterViewedAt?: string;
  recruiterNotes?: string;
  recruiterApprovedForClient?: boolean;
  
  // Client interaction
  clientFeedback?: {
    status: 'shortlisted' | 'rejected' | 'interview_proposed' | 'pending';
    proposedSlot?: {
      date: string;
      time: string;
      interviewType: string;
      interviewer: string;
    };
    rejectionReason?: string;
    rejectionFeedback?: string;
    submittedAt?: string;
  };

  // DPDP Act 2023 compliance
  consentRecord: {
    hasConsent: boolean;
    consentSource: 'Job Board Opt-in' | 'Candidate Portal' | 'Direct Email Confirmation';
    consentedAt: string;
    purpose: 'Hiring use only';
    isDeleted?: boolean;
    deletedAt?: string;
  };
}

export interface Requisition {
  id: string; // e.g. REQ-2024-801
  clientName: string;
  title: string;
  industry: 'IT Services' | 'Banking & BFSI' | 'Retail & Consumer';
  openPositions: number;
  feePerPlacementINR: number;
  createdAt: string;
  slaDeadline: string; // 48 hours from intake
  status: 'Open' | 'Shortlist Delivered' | 'Client Reviewing' | 'Interviewing' | 'Closed';
  assignedRecruiter: string;
  scorecard: Scorecard;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  userName: string;
  userRole: Role;
  action: 'VIEW_CV' | 'MASKED_PREVIEW' | 'SCORE_GENERATED' | 'SHORTLIST_SUBMITTED' | 'INTERVIEW_PROPOSED' | 'REJECTION_SUBMITTED' | 'CONSENT_VERIFIED' | 'DATA_DELETION_EXECUTED';
  candidateId: string;
  candidateMaskedName: string;
  requisitionId: string;
  details: string;
  ipAddress: string;
}

export interface CalibrationSample {
  candidateId: string;
  name: string;
  role: string;
  aiRank: number;
  aiScore: number;
  recruiterRank: number;
  recruiterSubmitted: boolean;
  clientAccepted: boolean;
  alignment: 'Agreed' | 'Recruiter Promoted' | 'Recruiter Overruled';
  reasons: string;
}
