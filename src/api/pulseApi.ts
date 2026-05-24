import type { 
  Patient, 
  EnvironmentalTelemetry, 
  NutritionSupply, 
  MasterHealthReportPayload, 
  PublicHealthBroadcastPayload,
  Survivor
} from '../types';

// API Bases
const BACKEND_BASE = 'https://pulse-medical-triage.vercel.app';
const SURVIVORS_BASE = 'http://69.28.90.158:3001';

const MOCK_PATIENTS: Patient[] = [
  {
    patientId: 'P-001',
    name: 'Elias Ward',
    age: 32,
    triageLevel: 'green',
    vitals: {
      heartRate: 82,
      bloodPressure: { sys: 120, dia: 80 },
      spO2: 98,
      temperature: 36.8,
      respiratoryRate: 16
    },
    timestamp: new Date().toISOString(),
    triageGroup: 'TRG_3',
    hrTrend: 'stable'
  },
  {
    patientId: 'P-002',
    name: 'Mira Kane',
    age: 28,
    triageLevel: 'yellow',
    vitals: {
      heartRate: 110,
      bloodPressure: { sys: 130, dia: 85 },
      spO2: 91,
      temperature: 38.1,
      respiratoryRate: 22
    },
    timestamp: new Date().toISOString(),
    triageGroup: 'TRG_2',
    hrTrend: 'up'
  },
  {
    patientId: 'P-003',
    name: 'Jonas Pike',
    age: 45,
    triageLevel: 'red',
    vitals: {
      heartRate: 140,
      bloodPressure: { sys: 80, dia: 50 },
      spO2: 82,
      temperature: 40.2,
      respiratoryRate: 30
    },
    timestamp: new Date().toISOString(),
    triageGroup: 'TRG_1',
    hrTrend: 'up'
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

// Simulated network latency helper
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const pulseApi = {
  /**
   * Fetches internal pulse patient records.
   * Hits the Firestore database logs for each patient to retrieve the latest vitals, falling back to mock files if offline.
   */
  async fetchPatients(): Promise<Patient[]> {
    try {
      const results = await Promise.all(
        MOCK_PATIENTS.map(async (p) => {
          try {
            // Firestore app/api returns last 10 logs
            const res = await fetch(`${BACKEND_BASE}/api/vitals?patientId=${p.patientId}`);
            if (res.ok) {
              const data = await res.json();
              if (data.vitals && data.vitals.length > 0) {
                const latest = data.vitals[0];
                return {
                  ...p,
                  vitals: {
                    heartRate: latest.heartRate ?? p.vitals.heartRate,
                    bloodPressure: latest.bloodPressure ?? p.vitals.bloodPressure,
                    spO2: latest.spO2 ?? p.vitals.spO2,
                    temperature: latest.temperature ?? p.vitals.temperature,
                    respiratoryRate: latest.respiratoryRate ?? p.vitals.respiratoryRate
                  },
                  triageLevel: latest.triageLevel ?? p.triageLevel,
                  timestamp: latest.timestamp ?? p.timestamp
                };
              }
            }
          } catch (err) {
            console.warn(`Firestore GET failed for patient ${p.patientId}. Using mock default.`, err);
          }
          return p;
        })
      );
      return results;
    } catch (error) {
      console.warn('API: fetchPatients failure, returning mock data.', error);
      return JSON.parse(JSON.stringify(MOCK_PATIENTS));
    }
  },

  /**
   * Saves patient vitals into Firebase Firestore db via the live Vercel endpoint.
   */
  async saveVitals(patient: Patient): Promise<{ message: string }> {
    const response = await fetch(`${BACKEND_BASE}/api/vitals`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ patient })
    });
    if (!response.ok) throw new Error('API: Failed to save patient vitals');
    return response.json();
  },

  /**
   * Evaluates patient vitals on the server, saving the results and reporting status to Nexus Governance.
   */
  async evaluateTriage(patient: Patient) {
    const response = await fetch(`${BACKEND_BASE}/api/triage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ patient })
    });
    if (!response.ok) throw new Error('API: Failed to run triage score');
    return response.json();
  },

  /**
   * Submits active patients list to evaluate outbreak possibilities.
   */
  async runOutbreakDetect(patients: Patient[]) {
    const response = await fetch(`${BACKEND_BASE}/api/outbreak-detect`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ patients })
    });
    if (!response.ok) throw new Error('API: Failed to analyze outbreak');
    return response.json();
  },

  /**
   * Fetches environmental telemetry readings (Mocked)
   */
  async fetchEnvironmentalTelemetry(): Promise<EnvironmentalTelemetry> {
    await delay(200);
    return JSON.parse(JSON.stringify(MOCK_ENVIRONMENTAL));
  },

  /**
   * Fetches global caloric/water ration supplies (Mocked)
   */
  async fetchNutritionSupply(): Promise<NutritionSupply> {
    await delay(200);
    return JSON.parse(JSON.stringify(MOCK_NUTRITION));
  },

  /**
   * Pushes master health reports to Nexus Governance endpoint (Action 3.1)
   */
  async postMasterHealthReport(payload: MasterHealthReportPayload): Promise<{ success: boolean }> {
    await delay(500);
    console.log('%c[POST /api/nexus/report]', 'color: #00dbe9; font-weight: bold;', payload);
    return { success: true };
  },

  /**
   * Triggers public health alarms to Sector Education nodes (Action 3.2)
   */
  async postPublicHealthBroadcast(payload: PublicHealthBroadcastPayload): Promise<{ success: boolean }> {
    await delay(400);
    console.log('%c[POST /api/education/broadcast]', 'color: #ffb4ab; font-weight: bold;', payload);
    return { success: true };
  },

  /**
   * Fetches registered bunker survivors from the live microservice.
   */
  async fetchSurvivors(skill?: string): Promise<Survivor[]> {
    try {
      const url = skill 
        ? `${SURVIVORS_BASE}/api/survivors?skill=${skill}` 
        : `${SURVIVORS_BASE}/api/survivors`;
      const response = await fetch(url);
      if (!response.ok) throw new Error('API: Failed to fetch survivors');
      return await response.json();
    } catch (error) {
      console.warn('API: Survivors fetch failed. Falling back to mock data.', error);
      if (!skill) return JSON.parse(JSON.stringify(MOCK_SURVIVORS));
      return MOCK_SURVIVORS.filter(s => 
        s.skills.some(sk => sk.category.toLowerCase() === skill.toLowerCase())
      );
    }
  }
};
export default pulseApi;
