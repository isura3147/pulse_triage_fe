import React from 'react';
import { useTerminalState } from './hooks/useTerminalState';
import { TopAppBar } from './components/TopAppBar';
import { SideNavBar } from './components/SideNavBar';
import { DashboardView } from './components/DashboardView';
import { TriageFeedView } from './components/TriageFeedView';
import { NexusExportView } from './components/NexusExportView';

const App: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    filteredPatients,
    logs,
    telemetry,
    nutrition,
    searchQuery,
    setSearchQuery,
    lockdownActive,
    handleLockdown,
    handleSystemPurge,
    nexusConsole,
    isCompiling,
    handleGenerateReport,
    criticalCount,
    warningCount,
    stableCount,
    setPatients,
    survivors,
    skillFilter,
    handleFilterSurvivors
  } = useTerminalState();

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden relative">
      {/* Top Header Bar */}
      <TopAppBar 
        lockdownActive={lockdownActive}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        activeTab={activeTab}
      />

      {/* Main Body */}
      <div className="flex-1 flex overflow-hidden min-h-0 relative">
        {/* Left Side Navigation Panel */}
        <SideNavBar 
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          lockdownActive={lockdownActive}
          handleLockdown={handleLockdown}
          handleSystemPurge={handleSystemPurge}
        />

        {/* Center Main View Canvas */}
        <main className="flex-1 p-gutter md:p-margin-desktop overflow-y-auto bg-surface-dim relative z-10 min-h-0">
          {activeTab === 'dashboard' && (
            <DashboardView 
              telemetry={telemetry}
              nutrition={nutrition}
              criticalCount={criticalCount}
              warningCount={warningCount}
              stableCount={stableCount}
              lockdownActive={lockdownActive}
            />
          )}

          {activeTab === 'triage' && (
            <TriageFeedView 
              filteredPatients={filteredPatients}
              criticalCount={criticalCount}
              warningCount={warningCount}
              stableCount={stableCount}
              lockdownActive={lockdownActive}
              setPatients={setPatients}
            />
          )}

          {activeTab === 'nexus' && (
            <NexusExportView 
              logs={logs}
              nexusConsole={nexusConsole}
              isCompiling={isCompiling}
              handleGenerateReport={handleGenerateReport}
              lockdownActive={lockdownActive}
              criticalCount={criticalCount}
              stableCount={stableCount}
              survivors={survivors}
              skillFilter={skillFilter}
              onFilterSurvivors={handleFilterSurvivors}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default App;
