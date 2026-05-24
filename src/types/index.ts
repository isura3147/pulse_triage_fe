export type TriageLevel = 'red' | 'yellow' | 'green';

export interface BloodPressure {
  sys: number;
  dia: number;
}

export interface PatientVitals {
  heartRate: number;
  bloodPressure: BloodPressure;
  spO2: number;
  temperature: number;
  respiratoryRate: number;
}

export interface Patient {
  patientId: string;
  name: string;
  triageLevel: TriageLevel;
  vitals: PatientVitals;
  timestamp: string;
  // UI helpers
  triageGroup: string;
  hrTrend: 'up' | 'down' | 'stable';
}

export interface EnvironmentalTelemetry {
  timestamp: string;
  oxygenLevel: number;
  co2Level: number;
  ambientTemperature: number;
  toxicityAlert: boolean;
  // Charting helpers
  oxygenHistory: number[];
  co2History: number[];
}

export interface NutritionSupply {
  timestamp: string;
  averageCaloricIntake: number;
  waterRation: number;
  foodReservesCritical: boolean;
}

export interface MasterHealthReportPayload {
  timestamp: string;
  bunkerThreatLevel: 'safe' | 'elevated' | 'outbreak';
  globalLockdownRequired: boolean;
  workforceMetrics: {
    medicallyHealthy: number;
    actualAvailableWorkforce: number;
    totalIncapacitated: number;
  };
}

export interface PublicHealthBroadcastPayload {
  alertId: string;
  severity: 'CRITICAL' | 'WARNING';
  targetAudience: 'GLOBAL';
  protocolString: string;
  symptomsToReport: string[];
}

export interface SystemLog {
  timestamp: string;
  reportId: string;
  type: string;
  status: 'COMPLETE' | 'ARCHIVED' | 'FAILED';
}
