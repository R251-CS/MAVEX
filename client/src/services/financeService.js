import api from './api';

export const financeService = {
  async getPayroll(month) {
    try {
      const res = await api.get(`/finance/payroll${month ? `?month=${month}` : ''}`);
      return res.data?.payroll || [];
    } catch (err) {
      console.warn('Finance payroll API notice:', err.message);
      return [];
    }
  },

  async getParties() {
    try {
      const res = await api.get('/finance/parties');
      return res.data?.parties || [];
    } catch (err) {
      return [];
    }
  },

  async getTransactions(month) {
    try {
      const res = await api.get(`/finance/transactions${month ? `?month=${month}` : ''}`);
      return res.data?.transactions || [];
    } catch (err) {
      console.warn('Finance transactions API notice:', err.message);
      return [];
    }
  },

  async createTransaction(data) {
    const res = await api.post('/finance/transactions', data);
    return res.data?.transaction;
  },

  async createParty(data) {
    const res = await api.post('/finance/parties', data);
    return res.data?.party;
  }
};

export default financeService;
