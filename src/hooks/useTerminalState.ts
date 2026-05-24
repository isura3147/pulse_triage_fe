import { useState, useEffect, useCallback } from 'react';
import type { 
  Patient, 
  EnvironmentalTelemetry, 
  NutritionSupply, 
  SystemLog, 
  MasterHealthReportPayload, 
  PublicHealthBroadcastPayload,
  Survivor
} from '../types';
import { pulseApi } from '../api/pulseApi';

const INITIAL_LOGS: SystemLog[] = [
  { timestamp: '2042-10-27 14:02:44', reportId: 'RPT-NX-9981', type: 'GOV_SUMMARY', status: 'COMPLETE' },
  { timestamp: '2042-10-27 08:00:00', reportId: 'RPT-NX-9980', type: 'DAILY_ROLLUP', status: 'COMPLETE' },
  { timestamp: '2042-10-26 23:59:59', reportId: 'RPT-NX-9979', type: 'QUARANTINE_LOG', status: 'ARCHIVED' },
  { timestamp: '2042-10-26 12:30:15', reportId: 'RPT-ER-1104', type: 'TRIAGE_ERR_DUMP', status: 'FAILED' }
];

const INITIAL_TELEMETRY: EnvironmentalTelemetry = {
  timestamp: new Date().toISOString(),
  oxygenLevel: 20.5,
  co2Level: 450,
  ambientTemperature: 24.2,
  toxicityAlert: false,
  oxygenHistory: Array.from({ length: 15 }, () => 20 + Math.random()),
  co2History: Array.from({ length: 15 }, () => 440 + Math.random() * 20),
};

const INITIAL_NUTRITION: NutritionSupply = {
  timestamp: new Date().toISOString(),
  averageCaloricIntake: 1800,
  waterRation: 2.0,
  foodReservesCritical: false,
};

