import api from './api';
import violationsService from './violationsService';

export const qualityService = {
  async getQualityEvents(month) {
    try {
      const res = await api.get(`/quality/events${month ? `?month=${month}` : ''}`);
      return res.data?.events || [];
    } catch (err) {
      console.warn('Quality events API fallback:', err.message);
      return [];
    }
  },

  async addQualityEvent(data) {
    const res = await api.post('/quality/events', data);
    const event = res.data?.event;

    // Cross-department pipeline: If inspection failed, automatically log non-conformance violation
    if (data.status === 'rejected' || data.isViolation) {
      try {
        await violationsService.recordViolation({
          code: `V-QC-${Date.now().toString().slice(-4)}`,
          dept: data.department || 'مراقبة الجودة والإنتاج',
          title: `حيود جودة: ${data.itemOrMachine || data.item || 'عينة تشغيل'}`,
          description: data.issue || data.notes || 'عدم مطابقة لمعايير الفحص الفني ISO-9001',
          action: 'عزل الدفعة وإعادة الفحص الفني',
          status: 'pending',
          month: data.month || new Date().toISOString().slice(0, 7),
          date: data.date || new Date().toISOString().slice(0, 10)
        });
      } catch (violationErr) {
        console.warn('Cross-department violation log notice:', violationErr.message);
      }
    }

    return event;
  }
};

export default qualityService;
