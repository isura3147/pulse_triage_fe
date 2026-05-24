import React from 'react';
import type { EnvironmentalTelemetry, NutritionSupply } from '../types';

interface DashboardViewProps {
  telemetry: EnvironmentalTelemetry;
  nutrition: NutritionSupply;
  criticalCount: number;
  warningCount: number;
  stableCount: number;
  lockdownActive: boolean;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  telemetry,
  nutrition,
  criticalCount,
  warningCount,
  stableCount,
  lockdownActive
}) => {
  // Helper to generate SVG path for history array
  const generatePath = (history: number[], minVal: number, maxVal: number): string => {
    if (history.length < 2) return '';
    const width = 100;
    const height = 100;
    
    return history.map((val, idx) => {
      const x = (idx / (history.length - 1)) * width;
      // Scale y between 10% and 90% height
      const yRange = maxVal - minVal || 1;
      const scaledY = height - 15 - ((val - minVal) / yRange) * 70;
      return `${idx === 0 ? 'M' : 'L'}${x.toFixed(1)},${scaledY.toFixed(1)}`;
    }).join(' ');
  };

  // Compute min/max for O2 and CO2 to fit graphs
  const minO2 = Math.min(...telemetry.oxygenHistory) - 0.1;
  const maxO2 = Math.max(...telemetry.oxygenHistory) + 0.1;
  const o2Path = generatePath(telemetry.oxygenHistory, minO2, maxO2);

  const minCO2 = Math.min(...telemetry.co2History) - 5;
  const maxCO2 = Math.max(...telemetry.co2History) + 5;
  const co2Path = generatePath(telemetry.co2History, minCO2, maxCO2);

  return (
    <div className="h-full flex flex-col gap-6 select-none">
      {/* Toxicity & Alert Banners */}
      <div className={`border-l-4 px-4 py-3 flex items-center justify-between transition-colors duration-300 ${
        lockdownActive || telemetry.toxicityAlert
          ? 'bg-error/10 border-error' 
          : 'bg-surface-container-low border-primary'
      }`}>
        <div className="flex items-center gap-2">
          <span className={`material-symbols-outlined text-sm ${
            lockdownActive || telemetry.toxicityAlert ? 'text-error animate-pulse' : 'text-primary'
          }`}>
            {lockdownActive || telemetry.toxicityAlert ? 'warning' : 'check_circle'}
          </span>
          <span className={`font-label-caps text-label-caps font-bold ${
            lockdownActive || telemetry.toxicityAlert ? 'text-error animate-pulse' : 'text-primary'
          }`}>
            {lockdownActive || telemetry.toxicityAlert 
              ? 'TOXICITY_ALERT: TOXIC BREEDING DETECTED' 
              : 'TOXICITY_ALERT: NEGATIVE // AIR NOMINAL'}
          </span>
        </div>
        <span className="text-[10px] text-on-surface-variant font-body-md tracking-wider">
          SCANNER_NOMINAL // SUB-LEVEL_CHECK_OK
        </span>
      </div>

      {/* Global Threat Level Hero Card */}
      <div className={`border p-8 text-center transition-all duration-300 ${
        lockdownActive
          ? 'bg-error/5 border-error glow-alert'
          : 'bg-surface border-error/50 glow-alert'
      }`}>
        <h2 className="font-headline-sm text-headline-lg text-error mb-2 tracking-widest uppercase font-bold">
          Global Threat Level
        </h2>
        <div className="font-sector-id text-[72px] leading-none text-error animate-pulse font-bold">
          {lockdownActive ? 'LOCKDOWN' : 'CRITICAL'}
        </div>
      </div>

      {/* Grid of Telemetry & Biometrics */}
      <div className="grid gap-6 flex-1 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        
        {/* O2 Saturation Card */}
        <div className="bg-surface border border-primary p-6 glow-effect flex flex-col clipped-corner">
          <h3 className="font-label-caps text-label-caps text-primary-fixed-dim mb-4 border-b border-outline-variant pb-2">
            O2 SATURATION
          </h3>
          <div className="font-data-lg text-[42px] text-primary mb-4 font-bold">
            {telemetry.oxygenLevel.toFixed(2)}%
          </div>
          <div className="flex-1 bg-surface-container-lowest border border-outline-variant relative overflow-hidden flex items-end p-2 min-h-[100px]">
            <svg className="w-full h-full text-primary" preserveAspectRatio="none" viewBox="0 0 100 100">
              <path 
                d={o2Path} 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                vectorEffect="non-scaling-stroke"
                className="transition-all duration-300"
              />
            </svg>
          </div>
        </div>

        {/* CO2 Levels Card */}
        <div className="bg-surface border border-secondary p-6 glow-effect-secondary flex flex-col clipped-corner">
          <h3 className="font-label-caps text-label-caps text-secondary-fixed-dim mb-4 border-b border-outline-variant pb-2">
            CO2 LEVELS
          </h3>
          <div className="font-data-lg text-[42px] text-secondary mb-4 font-bold">
            {telemetry.co2Level} ppm
          </div>
          <div className="flex-1 bg-surface-container-lowest border border-outline-variant relative overflow-hidden flex items-end p-2 min-h-[100px]">
            <svg className="w-full h-full text-secondary" preserveAspectRatio="none" viewBox="0 0 100 100">
              <path 
                d={co2Path} 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                vectorEffect="non-scaling-stroke"
                className="transition-all duration-300"
              />
            </svg>
          </div>
        </div>

        {/* Bunker Biometrics Card */}
        <div className="bg-surface border border-outline p-6 flex flex-col clipped-corner">
          <h3 className="font-label-caps text-label-caps text-on-surface-variant mb-4 border-b border-outline-variant pb-2">
            BUNKER BIOMETRICS
          </h3>
          <div className="flex-1 flex flex-col justify-around">
            <div className="flex justify-between items-center py-1">
              <span className="font-label-caps text-error font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-error animate-pulse"></span>
                RED (CRITICAL)
              </span>
              <span className="font-sector-id text-data-lg text-error font-bold">{criticalCount}</span>
            </div>
            <div className="flex justify-between items-center py-1 border-t border-outline-variant/30">
              <span className="font-label-caps text-secondary font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-secondary"></span>
                YELLOW (WARNING)
              </span>
              <span className="font-sector-id text-data-lg text-secondary font-bold">{warningCount}</span>
            </div>
            <div className="flex justify-between items-center py-1 border-t border-outline-variant/30">
              <span className="font-label-caps text-primary font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-primary"></span>
                GREEN (STABLE)
              </span>
              <span className="font-sector-id text-data-lg text-primary font-bold">{stableCount}</span>
            </div>
          </div>
        </div>

        {/* Supply Reserves Card */}
        <div className="bg-surface border border-outline p-6 flex flex-col clipped-corner">
          <h3 className="font-label-caps text-label-caps text-on-surface-variant mb-4 border-b border-outline-variant pb-2">
            HARVEST SUPPLY
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-end">
              <span className="text-on-surface-variant font-label-caps text-xs">AVG CALORIES</span>
              <span className="font-data-lg text-primary text-lg font-bold">{nutrition.averageCaloricIntake} kcal</span>
            </div>
            <div className="flex justify-between items-end border-t border-outline-variant/20 pt-2">
              <span className="text-on-surface-variant font-label-caps text-xs">WATER RATION</span>
              <span className="font-data-lg text-primary text-lg font-bold">{nutrition.waterRation.toFixed(1)} L</span>
            </div>
            <div className="flex justify-between items-end border-t border-outline-variant/20 pt-2">
              <span className="text-on-surface-variant font-label-caps text-xs">SUPPLY TIERS</span>
              <span className="font-data-lg text-secondary text-lg font-bold">SEC_B4_A</span>
            </div>
            <div className="pt-3 border-t border-outline-variant flex justify-between items-center">
              <span className="text-on-surface-variant font-label-caps text-xs">RESERVES STATE</span>
              <span className={`font-bold text-sm px-2 py-0.5 border ${
                nutrition.foodReservesCritical 
                  ? 'text-error border-error bg-error/10 animate-pulse' 
                  : 'text-primary border-primary bg-primary/10'
              }`}>
                {nutrition.foodReservesCritical ? 'CRITICAL' : 'STABLE'}
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
export default DashboardView;
