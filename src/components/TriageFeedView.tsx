import React, { useState } from 'react';
import type { Patient, PatientVitals } from '../types';
// import { pulseApi } from '../api/pulseApi';

interface TriageFeedViewProps {
  filteredPatients: Patient[];
  criticalCount: number;
  warningCount: number;
  stableCount: number;
  lockdownActive: boolean;
  setPatients: React.Dispatch<React.SetStateAction<Patient[]>>;
}

export const TriageFeedView: React.FC<TriageFeedViewProps> = ({
  filteredPatients,
  criticalCount,
  warningCount,
  stableCount,
  lockdownActive,
  setPatients
}) => {
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [newNoteText, setNewNoteText] = useState('');

  const selectedPatient = filteredPatients.find(p => p.patientId === selectedPatientId) || null;

  // Manual override for vitals nested attributes
  const updateVital = (patientId: string, key: keyof PatientVitals, value: any) => {
    setPatients(prev =>
      prev.map(p => {
        if (p.patientId === patientId) {
          const updatedVitals = { ...p.vitals, [key]: value };
          const updated = { ...p, vitals: updatedVitals };
          
          // Auto-adjust triage level based on new heartRate / spO2 (BUNKER rule)
          const hrVal = key === 'heartRate' ? value : p.vitals.heartRate;
          const spo2Val = key === 'spO2' ? value : p.vitals.spO2;
          
          if (hrVal > 130 || hrVal < 45 || spo2Val < 90) {
            updated.triageLevel = 'red';
            updated.triageGroup = 'TRG_1';
          } else if (hrVal > 100 || hrVal < 60 || spo2Val < 95) {
            updated.triageLevel = 'yellow';
            updated.triageGroup = 'TRG_2';
          } else {
            updated.triageLevel = 'green';
            updated.triageGroup = 'TRG_3';
          }
          /*
          // REAL API PERSISTENCE TRIGGER (Commented Out)
          // To save vital override to Firestore and execute triage scoring backend-side:
          pulseApi.saveVitals(updated).then(res => {
            console.log("Firestore: Vitals saved successfully", res.message);
          }).catch(err => {
            console.error("Firestore Error:", err);
          });

          pulseApi.evaluateTriage(updated).then(res => {
            console.log("Triage Level Evaluated:", res.triageLevel, "Score:", res.score, "Reasons:", res.reasons);
          }).catch(err => {
            console.error("Triage API Error:", err);
          });
          */

          return updated;
        }
        return p;
      })
    );
  };

  // Helper to handle blood pressure overrides
  const handleBpOverride = (patientId: string, bpString: string) => {
    const [sysStr, diaStr] = bpString.split('/');
    const sys = parseInt(sysStr) || 120;
    const dia = parseInt(diaStr) || 80;
    
    setPatients(prev =>
      prev.map(p => {
        if (p.patientId === patientId) {
          const updated = {
            ...p,
            vitals: {
              ...p.vitals,
              bloodPressure: { sys, dia }
            }
          };
          
          /*
          // REAL API PERSISTENCE TRIGGER (Commented Out)
          // To save blood pressure overrides into Firebase Firestore:
          pulseApi.saveVitals(updated).then(res => {
            console.log("Firestore: BP saved successfully", res.message);
          }).catch(err => {
            console.error("Firestore Error:", err);
          });
          */

          return updated;
        }
        return p;
      })
    );
  };

  const handleAddNote = (patientId: string) => {
    if (!newNoteText.trim()) return;
    setNotes(prev => ({
      ...prev,
      [patientId]: `${prev[patientId] ? prev[patientId] + '\n' : ''}> [${new Date().toLocaleTimeString()}] ${newNoteText.toUpperCase()}`
    }));
    setNewNoteText('');
  };

  return (
    <div className="h-full flex flex-col gap-6 select-none overflow-hidden">
      {/* Triage Summary Header */}
      <div className="flex justify-between items-center border-b border-outline-variant pb-4 shrink-0">
        <div>
          <h2 className={`font-headline-sm text-headline-sm uppercase tracking-wider ${
            lockdownActive ? 'text-error animate-pulse' : 'text-primary'
          }`}>
            REAL-TIME BIOMETRIC TELEMETRY
          </h2>
          <p className="font-body-md text-xs text-outline-variant uppercase mt-1">
            SCANNING SECTOR B4 PATIENT WARD ACTIVE CHANNELS
          </p>
        </div>
        <div className="flex gap-2">
          <span className="bg-surface-container px-2 py-1 font-label-caps text-label-caps text-error border border-error bg-error/10">
            CRITICAL: {criticalCount}
          </span>
          <span className="bg-surface-container px-2 py-1 font-label-caps text-label-caps text-secondary border border-secondary bg-secondary/10">
            WARNING: {warningCount}
          </span>
          <span className="bg-surface-container px-2 py-1 font-label-caps text-label-caps text-primary border border-primary bg-primary/10">
            STABLE: {stableCount}
          </span>
        </div>
      </div>

      <div className="flex-1 flex gap-6 overflow-hidden min-h-0">
        {/* Patient Grid */}
        <div className={`flex-1 overflow-y-auto pr-2 pb-6 grid gap-4 grid-cols-1 md:grid-cols-2 ${
          selectedPatient ? 'xl:grid-cols-2' : 'xl:grid-cols-3'
        }`}>
          {filteredPatients.map(p => {
            const isCritical = p.triageLevel === 'red';
            const isWarning = p.triageLevel === 'yellow';
            const isSelected = p.patientId === selectedPatientId;

            return (
              <article 
                key={p.patientId}
                onClick={() => setSelectedPatientId(isSelected ? null : p.patientId)}
                className={`bg-[#121214] border p-4 flex flex-col gap-4 relative overflow-hidden transition-all duration-150 cursor-pointer hover:border-primary-container group ${
                  isSelected ? 'border-primary shadow-[0_0_15px_rgba(0,219,233,0.3)] ring-1 ring-primary' : ''
                } ${
                  isCritical 
                    ? 'border-error card-critical glow-alert bg-error/2' 
                    : isWarning 
                      ? 'border-secondary bg-secondary/2' 
                      : 'border-outline-variant bg-surface-container-lowest'
                }`}
              >
                <div className={`absolute top-0 right-0 font-label-caps text-label-caps px-2 py-1 ${
                  isCritical 
                    ? 'bg-error text-on-error' 
                    : isWarning 
                      ? 'bg-secondary text-on-secondary' 
                      : 'bg-primary-fixed-dim text-on-primary'
                }`}>
                  {p.triageGroup}
                </div>

                <header className="flex justify-between items-start border-b border-outline-variant pb-2">
                  <div>
                    <p className={`font-label-caps text-label-caps text-xs ${
                      isCritical ? 'text-error' : isWarning ? 'text-secondary' : 'text-primary'
                    }`}>
                      ID: {p.patientId}
                    </p>
                    <h3 className="font-headline-sm text-headline-sm text-on-background uppercase mt-1">
                      {p.name}
                    </h3>
                  </div>
                  <span className={`material-symbols-outlined text-3xl ${
                    isCritical ? 'text-error animate-pulse' : isWarning ? 'text-secondary' : 'text-primary'
                  }`} style={{ fontVariationSettings: "'FILL' 1" }}>
                    {isCritical ? 'monitor_heart' : isWarning ? 'vital_signs' : 'ecg_heart'}
                  </span>
                </header>

                <div className="grid grid-cols-2 gap-y-3 gap-x-4">
                  {/* Heart Rate */}
                  <div className="flex flex-col gap-0.5">
                    <span className="font-label-caps text-[10px] text-outline">HR (BPM)</span>
                    <div className="flex items-baseline gap-1.5">
                      <span className={`font-data-lg text-lg font-bold ${
                        isCritical ? 'text-error' : isWarning ? 'text-secondary' : 'text-primary'
                      }`}>
                        {p.vitals.heartRate}
                      </span>
                      {p.hrTrend === 'up' && (
                        <span className={`material-symbols-outlined text-xs animate-pulse ${
                          isCritical ? 'text-error' : 'text-secondary'
                        }`}>arrow_upward</span>
                      )}
                      {p.hrTrend === 'down' && (
                        <span className={`material-symbols-outlined text-xs animate-pulse ${
                          isCritical ? 'text-error' : 'text-secondary'
                        }`}>arrow_downward</span>
                      )}
                    </div>
                  </div>

                  {/* BP */}
                  <div className="flex flex-col gap-0.5">
                    <span className="font-label-caps text-[10px] text-outline">BP (mmHg)</span>
                    <span className={`font-data-lg text-lg font-bold ${
                      isCritical ? 'text-error' : isWarning ? 'text-secondary' : 'text-on-background'
                    }`}>
                      {p.vitals.bloodPressure.sys}/{p.vitals.bloodPressure.dia}
                    </span>
                  </div>

                  {/* SpO2 */}
                  <div className="flex flex-col gap-0.5">
                    <span className="font-label-caps text-[10px] text-outline">SpO2 (%)</span>
                    <span className={`font-data-lg text-lg font-bold ${
                      p.vitals.spO2 < 90 ? 'text-error' : p.vitals.spO2 < 95 ? 'text-secondary' : 'text-primary'
                    }`}>
                      {p.vitals.spO2}%
                    </span>
                  </div>

                  {/* Temp */}
                  <div className="flex flex-col gap-0.5">
                    <span className="font-label-caps text-[10px] text-outline">TEMP (°C)</span>
                    <span className="font-data-lg text-lg font-bold text-on-background">
                      {p.vitals.temperature.toFixed(1)}°C
                    </span>
                  </div>
                </div>

                {/* Animated ECG Pulse Scanline */}
                <div className={`mt-2 shrink-0 ${isCritical ? 'pulse-line-critical' : 'pulse-line'}`}></div>
              </article>
            );
          })}
        </div>

        {/* Selected Patient Control Panel (Overriding Vitals & Notes) */}
        {selectedPatient && (
          <div className="w-80 border border-primary bg-surface-container p-6 flex flex-col gap-6 overflow-y-auto shrink-0 clipped-corner animate-fade-in">
            <div className="flex justify-between items-center border-b border-outline-variant pb-3">
              <div>
                <h3 className="font-headline-sm text-headline-sm text-primary uppercase">
                  MANUAL_OVERRIDE
                </h3>
                <p className="font-label-caps text-[10px] text-outline-variant uppercase">
                  PX: {selectedPatient.patientId}
                </p>
              </div>
              <button 
                onClick={() => setSelectedPatientId(null)}
                className="text-on-surface-variant hover:text-error transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Diagnostics Stats Controls */}
            <div className="flex flex-col gap-4">
              <h4 className="font-label-caps text-xs text-primary border-b border-outline-variant/30 pb-1">
                BIOMETRIC CALIBRATION
              </h4>

              {/* HR Overrides */}
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between text-xs font-label-caps">
                  <span className="text-on-surface-variant">HEART RATE (BPM)</span>
                  <span className="text-primary font-bold">{selectedPatient.vitals.heartRate}</span>
                </div>
                <input 
                  type="range" 
                  min="30" 
                  max="190" 
                  value={selectedPatient.vitals.heartRate}
                  onChange={(e) => updateVital(selectedPatient.patientId, 'heartRate', parseInt(e.target.value))}
                  className="w-full accent-primary bg-surface-container-low h-1 cursor-pointer"
                />
              </div>

              {/* SpO2 Overrides */}
              <div className="flex flex-col gap-1.5 mt-2">
                <div className="flex justify-between text-xs font-label-caps">
                  <span className="text-on-surface-variant">O2 SATURATION (%)</span>
                  <span className="text-primary font-bold">{selectedPatient.vitals.spO2}%</span>
                </div>
                <input 
                  type="range" 
                  min="70" 
                  max="100" 
                  value={selectedPatient.vitals.spO2}
                  onChange={(e) => updateVital(selectedPatient.patientId, 'spO2', parseInt(e.target.value))}
                  className="w-full accent-primary bg-surface-container-low h-1 cursor-pointer"
                />
              </div>

              {/* Temp Override Slider */}
              <div className="flex flex-col gap-1.5 mt-2">
                <div className="flex justify-between text-xs font-label-caps">
                  <span className="text-on-surface-variant">TEMP (°C)</span>
                  <span className="text-primary font-bold">{selectedPatient.vitals.temperature.toFixed(1)}°C</span>
                </div>
                <input 
                  type="range" 
                  min="33" 
                  max="42" 
                  step="0.1"
                  value={selectedPatient.vitals.temperature}
                  onChange={(e) => updateVital(selectedPatient.patientId, 'temperature', parseFloat(e.target.value))}
                  className="w-full accent-primary bg-surface-container-low h-1 cursor-pointer"
                />
              </div>
            </div>

            {/* Override BP options */}
            <div className="flex flex-col gap-2">
              <span className="font-label-caps text-[10px] text-outline">BP FORCE CONFIG</span>
              <div className="flex gap-2">
                {['80/50', '120/80', '140/90'].map(bpVal => {
                  const currentBpStr = `${selectedPatient.vitals.bloodPressure.sys}/${selectedPatient.vitals.bloodPressure.dia}`;
                  return (
                    <button 
                      key={bpVal}
                      onClick={() => handleBpOverride(selectedPatient.patientId, bpVal)}
                      className={`flex-1 py-1 text-xs border font-label-caps transition-colors ${
                        currentBpStr === bpVal 
                          ? 'border-primary text-primary bg-primary/10' 
                          : 'border-outline-variant text-on-surface-variant hover:text-primary hover:border-primary'
                      }`}
                    >
                      {bpVal}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Operator Notes Logs */}
            <div className="flex-grow flex flex-col gap-2 min-h-[140px] border-t border-outline-variant pt-4">
              <h4 className="font-label-caps text-xs text-primary pb-1">
                WARD CLINICAL NOTES
              </h4>
              <div className="flex-grow bg-surface-container-low border border-outline-variant p-2 font-body-md text-xs text-on-surface-variant overflow-y-auto whitespace-pre-line max-h-[180px]">
                {notes[selectedPatient.patientId] || '> NO CLINICAL NOTE LOGGED.'}
              </div>
              <div className="flex gap-2 mt-2">
                <input 
                  type="text" 
                  placeholder="NEW LOG..."
                  value={newNoteText}
                  onChange={(e) => setNewNoteText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddNote(selectedPatient.patientId)}
                  className="flex-grow bg-surface-container-lowest border border-outline-variant px-2 py-1 font-body-md text-xs text-on-surface placeholder:text-outline-variant focus:outline-none focus:border-primary uppercase"
                />
                <button 
                  onClick={() => handleAddNote(selectedPatient.patientId)}
                  className="bg-primary text-on-primary font-label-caps text-xs px-3 border border-primary hover:bg-transparent hover:text-primary transition-colors"
                >
                  LOG
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default TriageFeedView;
