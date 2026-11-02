import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import {
  UploadCloud,
  FileCheck,
  AlertTriangle,
  Layers,
  Sparkles,
  ArrowRight,
  FileText,
  Clock,
  ShieldAlert,
} from 'lucide-react';
import {
  extractTextFromFile,
  extractProfileFromText,
  checkDuplicate,
  generateSyntheticBatch,
} from '../../utils/cvParser';
import { Candidate } from '../../types';

export const BulkUpload: React.FC = () => {
  const { activeRequisition, candidates, addCandidates, setActiveTab } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressPercent, setProgressPercent] = useState(0);
  const [currentFileLabel, setCurrentFileLabel] = useState('');
  const [parsedQueue, setParsedQueue] = useState<{
    candidate: Candidate;
    isDuplicate: boolean;
    duplicateReason?: string;
  }[]>([]);
  const [stats, setStats] = useState({ total: 0, parsed: 0, duplicates: 0 });

  if (!activeRequisition) return null;

  const handleFiles = async (files: FileList | File[]) => {
    if (!files || files.length === 0) return;

    setIsProcessing(true);
    setProgressPercent(5);
    const fileArray = Array.from(files);
    setStats({ total: fileArray.length, parsed: 0, duplicates: 0 });

    const queue: { candidate: Candidate; isDuplicate: boolean; duplicateReason?: string }[] = [];
    let parsedCount = 0;
    let dupCount = 0;

    for (let i = 0; i < fileArray.length; i++) {
      const file = fileArray[i];
      setCurrentFileLabel(`Parsing ${file.name} (${i + 1}/${fileArray.length})...`);
      
      try {
        const text = await extractTextFromFile(file);
        const profile = extractProfileFromText(text, file.name, activeRequisition.id);

        const dupCheck = checkDuplicate(profile, [...candidates, ...queue.map(q => q.candidate)]);
        if (dupCheck.isDuplicate) {
          dupCount++;
          queue.push({
            candidate: profile,
            isDuplicate: true,
            duplicateReason: dupCheck.reason,
          });
        } else {
          parsedCount++;
          queue.push({
            candidate: profile,
            isDuplicate: false,
          });
        }
      } catch (err) {
        console.error('Error parsing file:', file.name, err);
      }

      setProgressPercent(Math.round(((i + 1) / fileArray.length) * 100));
      // subtle delay for visual feedback
      await new Promise(r => setTimeout(r, 60));
    }

    setParsedQueue(queue);
    setStats({ total: fileArray.length, parsed: parsedCount, duplicates: dupCount });
    setIsProcessing(false);
    setCurrentFileLabel('Parsing Complete');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleSimulateBatch = (count: number) => {
    setIsProcessing(true);
    setProgressPercent(15);
    setCurrentFileLabel(`Generating & parsing synthetic batch of ${count} varied CVs...`);

    setTimeout(() => {
      setProgressPercent(60);
      const batch = generateSyntheticBatch(count, activeRequisition.id);

      // Check for duplicates
      let dupCount = 0;
      const queue = batch.map((cand, idx) => {
        // Intentionally create 1 duplicate if count > 10 for realistic demo
        if (idx === 3 && candidates.length > 0) {
          const dupOf = candidates[0];
          cand.email = dupOf.email;
          cand.phone = dupOf.phone;
          cand.name = dupOf.name;
          dupCount++;
          return {
            candidate: cand,
            isDuplicate: true,
            duplicateReason: `Duplicate profile detected: Phone & Email match candidate ${dupOf.id} (${dupOf.name})`,
          };
        }

        const dupCheck = checkDuplicate(cand, candidates);
        if (dupCheck.isDuplicate) {
          dupCount++;
          return {
            candidate: cand,
            isDuplicate: true,
            duplicateReason: dupCheck.reason,
          };
        }
        return {
          candidate: cand,
          isDuplicate: false,
        };
      });

      setProgressPercent(100);
      setParsedQueue(queue);
      setStats({ total: count, parsed: count - dupCount, duplicates: dupCount });
      setIsProcessing(false);
      setCurrentFileLabel(`Parsed ${count} CVs with full duplicate detection`);
    }, 450);
  };

  const handleImportVerified = () => {
    // Only import non-duplicates (or user approved)
    const valid = parsedQueue.filter(q => !q.isDuplicate).map(q => q.candidate);
    if (valid.length > 0) {
      addCandidates(valid, true);
      setParsedQueue([]);
      setActiveTab('ranked-feed');
    }
  };

  return (
    <div className="space-y-6">
      {/* Screen Header */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-indigo-600 uppercase tracking-wider">
            <span>High-Volume Ingestion</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 mt-1">
            Bulk CV Upload & Intelligent Parser (Up to 500 CVs)
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Parses PDF and DOCX CVs, normalizes contact points, and catches duplicates against Company A’s 70-recruiter database.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleSimulateBatch(10)}
            disabled={isProcessing}
            className="flex items-center space-x-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold px-3 py-2 rounded-lg transition-colors border border-slate-200 disabled:opacity-50"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>Simulate 10 CVs</span>
          </button>

          <button
            onClick={() => handleSimulateBatch(50)}
            disabled={isProcessing}
            className="flex items-center space-x-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold px-3 py-2 rounded-lg transition-colors border border-slate-200 disabled:opacity-50"
          >
            <Layers className="w-3.5 h-3.5 text-indigo-600" />
            <span>Bulk Batch (50 CVs)</span>
          </button>
        </div>
      </div>

      {/* Dropzone Area */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`bg-white border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
          isDragging
            ? 'border-indigo-500 bg-indigo-50/50 scale-[1.005]'
            : 'border-slate-300 hover:border-slate-400 hover:bg-slate-50/50'
        }`}
      >
        <input
          type="file"
          ref={fileInputRef}
          multiple
          accept=".pdf,.docx,.txt,.doc"
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
          className="hidden"
        />

        <div className="max-w-md mx-auto space-y-3">
          <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
            <UploadCloud className="w-6 h-6" />
          </div>

          <div>
            <p className="text-sm font-semibold text-slate-800">
              Drag and drop candidate CVs here, or <span className="text-indigo-600 underline">browse files</span>
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Supports <strong>PDF, DOCX, and TXT</strong> (Up to 500 files per upload batch)
            </p>
          </div>

          <div className="flex items-center justify-center space-x-4 text-[11px] text-slate-500 pt-2 border-t border-slate-100">
            <span className="flex items-center gap-1">
              <FileCheck className="w-3.5 h-3.5 text-emerald-600" /> Mammoth DOCX Parser
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5 text-indigo-600" /> Duplicate Check Hash
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-amber-600" /> 3 min/CV down to 2 sec
            </span>
          </div>
        </div>
      </div>

      {/* Progress & Processing Bar */}
      {isProcessing && (
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-2 animate-fade-in">
          <div className="flex justify-between text-xs font-semibold text-slate-800">
            <span>{currentFileLabel}</span>
            <span>{progressPercent}%</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-indigo-600 h-2.5 rounded-full transition-all duration-200"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      )}

      {/* Parsed Results Queue */}
      {parsedQueue.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Batch Parsing Results ({parsedQueue.length} Profiles Processed)
              </h2>
              <div className="flex items-center space-x-3 text-xs text-slate-600 mt-0.5">
                <span className="text-emerald-700 font-semibold">
                  ✓ {stats.parsed} Ready to Score
                </span>
                <span>•</span>
                <span className="text-amber-700 font-semibold">
                  ⚠ {stats.duplicates} Duplicate Warnings
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setParsedQueue([])}
                className="text-xs text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-lg border border-slate-200 bg-white"
              >
                Clear Queue
              </button>
              <button
                onClick={handleImportVerified}
                className="flex items-center space-x-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-4 py-1.5 rounded-lg transition-colors shadow-sm"
              >
                <span>Import {stats.parsed} Profiles & Run AI</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="divide-y divide-slate-100 max-h-96 overflow-y-auto">
            {parsedQueue.map(({ candidate, isDuplicate, duplicateReason }, index) => (
              <div
                key={index}
                className={`p-3.5 flex items-center justify-between transition-colors ${
                  isDuplicate ? 'bg-amber-50/50' : 'hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                      isDuplicate
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-indigo-50 text-indigo-700'
                    }`}
                  >
                    {isDuplicate ? (
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                    ) : (
                      <FileText className="w-4 h-4 text-indigo-600" />
                    )}
                  </div>

                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-semibold text-slate-900">
                        {candidate.name}
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">
                        ({candidate.id})
                      </span>
                      {isDuplicate && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-200">
                          DUPLICATE DETECTED
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5 flex items-center space-x-2">
                      <span>{candidate.currentRole}</span>
                      <span>•</span>
                      <span>{candidate.experienceYears} yrs</span>
                      <span>•</span>
                      <span>{candidate.noticeDays} days notice</span>
                      <span>•</span>
                      <span>{candidate.location}</span>
                    </div>
                    {isDuplicate && duplicateReason && (
                      <div className="text-[11px] text-amber-800 font-medium mt-1">
                        ↳ {duplicateReason}
                      </div>
                    )}
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-medium text-slate-500">
                    {candidate.keySkills.slice(0, 3).join(', ')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
