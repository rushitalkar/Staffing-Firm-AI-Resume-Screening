import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ScorecardCriterion } from '../../types';
import {
  Sparkles,
  Sliders,
  Plus,
  Trash2,
  CheckCircle,
  AlertCircle,
  FileText,
  Save,
  ArrowRight,
} from 'lucide-react';

export const ScorecardIntake: React.FC = () => {
  const { activeRequisition, updateScorecard, setActiveTab } = useApp();
  if (!activeRequisition) return null;

  const scorecard = activeRequisition.scorecard;

  const [rawText, setRawText] = useState(scorecard.rawJDText || '');
  const [jobTitle, setJobTitle] = useState(scorecard.jobTitle);
  const [minExp, setMinExp] = useState(scorecard.experienceMinYears);
  const [maxExp, setMaxExp] = useState(scorecard.experienceMaxYears);
  const [maxNotice, setMaxNotice] = useState(scorecard.maxNoticeDays);
  const [budgetMin, setBudgetMin] = useState(scorecard.budgetMinLPA);
  const [budgetMax, setBudgetMax] = useState(scorecard.budgetMaxLPA);
  const [location, setLocation] = useState(scorecard.primaryLocation);
  const [workMode, setWorkMode] = useState(scorecard.workMode);
  const [criteria, setCriteria] = useState<ScorecardCriterion[]>(scorecard.criteria);
  const [isExtracting, setIsExtracting] = useState(false);
  const [savedNotification, setSavedNotification] = useState(false);

  // New criterion state
  const [newCritName, setNewCritName] = useState('');
  const [newCritCategory, setNewCritCategory] = useState<ScorecardCriterion['category']>('must_have');
  const [newCritWeight, setNewCritWeight] = useState(4);
  const [newCritDesc, setNewCritDesc] = useState('');

  const handleAIExtract = () => {
    setIsExtracting(true);
    setTimeout(() => {
      // Intelligent extraction simulation from JD text
      const hasJava = /java/i.test(rawText);
      const hasSpringBoot = /spring boot/i.test(rawText);
      const hasKyc = /kyc|aml/i.test(rawText);

      if (hasJava || hasSpringBoot) {
        setJobTitle('Senior Java Developer');
        setMinExp(5);
        setMaxExp(8);
        setMaxNotice(60);
        setBudgetMin(18);
        setBudgetMax(24);
        setLocation('Noida');
        setWorkMode('Hybrid');
        setCriteria([
          {
            id: 'crit-1',
            name: 'Spring Boot & Microservices',
            category: 'must_have',
            targetValue: 'Production microservices, REST APIs, high throughput',
            weight: 5,
            description: 'Design and deploy scalable Spring Boot microservices.',
          },
          {
            id: 'crit-2',
            name: 'Core Java (JDK 11/17)',
            category: 'must_have',
            targetValue: 'Multithreading, Collections, Stream API',
            weight: 5,
            description: 'Core object-oriented design and concurrency.',
          },
          {
            id: 'crit-3',
            name: 'Relevant Experience (5-8 yrs)',
            category: 'experience',
            targetValue: '5.0 - 8.0 Years',
            weight: 4,
            description: 'Minimum 5 years in production backend development.',
          },
          {
            id: 'crit-4',
            name: 'Notice Period (<= 60 days)',
            category: 'notice_period',
            targetValue: '<= 60 days',
            weight: 4,
            description: 'Strict onboarding window.',
          },
          {
            id: 'crit-5',
            name: 'Location: Noida / Hybrid',
            category: 'location',
            targetValue: 'Noida / NCR',
            weight: 3,
            description: 'Office attendance 2 days a week.',
          },
          {
            id: 'crit-6',
            name: 'Kafka / Distributed Messaging',
            category: 'good_to_have',
            targetValue: 'Kafka / RabbitMQ / Docker',
            weight: 3,
            description: 'Event-driven systems exposure.',
          },
        ]);
      } else if (hasKyc) {
        setJobTitle('KYC & AML Compliance Analyst');
        setMinExp(2);
        setMaxExp(5);
        setMaxNotice(30);
        setBudgetMin(6);
        setBudgetMax(9.5);
        setLocation('Noida');
        setWorkMode('Onsite');
        setCriteria([
          {
            id: 'crit-b1',
            name: 'KYC / AML Due Diligence',
            category: 'must_have',
            targetValue: 'CDD, EDD, Sanctions screening',
            weight: 5,
            description: 'Customer due diligence in banking operations.',
          },
          {
            id: 'crit-b2',
            name: 'Advanced Excel & Data Reconciliation',
            category: 'must_have',
            targetValue: 'VLOOKUP, Pivot Tables',
            weight: 4,
            description: 'High volume tracking and MIS reporting.',
          },
          {
            id: 'crit-b3',
            name: 'Notice Period (<= 30 days)',
            category: 'notice_period',
            targetValue: '<= 30 days',
            weight: 5,
            description: 'Immediate joiner requirement.',
          },
        ]);
      }
      setIsExtracting(false);
      setSavedNotification(true);
      setTimeout(() => setSavedNotification(false), 3000);
    }, 600);
  };

  const handleSaveScorecard = () => {
    const updated = {
      ...scorecard,
      jobTitle,
      experienceMinYears: Number(minExp),
      experienceMaxYears: Number(maxExp),
      maxNoticeDays: Number(maxNotice),
      budgetMinLPA: Number(budgetMin),
      budgetMaxLPA: Number(budgetMax),
      primaryLocation: location,
      workMode,
      criteria,
      rawJDText: rawText,
      lastUpdated: new Date().toISOString(),
    };
    updateScorecard(activeRequisition.id, updated);
    setSavedNotification(true);
    setTimeout(() => setSavedNotification(false), 3000);
  };

  const handleAddCriterion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCritName.trim()) return;

    const newCrit: ScorecardCriterion = {
      id: `crit-custom-${Date.now()}`,
      name: newCritName.trim(),
      category: newCritCategory,
      targetValue: newCritDesc.trim() || newCritName.trim(),
      weight: newCritWeight,
      description: newCritDesc.trim() || `Verified hands-on knowledge in ${newCritName}`,
    };

    setCriteria([...criteria, newCrit]);
    setNewCritName('');
    setNewCritDesc('');
  };

  const handleDeleteCriterion = (id: string) => {
    setCriteria(criteria.filter(c => c.id !== id));
  };

  const handleWeightChange = (id: string, weight: number) => {
    setCriteria(criteria.map(c => (c.id === id ? { ...c, weight } : c)));
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-indigo-600 uppercase tracking-wider">
            <span>Intelligent JD Intake & Scorecard</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 mt-1">
            Job Description & Weighted Evaluation Scorecard
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Client: <strong>{activeRequisition.clientName}</strong> • Requisition: <strong>{activeRequisition.id}</strong>
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {savedNotification && (
            <div className="flex items-center space-x-1.5 text-xs text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 animate-fade-in">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>Scorecard saved & AI scores recomputed!</span>
            </div>
          )}

          <button
            onClick={handleSaveScorecard}
            className="flex items-center space-x-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors shadow-sm"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save & Recompute AI</span>
          </button>

          <button
            onClick={() => setActiveTab('ranked-feed')}
            className="flex items-center space-x-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold px-4 py-2 rounded-lg transition-colors border border-indigo-200"
          >
            <span>View Ranked CVs</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Raw JD Intake from Client */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-semibold text-slate-900 flex items-center space-x-2">
                <FileText className="w-4 h-4 text-slate-500" />
                <span>Client JD / Email Intake</span>
              </label>
              <span className="text-xs text-slate-400">Paste text or email</span>
            </div>

            <textarea
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              rows={12}
              className="w-full text-xs font-mono p-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 leading-relaxed resize-y"
              placeholder="Paste job description received from client..."
            />

            <div className="mt-3 flex items-center justify-between">
              <p className="text-[11px] text-slate-500">
                AI extracts must-haves, experience range, notice limit, and compensation.
              </p>
              <button
                type="button"
                onClick={handleAIExtract}
                disabled={isExtracting}
                className="flex items-center space-x-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors shadow-sm disabled:opacity-50"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isExtracting ? 'Extracting...' : 'AI Extract Scorecard'}</span>
              </button>
            </div>
          </div>

          {/* Core Requisition Guardrails */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-wider flex items-center space-x-2">
              <Sliders className="w-3.5 h-3.5 text-slate-500" />
              <span>Core Parameters & Guardrails</span>
            </h3>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-slate-600 mb-1 font-medium">Job Title</label>
                <input
                  type="text"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md font-semibold text-slate-800"
                />
              </div>

              <div>
                <label className="block text-slate-600 mb-1 font-medium">Work Mode</label>
                <select
                  value={workMode}
                  onChange={(e) => setWorkMode(e.target.value as any)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md text-slate-800"
                >
                  <option value="Hybrid">Hybrid (Noida)</option>
                  <option value="Onsite">Onsite (Noida)</option>
                  <option value="Remote">Remote</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 mb-1 font-medium">Experience Range (Yrs)</label>
                <div className="flex items-center space-x-1">
                  <input
                    type="number"
                    value={minExp}
                    onChange={(e) => setMinExp(Number(e.target.value))}
                    className="w-16 p-2 bg-slate-50 border border-slate-200 rounded-md text-slate-800"
                  />
                  <span className="text-slate-400">to</span>
                  <input
                    type="number"
                    value={maxExp}
                    onChange={(e) => setMaxExp(Number(e.target.value))}
                    className="w-16 p-2 bg-slate-50 border border-slate-200 rounded-md text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 mb-1 font-medium">Max Notice (Days)</label>
                <input
                  type="number"
                  value={maxNotice}
                  onChange={(e) => setMaxNotice(Number(e.target.value))}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md text-slate-800"
                />
              </div>

              <div>
                <label className="block text-slate-600 mb-1 font-medium">Budget CTC (LPA)</label>
                <div className="flex items-center space-x-1">
                  <input
                    type="number"
                    value={budgetMin}
                    onChange={(e) => setBudgetMin(Number(e.target.value))}
                    className="w-16 p-2 bg-slate-50 border border-slate-200 rounded-md text-slate-800"
                  />
                  <span className="text-slate-400">-</span>
                  <input
                    type="number"
                    value={budgetMax}
                    onChange={(e) => setBudgetMax(Number(e.target.value))}
                    className="w-16 p-2 bg-slate-50 border border-slate-200 rounded-md text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 mb-1 font-medium">Target Location</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md text-slate-800"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Editable Criteria & Weights */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-semibold text-slate-900">
                  Weighted Scoring Rubric ({criteria.length} Criteria)
                </h2>
                <p className="text-xs text-slate-500">
                  AI will evaluate every candidate against these criteria and quote direct evidence lines.
                </p>
              </div>
              <span className="text-xs font-medium px-2 py-1 bg-indigo-50 text-indigo-700 rounded-full border border-indigo-100">
                Blind AI Assessment
              </span>
            </div>

            {/* Criteria List */}
            <div className="space-y-3">
              {criteria.map((crit) => {
                const isMustHave = crit.category === 'must_have';
                const isExp = crit.category === 'experience';
                const isNotice = crit.category === 'notice_period';

                return (
                  <div
                    key={crit.id}
                    className="p-3.5 bg-slate-50 hover:bg-slate-100/70 border border-slate-200 rounded-lg transition-colors space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                            isMustHave
                              ? 'bg-red-100 text-red-800 border border-red-200'
                              : isExp || isNotice
                              ? 'bg-amber-100 text-amber-800 border border-amber-200'
                              : 'bg-blue-100 text-blue-800 border border-blue-200'
                          }`}
                        >
                          {crit.category.replace('_', ' ')}
                        </span>
                        <span className="text-xs font-semibold text-slate-900">{crit.name}</span>
                      </div>

                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-1">
                          <span className="text-[11px] text-slate-500 font-medium">Weight:</span>
                          <select
                            value={crit.weight}
                            onChange={(e) => handleWeightChange(crit.id, Number(e.target.value))}
                            className="text-xs bg-white border border-slate-200 rounded px-1.5 py-0.5 font-semibold text-slate-800"
                          >
                            <option value={5}>5 (Critical)</option>
                            <option value={4}>4 (High)</option>
                            <option value={3}>3 (Standard)</option>
                            <option value={2}>2 (Secondary)</option>
                            <option value={1}>1 (Bonus)</option>
                          </select>
                        </div>

                        <button
                          onClick={() => handleDeleteCriterion(crit.id)}
                          className="text-slate-400 hover:text-red-600 p-1 rounded"
                          title="Delete criterion"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="text-xs text-slate-600 flex items-start space-x-2">
                      <span className="text-slate-400 font-mono text-[10px]">TARGET:</span>
                      <span>{crit.targetValue}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Add New Criterion Form */}
            <form onSubmit={handleAddCriterion} className="mt-5 pt-4 border-t border-slate-200">
              <h4 className="text-xs font-semibold text-slate-900 mb-2 flex items-center space-x-1">
                <Plus className="w-3.5 h-3.5 text-indigo-600" />
                <span>Add Custom Evaluation Criterion</span>
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-2 text-xs">
                <div className="md:col-span-5">
                  <input
                    type="text"
                    placeholder="e.g. AWS & Docker, Hibernate ORM"
                    value={newCritName}
                    onChange={(e) => setNewCritName(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md text-slate-800"
                  />
                </div>

                <div className="md:col-span-3">
                  <select
                    value={newCritCategory}
                    onChange={(e) => setNewCritCategory(e.target.value as any)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md text-slate-800"
                  >
                    <option value="must_have">Must Have</option>
                    <option value="good_to_have">Good to Have</option>
                    <option value="experience">Experience</option>
                    <option value="location">Location</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <select
                    value={newCritWeight}
                    onChange={(e) => setNewCritWeight(Number(e.target.value))}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md text-slate-800"
                  >
                    <option value={5}>Wt: 5 (Critical)</option>
                    <option value={4}>Wt: 4 (High)</option>
                    <option value={3}>Wt: 3 (Std)</option>
                    <option value={2}>Wt: 2 (Low)</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <button
                    type="submit"
                    className="w-full h-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded-md border border-slate-300 py-1.5 transition-colors"
                  >
                    + Add
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* AI Fairness & Explainability Notice */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-2">
            <div className="flex items-center space-x-2 text-slate-800 font-semibold">
              <AlertCircle className="w-4 h-4 text-indigo-600" />
              <span>Company A Fairness Protocol (DPDP & Bias Guardrails)</span>
            </div>
            <p>
              Scores are computed exclusively against the above scorecard criteria. All candidate demographic tokens (Name, Gender, Marital Status, Age, Photo) are omitted during scoring. The AI provides quoted evidence sentences for each criterion and <strong>never automatically rejects candidates</strong>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
