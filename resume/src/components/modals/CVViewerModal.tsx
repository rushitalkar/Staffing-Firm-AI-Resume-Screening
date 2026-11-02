import React, { useState } from 'react';
import { Candidate } from '../../types';
import { useApp } from '../../context/AppContext';
import {
  X,
  CheckCircle2,
  Lock,
  Eye,
  Send,
  FileText,
  Clock,
  MapPin,
  Briefcase,
  Quote,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';

export const CVViewerModal: React.FC<{
  candidate: Candidate | null;
  onClose: () => void;
  onSubmitToClient?: (cand: Candidate) => void;
}> = ({ candidate, onClose, onSubmitToClient }) => {
  const { markCandidateViewed, approveForClientShortlist, role } = useApp();
  const [viewTab, setViewTab] = useState<'structured' | 'raw'>('structured');
  const [recruiterNotesInput, setRecruiterNotesInput] = useState(candidate?.recruiterNotes || '');
  const [verifiedCheck, setVerifiedCheck] = useState(candidate?.recruiterViewed || false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  if (!candidate) return null;

  const aiScore = candidate.aiScore;

  const handleVerifyAndSubmit = () => {
    markCandidateViewed(candidate.id);
    const res = approveForClientShortlist(candidate.id, recruiterNotesInput);
    if (res.success) {
      setSubmitSuccess(true);
      setTimeout(() => {
        setSubmitSuccess(false);
        onClose();
      }, 1500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white font-bold flex items-center justify-center text-sm">
              {aiScore?.overallScore || '—'}%
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base font-bold text-slate-900">
                  {role === 'client' ? candidate.maskedName : candidate.name}
                </h2>
                <span className="text-xs font-mono text-slate-400">({candidate.id})</span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                  {candidate.fileType?.toUpperCase() || 'PDF'}
                </span>
              </div>
              <div className="text-xs text-slate-500 flex items-center space-x-2 mt-0.5">
                <span>{candidate.currentRole}</span>
                <span>•</span>
                <span>{candidate.experienceYears} Years Exp</span>
                <span>•</span>
                <span>Notice: {candidate.noticeDays} Days</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <div className="flex bg-slate-200/80 p-0.5 rounded-lg text-xs">
              <button
                onClick={() => setViewTab('structured')}
                className={`px-3 py-1 rounded-md font-medium transition-all ${
                  viewTab === 'structured'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Score &amp; Evidence
              </button>
              <button
                onClick={() => setViewTab('raw')}
                className={`px-3 py-1 rounded-md font-medium transition-all ${
                  viewTab === 'raw'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Original CV Text
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {viewTab === 'structured' ? (
            <div className="space-y-6">
              {/* Top Highlights Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-slate-400 block text-[10px] uppercase font-mono">
                    Experience
                  </span>
                  <span className="font-bold text-slate-800 text-sm">
                    {candidate.experienceYears} Years
                  </span>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-slate-400 block text-[10px] uppercase font-mono">
                    Notice Period
                  </span>
                  <span className="font-bold text-slate-800 text-sm">
                    {candidate.noticeDays} Calendar Days
                  </span>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-slate-400 block text-[10px] uppercase font-mono">
                    Expected Compensation
                  </span>
                  <span className="font-bold text-slate-800 text-sm">
                    ₹{candidate.expectedCTCLPA} LPA
                  </span>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-slate-400 block text-[10px] uppercase font-mono">
                    Current Location
                  </span>
                  <span className="font-bold text-slate-800 text-sm">
                    {candidate.location}
                  </span>
                </div>
              </div>

              {/* Quoted Evidence Verification Breakdown */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-1.5">
                    <Quote className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Exact Quoted CV Evidence Sentences</span>
                  </h3>
                  <span className="text-[11px] text-slate-500">
                    Blind Scoring Verified
                  </span>
                </div>

                <div className="space-y-2">
                  {aiScore?.evidenceList.map((ev, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              ev.matched ? 'bg-emerald-500' : 'bg-rose-500'
                            }`}
                          />
                          <span className="font-bold text-slate-900">{ev.criterionName}</span>
                          <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.2 rounded font-mono">
                            {ev.sourceSection}
                          </span>
                        </div>
                        <span className="font-mono font-bold text-slate-800">{ev.score}/100</span>
                      </div>

                      <div className="bg-white p-2.5 rounded-lg border border-slate-200/80 font-mono text-[11px] text-slate-800">
                        &quot;{ev.evidenceQuote}&quot;
                      </div>

                      <div className="text-[11px] text-slate-500 italic pl-1">
                        ↳ {ev.reasoning}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Skills Bag */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Extracted Technical Skills
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {candidate.keySkills.map((sk, idx) => (
                    <span
                      key={idx}
                      className="text-xs px-2.5 py-1 bg-slate-100 text-slate-800 rounded-md font-medium border border-slate-200"
                    >
                      {sk}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* Raw CV Document Text */
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 font-mono text-xs text-slate-800 whitespace-pre-wrap leading-relaxed max-h-[500px] overflow-y-auto">
              {candidate.rawCVText}
            </div>
          )}
        </div>

        {/* Modal Footer & Recruiter Verification Sign-off */}
        {role !== 'client' && (
          <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center space-x-2 text-xs">
              <input
                type="checkbox"
                id="recruiter-verify-check"
                checked={verifiedCheck}
                onChange={(e) => setVerifiedCheck(e.target.checked)}
                className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500 cursor-pointer"
              />
              <label htmlFor="recruiter-verify-check" className="text-slate-700 font-medium cursor-pointer">
                I have inspected this candidate&apos;s CV credentials (Recruiter Gate satisfied)
              </label>
            </div>

            <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
              {submitSuccess ? (
                <div className="text-xs font-bold text-emerald-700 flex items-center space-x-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Submitted to Client Shortlist!</span>
                </div>
              ) : (
                <button
                  onClick={handleVerifyAndSubmit}
                  disabled={!verifiedCheck || candidate.recruiterApprovedForClient}
                  className="flex items-center space-x-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>
                    {candidate.recruiterApprovedForClient
                      ? 'Already Submitted'
                      : 'Sign-Off & Submit to Client'}
                  </span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
