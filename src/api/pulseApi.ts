import type { 
  Patient, 
  EnvironmentalTelemetry, 
  NutritionSupply, 
  MasterHealthReportPayload, 
  PublicHealthBroadcastPayload 
} from '../types';

const MOCK_PATIENTS: Patient[] = [
  {
    patientId: 'PX-928',
    name: 'Doe, John R.',
    triageLevel: 'red',
    vitals: {
      heartRate: 145,
      bloodPressure: { sys: 80, dia: 50 },
      spO2: 88,
      temperature: 39.5,
      respiratoryRate: 30
    },
    timestamp: new Date().toISOString(),
    triageGroup: 'TRG_1',
    hrTrend: 'up'
  },
  {
    patientId: 'PX-401',
    name: 'Unknown Female',
    triageLevel: 'red',
    vitals: {
      heartRate: 42,
      bloodPressure: { sys: 70, dia: 40 },
      spO2: 85,
      temperature: 34.1,
      respiratoryRate: 20
    },
    timestamp: new Date().toISOString(),
    triageGroup: 'TRG_1',
    hrTrend: 'down'
  },
  {
    patientId: 'PX-112',
    name: 'Smith, Arthur',
    triageLevel: 'yellow',
    vitals: {
      heartRate: 110,
      bloodPressure: { sys: 140, dia: 90 },
      spO2: 94,
      temperature: 38.5,
      respiratoryRate: 22
    },
    timestamp: new Date().toISOString(),
    triageGroup: 'TRG_2',
    hrTrend: 'stable'
  },
  {
    patientId: 'PX-993',
    name: 'Miller, Evelyn',
    triageLevel: 'green',
    vitals: {
      heartRate: 72,
      bloodPressure: { sys: 120, dia: 80 },
      spO2: 98,
      temperature: 36.6,
      respiratoryRate: 16
    },
    timestamp: new Date().toISOString(),
    triageGroup: 'TRG_3',
    hrTrend: 'stable'
  },
  {
    patientId: 'PX-742',
    name: 'Davis, Robert',
    triageLevel: 'green',
    vitals: {
      heartRate: 68,
      bloodPressure: { sys: 118, dia: 75 },
      spO2: 99,
      temperature: 36.8,
      respiratoryRate: 16
    },
    timestamp: new Date().toISOString(),
    triageGroup: 'TRG_3',
    hrTrend: 'stable'
  },
  {
    patientId: 'PX-442',
    name: 'Taylor, James',
    triageLevel: 'yellow',
    vitals: {
      heartRate: 105,
      bloodPressure: { sys: 130, dia: 85 },
      spO2: 93,
      temperature: 37.8,
      respiratoryRate: 22
    },
    timestamp: new Date().toISOString(),
    triageGroup: 'TRG_2',
    hrTrend: 'up'
  },
  {
    patientId: 'PX-109',
    name: 'Wilson, Clara',
    triageLevel: 'green',
    vitals: {
      heartRate: 75,
      bloodPressure: { sys: 120, dia: 80 },
      spO2: 98,
      temperature: 36.6,
      respiratoryRate: 16
    },
    timestamp: new Date().toISOString(),
    triageGroup: 'TRG_3',
    hrTrend: 'stable'
  }
];

const MOCK_ENVIRONMENTAL: EnvironmentalTelemetry = {
  timestamp: new Date().toISOString(),
  oxygenLevel: 20.5,
  co2Level: 450,
  ambientTemperature: 24.2,
  toxicityAlert: false,
  oxygenHistory: Array.from({ length: 15 }, () => 20 + Math.random()),
  co2History: Array.from({ length: 15 }, () => 440 + Math.random() * 20),
};

const MOCK_NUTRITION: NutritionSupply = {
  timestamp: new Date().toISOString(),
  averageCaloricIntake: 1800,
  waterRation: 2.0,
  foodReservesCritical: false,
};

// Simulated network latency helper
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const pulseApi = {
  /**
   * Fetches internal pulse patient records
   */
  async fetchPatients(): Promise<Patient[]> {
    await delay(300); // Simulate network latency
    return JSON.parse(JSON.stringify(MOCK_PATIENTS));
  },

  /**
   * Fetches environmental telemetry readings
   */
  async fetchEnvironmentalTelemetry(): Promise<EnvironmentalTelemetry> {
    await delay(200);
    return JSON.parse(JSON.stringify(MOCK_ENVIRONMENTAL));
  },

  /**
   * Fetches global caloric/water ration supplies
   */
  async fetchNutritionSupply(): Promise<NutritionSupply> {
    await delay(200);
    return JSON.parse(JSON.stringify(MOCK_NUTRITION));
  },

  /**
   * Pushes master health reports to Nexus Governance endpoint
   */
  async postMasterHealthReport(payload: MasterHealthReportPayload): Promise<{ success: boolean }> {
    await delay(500);
    console.log('%c[POST /api/nexus/report]', 'color: #00dbe9; font-weight: bold;', payload);
    return { success: true };
  },

  /**
   * Triggers public health alarms to Sector Education nodes
   */
  async postPublicHealthBroadcast(payload: PublicHealthBroadcastPayload): Promise<{ success: boolean }> {
    await delay(400);
    console.log('%c[POST /api/education/broadcast]', 'color: #ffb4ab; font-weight: bold;', payload);
    return { success: true };
  }
};
export default pulseApi;
