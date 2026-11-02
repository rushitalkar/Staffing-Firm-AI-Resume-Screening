import React, { useState } from 'react';
import { Candidate } from '../../types';
import { useApp } from '../../context/AppContext';
import { X, ShieldAlert, CheckCircle2, AlertTriangle } from 'lucide-react';

export const DPDPDeleteModal: React.FC<{
  candidateId: string | null;
  onClose: () => void;
}> = ({ candidateId, onClose }) => {
  const { candidates, executeDPDPDeletion } = useApp();
  const [requester, setRequester] = useState('Candidate Direct Email Request');
  const [confirmText, setConfirmText] = useState('');
  const [isDeleted, setIsDeleted] = useState(false);

  const candidate = candidates.find((c) => c.id === candidateId);
  if (!candidate) return null;

  const handleDelete = (e: React.FormEvent) => {
    e.preventDefault();
    if (confirmText.trim().toUpperCase() !== 'DELETE') return;

    executeDPDPDeletion(candidate.id, requester);
    setIsDeleted(true);
    setTimeout(() => {
      setIsDeleted(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-rose-100 flex items-center justify-between bg-rose-50/50">
          <div className="flex items-center space-x-2">
            <ShieldAlert className="w-5 h-5 text-rose-600" />
            <h2 className="text-base font-bold text-slate-900">Right to Erasure (DPDP Act 2023)</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleDelete} className="p-5 space-y-4 text-xs">
          {isDeleted ? (
            <div className="p-6 text-center space-y-2">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
              <h3 className="text-base font-bold text-slate-900">Candidate Data Purged</h3>
              <p className="text-slate-500 text-xs">
                All PII, CV texts, and contact points wiped. Cryptographic audit entry saved.
              </p>
            </div>
          ) : (
            <>
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 space-y-1">
                <div className="font-bold flex items-center gap-1">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>Permanent Action Warning</span>
                </div>
                <p className="text-[11px]">
                  This will immediately and irrecoverably erase <strong>{candidate.name} ({candidate.id})</strong>&apos;s personal contact information, raw resume texts, and evaluation records under India&apos;s DPDP Act Section 12(3).
                </p>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Consent Withdrawal Source / Requester
                </label>
                <select
                  value={requester}
                  onChange={(e) => setRequester(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-medium"
                >
                  <option value="Candidate Direct Email Request">Candidate Direct Email Request</option>
                  <option value="Job Board Opt-out Webhook">Job Board Opt-out Webhook</option>
                  <option value="Data Protection Officer (DPO) Order">Data Protection Officer (DPO) Order</option>
                  <option value="Retention Period Expiry (90 Days)">Retention Period Expiry (90 Days)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Type <span className="font-mono text-rose-600 font-bold">DELETE</span> to confirm:
                </label>
                <input
                  type="text"
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  placeholder="DELETE"
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-mono font-bold"
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
                  disabled={confirmText.trim().toUpperCase() !== 'DELETE'}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-lg shadow-sm disabled:opacity-40"
                >
                  Execute Data Erasure
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
};
