import api from './api';

export const warehouseService = {
  async getItems() {
    try {
      const res = await api.get('/inventory/items');
      return res.data?.items || [];
    } catch (err) {
      console.warn('Inventory items API fallback:', err.message);
      return [];
    }
  },

  async getMovements(month) {
    try {
      const res = await api.get(`/inventory/movements${month ? `?month=${month}` : ''}`);
      return res.data?.movements || [];
    } catch (err) {
      console.warn('Inventory movements API fallback:', err.message);
      return [];
    }
  },

  async getWarehouses() {
    try {
      const res = await api.get('/inventory/warehouses');
      return res.data?.warehouses || [];
    } catch (err) {
      return [];
    }
  },

  async recordMovement(data) {
    const res = await api.post('/inventory/movements', data);
    return res.data?.movement;
  }
};

export default warehouseService;
