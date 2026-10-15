import api from './api';
import { mockDashboardData } from '../mocks/dashboard.mock';

export const dashboardService = {
  async getDashboard(month) {
    try {
      const res = await api.get(`/dashboard?month=${month}`);
      return res.data;
    } catch (err) {
      console.warn('Backend API unavailable or error occurred, using mock dashboard data:', err.message);
      return mockDashboardData;
    }
  }
};
