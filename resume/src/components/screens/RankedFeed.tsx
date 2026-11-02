import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Candidate } from '../../types';
import {
  Award,
  CheckCircle2,
  Clock,
  MapPin,
  Briefcase,
  ChevronDown,
  ChevronUp,
  Eye,
  Send,
  AlertCircle,
  Search,
  Filter,
  ShieldCheck,
  Quote,
  Sparkles,
  ExternalLink,
  Lock,
} from 'lucide-react';

export const RankedFeed: React.FC<{ onOpenCV: (cand: Candidate) => void }> = ({ onOpenCV }) => {
  const {
    activeRequisition,
    candidates,
    activeRequisitionId,
    markCandidateViewed,
    approveForClientShortlist,
    setActiveTab,
  } = useApp();

  const [expandedCandId, setExpandedCandId] = useState<string | null>(null);
  const [tierFilter, setTierFilter] = useState<string>('all');
  const [noticeFilter, setNoticeFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [gateErrorMessage, setGateErrorMessage] = useState<{ id: string; msg: string } | null>(null);

  if (!activeRequisition) return null;

  // Filter candidates belonging to this requisition
  let reqCandidates = candidates.filter(
    (c) => c.requisitionId === activeRequisitionId && !c.consentRecord.isDeleted
  );

  // Apply filters
  if (tierFilter !== 'all') {
    reqCandidates = reqCandidates.filter((c) => c.aiScore?.matchTier === tierFilter);
  }
  if (noticeFilter === '30') {
    reqCandidates = reqCandidates.filter((c) => c.noticeDays <= 30);
  } else if (noticeFilter === '60') {
    reqCandidates = reqCandidates.filter((c) => c.noticeDays <= 60);
  }

  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    reqCandidates = reqCandidates.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.currentRole.toLowerCase().includes(q) ||
        c.currentCompany.toLowerCase().includes(q) ||
        c.keySkills.some((s) => s.toLowerCase().includes(q))
    );
  }

  // Sort best first: AI match score descending
  const sortedCandidates = [...reqCandidates].sort(
    (a, b) => (b.aiScore?.overallScore || 0) - (a.aiScore?.overallScore || 0)
  );

  const toggleExpand = (id: string) => {
    setExpandedCandId(expandedCandId === id ? null : id);
  };

  const handleOpenCVModal = (cand: Candidate) => {
    markCandidateViewed(cand.id);
    onOpenCV(cand);
    setGateErrorMessage(null);
  };

  const handleSubmitToClient = (cand: Candidate) => {
    const result = approveForClientShortlist(cand.id);
    if (!result.success) {
      setGateErrorMessage({ id: cand.id, msg: result.error || 'Please open CV first.' });
    } else {
      setGateErrorMessage(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-indigo-600 uppercase tracking-wider">
            <span>Ranked Candidates • Best First with Evidence</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 mt-1">
            AI Screening & Quoted Resume Evidence
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Evaluated against {activeRequisition.scorecard.criteria.length} criteria in {activeRequisition.title} scorecard.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <div className="text-xs bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>
              <strong>Blind Screening:</strong> Names & demographics redacted from AI
            </span>
          </div>
          <button
            onClick={() => setActiveTab('client-portal')}
            className="text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2 rounded-lg transition-colors shadow-sm flex items-center space-x-1.5"
          >
            <span>Client Portal View</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center space-x-2 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by skill, name, role..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="flex items-center space-x-3 w-full md:w-auto justify-end flex-wrap gap-2">
          <div className="flex items-center space-x-1.5">
            <span className="text-slate-500 font-medium">Match Tier:</span>
            <select
              value={tierFilter}
              onChange={(e) => setTierFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-md px-2 py-1 text-slate-800 font-medium cursor-pointer"
            >
              <option value="all">All Profiles ({sortedCandidates.length})</option>
              <option value="Strong Match">Strong Match (80%+)</option>
              <option value="Moderate Match">Moderate Match (60-79%)</option>
              <option value="Low Match">Low Match (35-59%)</option>
              <option value="Unfit">Unfit (&lt; 35%)</option>
            </select>
          </div>

          <div className="flex items-center space-x-1.5">
            <span className="text-slate-500 font-medium">Notice:</span>
            <select
              value={noticeFilter}
              onChange={(e) => setNoticeFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-md px-2 py-1 text-slate-800 font-medium cursor-pointer"
            >
              <option value="all">All Notice Periods</option>
              <option value="30">&lt;= 30 Days (Immediate)</option>
              <option value="60">&lt;= 60 Days (Compliant)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Candidate List */}
      <div className="space-y-4">
        {sortedCandidates.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-xl border border-slate-200 text-slate-500 space-y-2">
            <AlertCircle className="w-8 h-8 text-slate-400 mx-auto" />
            <p className="font-semibold text-slate-700">No candidates match current filters.</p>
            <p className="text-xs">Adjust filter settings or upload more CVs via the Bulk Upload tab.</p>
          </div>
        ) : (
          sortedCandidates.map((cand, index) => {
            const aiScore = cand.aiScore;
            const isExpanded = expandedCandId === cand.id;
            const isStrong = aiScore?.matchTier === 'Strong Match';
            const isModerate = aiScore?.matchTier === 'Moderate Match';
            const isUnfit = aiScore?.matchTier === 'Unfit';

            return (
              <div
                key={cand.id}
                className={`bg-white rounded-xl border transition-all ${
                  isStrong
                    ? 'border-indigo-200 shadow-sm'
                    : isUnfit
                    ? 'border-slate-200 opacity-90'
                    : 'border-slate-200'
                }`}
              >
                {/* Main Summary Row */}
                <div className="p-5">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    {/* Left: Rank, Score Badge, Name & Role */}
                    <div className="flex items-start space-x-4">
                      {/* Rank Indicator */}
                      <div className="text-xs font-mono font-bold text-slate-400 pt-1">
                        #{index + 1}
                      </div>

                      {/* AI Score Badge */}
                      <div
                        className={`w-14 h-14 rounded-xl flex flex-col items-center justify-center font-bold shadow-sm ${
                          isStrong
                            ? 'bg-emerald-600 text-white'
                            : isModerate
                            ? 'bg-amber-500 text-white'
                            : 'bg-slate-700 text-white'
                        }`}
                      >
                        <span className="text-lg leading-none">{aiScore?.overallScore || '—'}%</span>
                        <span className="text-[9px] uppercase tracking-wider opacity-90 mt-0.5">
                          {isStrong ? 'Strong' : isModerate ? 'Moderate' : 'Unfit'}
                        </span>
                      </div>

                      {/* Candidate Details */}
                      <div>
                        <div className="flex items-center space-x-2">
                          <h2 className="text-base font-bold text-slate-900">{cand.name}</h2>
                          <span className="text-xs font-mono text-slate-400">({cand.id})</span>

                          {cand.recruiterApprovedForClient && (
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Submitted to Client
                            </span>
                          )}

                          {cand.recruiterViewed && !cand.recruiterApprovedForClient && (
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center gap-1">
                              <Eye className="w-3 h-3 text-indigo-600" /> CV Inspected
                            </span>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600 mt-1">
                          <span className="flex items-center gap-1 font-medium text-slate-800">
                            <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                            {cand.currentRole} at {cand.currentCompany}
                          </span>
                          <span>•</span>
                          <span className="font-semibold text-slate-800">
                            {cand.experienceYears} Years Exp
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            Notice: <strong className="text-slate-800">{cand.noticeDays} Days</strong>
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-slate-400" />
                            {cand.location}
                          </span>
                        </div>

                        {/* Skills Chips */}
                        <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
                          {cand.keySkills.slice(0, 6).map((skill, sIdx) => (
                            <span
                              key={sIdx}
                              className="text-[11px] px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md font-medium"
                            >
                              {skill}
                            </span>
                          ))}
                          {cand.keySkills.length > 6 && (
                            <span className="text-[10px] text-slate-400">
                              +{cand.keySkills.length - 6} more
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right: Actions & Recruiter Verification Gate */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 lg:pl-4">
                      {/* Recruiter Gate: Must open CV */}
                      <button
                        onClick={() => handleOpenCVModal(cand)}
                        className={`flex items-center justify-center space-x-1.5 px-3 py-2 text-xs font-semibold rounded-lg border transition-colors ${
                          cand.recruiterViewed
                            ? 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                            : 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100'
                        }`}
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>{cand.recruiterViewed ? 'View Full CV' : 'Open & Inspect CV'}</span>
                      </button>

                      <button
                        onClick={() => handleSubmitToClient(cand)}
                        disabled={cand.recruiterApprovedForClient}
                        className={`flex items-center justify-center space-x-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg transition-all shadow-sm ${
                          cand.recruiterApprovedForClient
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-default'
                            : !cand.recruiterViewed
                            ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                            : 'bg-slate-900 hover:bg-slate-800 text-white'
                        }`}
                        title={
                          !cand.recruiterViewed
                            ? 'Recruiter Gate: Open and review CV before submitting to client'
                            : 'Submit verified profile to client portal'
                        }
                      >
                        {!cand.recruiterViewed && <Lock className="w-3.5 h-3.5 mr-0.5" />}
                        <Send className="w-3.5 h-3.5" />
                        <span>
                          {cand.recruiterApprovedForClient ? 'Submitted' : 'Submit to Client'}
                        </span>
                      </button>

                      <button
                        onClick={() => toggleExpand(cand.id)}
                        className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors flex items-center justify-center"
                        title="Toggle evidence breakdown"
                      >
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Gate Warning Message */}
                  {gateErrorMessage?.id === cand.id && (
                    <div className="mt-3 p-2.5 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800 flex items-center space-x-2 animate-fade-in">
                      <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                      <span>{gateErrorMessage.msg}</span>
                    </div>
                  )}

                  {/* Quick Highlight Summary */}
                  {aiScore && (
                    <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                      {aiScore.strengths.length > 0 && (
                        <div className="flex items-start space-x-1.5 text-emerald-800">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                          <span>
                            <strong>Key Strength:</strong> {aiScore.strengths[0]}
                          </span>
                        </div>
                      )}
                      {aiScore.gaps.length > 0 && (
                        <div className="flex items-start space-x-1.5 text-rose-700">
                          <AlertCircle className="w-3.5 h-3.5 text-rose-500 flex-shrink-0 mt-0.5" />
                          <span>
                            <strong>Identified Gap:</strong> {aiScore.gaps[0]}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Quoted Evidence Breakdown (Expandable Drawer) */}
                {isExpanded && aiScore && (
                  <div className="px-5 pb-5 pt-2 bg-slate-50 border-t border-slate-200 rounded-b-xl space-y-4 animate-fade-in">
                    <div className="flex items-center justify-between text-xs">
                      <div className="font-semibold text-slate-800 flex items-center space-x-1.5">
                        <Quote className="w-3.5 h-3.5 text-indigo-600" />
                        <span>Exact Quoted Evidence Lines from CV (Criterion by Criterion)</span>
                      </div>
                      <span className="text-[11px] text-slate-500 font-mono">
                        Blind AI Verification Active
                      </span>
                    </div>

                    <div className="space-y-2.5">
                      {aiScore.evidenceList.map((ev, eIdx) => {
                        return (
                          <div
                            key={eIdx}
                            className={`p-3 rounded-lg border text-xs space-y-1.5 ${
                              ev.matched
                                ? 'bg-white border-slate-200'
                                : 'bg-red-50/50 border-red-200'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <span
                                  className={`w-2 h-2 rounded-full ${
                                    ev.matched ? 'bg-emerald-500' : 'bg-rose-500'
                                  }`}
                                />
                                <span className="font-semibold text-slate-900">
                                  {ev.criterionName}
                                </span>
                                <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 font-mono">
                                  {ev.sourceSection}
                                </span>
                              </div>

                              <span
                                className={`font-mono font-bold ${
                                  ev.score >= 80
                                    ? 'text-emerald-700'
                                    : ev.score >= 60
                                    ? 'text-amber-700'
                                    : 'text-rose-700'
                                }`}
                              >
                                {ev.score}/100
                              </span>
                            </div>

                            {/* Quoted Evidence Line */}
                            <div className="bg-slate-50 p-2 rounded border border-slate-200/80 font-mono text-[11px] text-slate-800 flex items-start space-x-2">
                              <span className="text-slate-400 select-none">“</span>
                              <span className="flex-1">{ev.evidenceQuote}</span>
                              <span className="text-slate-400 select-none">”</span>
                            </div>

                            <p className="text-[11px] text-slate-500 italic pl-1">
                              ↳ {ev.reasoning}
                            </p>
                          </div>
                        );
                      })}
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <div className="text-[11px] text-slate-500">
                        Candidate ID: <strong>{cand.id}</strong> • Uploaded:{' '}
                        {new Date(cand.uploadedAt).toLocaleDateString()}
                      </div>

                      <button
                        onClick={() => handleOpenCVModal(cand)}
                        className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center space-x-1"
                      >
                        <span>Open Complete CV Document</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
