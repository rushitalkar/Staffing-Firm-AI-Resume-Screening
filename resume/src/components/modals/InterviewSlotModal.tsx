import React, { useState } from 'react';
import { Candidate } from '../../types';
import { useApp } from '../../context/AppContext';
import { X, Calendar, Clock, User, CheckCircle2 } from 'lucide-react';

export const InterviewSlotModal: React.FC<{
  candidate: Candidate | null;
  onClose: () => void;
}> = ({ candidate, onClose }) => {
  const { clientProposeInterview } = useApp();

  const [date, setDate] = useState('2024-11-05');
  const [time, setTime] = useState('15:00 IST');
  const [interviewType, setInterviewType] = useState('Technical Round 1 (System Design & Core Java)');
  const [interviewer, setInterviewer] = useState('Sarah Jenkins (VP Engineering)');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!candidate) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    clientProposeInterview(candidate.id, {
      date,
      time,
      interviewType,
      interviewer,
    });
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <h2 className="text-base font-bold text-slate-900">Propose Interview Slot</h2>
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          {isSuccess ? (
            <div className="p-6 text-center space-y-2">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
              <h3 className="text-base font-bold text-slate-900">Interview Slot Sent!</h3>
              <p className="text-slate-500 text-xs">
                Candidate and recruiter will be notified with slot details.
              </p>
            </div>
          ) : (
            <>
              <div>
                <label className="block font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Interview Date</span>
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-medium"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Time Slot (IST)</span>
                </label>
                <select
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-medium"
                >
                  <option value="11:00 AM IST">11:00 AM IST</option>
                  <option value="02:30 PM IST">02:30 PM IST</option>
                  <option value="04:00 PM IST">04:00 PM IST</option>
                  <option value="05:30 PM IST">05:30 PM IST</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Interview Round</label>
                <select
                  value={interviewType}
                  onChange={(e) => setInterviewType(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-medium"
                >
                  <option value="Technical Round 1 (System Design & Core Java)">
                    Technical Round 1 (System Design &amp; Core Java)
                  </option>
                  <option value="Technical Round 2 (Live Coding / Architecture)">
                    Technical Round 2 (Live Coding / Architecture)
                  </option>
                  <option value="Hiring Manager & Culture Discussion">
                    Hiring Manager &amp; Culture Discussion
                  </option>
                  <option value="KYC Operations Case Study">
                    KYC Operations Case Study
                  </option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Interviewer Name &amp; Role</span>
                </label>
                <input
                  type="text"
                  value={interviewer}
                  onChange={(e) => setInterviewer(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                  required
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
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg shadow-sm"
                >
                  Confirm &amp; Propose Slot
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
};
