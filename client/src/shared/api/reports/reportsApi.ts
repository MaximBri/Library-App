import { API_URL } from '../axios';

export interface GetBookPopularityReportParams {
  startDate: string;
  endDate: string;
  status: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

export const reportsApi = {
  getBookPopularityReport: async (params: GetBookPopularityReportParams) => {
    const queryParams = new URLSearchParams(
      Object.keys(params).reduce((acc, key) => {
        acc.append(key, params[key as keyof GetBookPopularityReportParams]);
        return acc;
      }, new URLSearchParams())
    );

    window.open(
      `${API_URL}/api/reports/book-popularity?${queryParams}&format=pdf`,
      '_blank'
    );
  },
};
