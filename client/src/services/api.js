const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';

/**
 * Standard HTTP client injecting Mavex JWT Token or session token.
 * Completely independent of Firebase.
 */
async function request(endpoint, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  // 1. Primary: Use JWT token from localStorage
  const jwtToken = localStorage.getItem('mavex_token');
  if (jwtToken) {
    headers['Authorization'] = `Bearer ${jwtToken}`;
  } else {
    // 2. Fallback: Structured session token if available
    try {
      const savedSessionStr = localStorage.getItem('mavex_auth_session');
      if (savedSessionStr) {
        const session = JSON.parse(savedSessionStr);
        if (session && session.email) {
          const role = session.role || 'department_member';
          const dept = session.departmentId || 'none';
          const email = session.email;
          headers['Authorization'] = `Bearer dev-token:${role}:${dept}:${email}`;
        }
      }
    } catch (e) {
      console.warn('Failed to parse local auth session token:', e);
    }
  }

  const config = {
    ...options,
    headers
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, config);
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    // Stale or revoked token handling
    if (response.status === 401) {
      if (typeof window !== 'undefined') {
        const isAuthPage = window.location.pathname === '/login' || window.location.pathname === '/register';
        if (!isAuthPage) {
          localStorage.removeItem('mavex_token');
          localStorage.removeItem('mavex_auth_session');
          window.dispatchEvent(new CustomEvent('mavex:auth_expired'));
        }
      }
    }

    const error = new Error(data.message || 'حدث خطأ أثناء الاتصال بالخادم');
    error.status = response.status;
    error.details = data.details || null;
    throw error;
  }

  return data;
}

export const api = {
  get: (url, options) => request(url, { ...options, method: 'GET' }),
  post: (url, body, options) => request(url, { ...options, method: 'POST', body: JSON.stringify(body) }),
  patch: (url, body, options) => request(url, { ...options, method: 'PATCH', body: JSON.stringify(body) }),
  delete: (url, options) => request(url, { ...options, method: 'DELETE' })
};

export default api;
