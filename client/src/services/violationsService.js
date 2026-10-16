import api from './api';

export const violationsService = {
  async getViolations(month) {
    try {
      const res = await api.get(`/violations${month ? `?month=${month}` : ''}`);
      return res.data?.violations || [];
    } catch (err) {
      console.warn('Violations API fallback:', err.message);
      return [];
    }
  },

  async recordViolation(data) {
    const res = await api.post('/violations', data);
    return res.data?.violation;
  },

  async updateViolation(id, updates) {
    const res = await api.patch(`/violations/${id}`, updates);
    return res.data?.violation;
  }
};

export default violationsService;
