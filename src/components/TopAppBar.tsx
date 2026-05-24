import React, { useEffect, useState } from 'react';

interface TopAppBarProps {
  lockdownActive: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeTab: string;
}

export const TopAppBar: React.FC<TopAppBarProps> = ({
  lockdownActive,
  searchQuery,
  setSearchQuery,
  activeTab
}) => {
  const [time, setTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header 
      className={`bg-background border-b-2 flex justify-between items-center w-full px-margin-desktop h-16 z-50 transition-all duration-300 relative shrink-0 ${
        lockdownActive 
          ? 'border-error shadow-[0_0_20px_rgba(255,180,171,0.4)] bg-error/5' 
          : 'border-primary shadow-[0_0_15px_rgba(0,219,233,0.25)]'
      }`}
    >
      {/* Brand Logo & Interactive Terminal Prompt */}
      <div className="flex items-center gap-4">
        <h1 className={`font-sector-id text-headline-lg tracking-widest uppercase transition-colors duration-300 ${
          lockdownActive ? 'text-error' : 'text-primary'
        }`}>
          BUNKER_OS_v4.2
        </h1>
        <span className={`font-body-md text-body-md animate-pulse hidden sm:inline ${
          lockdownActive ? 'text-error' : 'text-primary'
        }`}>_</span>
      </div>

      {/* Center Alert Banner / System Clock */}
      <div className="flex items-center gap-6">
        <div className={`hidden lg:flex items-center gap-2 border px-4 py-1 font-label-caps text-label-caps animate-pulse ${
          lockdownActive 
            ? 'bg-error-container text-on-error-container border-error' 
            : 'bg-[#93000a] text-[#ffdad6] border-error'
        }`}>
          {lockdownActive ? 'SECTOR SEALED' : 'OUTBREAK ALERT'}
        </div>
        <div className={`font-data-lg text-headline-sm uppercase hidden md:block ${
          lockdownActive ? 'text-error animate-pulse' : 'text-error'
        }`}>
          THREAT: {lockdownActive ? 'LOCKDOWN' : 'CRITICAL'}
        </div>
        
        {/* System Time clock */}
        <div className={`font-body-md text-sm border px-3 py-1 border-outline-variant select-none hidden sm:block ${
          lockdownActive ? 'text-error' : 'text-primary-fixed-dim'
        }`}>
          {time}
        </div>

        {/* Search bar (active in Triage screen) */}
        {activeTab === 'triage' && (
          <div className={`flex items-center border bg-surface-container px-3 py-1 transition-all ${
            lockdownActive 
              ? 'border-error focus-within:shadow-[0_0_10px_rgba(255,180,171,0.3)]' 
              : 'border-outline-variant focus-within:border-primary focus-within:shadow-[0_0_10px_rgba(0,219,233,0.3)]'
          }`}>
            <span className={`mr-2 font-body-md ${lockdownActive ? 'text-error' : 'text-primary'}`}>&gt;</span>
            <input 
              className="bg-transparent border-none outline-none text-on-surface font-body-md placeholder:text-outline-variant focus:ring-0 w-36 sm:w-48 text-sm uppercase" 
              placeholder="QUERY_PATIENT..." 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <span className={`terminal-cursor ${lockdownActive ? 'text-error' : 'text-primary'}`}></span>
          </div>
        )}

        {/* Trailing Controls */}
        <div className="flex gap-3">
          <button className={`hover:bg-surface-container-highest transition-all duration-75 p-2 flex items-center justify-center border border-transparent hover:border-outline-variant relative ${
            lockdownActive ? 'text-error' : 'text-primary-fixed-dim'
          }`}>
            {lockdownActive && <span className="absolute top-1 right-1 w-2 h-2 bg-error rounded-full animate-pulse"></span>}
            <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>warning</span>
          </button>
          
          <button className={`hover:bg-surface-container-highest transition-all duration-75 p-2 flex items-center justify-center border border-transparent hover:border-outline-variant ${
            lockdownActive ? 'text-error' : 'text-primary-fixed-dim'
          }`}>
            <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>settings_remote</span>
          </button>
        </div>
      </div>
    </header>
  );
};
