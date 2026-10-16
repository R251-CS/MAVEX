import api from './api';

export const productionService = {
  async getOrders(month) {
    try {
      const res = await api.get(`/production/orders${month ? `?month=${month}` : ''}`);
      return res.data?.orders || [];
    } catch (err) {
      console.warn('Production orders API fallback:', err.message);
      return [];
    }
  },

  async getProducts() {
    try {
      const res = await api.get('/production/products');
      return res.data?.products || [];
    } catch (err) {
      return [];
    }
  },

  async createOrder(data) {
    const res = await api.post('/production/orders', data);
    return res.data?.order;
  },

  async updateStage(orderId, stageKey, stageData) {
    const payload = typeof stageData === 'object' ? stageData : { status: stageData };
    const res = await api.patch(`/production/orders/${orderId}/stages/${stageKey}`, payload);
    return res.data?.order;
  }
};

export default productionService;
