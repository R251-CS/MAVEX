import api from './api';
import violationsService from './violationsService';

export const safetyService = {
  async getIncidents(month) {
    try {
      const res = await api.get(`/safety/incidents${month ? `?month=${month}` : ''}`);
      return res.data?.incidents || [];
    } catch (err) {
      console.warn('Safety incidents API fallback:', err.message);
      return [];
    }
  },

  async addIncident(data) {
    const res = await api.post('/safety/incidents', data);
    const incident = res.data?.incident;

    // Cross-department pipeline: If audit found non-compliance, log to violations admin
    if (data.result === 'non_compliant' || data.severity === 'high') {
      try {
        await violationsService.recordViolation({
          code: `V-SAF-${Date.now().toString().slice(-4)}`,
          dept: data.area || 'السلامة والصحة المهنية',
          title: `مخالفة سلامة: ${data.item || 'بند تفتيش'}`,
          description: data.description || 'مخالفة قواعد السلامة وارتداء مهمات الوقاية',
          action: 'توجيه تنبيه وتأمين منطقة العمل فوراً',
          status: 'pending',
          month: data.month || new Date().toISOString().slice(0, 7),
          date: data.date || new Date().toISOString().slice(0, 10)
        });
      } catch (e) {
        console.warn('Safety cross-department violation notice:', e.message);
      }
    }

    return incident;
  }
};

export default safetyService;
