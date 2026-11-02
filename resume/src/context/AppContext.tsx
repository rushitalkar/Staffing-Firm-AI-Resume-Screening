import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Role,
  Candidate,
  Requisition,
  Scorecard,
  ScorecardCriterion,
  PipelineStage,
  AuditLogEntry,
  CalibrationSample,
} from '../types';
import {
  INITIAL_REQUISITIONS,
  INITIAL_CANDIDATES,
  INITIAL_AUDIT_LOGS,
  INITIAL_CALIBRATION_SAMPLES,
} from '../data/seedData';
import { scoreCandidateAgainstScorecard } from '../utils/aiScorer';

interface AppContextType {
  role: Role;
  setRole: (role: Role) => void;
  activeRequisitionId: string;
  setActiveRequisitionId: (id: string) => void;
  activeRequisition: Requisition | undefined;
  requisitions: Requisition[];
  candidates: Candidate[];
  auditLogs: AuditLogEntry[];
  calibrationSamples: CalibrationSample[];
  selectedCandidate: Candidate | null;
  setSelectedCandidateId: (id: string | null) => void;
  
  // Navigation
  activeTab: string;
  setActiveTab: (tab: string) => void;

  // Actions
  updateScorecard: (requisitionId: string, scorecard: Scorecard) => void;
  addScorecardCriterion: (requisitionId: string, criterion: ScorecardCriterion) => void;
  removeScorecardCriterion: (requisitionId: string, criterionId: string) => void;
  
  // Candidates & AI
  addCandidates: (newCandidates: Candidate[], runScoring?: boolean) => void;
  recomputeAIScoresForRequisition: (requisitionId: string) => void;
  markCandidateViewed: (candidateId: string) => void;
  approveForClientShortlist: (candidateId: string, notes?: string) => { success: boolean; error?: string };
  updateCandidateStage: (candidateId: string, stage: PipelineStage) => void;
  
  // Client interactions
  clientProposeInterview: (
    candidateId: string,
    slot: { date: string; time: string; interviewType: string; interviewer: string }
  ) => void;
  clientRejectCandidate: (candidateId: string, reason: string, feedback?: string) => void;
  
  // DPDP 2023 Compliance
  executeDPDPDeletion: (candidateId: string, requester: string) => void;
  