export const useTerminalState = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'triage' | 'nexus'>('dashboard');
  const [patients, setPatients] = useState<Patient[]>([]);
  const [logs, setLogs] = useState<SystemLog[]>(INITIAL_LOGS);
  const [telemetry, setTelemetry] = useState<EnvironmentalTelemetry>(INITIAL_TELEMETRY);
  const [nutrition, setNutrition] = useState<NutritionSupply>(INITIAL_NUTRITION);
  const [searchQuery, setSearchQuery] = useState('');
  const [lockdownActive, setLockdownActive] = useState(false);
  const [systemAlertActive, setSystemAlertActive] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [survivors, setSurvivors] = useState<Survivor[]>([]);
  const [skillFilter, setSkillFilter] = useState<string>('');
  
  // Nexus report compiler variables
  const [nexusConsole, setNexusConsole] = useState<string[]>([
    '> INITIALIZING NEXUS EXPORT PROTOCOL...',
    '> CONNECTING TO MAINFRAME...',
    '> CONNECTION ESTABLISHED. SECURE CHANNEL.',
    '> COMPILING SECTOR B4 DATA...',
    '> WARNING: ABNORMAL DATA SPIKE DETECTED IN SUB-LEVEL 3.',
    '> CRITICAL: CONTAINMENT BREACH PROBABILITY 87%.',
    '> WAITING FOR OPERATOR INPUT'
  ]);
  const [isCompiling, setIsCompiling] = useState(false);

  // Load Initial API Data
  useEffect(() => {
    const loadApiData = async () => {
      try {
        setIsLoading(true);
        const [patientsData, telemetryData, nutritionData, survivorsData] = await Promise.all([
          pulseApi.fetchPatients(),
          pulseApi.fetchEnvironmentalTelemetry(),
          pulseApi.fetchNutritionSupply(),
          pulseApi.fetchSurvivors()
        ]);
        setPatients(patientsData);
        setTelemetry(telemetryData);
        setNutrition(nutritionData);
        setSurvivors(survivorsData);

        // REAL API INTEGRATION TRIGGER
        // To query outbreak detection at start using patient collection:
        pulseApi.runOutbreakDetect(patientsData).then(outbreak => {
          if (outbreak.outbreakDetected) {
            setLockdownActive(true);
            setNexusConsole(logs => [
              ...logs,
              `> [${new Date().toLocaleTimeString()}] OUTBREAK DETECTED BY BACKEND DETECTOR Node.`,
              `>   THREAT: ${outbreak.threatLevel.toUpperCase()} (AFFECTED: ${outbreak.affectedCount} PATIENTS)`,
              `>   SYMPTOMS: ${outbreak.symptoms.join(', ')}`,
              `>   RECOMMENDATION: ${outbreak.recommendation}`
            ]);
          }
        }).catch(err => {
          console.error("Outbreak Detection API Error:", err);
        });

      } catch (error) {
        console.error('BUNKER_OS_v4.2 API Data Load Failure:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadApiData();
  }, []);

  // Fluctuating vitals simulation
  useEffect(() => {
    if (isLoading) return;

    const interval = setInterval(() => {
      // 1. Fluctuate patient biometrics nested under vitals
      setPatients(prev =>
        prev.map(p => {
          let hrDiff = 0;
          if (Math.random() > 0.4) {
            hrDiff = Math.random() > 0.5 ? 1 : -1;
          }
          const heartRate = Math.max(30, Math.min(200, p.vitals.heartRate + hrDiff));
          const hrTrend = hrDiff > 0 ? 'up' : hrDiff < 0 ? 'down' : p.hrTrend;

          let spo2Diff = 0;
          if (Math.random() > 0.7) {
            spo2Diff = Math.random() > 0.5 ? 1 : -1;
          }
          const spO2 = Math.max(70, Math.min(100, p.vitals.spO2 + spo2Diff));

          let tempDiff = 0;
          if (Math.random() > 0.8) {
            tempDiff = Math.random() > 0.5 ? 0.1 : -0.1;
          }
          const temperature = parseFloat((p.vitals.temperature + tempDiff).toFixed(1));

          return { 
            ...p, 
            vitals: {
              ...p.vitals,
              heartRate,
              spO2,
              temperature
            },
            hrTrend,
            timestamp: new Date().toISOString()
          };
        })
      );

      // 2. Fluctuate global environmental levels
      setTelemetry(prev => {
        const o2Diff = (Math.random() - 0.5) * 0.2;
        const oxygenLevel = parseFloat(Math.max(15, Math.min(25, prev.oxygenLevel + o2Diff)).toFixed(2));
        const oxygenHistory = [...prev.oxygenHistory.slice(1), oxygenLevel];

        const co2Diff = Math.round((Math.random() - 0.5) * 8);
        const co2Level = Math.max(300, Math.min(600, prev.co2Level + co2Diff));
        const co2History = [...prev.co2History.slice(1), co2Level];

        return {
          ...prev,
          oxygenLevel,
          co2Level,
          oxygenHistory,
          co2History,
          timestamp: new Date().toISOString()
        };
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [isLoading]);

  // Lockdown protocol trigger
  const handleLockdown = useCallback(() => {
    setLockdownActive(prev => {
      const nextState = !prev;

      // Construct and POST broadcast action payload (Action 3.2)
      const broadcastPayload: PublicHealthBroadcastPayload = {
        alertId: `OUTBREAK-${Math.floor(100 + Math.random() * 900)}`,
        severity: nextState ? 'CRITICAL' : 'WARNING',
        targetAudience: 'GLOBAL',
        protocolString: nextState 
          ? 'CONTAGION DETECTED. CEASE ALL COMMERCE. RETURN TO QUARTERS.'
          : 'LOCKDOWN CANCELLED. COMMENCE CLEANING AND NOMINAL SHIFT CYCLE.',
        symptomsToReport: ['High Fever', 'Low SpO2']
      };

      pulseApi.postPublicHealthBroadcast(broadcastPayload);
      
      // Update nexus compiler output logs
      setNexusConsole(logs => [
        ...logs,
        `> [${new Date().toLocaleTimeString()}] EMERGENCY PROTOCOL: OPERATOR INITIATED ACTION.`,
        `> POSTING PUBLIC HEALTH BROADCAST: ID=${broadcastPayload.alertId}, SEVERITY=${broadcastPayload.severity}`,
        `> PROTOCOL: ${broadcastPayload.protocolString}`
      ]);
      
      return nextState;
    });
  }, []);

  // System purge trigger (clears stats or resets to extreme mode)
  const handleSystemPurge = useCallback(() => {
    if (window.confirm("WARNING: INITIATING SYSTEM PURGE WILL RESET ALL DIAGNOSTICS & TELEMETRY. CONTINUE?")) {
      setIsLoading(true);
      pulseApi.fetchPatients().then(data => {
        setPatients(data);
        setIsLoading(false);
      });
      setLogs(INITIAL_LOGS);
      setTelemetry(INITIAL_TELEMETRY);
      setNutrition(INITIAL_NUTRITION);
      setNexusConsole([
        `> [${new Date().toLocaleTimeString()}] SYSTEM PURGE COMPLETED.`,
        `> DIAGNOSTICS RESET TO PROTOCOL ZERO.`
      ]);
    }
  }, []);

  // Derived patient metrics
  const criticalCount = patients.filter(p => p.triageLevel === 'red').length;
  const warningCount = patients.filter(p => p.triageLevel === 'yellow').length;
  const stableCount = patients.filter(p => p.triageLevel === 'green').length;

  // Master Health Report compiler simulation (Action 3.1)
  const handleGenerateReport = useCallback(() => {
    if (isCompiling) return;
    setIsCompiling(true);
    setNexusConsole(['> INITIALIZING NEXUS EXPORT PROTOCOL...']);

    const steps = [
      { text: '> ESTABLISHING MAINNET LINK...', delay: 1000 },
      { text: '> AUTHENTICATING CREDENTIALS FOR OPERATOR_092...', delay: 2000 },
      { text: '> COMPILED PATIENT RECORD MATRIX (8 RECORDS)...', delay: 3500 },
      { text: '> SYSTEM FLAGS: LOCKDOWN_REQ=' + (lockdownActive ? 'TRUE' : 'FALSE') + ', THREAT=' + (lockdownActive ? 'CRITICAL' : 'SAFE'), delay: 5000 },
      { text: '> CONSTRUCTING GOVERNANCE MASTER HEALTH REPORT PAYLOAD...', delay: 6500 },
      { text: '> POSTING TO NEXUS DATA MAINNET...', delay: 7800 }
    ];

    steps.forEach((step, idx) => {
      setTimeout(() => {
        setNexusConsole(prev => [...prev, step.text]);
        if (idx === steps.length - 1) {
          const reportPayload: MasterHealthReportPayload = {
            timestamp: new Date().toISOString(),
            bunkerThreatLevel: lockdownActive ? 'outbreak' : 'elevated',
            globalLockdownRequired: lockdownActive,
            workforceMetrics: {
              medicallyHealthy: stableCount + warningCount,
              actualAvailableWorkforce: stableCount,
              totalIncapacitated: criticalCount
            }
          };

          pulseApi.postMasterHealthReport(reportPayload).then(() => {
            setNexusConsole(prev => [
              ...prev,
              `> TRANSMISSION COMPLETE. payload:`,
              `>   THREAT_LEVEL: ${reportPayload.bunkerThreatLevel.toUpperCase()}`,
              `>   MEDICALLY_HEALTHY: ${reportPayload.workforceMetrics.medicallyHealthy}`,
              `>   AVAILABLE_WORKFORCE: ${reportPayload.workforceMetrics.actualAvailableWorkforce}`,
              `>   TOTAL_INCAPACITATED: ${reportPayload.workforceMetrics.totalIncapacitated}`,
              `> ARCHIVED IN LOCAL DATABASE.`
            ]);
            setIsCompiling(false);
            setLogs(prev => [
              {
                timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
                reportId: `RPT-NX-${Math.floor(1000 + Math.random() * 9000)}`,
                type: 'GOV_SUMMARY',
                status: 'COMPLETE'
              },
              ...prev
            ]);
          });
        }
      }, step.delay);
    });
  }, [isCompiling, lockdownActive, criticalCount, warningCount, stableCount]);

  const filteredPatients = patients.filter(p =>
    p.patientId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleFilterSurvivors = useCallback(async (category: string) => {
    setSkillFilter(category);
    try {
      const data = await pulseApi.fetchSurvivors(category || undefined);
      setSurvivors(data);
    } catch (error) {
      console.error('Failed to filter survivors:', error);
    }
  }, []);

  return {
    activeTab,
    setActiveTab,
    patients,
    filteredPatients,
    logs,
    telemetry,
    nutrition,
    searchQuery,
    setSearchQuery,
    lockdownActive,
    handleLockdown,
    handleSystemPurge,
    systemAlertActive,
    setSystemAlertActive,
    nexusConsole,
    isCompiling,
    handleGenerateReport,
    criticalCount,
    warningCount,
    stableCount,
    setPatients,
    isLoading,
    survivors,
    skillFilter,
    handleFilterSurvivors
  };
};
export type UseTerminalStateReturn = ReturnType<typeof useTerminalState>;
