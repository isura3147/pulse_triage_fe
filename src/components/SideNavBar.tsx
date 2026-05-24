import React from 'react';

interface SideNavBarProps {
  activeTab: 'dashboard' | 'triage' | 'nexus';
  setActiveTab: (tab: 'dashboard' | 'triage' | 'nexus') => void;
  lockdownActive: boolean;
  handleLockdown: () => void;
  handleSystemPurge: () => void;
}

export const SideNavBar: React.FC<SideNavBarProps> = ({
  activeTab,
  setActiveTab,
  lockdownActive,
  handleLockdown,
  handleSystemPurge
}) => {
  return (
    <nav className={`bg-surface-container-low w-64 border-r-2 flex flex-col pt-8 z-40 relative shrink-0 transition-colors duration-300 ${
      lockdownActive ? 'border-error bg-error/2' : 'border-primary'
    }`}>
      {/* Operator Biometrics & Fingerprint */}
      <div className="px-6 mb-8 text-center border-b border-outline-variant pb-6">
        <div className={`w-16 h-16 rounded-full mx-auto mb-4 border-2 flex items-center justify-center overflow-hidden transition-all duration-300 ${
          lockdownActive 
            ? 'border-error shadow-[0_0_15px_rgba(255,180,171,0.5)] bg-error/10' 
            : 'border-primary shadow-[0_0_15px_rgba(0,219,233,0.3)] bg-surface'
        }`}>
          <span className={`material-symbols-outlined text-4xl ${
            lockdownActive ? 'text-error' : 'text-primary'
          }`}>
            fingerprint
          </span>
        </div>
        <h2 className={`font-headline-lg text-headline-lg transition-colors ${
          lockdownActive ? 'text-error' : 'text-primary'
        }`}>
          SECTOR_B4
        </h2>
        <p className={`font-label-caps text-label-caps tracking-widest mt-1 ${
          lockdownActive ? 'text-error animate-pulse' : 'text-primary-fixed-dim'
        }`}>
          {lockdownActive ? 'STATUS: LOCKED' : 'OPERATOR_092'}
        </p>
      </div>

      {/* Navigation tabs */}
      <div className="flex-grow flex flex-col gap-2 px-4">
        {/* Tab: Main Dashboard */}
        <button 
          onClick={() => setActiveTab('dashboard')}
          className={`nav-tab flex items-center gap-3 px-4 py-3 border-l-4 font-label-caps text-label-caps text-left w-full transition-all clipped-corner-sm ${
            activeTab === 'dashboard'
              ? lockdownActive 
                ? 'bg-error-container text-on-error-container border-error scale-[0.98]' 
                : 'bg-primary-container text-on-primary-container border-primary scale-[0.98]'
              : 'text-on-surface-variant hover:text-primary hover:bg-surface-container-high border-transparent'
          }`}
        >
          <span className="material-symbols-outlined">dashboard</span>
          Main Dashboard
        </button>

        {/* Tab: Patient Triage Feed */}
        <button 
          onClick={() => setActiveTab('triage')}
          className={`nav-tab flex items-center gap-3 px-4 py-3 border-l-4 font-label-caps text-label-caps text-left w-full transition-all clipped-corner-sm ${
            activeTab === 'triage'
              ? lockdownActive 
                ? 'bg-error-container text-on-error-container border-error scale-[0.98]' 
                : 'bg-primary-container text-on-primary-container border-primary scale-[0.98]'
              : 'text-on-surface-variant hover:text-primary hover:bg-surface-container-high border-transparent'
          }`}
        >
          <span className="material-symbols-outlined">emergency</span>
          Triage Feed
        </button>

        {/* Tab: NEXUS Export */}
        <button 
          onClick={() => setActiveTab('nexus')}
          className={`nav-tab flex items-center gap-3 px-4 py-3 border-l-4 font-label-caps text-label-caps text-left w-full transition-all clipped-corner-sm ${
            activeTab === 'nexus'
              ? lockdownActive 
                ? 'bg-error-container text-on-error-container border-error scale-[0.98]' 
                : 'bg-primary-container text-on-primary-container border-primary scale-[0.98]'
              : 'text-on-surface-variant hover:text-primary hover:bg-surface-container-high border-transparent'
          }`}
        >
          <span className="material-symbols-outlined">account_tree</span>
          NEXUS Export
        </button>
      </div>

      {/* Operator Control Actions (CTAs) */}
      <div className="px-4 pb-6 mt-auto">
        <button 
          onClick={handleLockdown}
          className={`w-full font-label-caps text-label-caps py-3 mb-2 border-2 transition-all duration-300 uppercase tracking-widest relative overflow-hidden group clipped-corner-sm ${
            lockdownActive
              ? 'bg-transparent text-error border-error hover:bg-error hover:text-on-error'
              : 'bg-error text-on-error border-error hover:bg-transparent hover:text-error'
          }`}
        >
          <span className="relative z-10 font-bold">
            {lockdownActive ? 'CANCEL_LOCKDOWN' : 'INITIATE_LOCKDOWN'}
          </span>
        </button>

        <button 
          onClick={handleSystemPurge}
          className="w-full bg-surface border-2 border-outline-variant text-on-surface-variant hover:border-error hover:text-error font-label-caps text-label-caps py-2.5 mb-6 transition-colors clipped-corner-sm"
        >
          SYSTEM_PURGE
        </button>

        <div className="flex flex-col gap-1 border-t border-outline-variant pt-4">
          <div className="flex items-center gap-3 px-4 py-2 text-on-surface-variant hover:text-primary font-label-caps text-xs select-none">
            <span className="material-symbols-outlined text-[16px]">radio</span>
            Band Frequency: B4-92
          </div>
          <div className="flex items-center gap-3 px-4 py-2 text-on-surface-variant hover:text-primary font-label-caps text-xs select-none">
            <span className="material-symbols-outlined text-[16px]">shield</span>
            Bunker Sub-level 3
          </div>
        </div>
      </div>
    </nav>
  );
};
export default SideNavBar;
