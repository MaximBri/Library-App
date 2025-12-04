import type { GetBookPopularityReportParams } from "@/shared/api/reports/reportsApi";

export const defaultReportParams: GetBookPopularityReportParams = {
  startDate: '2024-01-01T00:00:00Z',
  endDate: '2025-11-25T00:00:00Z',
  status: 'returned',
  sortBy: 'reservations',
  sortOrder: 'asc',
};