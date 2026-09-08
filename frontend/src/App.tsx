import React, { useState } from 'react';
import { UserRole } from './types';
import { Header } from './components/Header';
import { Sidebar, NavTab } from './components/Sidebar';
import { DemoWalkthroughModal } from './components/DemoWalkthroughModal';
import { ReportModal } from './components/ReportModal';
import { RotatingHalfRangoliRight } from './components/common/RotatingHalfRangoliRight';

// Pages
import { OverviewPage } from './pages/OverviewPage';
import { ResearchCopilotPage } from './pages/ResearchCopilotPage';
import { GisExplorerPage } from './pages/GisExplorerPage';
import { LulcChangePage } from './pages/LulcChangePage';
import { PredictionsPage } from './pages/PredictionsPage';
import { ScenariosPage } from './pages/ScenariosPage';
import { EvidenceChainPage } from './pages/EvidenceChainPage';
import { DatasetsPage } from './pages/DatasetsPage';
import { ModelsPage } from './pages/ModelsPage';
import { SettingsPage } from './pages/SettingsPage';

export function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('overview');
  const [userRole, setUserRole] = useState<UserRole>('Policymaker');
  const [selectedCellId, setSelectedCellId] = useState<string>('TP-0002');
  const [askMapInitialQuery, setAskMapInitialQuery] = useState<string>('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Modals
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  const handleRunAskMap = (query: string) => {
    setAskMapInitialQuery(query);
    setActiveTab('gis');
  };

  const handleSelectCell = (cellId: string) => {
    setSelectedCellId(cellId);
  };

  return (
    <div className="min-h-screen bg-[#FAF9F5] flex flex-col font-sans antialiased text-[#1F2421] relative overflow-x-hidden">
      {/* Website-Wide Subtle South Indian Heritage Background (Original Landscape, Low Opacity) */}
      <div className="tn-site-heritage-bg" aria-hidden="true">
        <div className="tn-site-heritage-bg-layer" />
        <div className="tn-site-heritage-bg-overlay" />
      </div>

      {/* Top Header */}
      <div className="relative z-30">
        <Header
          currentRole={userRole}
          onRoleChange={setUserRole}
          onStartDemo={() => setIsDemoModalOpen(true)}
          onOpenReport={() => setIsReportModalOpen(true)}
          onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
        />
      </div>

      {/* Main Content Layout */}
      <div className="flex-1 flex overflow-hidden relative z-20">
        {/* Left Navigation Sidebar (Opens when settings/menu icon is touched) */}
        <Sidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        {/* Dynamic Main Workspace (Expands to full width when sidebar is closed) */}
        <main className="flex-1 overflow-y-auto relative z-10 w-full">
          {activeTab === 'overview' && (
            <OverviewPage
              onNavigateTab={setActiveTab}
              onRunAskMap={handleRunAskMap}
            />
          )}

          {activeTab === 'research' && (
            <ResearchCopilotPage onNavigateTab={setActiveTab} />
          )}

          {activeTab === 'gis' && (
            <GisExplorerPage
              initialQuery={askMapInitialQuery}
              onNavigateTab={setActiveTab}
              onSelectCell={handleSelectCell}
            />
          )}

          {activeTab === 'land_change' && (
            <LulcChangePage onNavigateTab={setActiveTab} />
          )}

          {activeTab === 'predictions' && (
            <PredictionsPage
              selectedCellId={selectedCellId}
              onNavigateTab={setActiveTab}
              onSelectCell={handleSelectCell}
            />
          )}

          {activeTab === 'scenarios' && (
            <ScenariosPage
              onNavigateTab={setActiveTab}
              onOpenReport={() => setIsReportModalOpen(true)}
            />
          )}

          {activeTab === 'evidence' && (
            <EvidenceChainPage
              selectedCellId={selectedCellId}
              onNavigateTab={setActiveTab}
            />
          )}

          {activeTab === 'datasets' && <DatasetsPage />}

          {activeTab === 'models' && <ModelsPage />}

          {activeTab === 'settings' && (
            <SettingsPage
              currentRole={userRole}
              onRoleChange={setUserRole}
            />
          )}
        </main>
      </div>

      {/* 15-Step Interactive Guided Demo Walkthrough Modal */}
      <DemoWalkthroughModal
        isOpen={isDemoModalOpen}
        onClose={() => setIsDemoModalOpen(false)}
        onNavigateTab={(tab) => {
          setActiveTab(tab);
        }}
        onSelectCell={handleSelectCell}
      />

      {/* Executive Evidence Brief Generator Modal */}
      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        userRole={userRole}
      />

      {/* Single Slow-Spinning Half Rangoli Design covering the Right Half */}
      <RotatingHalfRangoliRight />
    </div>
  );
}

export default App;
