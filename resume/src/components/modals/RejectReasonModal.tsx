import React, { useState } from 'react';
import { Candidate } from '../../types';
import { useApp } from '../../context/AppContext';
import { X, AlertOctagon, CheckCircle2 } from 'lucide-react';

export const RejectReasonModal: React.FC<{
  candidate: Candidate | null;
  onClose: () => void;
}> = ({ candidate, onClose }) => {
  const { clientRejectCandidate } = useApp();

  const [reason, setReason] = useState('Technical Skill Gap');
  const [feedback, setFeedback] = useState('');
  const [isDone, setIsDone] = useState(false);

  if (!candidate) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    clientRejectCandidate(candidate.id, reason, feedback);
    setIsDone(true);
    setTimeout(() => {
      setIsDone(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <h2 className="text-base font-bold text-slate-900">Reject Candidate with Feedback</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Candidate: <strong>{candidate.maskedName}</strong>
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          {isDone ? (
            <div className="p-6 text-center space-y-2">
              <CheckCircle2 className="w-10 h-10 text-slate-700 mx-auto" />
              <h3 className="text-base font-bold text-slate-900">Feedback Recorded</h3>
              <p className="text-slate-500 text-xs">
                Recruiter will review rejection feedback to calibrate next profiles.
              </p>
            </div>
          ) : (
            <>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Primary Rejection Reason (Required)
                </label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-medium cursor-pointer"
                  required
                >
                  <option value="Technical Skill Gap">Technical Skill Gap (Missing core stack)</option>
                  <option value="Notice Period Too Long">Notice Period Too Long (Exceeds project joining date)</option>
                  <option value="Compensation / Budget Mismatch">Compensation / Budget Mismatch</option>
                  <option value="Seniority / Experience Level">Seniority / Experience Level Misalignment</option>
                  <option value="Location / Commute Infeasibility">Location / Commute Infeasibility</option>
                  <option value="Communication / Client Facing Gap">Communication / Client Facing Gap</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Specific Recruiter Feedback (Optional)
                </label>
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  rows={4}
                  placeholder="e.g. Candidate has solid Java basics but lacks production Kafka microservices ownership..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-3 py-2 text-slate-600 hover:text-slate-900 border border-slate-200 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-lg shadow-sm"
                >
                  Submit Rejection
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
};
