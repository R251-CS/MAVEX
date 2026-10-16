import api from './api';

export const maintenanceService = {
  async getTickets(month) {
    try {
      const res = await api.get(`/maintenance/tickets${month ? `?month=${month}` : ''}`);
      return res.data?.tickets || [];
    } catch (err) {
      console.warn('Maintenance tickets API fallback:', err.message);
      return [];
    }
  },

  async createTicket(data) {
    const res = await api.post('/maintenance/tickets', data);
    return res.data?.ticket;
  },

  async updateTicketStatus(id, status) {
    const res = await api.patch(`/maintenance/tickets/${id}/status`, { status });
    return res.data?.ticket;
  }
};

export default maintenanceService;
