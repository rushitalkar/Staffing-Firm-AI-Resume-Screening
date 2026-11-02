import React from 'react';
import { useApp } from '../../context/AppContext';
import { Candidate, PipelineStage } from '../../types';
import {
  GitBranch,
  Clock,
  CheckCircle2,
  Calendar,
  DollarSign,
  ChevronRight,
  Eye,
  Send,
  UserCheck,
  TrendingUp,
} from 'lucide-react';

export const PipelineKanban: React.FC<{ onOpenCV: (cand: Candidate) => void }> = ({ onOpenCV }) => {
  const {
    activeRequisition,
    candidates,
    activeRequisitionId,
    updateCandidateStage,
  } = useApp();

  if (!activeRequisition) return null;

  const reqCandidates = candidates.filter(
    (c) => c.requisitionId === activeRequisitionId && !c.consentRecord.isDeleted
  );

  const columns: { id: PipelineStage; title: string; desc: string; color: string }[] = [
    { id: 'sourced', title: 'Sourced', desc: 'Raw uploaded CVs', color: 'border-slate-300' },
    { id: 'ai_screened', title: 'AI Screened', desc: 'Ranked with evidence', color: 'border-indigo-400' },
    { id: 'recruiter_verified', title: 'Recruiter Verified', desc: 'CV inspected & gated', color: 'border-blue-500' },
    { id: 'submitted_to_client', title: 'Submitted to Client', desc: 'Within 48h SLA', color: 'border-amber-500' },
    { id: 'client_shortlisted', title: 'Client Shortlisted', desc: 'Accepted by client', color: 'border-teal-500' },
    { id: 'interview_scheduled', title: 'Interview Scheduled', desc: 'Slot confirmed', color: 'border-emerald-500' },
    { id: 'offer_extended', title: 'Offer Extended', desc: 'CTC negotiated', color: 'border-purple-500' },
    { id: 'joined', title: 'Joined / Placed', desc: 'Fee earned ₹65k', color: 'border-emerald-600' },
  ];

  const getCandidatesForStage = (stage: PipelineStage) => {
    return reqCandidates.filter((c) => c.pipelineStage === stage);
  };

  const handleAdvance = (cand: Candidate, nextStage: PipelineStage) => {
    updateCandidateStage(cand.id, nextStage);
  };

  const nextStageMap: Partial<Record<PipelineStage, PipelineStage>> = {
    sourced: 'ai_screened',
    ai_screened: 'recruiter_verified',
    recruiter_verified: 'submitted_to_client',
    submitted_to_client: 'client_shortlisted',
    client_shortlisted: 'interview_scheduled',
    interview_scheduled: 'offer_extended',
    offer_extended: 'joined',
  };

  const joinedCount = reqCandidates.filter((c) => c.pipelineStage === 'joined').length;
  const inPipelineCount = reqCandidates.length;

  return (
    <div className="space-y-6">
      {/* Pipeline Header */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-indigo-600 uppercase tracking-wider">
            <span>Requisition Pipeline Tracker</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 mt-1">
            End-to-End Recruitment Flow ({activeRequisition.title})
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Turnaround SLA: <strong>&lt; 48 hours to client shortlist</strong> • Placement Fee: <strong>₹{activeRequisition.feePerPlacementINR.toLocaleString('en-IN')}</strong>
          </p>
        </div>

        <div className="flex items-center space-x-3 text-xs">
          <div className="bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg text-emerald-800">
            <strong>{joinedCount} Joined</strong> (₹{(joinedCount * activeRequisition.feePerPlacementINR).toLocaleString('en-IN')} Earned)
          </div>
          <div className="bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-lg text-slate-700">
            <strong>{inPipelineCount}</strong> Active Candidates
          </div>
        </div>
      </div>

      {/* Kanban Board Container (Scrollable Horizontal) */}
      <div className="overflow-x-auto pb-4">
        <div className="flex space-x-4 min-w-[1400px]">
          {columns.map((col) => {
            const stageCandidates = getCandidatesForStage(col.id);

            return (
              <div
                key={col.id}
                className="w-72 bg-slate-100/70 rounded-xl border border-slate-200 p-3 flex flex-col flex-shrink-0"
              >
                {/* Column Header */}
                <div className={`border-t-2 ${col.color} pt-2 pb-2.5 px-1`}>
                  <div className="flex items-center justify-between">
                    <h2 className="text-xs font-bold text-slate-900">{col.title}</h2>
                    <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded-full bg-white border border-slate-200 text-slate-700">
                      {stageCandidates.length}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-0.5">{col.desc}</p>
                </div>

                {/* Candidate Cards */}
                <div className="space-y-2.5 flex-1 overflow-y-auto max-h-[600px] pr-0.5">
                  {stageCandidates.length === 0 ? (
                    <div className="p-4 text-center text-[11px] text-slate-400 border border-dashed border-slate-200 rounded-lg">
                      No candidates in this stage
                    </div>
                  ) : (
                    stageCandidates.map((cand) => {
                      const nextStage = nextStageMap[cand.pipelineStage];

                      return (
                        <div
                          key={cand.id}
                          className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm space-y-2 hover:border-slate-300 transition-colors"
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="text-xs font-bold text-slate-900">
                                {cand.name}
                              </div>
                              <div className="text-[10px] text-slate-400 font-mono">
                                {cand.id}
                              </div>
                            </div>

                            {cand.aiScore && (
                              <div
                                className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                                  cand.aiScore.overallScore >= 80
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : cand.aiScore.overallScore >= 60
                                    ? 'bg-amber-100 text-amber-800'
                                    : 'bg-slate-100 text-slate-700'
                                }`}
                              >
                                {cand.aiScore.overallScore}%
                              </div>
                            )}
                          </div>

                          <div className="text-[11px] text-slate-600 space-y-0.5">
                            <div>{cand.currentRole}</div>
                            <div className="text-slate-500 text-[10px]">
                              {cand.experienceYears}y exp • {cand.noticeDays}d notice • {cand.location.split(' ')[0]}
                            </div>
                          </div>

                          {/* Quick Actions */}
                          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                            <button
                              onClick={() => onOpenCV(cand)}
                              className="text-[11px] text-slate-500 hover:text-slate-800 flex items-center space-x-1"
                            >
                              <Eye className="w-3 h-3" />
                              <span>CV</span>
                            </button>

                            {nextStage && (
                              <button
                                onClick={() => handleAdvance(cand, nextStage)}
                                className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 flex items-center space-x-0.5"
                                title={`Move to ${nextStage.replace('_', ' ')}`}
                              >
                                <span>Advance</span>
                                <ChevronRight className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
