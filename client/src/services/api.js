import { auth } from './firebase';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';

/**
 * Standard HTTP client injecting Firebase ID Token and parsing responses
 */
async function request(endpoint, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  // Inject current Firebase user token if authenticated, or demo fallback
  if (auth.currentUser) {
    try {
      const token = await auth.currentUser.getIdToken();
      headers['Authorization'] = `Bearer ${token}`;
    } catch (e) {
      headers['Authorization'] = `Bearer dev-token-admin`;
    }
  } else {
    headers['Authorization'] = `Bearer dev-token-admin`;
  }

  const config = {
    ...options,
    headers
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, config);
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
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
