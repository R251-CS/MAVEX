const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';

export const authService = {
  /**
   * Log in user via backend API using MongoDB credentials
   */
  async login(email, password) {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.message || 'فشل تسجيل الدخول. يرجى التحقق من البريد وكلمة المرور');
    }

    return data.data; // { token, user }
  },

  /**
   * Register new user in MongoDB via backend API
   */
  async register(userData) {
    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.message || 'فشل إنشاء الحساب. يرجى المحاولة لاحقاً');
    }

    return data.data; // { token, user }
  },

  /**
   * Get fresh authenticated user profile
   */
  async getMe(token) {
    const res = await fetch(`${BASE_URL}/auth/me`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.message || 'فشل جلب بيانات المستخدم');
    }

    return data.data.user;
  }
};
