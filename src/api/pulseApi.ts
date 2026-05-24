import type { 
  Patient, 
  EnvironmentalTelemetry, 
  NutritionSupply, 
  MasterHealthReportPayload, 
  PublicHealthBroadcastPayload,
  Survivor
} from '../types';

const MOCK_PATIENTS: Patient[] = [
  {
    patientId: 'PX-928',
    name: 'Doe, John R.',
    age: 42,
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
    age: 29,
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
    age: 38,
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
    age: 64,
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
    age: 51,
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
    age: 35,
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
    age: 22,
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
  // ==========================================
  // REAL BACKEND ROUTE HANDLERS (Next.js /api)
  // ==========================================
  // Uncomment the block below and comment out the mock implementations to wire directly:
  /*
  async fetchPatients(): Promise<Patient[]> {
    // Next.js APP router endpoint (requires custom route for list, or fallback list)
    const response = await fetch('/api/patients');
    if (!response.ok) throw new Error('API: Failed to fetch patients list');
    return response.json();
  },

  async saveVitals(patient: Patient): Promise<{ message: string }> {
    // Saves patient vitals into Firebase Firestore db
    const response = await fetch('/api/vitals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ patient })
    });
    if (!response.ok) throw new Error('API: Failed to save patient vitals');
    return response.json();
  },

  async evaluateTriage(patient: Patient) {
    // Runs vital scoring in Next.js, saves output, reports to Nexus
    const response = await fetch('/api/triage', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ patient })
    });
    if (!response.ok) throw new Error('API: Failed to run triage score');
    return response.json();
  },

  async runOutbreakDetect(patients: Patient[]) {
    // Runs outbreak analysis against the patient ward
    const response = await fetch('/api/outbreak-detect', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ patients })
    });
    if (!response.ok) throw new Error('API: Failed to analyze outbreak');
    return response.json();
  },
  */

  // ==========================================
  // MOCK TELEMETRY IMPLEMENTATIONS
  // ==========================================

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
  },

  /**
   * Fetches registered bunker survivors
   */
  async fetchSurvivors(skill?: string): Promise<Survivor[]> {
    await delay(250);
    
    // Commented-out live HTTP fetch implementation:
    /*
    const url = skill 
      ? `http://69.28.90.158:3001/api/survivors?skill=${skill}` 
      : 'http://69.28.90.158:3001/api/survivors';
    const response = await fetch(url);
    if (!response.ok) throw new Error('API: Failed to fetch survivors');
    return response.json();
    */

    if (!skill) return JSON.parse(JSON.stringify(MOCK_SURVIVORS));
    
    // Filter by skill category
    return MOCK_SURVIVORS.filter(s => 
      s.skills.some(sk => sk.category.toLowerCase() === skill.toLowerCase())
    );
  }
};

const MOCK_SURVIVORS: Survivor[] = [
  {
    id: "cmpjmeof3000001pfndghrb8q",
    name: "Ayesha",
    age: 22,
    sector: "Archive",
    registeredAt: "2026-05-24T10:14:22.239Z",
    skills: []
  },
  {
    id: "cmpjk6fdb000l23obzjqf97nc",
    name: "Rosa Mendez",
    age: 45,
    sector: "Construction",
    registeredAt: "2026-05-24T09:11:58.031Z",
    skills: [
      { id: "cmpjk6fdc000m23ob6ijg8i4g", name: "Masonry", category: "construction", survivorId: "cmpjk6fdb000l23obzjqf97nc" },
      { id: "cmpjk6fdc000n23ob90fu52ej", name: "Plumbing", category: "construction", survivorId: "cmpjk6fdb000l23obzjqf97nc" },
      { id: "cmpjk6fdc000o23ob8ugbmt2m", name: "Ventilation Systems", category: "engineering", survivorId: "cmpjk6fdb000l23obzjqf97nc" }
    ]
  },
  {
    id: "cmpjk6fd4000h23ob7ovnwx4b",
    name: "James Whitfield",
    age: 31,
    sector: "Communications",
    registeredAt: "2026-05-24T09:11:58.024Z",
    skills: [
      { id: "cmpjk6fd5000i23obav3zmr6q", name: "Network Administration", category: "tech", survivorId: "cmpjk6fd4000h23ob7ovnwx4b" },
      { id: "cmpjk6fd5000j23ob6w0wlzns", name: "Radio Operations", category: "tech", survivorId: "cmpjk6fd4000h23ob7ovnwx4b" },
      { id: "cmpjk6fd5000k23obssbg6xpn", name: "Encryption", category: "tech", survivorId: "cmpjk6fd4000h23ob7ovnwx4b" }
    ]
  },
  {
    id: "cmpjk6fcx000d23obumgiug12",
    name: "Sarah Okonkwo",
    age: 28,
    sector: "Agriculture",
    registeredAt: "2026-05-24T09:11:58.017Z",
    skills: [
      { id: "cmpjk6fcy000e23obzju76mai", name: "Hydroponics", category: "farming", survivorId: "cmpjk6fcx000d23obumgiug12" },
      { id: "cmpjk6fcy000f23obp8jomvdm", name: "Seed Preservation", category: "farming", survivorId: "cmpjk6fcx000d23obumgiug12" },
      { id: "cmpjk6fcy000g23obv4t3d3eo", name: "Soil Analysis", category: "farming", survivorId: "cmpjk6fcx000d23obumgiug12" }
    ]
  },
  {
    id: "cmpjk6fcr000923obgwtss1xb",
    name: "Marcus Chen",
    age: 35,
    sector: "Engineering",
    registeredAt: "2026-05-24T09:11:58.011Z",
    skills: [
      { id: "cmpjk6fcs000a23obg783q89a", name: "Electrical Systems", category: "engineering", survivorId: "cmpjk6fcr000923obgwtss1xb" },
      { id: "cmpjk6fcs000b23ob4bqzhcs1", name: "Generator Repair", category: "engineering", survivorId: "cmpjk6fcr000923obgwtss1xb" },
      { id: "cmpjk6fcs000c23ob0t1u6fyh", name: "Structural Assessment", category: "construction", survivorId: "cmpjk6fcr000923obgwtss1xb" }
    ]
  },
  {
    id: "cmpjk6fci000523obb0qyo7ky",
    name: "Dr. Elena Vasquez",
    age: 42,
    sector: "Medical Bay",
    registeredAt: "2026-05-24T09:11:58.002Z",
    skills: [
      { id: "cmpjk6fcj000623obg8en8rbt", name: "Trauma Surgery", category: "medical", survivorId: "cmpjk6fci000523obb0qyo7ky" },
      { id: "cmpjk6fcj000723obc0p2vz8o", name: "Pharmacology", category: "medical", survivorId: "cmpjk6fci000523obb0qyo7ky" },
      { id: "cmpjk6fcj000823ob2y25xugw", name: "Field Triage", category: "medical", survivorId: "cmpjk6fci000523obb0qyo7ky" }
    ]
  }
];
export default pulseApi;
