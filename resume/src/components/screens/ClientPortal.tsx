import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Candidate } from '../../types';
import {
  Calendar,
  XCircle,
  CheckCircle,
  Clock,
  MapPin,
  Briefcase,
  ShieldCheck,
  Smartphone,
  Monitor,
  Eye,
  Send,
  MessageSquare,
  Lock,
} from 'lucide-react';

export const ClientPortal: React.FC<{
  onOpenCV: (cand: Candidate) => void;
  onProposeSlot: (cand: Candidate) => void;
  onReject: (cand: Candidate) => void;
}> = ({ onOpenCV, onProposeSlot, onReject }) => {
  const { activeRequisition, candidates, activeRequisitionId, role, setRole } = useApp();
  const [deviceMode, setDeviceMode] = useState<'desktop' | 'mobile'>('desktop');
  const [activeFilter, setActiveFilter] = useState<'all' | 'pending' | 'interview' | 'rejected'>('all');

  if (!activeRequisition) return null;

  // Each client sees ONLY candidates submitted to them for this requisition
  const clientCandidates = candidates.filter(
    (c) =>
      c.requisitionId === activeRequisitionId &&
      !c.consentRecord.isDeleted &&
      (c.pipelineStage === 'submitted_to_client' ||
        c.pipelineStage === 'client_shortlisted' ||
        c.pipelineStage === 'interview_scheduled' ||
        c.pipelineStage === 'offer_extended' ||
        c.pipelineStage === 'joined' ||
        (c.pipelineStage === 'rejected' && c.clientFeedback))
  );

  let filtered = clientCandidates;
  if (activeFilter === 'pending') {
    filtered = clientCandidates.filter((c) => c.pipelineStage === 'submitted_to_client');
  } else if (activeFilter === 'interview') {
    filtered = clientCandidates.filter(
      (c) => c.pipelineStage === 'client_shortlisted' || c.pipelineStage === 'interview_scheduled'
    );
  } else if (activeFilter === 'rejected') {
    filtered = clientCandidates.filter((c) => c.pipelineStage === 'rejected');
  }

  return (
    <div className="space-y-6">
      {/* Top Banner & Device Switcher */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-600 uppercase tracking-wider">
            <span>Secure Client Hiring Portal</span>
            <span className="text-slate-400">•</span>
            <span className="text-slate-500 font-mono">Masked Contact Protection</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 mt-1">
            {activeRequisition.clientName} • Shortlist Review
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Review submitted candidates for <strong>{activeRequisition.title}</strong>. Propose interview slots or submit structured feedback.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {/* Device toggle */}
          <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
            <button
              onClick={() => setDeviceMode('desktop')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md font-medium transition-all ${
                deviceMode === 'desktop'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>Desktop</span>
            </button>
            <button
              onClick={() => setDeviceMode('mobile')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md font-medium transition-all ${
                deviceMode === 'mobile'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Mobile Phone View</span>
            </button>
          </div>

          {role !== 'client' && (
            <button
              onClick={() => setRole('client')}
              className="text-xs bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-semibold px-3 py-2 rounded-lg border border-emerald-200 transition-colors"
            >
              Switch to Client Mode
            </button>
          )}
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex items-center space-x-2 text-xs">
        <button
          onClick={() => setActiveFilter('all')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
            activeFilter === 'all'
              ? 'bg-slate-900 text-white'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          All Profiles ({clientCandidates.length})
        </button>
        <button
          onClick={() => setActiveFilter('pending')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
            activeFilter === 'pending'
              ? 'bg-slate-900 text-white'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          Pending Review ({clientCandidates.filter((c) => c.pipelineStage === 'submitted_to_client').length})
        </button>
        <button
          onClick={() => setActiveFilter('interview')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
            activeFilter === 'interview'
              ? 'bg-slate-900 text-white'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          Interview Scheduled ({clientCandidates.filter((c) => c.pipelineStage === 'interview_scheduled').length})
        </button>
        <button
          onClick={() => setActiveFilter('rejected')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
            activeFilter === 'rejected'
              ? 'bg-slate-900 text-white'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          Rejected ({clientCandidates.filter((c) => c.pipelineStage === 'rejected').length})
        </button>
      </div>

      {/* Main Container - Desktop or Mobile Frame */}
      <div className={deviceMode === 'mobile' ? 'flex justify-center' : ''}>
        <div
          className={
            deviceMode === 'mobile'
              ? 'w-full max-w-sm bg-slate-900 p-3 rounded-[36px] shadow-2xl border-4 border-slate-800'
              : 'w-full'
          }
        >
          {/* Mobile Screen Wrapper */}
          <div
            className={
              deviceMode === 'mobile'
                ? 'bg-slate-50 rounded-[28px] overflow-hidden min-h-[680px] p-4 space-y-4'
                : 'space-y-4'
            }
          >
            {deviceMode === 'mobile' && (
              <div className="flex items-center justify-between text-[11px] text-slate-500 pb-2 border-b border-slate-200">
                <span className="font-semibold text-slate-800">Company A Portal</span>
                <span className="text-emerald-600 font-medium">● Live</span>
              </div>
            )}

            {filtered.length === 0 ? (
              <div className="bg-white p-10 text-center rounded-xl border border-slate-200 text-slate-500 space-y-2">
                <Briefcase className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="font-semibold text-slate-700">No candidates in this view.</p>
                <p className="text-xs">
                  Recruiters submit shortlisted profiles after verification.
                </p>
              </div>
            ) : (
              filtered.map((cand) => {
                const aiScore = cand.aiScore;
                const hasInterview = cand.pipelineStage === 'interview_scheduled';
                const isRejected = cand.pipelineStage === 'rejected';

                return (
                  <div
                    key={cand.id}
                    className={`bg-white rounded-xl border p-5 transition-all shadow-sm ${
                      hasInterview
                        ? 'border-emerald-200 bg-emerald-50/20'
                        : isRejected
                        ? 'border-slate-200 opacity-75'
                        : 'border-slate-200'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div>
                        {/* Masked Contact Name */}
                        <div className="flex items-center space-x-2">
                          <h2 className="text-base font-bold text-slate-900">
                            {cand.maskedName}
                          </h2>
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200 flex items-center gap-1">
                            <Lock className="w-2.5 h-2.5" /> Masked Contact
                          </span>
                        </div>

                        {/* Masked PII notice */}
                        <div className="text-[11px] text-slate-500 flex items-center space-x-2 mt-0.5">
                          <span>Phone: {cand.maskedPhone}</span>
                          <span>•</span>
                          <span>Email: {cand.maskedEmail}</span>
                        </div>

                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-600 mt-2">
                          <span className="font-medium text-slate-800">
                            {cand.currentRole}
                          </span>
                          <span>•</span>
                          <span className="font-semibold text-slate-900">
                            {cand.experienceYears} Years Exp
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            Notice: <strong>{cand.noticeDays} Days</strong>
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-slate-400" />
                            {cand.location}
                          </span>
                        </div>

                        {/* Verified skills */}
                        <div className="flex flex-wrap gap-1.5 mt-2.5">
                          {cand.keySkills.slice(0, 5).map((sk, idx) => (
                            <span
                              key={idx}
                              className="text-[11px] px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md font-medium"
                            >
                              {sk}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* AI Match Badge */}
                      <div className="flex sm:flex-col items-center sm:items-end justify-between gap-1 text-right">
                        <div className="text-xs bg-slate-900 text-white font-bold px-2.5 py-1 rounded-md shadow-sm">
                          {aiScore?.overallScore || '—'}% AI Fit
                        </div>
                        <span className="text-[10px] text-slate-400">
                          {aiScore?.matchTier}
                        </span>
                      </div>
                    </div>

                    {/* Recruiter Notes to Client */}
                    {cand.recruiterNotes && (
                      <div className="mt-3 p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 flex items-start space-x-2">
                        <MessageSquare className="w-3.5 h-3.5 text-indigo-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-slate-900">Recruiter Note:</strong>{' '}
                          {cand.recruiterNotes}
                        </div>
                      </div>
                    )}

                    {/* Quoted Resume Proof Highlight */}
                    {aiScore?.evidenceList && aiScore.evidenceList.length > 0 && (
                      <div className="mt-3 p-2.5 bg-indigo-50/50 border border-indigo-100 rounded-lg text-xs space-y-1">
                        <div className="text-[11px] font-semibold text-indigo-900">
                          Top Verified Evidence:
                        </div>
                        <p className="font-mono text-[11px] text-slate-700 italic">
                          “{aiScore.evidenceList[0].evidenceQuote}”
                        </p>
                      </div>
                    )}

                    {/* Interview Slot Card (if scheduled) */}
                    {cand.clientFeedback?.proposedSlot && (
                      <div className="mt-3 p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-900 space-y-1">
                        <div className="flex items-center space-x-1.5 font-bold">
                          <CheckCircle className="w-4 h-4 text-emerald-600" />
                          <span>
                            Interview Proposed: {cand.clientFeedback.proposedSlot.interviewType}
                          </span>
                        </div>
                        <div className="text-xs text-emerald-800">
                          Slot:{' '}
                          <strong>
                            {cand.clientFeedback.proposedSlot.date} at{' '}
                            {cand.clientFeedback.proposedSlot.time}
                          </strong>{' '}
                          with {cand.clientFeedback.proposedSlot.interviewer}
                        </div>
                      </div>
                    )}

                    {/* Rejection Feedback (if rejected) */}
                    {cand.clientFeedback?.rejectionReason && (
                      <div className="mt-3 p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-900 space-y-1">
                        <div className="flex items-center space-x-1.5 font-bold">
                          <XCircle className="w-4 h-4 text-rose-600" />
                          <span>Candidate Rejected by Client</span>
                        </div>
                        <div>
                          Reason: <strong>{cand.clientFeedback.rejectionReason}</strong>
                          {cand.clientFeedback.rejectionFeedback && (
                            <span className="block text-slate-600 mt-0.5">
                              Notes: {cand.clientFeedback.rejectionFeedback}
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Client Action Buttons */}
                    <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                      <button
                        onClick={() => onOpenCV(cand)}
                        className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center space-x-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect Full CV</span>
                      </button>

                      <div className="flex items-center space-x-2">
                        {!isRejected && (
                          <button
                            onClick={() => onReject(cand)}
                            className="text-xs font-semibold px-3 py-1.5 rounded-lg text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors flex items-center space-x-1"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Reject</span>
                          </button>
                        )}

                        <button
                          onClick={() => onProposeSlot(cand)}
                          className="text-xs font-semibold px-3.5 py-1.5 rounded-lg text-white bg-slate-900 hover:bg-slate-800 transition-colors shadow-sm flex items-center space-x-1.5"
                        >
                          <Calendar className="w-3.5 h-3.5" />
                          <span>
                            {hasInterview ? 'Reschedule Slot' : 'Propose Interview Slot'}
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
