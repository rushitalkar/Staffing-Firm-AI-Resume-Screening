import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Sliders,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  Clock,
  Award,
  ShieldCheck,
  Scale,
  Users,
} from 'lucide-react';

export const DeliveryHeadCalibration: React.FC = () => {
  const { calibrationSamples, activeRequisition } = useApp();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-indigo-600 uppercase tracking-wider">
            <span>Delivery Head Oversight &amp; Audit</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 mt-1">
            Weekly Calibration Sample: AI Ranks vs. Recruiter Choices
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Monitors 70 recruiters in Noida to verify model accuracy, human overrides, and demographic fairness under Company A SLA standards.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Weekly Sample: 91.6% Alignment</span>
          </span>
        </div>
      </div>

      {/* Target KPIs vs Baseline */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
        {/* KPI 1: Shortlist in 48h */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="font-medium">Shortlist in &lt; 48 Hours</span>
            <Clock className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-emerald-600">86.2%</div>
          <div className="text-[11px] text-slate-600">
            Target: <strong>80%</strong> • Baseline was <strong>5 days</strong>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div className="bg-emerald-600 h-1.5 rounded-full" style={{ width: '86%' }} />
          </div>
        </div>

        {/* KPI 2: Client Acceptance */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="font-medium">Client Candidate Acceptance</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-emerald-600">62.4%</div>
          <div className="text-[11px] text-slate-600">
            Target: <strong>60%</strong> • Baseline was <strong>45%</strong>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div className="bg-emerald-600 h-1.5 rounded-full" style={{ width: '62%' }} />
          </div>
        </div>

        {/* KPI 3: Screening Time */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="font-medium">Screening Time Reduction</span>
            <Award className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-bold text-indigo-600">-64.5%</div>
          <div className="text-[11px] text-slate-600">
            Goal: <strong>-60%</strong> • Saved <strong>1,800 hrs/month</strong>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div className="bg-indigo-600 h-1.5 rounded-full" style={{ width: '64%' }} />
          </div>
        </div>

        {/* KPI 4: Recruiter Override Rate */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="font-medium">Human-in-the-Loop Overrides</span>
            <Scale className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold text-amber-600">8.4%</div>
          <div className="text-[11px] text-slate-600">
            Recruiter human insight override frequency
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: '8.4%' }} />
          </div>
        </div>
      </div>

      {/* Weekly Sample Calibration Matrix */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Weekly Calibration Audit (Sample Requisitions #REQ-801 to #REQ-810)
            </h2>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Compares AI Rank with Recruiter Final Submission and Client Acceptance.
            </p>
          </div>
          <span className="text-xs font-mono bg-white px-2.5 py-1 rounded border border-slate-200 text-slate-700">
            Sample N = 50 CVs
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
              <tr>
                <th className="py-2.5 px-4">Candidate</th>
                <th className="py-2.5 px-4">Target Role</th>
                <th className="py-2.5 px-4">AI Rank &amp; Score</th>
                <th className="py-2.5 px-4">Recruiter Rank</th>
                <th className="py-2.5 px-4">Recruiter Submitted?</th>
                <th className="py-2.5 px-4">Client Accepted?</th>
                <th className="py-2.5 px-4">Calibration Status</th>
                <th className="py-2.5 px-4">Human Reason / Evidence</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {calibrationSamples.map((sample, idx) => {
                const isAgreed = sample.alignment === 'Agreed';
                const isPromoted = sample.alignment === 'Recruiter Promoted';

                return (
                  <tr key={idx} className="hover:bg-slate-50/70">
                    <td className="py-3 px-4 font-semibold text-slate-900">
                      <div>{sample.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {sample.candidateId}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-700">{sample.role}</td>
                    <td className="py-3 px-4 font-mono">
                      <span className="font-bold text-slate-900">#{sample.aiRank}</span>{' '}
                      <span className="text-slate-500">({sample.aiScore}%)</span>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">
                      #{sample.recruiterRank}
                    </td>
                    <td className="py-3 px-4">
                      {sample.recruiterSubmitted ? (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                          YES
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                          NO
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      {sample.clientAccepted ? (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                          ACCEPTED
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                          N/A
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          isAgreed
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : isPromoted
                            ? 'bg-amber-50 text-amber-800 border border-amber-200'
                            : 'bg-indigo-50 text-indigo-800 border border-indigo-200'
                        }`}
                      >
                        {sample.alignment}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600 max-w-sm">
                      {sample.reasons}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bias & Demographic Fairness Audit Card */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center space-x-2 text-slate-900 font-bold text-sm">
          <ShieldCheck className="w-5 h-5 text-emerald-600" />
          <span>Algorithmic Fairness &amp; Blind Screening Verification</span>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed">
          Under Company A’s ethical AI charter, candidates cannot be disqualified by algorithmic decisions alone. All names, gender pronouns, age indicators, photos, and marital statuses are redacted before AI scoring. A recruiter must physically open each candidate file before submitting to a client. Low scoring candidates remain visible and searchable in the talent database.
        </p>
      </div>
    </div>
  );
};
