import React from 'react';
import { useApp } from '../../context/AppContext';
import { Role } from '../../types';
import {
  Briefcase,
  UserCheck,
  ShieldCheck,
  TrendingUp,
  RotateCcw,
  ChevronDown,
  Plus,
} from 'lucide-react';

export const Header: React.FC<{ onNewReqClick: () => void }> = ({ onNewReqClick }) => {
  const {
    role,
    setRole,
    activeRequisitionId,
    setActiveRequisitionId,
    activeRequisition,
    requisitions,
    resetDemoData,
  } = useApp();

  const roles: { id: Role; label: string; sublabel: string; icon: React.ReactNode }[] = [
    {
      id: 'recruiter',
      label: 'Recruiter',
      sublabel: 'Noida Hub',
      icon: <Briefcase className="w-3.5 h-3.5" />,
    },
    {
      id: 'client',
      label: 'Client Manager',
      sublabel: 'FinTech Corp',
      icon: <UserCheck className="w-3.5 h-3.5" />,
    },
    {
      id: 'delivery_head',
      label: 'Delivery Head',
      sublabel: 'Quality & Bias',
      icon: <ShieldCheck className="w-3.5 h-3.5" />,
    },
    {
      id: 'ceo',
      label: 'CEO',
      sublabel: 'ROI Engine',
      icon: <TrendingUp className="w-3.5 h-3.5" />,
    },
  ];

  return (
    <header className="bg-white border-b border-slate-200/80 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Left: Brand & Workspace / Requisition Switcher */}
          <div className="flex items-center space-x-3">
            {/* Minimal Logo Mark */}
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 bg-slate-900 rounded-md flex items-center justify-center text-white font-semibold text-xs tracking-wider shadow-xs">
                A
              </div>
              <div className="flex items-baseline space-x-1.5">
                <span className="font-semibold text-slate-900 text-sm tracking-tight">
                  Company A
                </span>
                <span className="text-[11px] text-slate-400 font-normal hidden sm:inline">
                  /
                </span>
              </div>
            </div>

            {/* Requisition Dropdown */}
            <div className="relative flex items-center">
              <select
                value={activeRequisitionId}
                onChange={(e) => setActiveRequisitionId(e.target.value)}
                className="appearance-none bg-slate-50 hover:bg-slate-100/80 border border-slate-200 text-slate-800 text-xs font-medium rounded-lg pl-2.5 pr-7 py-1.5 cursor-pointer transition-colors focus:outline-none focus:ring-1 focus:ring-slate-400"
              >
                {requisitions.map((req) => (
                  <option key={req.id} value={req.id}>
                    {req.title} · {req.clientName.split(' ')[0]} ({req.id})
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 pointer-events-none" />
            </div>

            {/* SLA Pill */}
            {activeRequisition && (
              <div className="hidden md:flex items-center space-x-1.5 text-[11px] font-medium text-slate-600 bg-slate-50 px-2.5 py-1 rounded-full border border-slate-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>48h SLA</span>
              </div>
            )}
          </div>

          {/* Right: Role Switcher & Utility Actions */}
          <div className="flex items-center space-x-2.5">
            {/* Refined Role Segmented Control */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200/80">
              {roles.map((r) => {
                const isActive = role === r.id;
                return (
                  <button
                    key={r.id}
                    onClick={() => setRole(r.id)}
                    className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-md text-xs transition-all ${
                      isActive
                        ? 'bg-white text-slate-900 shadow-xs font-semibold'
                        : 'text-slate-500 hover:text-slate-800 font-medium'
                    }`}
                    title={`${r.label} (${r.sublabel})`}
                  >
                    <span className={isActive ? 'text-slate-900' : 'text-slate-400'}>
                      {r.icon}
                    </span>
                    <span className="hidden sm:inline">{r.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Create Requisition Button */}
            <button
              onClick={onNewReqClick}
              className="hidden lg:flex items-center space-x-1 text-xs font-medium text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-200 transition-colors shadow-xs"
              title="Create new open requisition"
            >
              <Plus className="w-3.5 h-3.5 text-slate-500" />
              <span>New Job</span>
            </button>

            {/* Reset Demo Data Button */}
            <button
              onClick={resetDemoData}
              title="Reset demo data to prompt defaults"
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
