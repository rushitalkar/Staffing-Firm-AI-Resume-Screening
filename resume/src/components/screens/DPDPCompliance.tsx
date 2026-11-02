import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldAlert,
  ShieldCheck,
  Trash2,
  Lock,
  UserX,
  FileText,
  Clock,
  Search,
  CheckCircle2,
  AlertOctagon,
} from 'lucide-react';

export const DPDPCompliance: React.FC<{ onDeleteRequest: (candId: string) => void }> = ({
  onDeleteRequest,
}) => {
  const { candidates, auditLogs, activeRequisitionId } = useApp();
  const [activeTab, setActiveTab] = useState<'consent' | 'audit'>('consent');
  const [auditSearch, setAuditSearch] = useState('');

  const activeCandidates = candidates.filter(
    (c) => c.requisitionId === activeRequisitionId || !c.consentRecord.isDeleted
  );

  const filteredLogs = auditLogs.filter(
    (log) =>
      log.details.toLowerCase().includes(auditSearch.toLowerCase()) ||
      log.candidateMaskedName.toLowerCase().includes(auditSearch.toLowerCase()) ||
      log.userName.toLowerCase().includes(auditSearch.toLowerCase()) ||
      log.action.toLowerCase().includes(auditSearch.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-indigo-600 uppercase tracking-wider">
            <span>Regulatory Data Privacy Hub</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 mt-1">
            Digital Personal Data Protection (DPDP) Act 2023 Compliance
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Strict adherence to consent management, purpose limitation (&quot;hiring use only&quot;), right to be forgotten, and immutable access logging.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>DPDP Section 6 &amp; 12 Compliant</span>
          </span>
        </div>
      </div>

      {/* Compliance Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-1">
          <div className="text-slate-500 font-medium">1. Explicit Consent</div>
          <div className="text-base font-bold text-slate-900">100% Tracked</div>
          <p className="text-slate-500 text-[11px]">
            Every CV linked to opt-in timestamp and job board source.
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-1">
          <div className="text-slate-500 font-medium">2. Purpose Limitation</div>
          <div className="text-base font-bold text-indigo-600">Hiring Use Only</div>
          <p className="text-slate-500 text-[11px]">
            Data Fiduciary lock: no marketing or secondary processing.
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-1">
          <div className="text-slate-500 font-medium">3. Right to Erasure</div>
          <div className="text-base font-bold text-rose-600">1-Click Purge</div>
          <p className="text-slate-500 text-[11px]">
            Immediate cryptographic wipe of PII upon candidate withdrawal.
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-1">
          <div className="text-slate-500 font-medium">4. Immutable Access Log</div>
          <div className="text-base font-bold text-slate-900">{auditLogs.length} Events Logged</div>
          <p className="text-slate-500 text-[11px]">
            Every CV view, preview, or status change logged with timestamp &amp; IP.
          </p>
        </div>
      </div>

      {/* Navigation sub-tabs */}
      <div className="flex items-center space-x-2 text-xs">
        <button
          onClick={() => setActiveTab('consent')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
            activeTab === 'consent'
              ? 'bg-slate-900 text-white'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          Candidate Consent &amp; Deletion Registry ({candidates.length})
        </button>
        <button
          onClick={() => setActiveTab('audit')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
            activeTab === 'audit'
              ? 'bg-slate-900 text-white'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          Immutable Access Audit Trail ({auditLogs.length})
        </button>
      </div>

      {/* Sub-tab 1: Consent & Deletion on Request */}
      {activeTab === 'consent' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Candidate Consent Records &amp; Deletion Requests (DPDP Act 2023 Sec 12)
            </h2>
            <span className="text-[11px] text-slate-500">
              Company A as Data Fiduciary
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                <tr>
                  <th className="py-2.5 px-4">Candidate ID</th>
                  <th className="py-2.5 px-4">Candidate Name</th>
                  <th className="py-2.5 px-4">Consent Source</th>
                  <th className="py-2.5 px-4">Consented At</th>
                  <th className="py-2.5 px-4">Purpose</th>
                  <th className="py-2.5 px-4">Status</th>
                  <th className="py-2.5 px-4 text-right">Right to Erasure</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {candidates.map((cand) => {
                  const isDeleted = cand.consentRecord.isDeleted;

                  return (
                    <tr
                      key={cand.id}
                      className={isDeleted ? 'bg-slate-50 text-slate-400' : 'hover:bg-slate-50/70'}
                    >
                      <td className="py-3 px-4 font-mono font-bold text-slate-800">
                        {cand.id}
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-900">
                        {isDeleted ? (
                          <span className="line-through text-slate-400 font-mono">
                            [PURGED DATA]
                          </span>
                        ) : (
                          cand.name
                        )}
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        {cand.consentRecord.consentSource}
                      </td>
                      <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">
                        {new Date(cand.consentRecord.consentedAt).toLocaleDateString()}{' '}
                        {new Date(cand.consentRecord.consentedAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        <span className="px-2 py-0.5 rounded bg-slate-100 font-medium">
                          {cand.consentRecord.purpose}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {isDeleted ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-800 border border-rose-200">
                            DELETED ON REQUEST
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1 w-max">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Active Consent
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        {isDeleted ? (
                          <span className="text-[11px] text-slate-400 italic">
                            Erased on {new Date(cand.consentRecord.deletedAt || '').toLocaleDateString()}
                          </span>
                        ) : (
                          <button
                            onClick={() => onDeleteRequest(cand.id)}
                            className="text-xs font-semibold px-2.5 py-1 text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded transition-colors"
                            title="Execute Right to be Forgotten deletion"
                          >
                            Delete on Request
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Sub-tab 2: Immutable Access Audit Trail */}
      {activeTab === 'audit' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Who Viewed What Log (DPDP Act Sec 8 Compliance Log)
              </h2>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Every CV opening, preview, shortlist submission, and deletion is recorded.
              </p>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search audit trail..."
                value={auditSearch}
                onChange={(e) => setAuditSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-md text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="overflow-x-auto max-h-[500px]">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold sticky top-0">
                <tr>
                  <th className="py-2.5 px-4">Timestamp (IST)</th>
                  <th className="py-2.5 px-4">User</th>
                  <th className="py-2.5 px-4">Role</th>
                  <th className="py-2.5 px-4">Action</th>
                  <th className="py-2.5 px-4">Candidate Masked ID</th>
                  <th className="py-2.5 px-4">Details</th>
                  <th className="py-2.5 px-4">IP / Session</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/70">
                    <td className="py-2.5 px-4 text-slate-500 font-mono text-[11px] whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleDateString()} {new Date(log.timestamp).toLocaleTimeString()}
                    </td>
                    <td className="py-2.5 px-4 font-semibold text-slate-800 whitespace-nowrap">
                      {log.userName}
                    </td>
                    <td className="py-2.5 px-4">
                      <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">
                        {log.userRole}
                      </span>
                    </td>
                    <td className="py-2.5 px-4">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          log.action === 'DATA_DELETION_EXECUTED'
                            ? 'bg-rose-100 text-rose-800'
                            : log.action === 'INTERVIEW_PROPOSED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : log.action === 'VIEW_CV'
                            ? 'bg-indigo-100 text-indigo-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {log.action}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 font-mono font-medium text-slate-900 whitespace-nowrap">
                      {log.candidateMaskedName}
                    </td>
                    <td className="py-2.5 px-4 text-slate-600 max-w-xs truncate" title={log.details}>
                      {log.details}
                    </td>
                    <td className="py-2.5 px-4 text-slate-400 font-mono text-[11px] whitespace-nowrap">
                      {log.ipAddress}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
