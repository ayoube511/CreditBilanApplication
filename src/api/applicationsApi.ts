import httpClient from './httpClient';

export interface ApplicationListItem {
  id: number;
  reference: string;
  clientName: string;
  status: string;
  segment: string;
  sector: string;
  amountRequestedMad: number;
  score: number;
  creditClass: string;
  createdAt: string;
}

export interface ApplicationDetail {
  id: number;
  reference: string;
  status: string;
  financingType: string;
  segment: string;
  sector: string;
  amountRequestedMad: number;
  score: number;
  creditClass: string;
  defaultProbabilityPct: number;
  decision: string;
  decisionReason: string;
  applicationDate: string;
  createdAt: string;
  counterparty: {
    id: number;
    legalName: string;
    segment: string;
    sector: string;
  };
  createdBy: {
    id: number;
    fullName: string;
    email: string;
  };
}

export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

export interface ApplicationFilters {
  status?: string;
  segment?: string;
  sector?: string;
  q?: string;
  page?: number;
  size?: number;
}

export const applicationsApi = {
  getAll: async (filters: ApplicationFilters = {}): Promise<PageResponse<ApplicationListItem>> => {
    const params = new URLSearchParams();
    if (filters.status && filters.status !== 'all') params.append('status', filters.status);
    if (filters.segment && filters.segment !== 'all') params.append('segment', filters.segment);
    if (filters.sector && filters.sector !== 'all') params.append('sector', filters.sector);
    if (filters.q) params.append('q', filters.q);
    params.append('page', String(filters.page || 0));
    params.append('size', String(filters.size || 10));

    const response = await httpClient.get(`/applications?${params.toString()}`);
    return response.data.data;
  },

  getById: async (id: number): Promise<ApplicationDetail> => {
    const response = await httpClient.get(`/applications/${id}`);
    return response.data.data;
  },

  create: async (data: {
    clientName: string;
    segment?: string;
    sector?: string;
    financingType?: string;
    amountRequestedMad?: number;
  }): Promise<ApplicationDetail> => {
    const response = await httpClient.post('/applications', data);
    return response.data.data;
  },

  // Mapper le statut backend vers frontend
  mapStatus: (status: string): string => {
    const map: Record<string, string> = {
      'DRAFT': 'En cours',
      'IN_REVIEW': 'En cours',
      'WAITING_DOCUMENTS': 'En attente',
      'SCORING_DONE': 'En cours',
      'APPROVED': 'Approuvé',
      'REJECTED': 'Refusé',
      'CANCELLED': 'Refusé',
    };
    return map[status] || status;
  },

  // Mapper segment backend vers frontend
  mapSegment: (segment: string): string => {
    const map: Record<string, string> = {
      'PME': 'PME',
      'ETI': 'Corporate',
      'Startup': 'TPE',
      'Corporate': 'Corporate',
    };
    return map[segment] || segment;
  },
};
