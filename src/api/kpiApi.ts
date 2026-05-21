import httpClient from './httpClient';

export interface KpiItem {
  code: string;
  label: string;
  value: number;
  unit: string;
  formulaLabel: string;
  status: 'GOOD' | 'WARN' | 'BAD' | 'NOT_AVAILABLE';
  threshold: string;
  source: string;
}

export interface KpiResponse {
  applicationId: number;
  policyVersion: string;
  calculatedAt: string;
  dataQuality: string;
  items: KpiItem[];
}

export interface KpiSourceRequest {
  caf?: number;
  loyers?: number;
  ebitda?: number;
  serviceDette?: number;
  chargesFinancieres?: number;
  resultatNet?: number;
  actifCourant?: number;
  passifCourant?: number;
  capitauxPropres?: number;
  dettesTotales?: number;
  totalPassif?: number;
  valeurBien?: number;
  montantFinancement?: number;
  apport?: number;
  cotationBam?: number;
  incidentsPaiement?: number;
}

export const kpiApi = {
  getKpi: async (applicationId: number): Promise<KpiResponse> => {
    const response = await httpClient.get(`/applications/${applicationId}/kpi`);
    return response.data.data;
  },

  saveSource: async (applicationId: number, data: KpiSourceRequest): Promise<KpiResponse> => {
    const response = await httpClient.put(`/applications/${applicationId}/kpi/source`, data);
    return response.data.data;
  },

  recalculate: async (applicationId: number): Promise<KpiResponse> => {
    const response = await httpClient.post(`/applications/${applicationId}/kpi/recalculate`);
    return response.data.data;
  },

  // Mapper status KPI vers couleur
  getStatusColor: (status: string): string => {
    const colors: Record<string, string> = {
      'GOOD': 'text-green-600',
      'WARN': 'text-yellow-600',
      'BAD': 'text-red-600',
      'NOT_AVAILABLE': 'text-gray-400',
    };
    return colors[status] || 'text-gray-400';
  },
};