  // Requisition management
  createNewRequisition: (req: Requisition) => void;
  resetDemoData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  ROLE: 'companya_role',
  REQ_ID: 'companya_active_req_id',
  REQS: 'companya_requisitions_v1',
  CANDS: 'companya_candidates_v1',
  AUDIT: 'companya_audit_logs_v1',
  CALIB: 'companya_calib_samples_v1',
  TAB: 'companya_active_tab',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRoleState] = useState<Role>(() => {
    return (localStorage.getItem(STORAGE_KEYS.ROLE) as Role) || 'recruiter';
  });

  const [activeRequisitionId, setActiveRequisitionIdState] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEYS.REQ_ID) || 'REQ-2024-801';
  });

  const [activeTab, setActiveTabState] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEYS.TAB) || 'ranked-feed';
  });

  const [requisitions, setRequisitions] = useState<Requisition[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.REQS);
      return saved ? JSON.parse(saved) : INITIAL_REQUISITIONS;
    } catch {
      return INITIAL_REQUISITIONS;
    }
  });

  const [candidates, setCandidates] = useState<Candidate[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CANDS);
      return saved ? JSON.parse(saved) : INITIAL_CANDIDATES;
    } catch {
      return INITIAL_CANDIDATES;
    }
  });

  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.AUDIT);
      return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
    } catch {
      return INITIAL_AUDIT_LOGS;
    }
  });

  const [calibrationSamples, setCalibrationSamples] = useState<CalibrationSample[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CALIB);
      return saved ? JSON.parse(saved) : INITIAL_CALIBRATION_SAMPLES;
    } catch {
      return INITIAL_CALIBRATION_SAMPLES;
    }
  });

  const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>(null);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ROLE, role);
  }, [role]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.REQ_ID, activeRequisitionId);
  }, [activeRequisitionId]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TAB, activeTab);
  }, [activeTab]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.REQS, JSON.stringify(requisitions));
  }, [requisitions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CANDS, JSON.stringify(candidates));
  }, [candidates]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.AUDIT, JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CALIB, JSON.stringify(calibrationSamples));
  }, [calibrationSamples]);

  const setRole = (newRole: Role) => {
    setRoleState(newRole);
    // If switching to client, default tab to client portal
    if (newRole === 'client' && activeTab !== 'client-portal') {
      setActiveTabState('client-portal');
    }
    // If switching to delivery head, open delivery head calibration
    if (newRole === 'delivery_head' && activeTab !== 'delivery-head') {
      setActiveTabState('delivery-head');
    }
    // If switching to CEO, open roi metrics
    if (newRole === 'ceo' && activeTab !== 'roi-metrics') {
      setActiveTabState('roi-metrics');
    }
  };

  const setActiveRequisitionId = (id: string) => {
    setActiveRequisitionIdState(id);
  };

  const setActiveTab = (tab: string) => {
    setActiveTabState(tab);
  };

  const activeRequisition = requisitions.find(r => r.id === activeRequisitionId);

  const addAuditEntry = (
    action: AuditLogEntry['action'],
    candidateId: string,
    candidateMaskedName: string,
    details: string
  ) => {
    const newEntry: AuditLogEntry = {
      id: `AUD-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toISOString(),
      userName:
        role === 'recruiter'
          ? 'Vikram Mehta (Recruiter)'
          : role === 'client'
          ? 'Sarah Jenkins (VP Eng / Client)'
          : role === 'delivery_head'
          ? 'Rajesh Goel (Delivery Head)'
          : 'Executive User',
      userRole: role,
      action,
      candidateId,
      candidateMaskedName,
      requisitionId: activeRequisitionId,
      details,
      ipAddress: role === 'client' ? '49.205.112.9 (Mobile Session)' : '103.24.88.14 (Office)',
    };

    setAuditLogs(prev => [newEntry, ...prev]);
  };

  const updateScorecard = (requisitionId: string, newScorecard: Scorecard) => {
    setRequisitions(prev =>
      prev.map(r => (r.id === requisitionId ? { ...r, scorecard: newScorecard } : r))
    );

    // Recompute scores for candidates in this requisition
    recomputeAIScoresForRequisition(requisitionId, newScorecard);
  };

  const addScorecardCriterion = (requisitionId: string, criterion: ScorecardCriterion) => {
    const targetReq = requisitions.find(r => r.id === requisitionId);
    if (!targetReq) return;

    const updatedScorecard: Scorecard = {
      ...targetReq.scorecard,
      criteria: [...targetReq.scorecard.criteria, criterion],
      lastUpdated: new Date().toISOString(),
    };

    updateScorecard(requisitionId, updatedScorecard);
  };

  const removeScorecardCriterion = (requisitionId: string, criterionId: string) => {
    const targetReq = requisitions.find(r => r.id === requisitionId);
    if (!targetReq) return;

    const updatedScorecard: Scorecard = {
      ...targetReq.scorecard,
      criteria: targetReq.scorecard.criteria.filter(c => c.id !== criterionId),
      lastUpdated: new Date().toISOString(),
    };

    updateScorecard(requisitionId, updatedScorecard);
  };

  const recomputeAIScoresForRequisition = (requisitionId: string, customScorecard?: Scorecard) => {
    const req = requisitions.find(r => r.id === requisitionId);
    const scorecard = customScorecard || req?.scorecard;
    if (!scorecard) return;

    setCandidates(prev =>
      prev.map(cand => {
        if (cand.requisitionId === requisitionId) {
          const aiScore = scoreCandidateAgainstScorecard(cand, scorecard);
          return {
            ...cand,
            aiScore,
            pipelineStage: cand.pipelineStage === 'sourced' ? 'ai_screened' : cand.pipelineStage,
          };
        }
        return cand;
      })
    );
  };

  const addCandidates = (newCandidates: Candidate[], runScoring: boolean = true) => {
    const targetReq = requisitions.find(r => r.id === activeRequisitionId);
    const scorecard = targetReq?.scorecard;

    const processed = newCandidates.map(c => {
      if (runScoring && scorecard) {
        const aiScore = scoreCandidateAgainstScorecard(c, scorecard);
        return {
          ...c,
          aiScore,
          pipelineStage: 'ai_screened' as PipelineStage,
        };
      }
      return c;
    });

    setCandidates(prev => [...processed, ...prev]);

    processed.forEach(c => {
      addAuditEntry('SCORE_GENERATED', c.id, c.maskedName, `AI Scorecard parsed candidate with score ${c.aiScore?.overallScore || 'N/A'}%`);
    });
  };

  const markCandidateViewed = (candidateId: string) => {
    setCandidates(prev =>
      prev.map(c => {
        if (c.id === candidateId && !c.recruiterViewed) {
          addAuditEntry('VIEW_CV', c.id, c.maskedName, 'Recruiter opened full CV document for inspection');
          return {
            ...c,
            recruiterViewed: true,
            recruiterViewedAt: new Date().toISOString(),
          };
        }
        return c;
      })
    );
  };

  // Recruiter verification gate: "a recruiter must open a CV before submitting it"
  const approveForClientShortlist = (candidateId: string, notes?: string): { success: boolean; error?: string } => {
    const cand = candidates.find(c => c.id === candidateId);
    if (!cand) return { success: false, error: 'Candidate not found' };

    if (!cand.recruiterViewed) {
      return {
        success: false,
        error: 'Recruiter Gate: You must inspect the CV details before submitting to client shortlist.',
      };
    }

    setCandidates(prev =>
      prev.map(c => {
        if (c.id === candidateId) {
          return {
            ...c,
            recruiterApprovedForClient: true,
            recruiterNotes: notes || c.recruiterNotes,
            pipelineStage: 'submitted_to_client',
          };
        }
        return c;
      })
    );

    addAuditEntry('SHORTLIST_SUBMITTED', cand.id, cand.maskedName, `Recruiter submitted candidate to client shortlist. Notes: ${notes || 'Verified'}`);
    return { success: true };
  };

  const updateCandidateStage = (candidateId: string, stage: PipelineStage) => {
    setCandidates(prev =>
      prev.map(c => (c.id === candidateId ? { ...c, pipelineStage: stage } : c))
    );
  };

  const clientProposeInterview = (
    candidateId: string,
    slot: { date: string; time: string; interviewType: string; interviewer: string }
  ) => {
    const cand = candidates.find(c => c.id === candidateId);
    if (!cand) return;

    setCandidates(prev =>
      prev.map(c => {
        if (c.id === candidateId) {
          return {
            ...c,
            pipelineStage: 'interview_scheduled',
            clientFeedback: {
              status: 'interview_proposed',
              proposedSlot: slot,
              submittedAt: new Date().toISOString(),
            },
          };
        }
        return c;
      })
    );

    addAuditEntry(
      'INTERVIEW_PROPOSED',
      cand.id,
      cand.maskedName,
      `Client proposed interview slot on ${slot.date} at ${slot.time} (${slot.interviewType}) with ${slot.interviewer}`
    );
  };

  const clientRejectCandidate = (candidateId: string, reason: string, feedback?: string) => {
    const cand = candidates.find(c => c.id === candidateId);
    if (!cand) return;

    setCandidates(prev =>
      prev.map(c => {
        if (c.id === candidateId) {
          return {
            ...c,
            pipelineStage: 'rejected',
            clientFeedback: {
              status: 'rejected',
              rejectionReason: reason,
              rejectionFeedback: feedback,
              submittedAt: new Date().toISOString(),
            },
          };
        }
        return c;
      })
    );

    addAuditEntry(
      'REJECTION_SUBMITTED',
      cand.id,
      cand.maskedName,
      `Client rejected candidate. Reason: "${reason}". Notes: "${feedback || 'None'}"`
    );
  };

  // DPDP 2023 Right to be Forgotten / Deletion on Request
  const executeDPDPDeletion = (candidateId: string, requester: string) => {
    const cand = candidates.find(c => c.id === candidateId);
    if (!cand) return;

    addAuditEntry(
      'DATA_DELETION_EXECUTED',
      cand.id,
      cand.maskedName,
      `DPDP Act 2023: Right-to-be-forgotten executed. Requester: ${requester}. All raw text, contact info, and CV files purged permanently.`
    );

    // Cryptographically purge candidate personal data, preserving only anonymous audit record
    setCandidates(prev =>
      prev.map(c => {
        if (c.id === candidateId) {
          return {
            ...c,
            name: '[DATA_DELETED_PER_DPDP_ACT_2023]',
            maskedName: `[PURGED-${candidateId}]`,
            email: 'purged@dpdp-erased.invalid',
            maskedEmail: 'p***@purged.invalid',
            phone: '+91 00000 00000',
            maskedPhone: '+91 00*** ***00',
            rawCVText: 'CONTENT PURGED UPON CANDIDATE RIGHT-TO-BE-FORGOTTEN REQUEST UNDER DPDP ACT 2023 SEC 12(3).',
            sourceFileName: undefined,
            pipelineStage: 'archived',
            consentRecord: {
              hasConsent: false,
              consentSource: c.consentRecord.consentSource,
              consentedAt: c.consentRecord.consentedAt,
              purpose: 'Hiring use only',
              isDeleted: true,
              deletedAt: new Date().toISOString(),
            },
          };
        }
        return c;
      })
    );
  };

  const createNewRequisition = (newReq: Requisition) => {
    setRequisitions(prev => [newReq, ...prev]);
    setActiveRequisitionId(newReq.id);
  };

  const resetDemoData = () => {
    localStorage.removeItem(STORAGE_KEYS.ROLE);
    localStorage.removeItem(STORAGE_KEYS.REQ_ID);
    localStorage.removeItem(STORAGE_KEYS.REQS);
    localStorage.removeItem(STORAGE_KEYS.CANDS);
    localStorage.removeItem(STORAGE_KEYS.AUDIT);
    localStorage.removeItem(STORAGE_KEYS.CALIB);
    localStorage.removeItem(STORAGE_KEYS.TAB);
    setRequisitions(INITIAL_REQUISITIONS);
    setCandidates(INITIAL_CANDIDATES);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    setCalibrationSamples(INITIAL_CALIBRATION_SAMPLES);
    setRoleState('recruiter');
    setActiveRequisitionIdState('REQ-2024-801');
    setActiveTabState('ranked-feed');
  };

  const selectedCandidate = candidates.find(c => c.id === selectedCandidateId) || null;

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        activeRequisitionId,
        setActiveRequisitionId,
        activeRequisition,
        requisitions,
        candidates,
        auditLogs,
        calibrationSamples,
        selectedCandidate,
        setSelectedCandidateId,
        activeTab,
        setActiveTab,
        updateScorecard,
        addScorecardCriterion,
        removeScorecardCriterion,
        addCandidates,
        recomputeAIScoresForRequisition,
        markCandidateViewed,
        approveForClientShortlist,
        updateCandidateStage,
        clientProposeInterview,
        clientRejectCandidate,
        executeDPDPDeletion,
        createNewRequisition,
        resetDemoData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
