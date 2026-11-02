import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/layout/Header';
import { Navbar } from './components/layout/Navbar';
import { ScorecardIntake } from './components/screens/ScorecardIntake';
import { BulkUpload } from './components/screens/BulkUpload';
import { RankedFeed } from './components/screens/RankedFeed';
import { ClientPortal } from './components/screens/ClientPortal';
import { PipelineKanban } from './components/screens/PipelineKanban';
import { DPDPCompliance } from './components/screens/DPDPCompliance';
import { DeliveryHeadCalibration } from './components/screens/DeliveryHeadCalibration';
import { CEORoiMetrics } from './components/screens/CEORoiMetrics';

// Modals
import { CVViewerModal } from './components/modals/CVViewerModal';
import { InterviewSlotModal } from './components/modals/InterviewSlotModal';
import { RejectReasonModal } from './components/modals/RejectReasonModal';
import { DPDPDeleteModal } from './components/modals/DPDPDeleteModal';
import { NewRequisitionModal } from './components/modals/NewRequisitionModal';
import { Candidate } from './types';

const MainAppContent: React.FC = () => {
  const { activeTab, setActiveTab } = useApp();

  // Modal states
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [slotCandidate, setSlotCandidate] = useState<Candidate | null>(null);
  const [rejectCandidate, setRejectCandidate] = useState<Candidate | null>(null);
  const [deleteCandId, setDeleteCandId] = useState<string | null>(null);
  const [isNewReqOpen, setIsNewReqOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
      <Header onNewReqClick={() => setIsNewReqOpen(true)} />
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'jd-scorecard' && <ScorecardIntake />}
        {activeTab === 'bulk-upload' && <BulkUpload />}
        {activeTab === 'ranked-feed' && (
          <RankedFeed onOpenCV={(cand) => setSelectedCandidate(cand)} />
        )}
        {activeTab === 'client-portal' && (
          <ClientPortal
            onOpenCV={(cand) => setSelectedCandidate(cand)}
            onProposeSlot={(cand) => setSlotCandidate(cand)}
            onReject={(cand) => setRejectCandidate(cand)}
          />
        )}
        {activeTab === 'pipeline' && (
          <PipelineKanban onOpenCV={(cand) => setSelectedCandidate(cand)} />
        )}
        {activeTab === 'dpdp-compliance' && (
          <DPDPCompliance onDeleteRequest={(id) => setDeleteCandId(id)} />
        )}
        {activeTab === 'delivery-head' && <DeliveryHeadCalibration />}
        {activeTab === 'roi-metrics' && <CEORoiMetrics />}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-slate-700">Company A, Noida</span>
            <span>•</span>
            <span>Contract &amp; Permanent Staffing (IT Services, BFSI Back-Office, Retail)</span>
          </div>
          <div className="flex items-center space-x-3 text-[11px] text-slate-400">
            <span>₹40–50 Cr Annual Scale</span>
            <span>•</span>
            <span>DPDP Act 2023 Compliant</span>
            <span>•</span>
            <span>48h Shortlist SLA Guarantee</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <CVViewerModal
        candidate={selectedCandidate}
        onClose={() => setSelectedCandidate(null)}
      />

      <InterviewSlotModal
        candidate={slotCandidate}
        onClose={() => setSlotCandidate(null)}
      />

      <RejectReasonModal
        candidate={rejectCandidate}
        onClose={() => setRejectCandidate(null)}
      />

      <DPDPDeleteModal
        candidateId={deleteCandId}
        onClose={() => setDeleteCandId(null)}
      />

      <NewRequisitionModal
        isOpen={isNewReqOpen}
        onClose={() => setIsNewReqOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
