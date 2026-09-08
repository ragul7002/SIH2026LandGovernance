import {
  District,
  Taluk,
  LulcComparisonItem,
  TransitionMatrixRow,
  KeyTransitionItem,
  PredictionCell,
  CellExplanationResponse,
  RAGResponse,
  ScenarioItem,
  ModelMetrics,
  DatasetItem,
  ExecutiveReport
} from '../types';

const API_BASE = 'http://127.0.0.1:8000/api/v1';

async function fetchJson<T>(endpoint: string, options?: RequestInit): Promise<T> {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers
      }
    });
    if (!res.ok) {
      throw new Error(`HTTP error ${res.status}: ${res.statusText}`);
    }
    return await res.json();
  } catch (err) {
    console.warn(`API call failed for ${endpoint}, using fallback if available:`, err);
    throw err;
  }
}

export const api = {
  // Regions
  getRegions: () => fetchJson<{ total_districts: number; districts: District[]; pilot_taluks: Taluk[] }>('/regions'),
  getTiruppurDetails: () => fetchJson<{ district: string; taluks: Taluk[]; key_corridors: string[]; river_basins: string[] }>('/regions/tiruppur'),

  // LULC
  getLulcSummary: () => fetchJson<{ sample_analyzed_area_ha: number; comparison: LulcComparisonItem[] }>('/lulc'),
  getLulcChange: () => fetchJson<{ matrix: TransitionMatrixRow[]; classes: string[]; key_transitions: KeyTransitionItem[] }>('/lulc/change'),

  // GIS
  getGisLayers: () => fetchJson<{ available_layers: any[]; pilot_center: { lat: number; lon: number; zoom: number } }>('/gis/layers'),
  getParcelsGeoJson: () => fetchJson<any>('/gis/geojson'),
  getTamilNaduDistrictsGeoJson: () => fetchJson<any>('/gis/tamilnadu-districts'),

  // Predictions
  getPredictions: (taluk?: string, risk?: string) => {
    const params = new URLSearchParams();
    if (taluk) params.append('taluk', taluk);
    if (risk) params.append('risk', risk);
    const queryStr = params.toString() ? `?${params.toString()}` : '';
    return fetchJson<{ total_evaluated_cells: number; risk_breakdown: Record<string, number>; predictions: PredictionCell[] }>(`/predictions${queryStr}`);
  },
  getCellExplanation: (cellId: string) => fetchJson<CellExplanationResponse>(`/predictions/${cellId}`),

  // Ask-the-Map
  askMap: (query: string) => fetchJson<{
    query: string;
    interpretation: any;
    explanation: string;
    matched_count: number;
    matched_cells: any[];
  }>('/ask-map', {
    method: 'POST',
    body: JSON.stringify({ query })
  }),

  // Research Copilot RAG
  queryResearch: (question: string) => fetchJson<RAGResponse>('/research/query', {
    method: 'POST',
    body: JSON.stringify({ question })
  }),
  getDocuments: () => fetchJson<{ policies: any[]; research: any[]; total_documents: number }>('/research/documents'),

  // Scenarios
  getScenarios: () => fetchJson<{ scenarios: ScenarioItem[]; default_weights: Record<string, number> }>('/scenarios'),
  simulateScenarios: (weights?: Record<string, number>) => fetchJson<{ status: string; scenarios: ScenarioItem[] }>('/scenarios/simulate', {
    method: 'POST',
    body: JSON.stringify({ weights })
  }),

  // Models Evaluation
  getModelsEvaluation: () => fetchJson<{
    models: ModelMetrics[];
    comparison_summary: any;
  }>('/models'),

  // Datasets & Quality
  getDatasets: () => fetchJson<{ datasets: DatasetItem[] }>('/datasets'),
  getDataQuality: () => fetchJson<{
    overall_platform_quality_index: number;
    average_completeness_pct: number;
    datasets_status: DatasetItem[];
  }>('/data-quality'),

  // Evidence
  getEvidenceChain: (cellId: string) => fetchJson<any>(`/evidence/chain/${cellId}`),

  // Taluk Intelligence & Industry Suitability (Strictly Real Datasets)
  getTaluks: (district?: string) => {
    const q = district ? `?district=${encodeURIComponent(district)}` : '';
    return fetchJson<{ district?: string; total_taluks?: number; taluks?: string[]; district_taluk_map?: Record<string, string[]> }>(`/taluks${q}`);
  },
  getTaluksGeoJson: (district?: string) => {
    const q = district ? `?district=${encodeURIComponent(district)}` : '';
    return fetchJson<any>(`/taluks/geojson${q}`);
  },
  getTalukIntelligence: (district: string, taluk: string) => {
    return fetchJson<any>(`/taluks/intelligence?district=${encodeURIComponent(district)}&taluk=${encodeURIComponent(taluk)}`);
  },
  getTalukComparison: (district: string) => {
    return fetchJson<any>(`/taluks/compare?district=${encodeURIComponent(district)}`);
  },
  filterHighRainAgriTaluks: (district?: string) => {
    const q = district ? `?district=${encodeURIComponent(district)}` : '';
    return fetchJson<any>(`/taluks/filter/high-rain-agri${q}`);
  },
  getIndustrySuitability: (district: string, taluk: string, industry: string = 'textile') => {
    return fetchJson<any>(`/taluks/industry-suitability?district=${encodeURIComponent(district)}&taluk=${encodeURIComponent(taluk)}&industry=${encodeURIComponent(industry)}`);
  },

  // Authentic Villages (LGD 15,179 Villages)
  getVillages: (district?: string, taluk?: string, search?: string, limit: number = 100) => {
    const params = new URLSearchParams();
    if (district) params.append('district', district);
    if (taluk) params.append('taluk', taluk);
    if (search) params.append('q', search);
    params.append('limit', String(limit));
    return fetchJson<any>(`/villages?${params.toString()}`);
  },

  // Cadastral Land Parcels & Parcel Intelligence (TNGIS / Tamil Nilam)
  getParcels: (district?: string, taluk?: string, village?: string, limit: number = 400) => {
    const params = new URLSearchParams();
    if (district) params.append('district', district);
    if (taluk) params.append('taluk', taluk);
    if (village) params.append('village', village);
    params.append('limit', String(limit));
    return fetchJson<any>(`/parcels?${params.toString()}`);
  },
  getParcelIntelligence: (surveyNo: string, district?: string, taluk?: string, village?: string) => {
    const params = new URLSearchParams();
    params.append('survey_no', surveyNo);
    if (district) params.append('district', district);
    if (taluk) params.append('taluk', taluk);
    if (village) params.append('village', village);
    return fetchJson<any>(`/parcels/intelligence?${params.toString()}`);
  },
  searchParcels: (query: string, district?: string, taluk?: string) => {
    const params = new URLSearchParams();
    params.append('q', query);
    if (district) params.append('district', district);
    if (taluk) params.append('taluk', taluk);
    return fetchJson<any>(`/parcels/search?${params.toString()}`);
  },

  // Executive Report
  generateReport: (scenarioId: string, focusTaluk: string, userRole: string) => fetchJson<ExecutiveReport>('/generate-report', {
    method: 'POST',
    body: JSON.stringify({ scenario_id: scenarioId, focus_taluk: focusTaluk, user_role: userRole })
  }),

  // Authorized Access (Land & Property Intelligence)
  getAuthorizationStatus: (role: string = 'Public User') => {
    return fetchJson<any>(`/authorized/status?role=${encodeURIComponent(role)}`);
  },
  getAuthorizedLandRecord: (surveyNo: string, district?: string, taluk?: string, village?: string, role: string = 'Authorized User') => {
    const params = new URLSearchParams();
    params.append('survey_no', surveyNo);
    if (district) params.append('district', district);
    if (taluk) params.append('taluk', taluk);
    if (village) params.append('village', village);
    params.append('role', role);
    return fetchJson<any>(`/authorized/land-records?${params.toString()}`);
  },
  calculateStampDuty: (guidelineValueInr: number, considerationValueInr?: number, propertyType?: string) => {
    return fetchJson<any>('/authorized/stamp-duty-calc', {
      method: 'POST',
      body: JSON.stringify({
        guideline_value_inr: guidelineValueInr,
        consideration_value_inr: considerationValueInr,
        property_type: propertyType || 'Agricultural'
      })
    });
  },
  recordAuditLog: (entry: { user_role: string; survey_no: string; district: string; taluk: string; village: string; access_type: string; data_source: string; status: string; reason: string; }) => {
    return fetchJson<any>('/authorized/audit-log', {
      method: 'POST',
      body: JSON.stringify(entry)
    });
  }
};
