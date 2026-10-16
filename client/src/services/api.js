import { auth } from './firebase';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';

/**
 * Standard HTTP client injecting Firebase ID Token or valid session dev-token.
 * Never bypasses authentication for unauthenticated callers.
 */
async function request(endpoint, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  // 1. If local session exists, use the structured session token first
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

  // 2. If no local session token was set and Firebase user is signed in, inject fresh ID Token
  if (!headers['Authorization'] && auth.currentUser) {
    try {
      const token = await auth.currentUser.getIdToken(false);
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    } catch (e) {
      console.warn('Could not retrieve Firebase ID token:', e.message);
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
      // Clear invalid session if rejected by server
      if (typeof window !== 'undefined') {
        const isAuthPage = window.location.pathname === '/login' || window.location.pathname === '/register';
        if (!isAuthPage) {
          localStorage.removeItem('mavex_auth_session');
          // Dispatch custom event for AuthContext to pick up and redirect cleanly
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

