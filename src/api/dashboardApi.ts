import httpClient from './httpClient';

export interface DashboardSummary {
  totalApplications: number;
  approved: number;
  rejected: number;
  inReview: number;
  draft: number;
  scoringDone: number;
  totalAmountMad: number;
  averageScore: number;
}

export interface SectorDistribution {
  sector: string;
  count: number;
  totalAmount: number;
}

export interface PortfolioStats {
  bySector: SectorDistribution[];
  bySegment: { segment: string; count: number }[];
  byStatus: Record<string, number>;
  byClass: Record<string, number>;
  approvalRate: number;
}

export const dashboardApi = {
  getSummary: async (): Promise<DashboardSummary> => {
    const response = await httpClient.get('/dashboard/summary');
    return response.data.data;
  },

  getSectorDistribution: async (): Promise<SectorDistribution[]> => {
    const response = await httpClient.get('/dashboard/sector-distribution');
    return response.data.data;
  },

  getPortfolioStats: async (): Promise<PortfolioStats> => {
    const response = await httpClient.get('/dashboard/portfolio');
    return response.data.data;
  },
};
