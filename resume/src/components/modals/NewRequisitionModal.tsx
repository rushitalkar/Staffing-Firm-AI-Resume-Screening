import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Requisition, Scorecard } from '../../types';
import { X, Plus, Sparkles } from 'lucide-react';

export const NewRequisitionModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const { createNewRequisition } = useApp();

  const [title, setTitle] = useState('');
  const [clientName, setClientName] = useState('');
  const [industry, setIndustry] = useState<Requisition['industry']>('IT Services');
  const [openPositions, setOpenPositions] = useState(2);
  const [fee, setFee] = useState(55000);
  const [minExp, setMinExp] = useState(4);
  const [maxExp, setMaxExp] = useState(7);
  const [maxNotice, setMaxNotice] = useState(60);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !clientName.trim()) return;

    const reqId = `REQ-${Date.now().toString().slice(-4)}`;
    const scorecard: Scorecard = {
      id: `SC-${Date.now().toString().slice(-4)}`,
      requisitionId: reqId,
      jobTitle: title,
      clientName,
      department: `${industry} Operations`,
      experienceMinYears: minExp,
      experienceMaxYears: maxExp,
      maxNoticeDays: maxNotice,
      budgetMinLPA: 12,
      budgetMaxLPA: 20,
      primaryLocation: 'Noida',
      workMode: 'Hybrid',
      extractedAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      criteria: [
        {
          id: `crit-${Date.now()}-1`,
          name: `${title} Core Skills`,
          category: 'must_have',
          targetValue: 'Demonstrated experience in primary stack',
          weight: 5,
          description: 'Core domain competencies',
        },
        {
          id: `crit-${Date.now()}-2`,
          name: `Experience (${minExp}-${maxExp} yrs)`,
          category: 'experience',
          targetValue: `${minExp} - ${maxExp} Years`,
          weight: 4,
          description: 'Relevant seniority',
        },
        {
          id: `crit-${Date.now()}-3`,
          name: `Notice Period (<= ${maxNotice} days)`,
          category: 'notice_period',
          targetValue: `<= ${maxNotice} days`,
          weight: 4,
          description: 'Required joining timeline',
        },
      ],
    };

    const newReq: Requisition = {
      id: reqId,
      title,
      clientName,
      industry,
      openPositions,
      feePerPlacementINR: fee,
      createdAt: new Date().toISOString(),
      slaDeadline: new Date(Date.now() + 48 * 3600 * 1000).toISOString(),
      status: 'Open',
      assignedRecruiter: 'Vikram Mehta (Noida Recruiter)',
      scorecard,
    };

    createNewRequisition(newReq);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <h2 className="text-base font-bold text-slate-900">Create New Requisition</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Intake open job requirement with automatic 48h SLA tracking.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Job Title</label>
            <input
              type="text"
              placeholder="e.g. Senior Java Developer, KYC Analyst"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Client Name</label>
              <input
                type="text"
                placeholder="e.g. FinTech Solutions Corp"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Industry Sector</label>
              <select
                value={industry}
                onChange={(e) => setIndustry(e.target.value as any)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
              >
                <option value="IT Services">IT Services</option>
                <option value="Banking & BFSI">Banking &amp; BFSI Back-Office</option>
                <option value="Retail & Consumer">Retail &amp; Consumer</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Open Seats</label>
              <input
                type="number"
                value={openPositions}
                onChange={(e) => setOpenPositions(Number(e.target.value))}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                min={1}
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Fee / Placement (₹)</label>
              <input
                type="number"
                value={fee}
                onChange={(e) => setFee(Number(e.target.value))}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                step={5000}
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Max Notice (Days)</label>
              <input
                type="number"
                value={maxNotice}
                onChange={(e) => setMaxNotice(Number(e.target.value))}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
              />
            </div>
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
              Create Requisition
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
