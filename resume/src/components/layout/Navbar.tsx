import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  FileText,
  UploadCloud,
  Award,
  GitBranch,
  ShieldCheck,
  Sliders,
  TrendingUp,
  Smartphone,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { activeTab, setActiveTab, candidates, activeRequisitionId, role } = useApp();

  const reqCandidates = candidates.filter(
    (c) => c.requisitionId === activeRequisitionId && !c.consentRecord.isDeleted
  );
  const rankedCount = reqCandidates.filter((c) => c.aiScore).length;
  const clientCount = reqCandidates.filter(
    (c) =>
      c.pipelineStage === 'submitted_to_client' ||
      c.pipelineStage === 'client_shortlisted' ||
      c.pipelineStage === 'interview_scheduled'
  ).length;

  const tabs = [
    {
      id: 'jd-scorecard',
      label: 'Scorecard',
      icon: <FileText className="w-3.5 h-3.5" />,
      badge: null,
      roleVisible: true,
    },
    {
      id: 'bulk-upload',
      label: 'Upload CVs',
      icon: <UploadCloud className="w-3.5 h-3.5" />,
      badge: `${reqCandidates.length}`,
      roleVisible: role !== 'client',
    },
    {
      id: 'ranked-feed',
      label: 'Ranked Candidates',
      icon: <Award className="w-3.5 h-3.5" />,
      badge: rankedCount > 0 ? `${rankedCount}` : null,
      roleVisible: role !== 'client',
    },
    {
      id: 'client-portal',
      label: 'Client Portal',
      icon: <Smartphone className="w-3.5 h-3.5" />,
      badge: clientCount > 0 ? `${clientCount}` : null,
      badgeHighlight: true,
      roleVisible: true,
    },
    {
      id: 'pipeline',
      label: 'Pipeline',
      icon: <GitBranch className="w-3.5 h-3.5" />,
      badge: null,
      roleVisible: role !== 'client',
    },
    {
      id: 'dpdp-compliance',
      label: 'DPDP 2023',
      icon: <ShieldCheck className="w-3.5 h-3.5" />,
      badge: null,
      roleVisible: true,
    },
    {
      id: 'delivery-head',
      label: 'Calibration',
      icon: <Sliders className="w-3.5 h-3.5" />,
      badge: null,
      roleVisible: role === 'delivery_head' || role === 'recruiter' || role === 'ceo',
    },
    {
      id: 'roi-metrics',
      label: 'ROI & Analytics',
      icon: <TrendingUp className="w-3.5 h-3.5" />,
      badge: '₹1.57 Cr',
      roleVisible: true,
    },
  ];

  return (
    <div className="bg-white border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav
          className="flex space-x-1 sm:space-x-2 overflow-x-auto scrollbar-none"
          aria-label="Tabs"
        >
          {tabs
            .filter((t) => t.roleVisible)
            .map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`group relative flex items-center space-x-2 py-3 px-2 sm:px-3 text-xs font-medium whitespace-nowrap transition-colors border-b-2 ${
                    isActive
                      ? 'border-slate-900 text-slate-900 font-semibold'
                      : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
                  }`}
                >
                  <span
                    className={`transition-colors ${
                      isActive
                        ? 'text-slate-900'
                        : 'text-slate-400 group-hover:text-slate-600'
                    }`}
                  >
                    {tab.icon}
                  </span>
                  <span>{tab.label}</span>

                  {tab.badge && (
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full font-medium transition-colors ${
                        tab.badgeHighlight
                          ? isActive
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                          : isActive
                          ? 'bg-slate-200 text-slate-800'
                          : 'bg-slate-100 text-slate-500 border border-slate-200/60'
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
        </nav>
      </div>
    </div>
  );
};
