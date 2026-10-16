import api from './api';

export const employeesService = {
  async getEmployeesByDepartment(departmentId, month) {
    try {
      const res = await api.get(`/employees?departmentId=${departmentId}${month ? `&month=${month}` : ''}`);
      return res.data?.employees || [];
    } catch (err) {
      console.warn(`Employees API fallback for ${departmentId}:`, err.message);
      return [];
    }
  },

  async createEmployee(data) {
    const res = await api.post('/employees', data);
    return res.data?.employee;
  },

  async deleteEmployee(id) {
    const res = await api.delete(`/employees/${id}`);
    return res;
  }
};

export default employeesService;
