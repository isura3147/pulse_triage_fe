import React, { useRef, useEffect } from 'react';
import type { SystemLog } from '../types';

interface NexusExportViewProps {
  logs: SystemLog[];
  nexusConsole: string[];
  isCompiling: boolean;
  handleGenerateReport: () => void;
  lockdownActive: boolean;
  criticalCount: number;
  stableCount: number;
}

export const NexusExportView: React.FC<NexusExportViewProps> = ({
  logs,
  nexusConsole,
  isCompiling,
  handleGenerateReport,
  lockdownActive,
  criticalCount,
  stableCount
}) => {
  const consoleEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll console to bottom when new logs arrive
  useEffect(() => {
    consoleEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [nexusConsole]);

  const handleDownload = (reportId: string, type: string) => {
    const header = `=== PULSE SECTOR B4 NEXUS EXPORT ===\nREPORT_ID: ${reportId}\nGENERATED: ${new Date().toISOString()}\nTYPE: ${type}\nLOCKDOWN_STATE: ${lockdownActive ? 'ACTIVE' : 'INACTIVE'}\nBIOMETRIC SUMMARY: CRITICAL=${criticalCount}, STABLE=${stableCount}\n===================================`;
    const blob = new Blob([header + '\n\n> EXPORT STATUS SECURED. PACKET COMPREHENSIVE.'], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${reportId}.log`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Dynamic workforce capacity: e.g. 100 raw capacity, percentage is calculated
  const capacityPercent = Math.min(100, Math.round((stableCount / 8) * 100)) || 60;
  const segmentedBlocks = Array.from({ length: 10 }, (_, idx) => idx < Math.round(capacityPercent / 10));

  return (
    <div className="h-full flex flex-col gap-6 select-none overflow-hidden">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end border-b-2 border-outline-variant pb-4 gap-4 shrink-0">
        <div>
          <h1 className="font-sector-id text-headline-lg text-on-surface uppercase mb-1">NEXUS Export</h1>
          <p className="font-body-md text-xs text-on-surface-variant uppercase tracking-wider flex items-center gap-2">
            <span className="material-symbols-outlined text-sm text-primary">data_usage</span>
            Governance Reporting & Metric Summary
          </p>
        </div>
        
        <button 
          onClick={handleGenerateReport}
          disabled={isCompiling}
          className={`bg-primary text-on-primary border-2 border-primary font-label-caps text-label-caps px-6 py-3 transition-all duration-150 uppercase tracking-widest flex items-center gap-2 glow-effect group clipped-corner-sm ${
            isCompiling ? 'opacity-50 cursor-not-allowed' : 'hover:bg-transparent hover:text-primary'
          }`}
        >
          <span className={`material-symbols-outlined ${isCompiling ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`}>
            sync
          </span>
          <span>{isCompiling ? 'Compiling...' : 'Generate Report'}</span>
        </button>
      </div>

      {/* Bento Grid for Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 shrink-0">
        {/* Card 1: Available Workforce */}
        <div className="bg-surface-container p-6 border border-outline-variant relative overflow-hidden group hover:border-primary transition-colors duration-300 flex flex-col justify-between min-h-[180px] clipped-corner">
          <div className="absolute top-2 right-2 opacity-25 group-hover:opacity-100 transition-opacity">
            <span className="material-symbols-outlined text-4xl text-primary">groups</span>
          </div>
          <div>
            <div className="font-label-caps text-[10px] text-outline uppercase tracking-widest mb-1 flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-primary"></div>
              AVAILABLE WORKFORCE CAPACITY
            </div>
            <div className="font-data-lg text-4xl text-on-surface mt-3 font-bold">
              {capacityPercent}%
            </div>
            <div className="font-label-caps text-[10px] text-outline-variant uppercase mt-1 tracking-wider">
              RAW ACTIVE CHANNELS: 8
            </div>
          </div>
          <div className="mt-4">
            {/* Segmented Progress Bar */}
            <div className="flex gap-1 h-3 mt-2 w-full">
              {segmentedBlocks.map((filled, idx) => (
                <div 
                  key={idx} 
                  className={`flex-1 border transition-colors ${
                    filled 
                      ? 'bg-primary border-primary/50' 
                      : 'bg-transparent border-outline-variant'
                  }`}
                />
              ))}
            </div>
            <div className="flex justify-between mt-1.5">
              <span className="font-body-md text-[10px] text-outline-variant">CAPACITY BAND</span>
              <span className="font-body-md text-[10px] text-primary font-bold">{capacityPercent}%</span>
            </div>
          </div>
        </div>

        {/* Card 2: Quarantined Patients */}
        <div className={`bg-surface-container p-6 border relative overflow-hidden group transition-all duration-300 flex flex-col justify-between min-h-[180px] clipped-corner ${
          lockdownActive || criticalCount > 0 
            ? 'border-error glow-alert bg-error/2' 
            : 'border-outline-variant hover:border-primary'
        }`}>
          <div className="absolute top-2 right-2 opacity-25">
            <span className="material-symbols-outlined text-4xl text-error">coronavirus</span>
          </div>
          <div>
            <div className="font-label-caps text-[10px] text-error uppercase tracking-widest mb-1 flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-error animate-pulse"></div>
              CRITICAL INCAPACITATED
            </div>
            <div className="font-data-lg text-5xl text-error mt-3 font-bold animate-pulse">
              {criticalCount}
            </div>
          </div>
          <div className="mt-4 flex items-end justify-between">
            <div className="font-body-md text-[10px] text-on-error-container bg-error-container/20 px-2 py-0.5 border border-error/50 inline-block font-bold">
              {criticalCount > 0 ? '+ INCIDENCE RATIO' : 'NOMINAL RATIO'}
            </div>
            <span className={`material-symbols-outlined text-error ${criticalCount > 0 ? 'animate-bounce' : ''}`}>
              {criticalCount > 0 ? 'trending_up' : 'trending_flat'}
            </span>
          </div>
        </div>

        {/* Card 3: Status Flags */}
        <div className="bg-surface-container p-6 border border-secondary relative overflow-hidden group hover:border-secondary-fixed transition-colors duration-300 flex flex-col justify-between min-h-[180px] clipped-corner">
          <div className="absolute top-2 right-2 opacity-25">
            <span className="material-symbols-outlined text-4xl text-secondary">security</span>
          </div>
          <div>
            <div className="font-label-caps text-[10px] text-secondary uppercase tracking-widest mb-1 flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-secondary"></div>
              SYSTEM STATUS FLAGS
            </div>
            <div className="flex flex-col gap-2 mt-4">
              <div className="flex items-center justify-between border-b border-secondary/20 pb-1">
                <span className="font-label-caps text-[10px] text-outline">LOCKDOWN_REQ</span>
                <span className={`font-body-md text-xs font-bold ${lockdownActive ? 'text-error' : 'text-secondary'}`}>
                  {lockdownActive ? 'TRUE' : 'FALSE'}
                </span>
              </div>
              <div className="flex items-center justify-between border-b border-secondary/20 pb-1">
                <span className="font-label-caps text-[10px] text-outline">THREAT_LVL</span>
                <span className={`font-body-md text-xs font-bold ${lockdownActive ? 'text-error animate-pulse' : 'text-primary'}`}>
                  {lockdownActive ? 'CRITICAL' : 'SAFE'}
                </span>
              </div>
            </div>
          </div>
          <div className="mt-4 flex flex-col gap-0.5 text-[9px] font-label-caps text-secondary-fixed-dim">
            <div>GLOBAL LOCKDOWN: {lockdownActive ? 'ACTIVE' : 'OFF'}</div>
            <div>BUNKER ENVIRONMENT: STABLE</div>
          </div>
        </div>
      </div>

      {/* Main Flex-1 Logs & Compiler Panel */}
      <div className="flex-grow flex flex-col lg:flex-row gap-6 min-h-0">
        
        {/* Terminal Compiler Console */}
        <div className="flex-1 bg-surface-container border border-outline-variant flex flex-col overflow-hidden clipped-corner">
          <div className="p-3 border-b border-outline-variant bg-surface-container-high flex justify-between items-center shrink-0">
            <h2 className="font-headline-sm text-sm text-on-surface uppercase flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-base">terminal</span>
              NEXUS Compiler Output
            </h2>
            <div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse"></div>
          </div>
          
          <div className="flex-1 p-4 font-body-md text-xs text-on-surface-variant overflow-y-auto bg-surface-container-lowest select-text space-y-1.5">
            {nexusConsole.map((logLine, idx) => {
              let color = 'text-primary';
              if (logLine.includes('WARNING')) color = 'text-secondary';
              if (logLine.includes('CRITICAL') || logLine.includes('EMERGENCY')) color = 'text-error';
              return (
                <p key={idx} className={`${color} font-mono tracking-wider`}>
                  {logLine}
                </p>
              );
            })}
            {isCompiling && (
              <p className="text-primary font-mono tracking-wider animate-pulse">
                &gt; SCRAPING SYSTEM DATA BUFFER...
              </p>
            )}
            <div ref={consoleEndRef} className="terminal-cursor text-primary"></div>
          </div>
        </div>

        {/* Recent Export Logs Table */}
        <div className="flex-1 bg-surface border border-outline-variant flex flex-col overflow-hidden clipped-corner">
          <div className="p-3 border-b border-outline-variant bg-surface-container-high flex justify-between items-center shrink-0">
            <h2 className="font-headline-sm text-sm text-on-surface uppercase flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-base">list_alt</span>
              Recent Export Logs
            </h2>
            <span className="font-label-caps text-[9px] text-outline px-1.5 py-0.5 border border-outline-variant/50">
              FILTER_SECURE
            </span>
          </div>
          
          <div className="flex-grow overflow-y-auto">
            <table className="w-full text-left font-body-md text-xs">
              <thead className="font-label-caps text-label-caps text-outline bg-surface-container-highest uppercase border-b border-outline-variant sticky top-0 z-10">
                <tr>
                  <th className="p-3 font-normal tracking-wider">Timestamp</th>
                  <th className="p-3 font-normal tracking-wider">Report ID</th>
                  <th className="p-3 font-normal tracking-wider">Type</th>
                  <th className="p-3 font-normal tracking-wider">Status</th>
                  <th className="p-3 font-normal tracking-wider text-right">Action</th>
                </tr>
              </thead>
              <tbody className="text-on-surface-variant">
                {logs.map((log, idx) => (
                  <tr 
                    key={log.reportId} 
                    className={`border-b border-surface-container-highest hover:bg-surface-container-high transition-colors ${
                      idx % 2 === 1 ? 'bg-surface-container-low' : 'bg-transparent'
                    }`}
                  >
                    <td className="p-3 font-body-md text-primary font-mono">{log.timestamp}</td>
                    <td className="p-3 font-mono">{log.reportId}</td>
                    <td className="p-3 font-mono">{log.type}</td>
                    <td className="p-3">
                      <span className={`inline-flex items-center gap-1 text-[10px] border px-2 py-0.5 bg-opacity-10 ${
                        log.status === 'COMPLETE'
                          ? 'text-primary border-primary/30 bg-primary'
                          : log.status === 'ARCHIVED'
                            ? 'text-secondary border-secondary/30 bg-secondary'
                            : 'text-error border-error/30 bg-error'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          log.status === 'COMPLETE' 
                            ? 'bg-primary' 
                            : log.status === 'ARCHIVED' 
                              ? 'bg-secondary' 
                              : 'bg-error animate-pulse'
                        }`} /> 
                        {log.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      {log.status === 'FAILED' ? (
                        <button 
                          onClick={handleGenerateReport}
                          className="text-outline hover:text-error transition-colors"
                          title="Retry Compile"
                        >
                          <span className="material-symbols-outlined text-[18px]">refresh</span>
                        </button>
                      ) : (
                        <button 
                          onClick={() => handleDownload(log.reportId, log.type)}
                          className="text-outline hover:text-primary transition-colors"
                          title="Download Log"
                        >
                          <span className="material-symbols-outlined text-[18px]">download</span>
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};
export default NexusExportView;
