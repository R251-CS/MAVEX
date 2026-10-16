import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { authService } from '../services/authService';

export const DEPARTMENT_ROUTES = {
  production: '/production',
  quality: '/quality',
  maintenance: '/maintenance',
  safety: '/safety',
  planning_warehouse: '/planning-warehouse',
  warehouse: '/planning-warehouse',
  planning: '/planning-warehouse',
  technical_office: '/technical-office',
  finance: '/finance'
};

export const getDepartmentRoute = (departmentId) => {
  if (!departmentId) return '/';
  const clean = String(departmentId).toLowerCase();
  return DEPARTMENT_ROUTES[clean] || '/';
};

export const SEED_ACCOUNTS = [
  {
    email: 'admin@mavex.com',
    password: 'Admin@123456',
    name: 'مدير النظام (أدمن)',
    role: 'admin',
    departmentId: null,
    title: 'الإدارة العليا'
  },
  {
    email: 'quality@mavex.com',
    password: 'Quality@123456',
    name: 'م. طارق محمود',
    role: 'department_manager',
    departmentId: 'quality',
    title: 'مدير مراقبة الجودة'
  },
  {
    email: 'production@mavex.com',
    password: 'Production@123456',
    name: 'م. سامح عزت',
    role: 'department_manager',
    departmentId: 'production',
    title: 'مدير الإنتاج'
  },
  {
    email: 'maintenance@mavex.com',
    password: 'Maintenance@123456',
    name: 'م. ياسر عبد الله',
    role: 'department_manager',
    departmentId: 'maintenance',
    title: 'مدير الصيانة'
  },
  {
    email: 'safety@mavex.com',
    password: 'Safety@123456',
    name: 'أ. محمود فوزي',
    role: 'department_manager',
    departmentId: 'safety',
    title: 'مسؤول السلامة والصحة المهنية'
  },
  {
    email: 'finance@mavex.com',
    password: 'Finance@123456',
    name: 'أ. حسام فوزي',
    role: 'department_manager',
    departmentId: 'finance',
    title: 'مدير الحسابات والمالية'
  },
  {
    email: 'warehouse@mavex.com',
    password: 'Warehouse@123456',
    name: 'م. كريم سامي',
    role: 'department_manager',
    departmentId: 'warehouse',
    title: 'مدير التخطيط والمستودعات'
  },
  {
    email: 'office@mavex.com',
    password: 'Office@123456',
    name: 'م. أحمد حسن',
    role: 'department_manager',
    departmentId: 'technical_office',
    title: 'مدير المكتب الفني'
  }
];

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // تهيئة الحالة مباشرة من الجلسة المخزنة محلياً لتفادي وميض إعادة التوجيه
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('mavex_auth_session');
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        return { uid: parsed.id || parsed.uid, email: parsed.email, displayName: parsed.name };
      }
    } catch (e) {
      console.error('Failed to parse saved auth session:', e);
    }
    return null;
  });

  const [profile, setProfile] = useState(() => {
    try {
      const savedUser = localStorage.getItem('mavex_auth_session');
      if (savedUser) {
        return JSON.parse(savedUser);
      }
    } catch (e) {
      console.error('Failed to parse saved profile:', e);
    }
    return null;
  });

  const [loading, setLoading] = useState(false);

  // التحقق من صلاحية الجلسة عند بدء التطبيق
  useEffect(() => {
    const token = localStorage.getItem('mavex_token');
    if (token) {
      authService.getMe(token)
        .then((freshUser) => {
          if (freshUser) {
            setUser({ uid: freshUser.id || freshUser.uid, email: freshUser.email, displayName: freshUser.name });
            setProfile(freshUser);
            localStorage.setItem('mavex_auth_session', JSON.stringify(freshUser));
          }
        })
        .catch(() => {
          // Token expired or invalid
          console.warn('Session check failed or expired');
        });
    }
  }, []);

  // الاستماع لحدث انتهاء صلاحية الرمز الصادر من interceptor الشبكة
  useEffect(() => {
    const handleExpired = () => {
      localStorage.removeItem('mavex_token');
      localStorage.removeItem('mavex_auth_session');
      setUser(null);
      setProfile(null);
    };

    window.addEventListener('mavex:auth_expired', handleExpired);
    return () => window.removeEventListener('mavex:auth_expired', handleExpired);
  }, []);

  /**
   * Log in user using native MongoDB backend authentication
   */
  const login = async (email, password) => {
    const trimmedEmail = email.trim().toLowerCase();

    try {
      const result = await authService.login(trimmedEmail, password);
      const authUser = result.user;
      const token = result.token;

      localStorage.setItem('mavex_token', token);
      localStorage.setItem('mavex_auth_session', JSON.stringify(authUser));

      setUser({ uid: authUser.id || authUser.uid, email: authUser.email, displayName: authUser.name });
      setProfile(authUser);
      setLoading(false);

      return { user: authUser, token };
    } catch (apiErr) {
      // Offline fallback for demo seed accounts if backend is unreachable
      const matchedSeed = SEED_ACCOUNTS.find(
        (acc) => acc.email.toLowerCase() === trimmedEmail && (acc.password === password || password === 'admin123')
      );

      if (matchedSeed && apiErr.message.includes('fetch')) {
        const simulatedProfile = {
          uid: `seed-${matchedSeed.departmentId || 'admin'}`,
          id: `seed-${matchedSeed.departmentId || 'admin'}`,
          name: matchedSeed.name,
          email: matchedSeed.email,
          role: matchedSeed.role,
          departmentId: matchedSeed.departmentId,
          title: matchedSeed.title
        };

        localStorage.setItem('mavex_auth_session', JSON.stringify(simulatedProfile));
        setUser({ uid: simulatedProfile.uid, email: simulatedProfile.email, displayName: simulatedProfile.name });
        setProfile(simulatedProfile);
        setLoading(false);

        return { user: simulatedProfile };
      }

      throw apiErr;
    }
  };

  /**
   * Quick login helper for development/testing
   */
  const loginWithSeed = (account) => {
    const simulatedProfile = {
      uid: `seed-${account.departmentId || 'admin'}`,
      id: `seed-${account.departmentId || 'admin'}`,
      name: account.name,
      email: account.email,
      role: account.role,
      departmentId: account.departmentId,
      title: account.title
    };

    setUser({ uid: simulatedProfile.uid, email: simulatedProfile.email, displayName: simulatedProfile.name });
    setProfile(simulatedProfile);
    localStorage.setItem('mavex_auth_session', JSON.stringify(simulatedProfile));
    return simulatedProfile;
  };

  /**
   * Register a new user in MongoDB
   */
  const register = async (email, password, displayName, role = 'department_member', departmentId = null) => {
    const result = await authService.register({
      email,
      password,
      name: displayName,
      role,
      departmentId
    });

    const authUser = result.user;
    const token = result.token;

    localStorage.setItem('mavex_token', token);
    localStorage.setItem('mavex_auth_session', JSON.stringify(authUser));

    setUser({ uid: authUser.id || authUser.uid, email: authUser.email, displayName: authUser.name });
    setProfile(authUser);

    return result;
  };

  /**
   * Log out
   */
  const logout = () => {
    localStorage.removeItem('mavex_token');
    localStorage.removeItem('mavex_auth_session');
    setUser(null);
    setProfile(null);
    return Promise.resolve();
  };

  /**
   * Check if current user has permission for a specific role or department
   */
  const canAccess = useCallback((allowedRoles = [], requiredDept = null) => {
    if (!profile) return false;
    if (profile.role === 'admin') return true;

    if (allowedRoles.length > 0) {
      const normalizedUserRole = (profile.role === 'manager' ? 'department_manager' : profile.role);
      const normalizedAllowed = allowedRoles.map(r => (r === 'manager' ? 'department_manager' : r));
      if (!normalizedAllowed.includes(normalizedUserRole)) {
        return false;
      }
    }

    if (requiredDept) {
      if (profile.departmentId && profile.departmentId !== requiredDept) {
        return false;
      }
    }

    return true;
  }, [profile]);

  const value = {
    user,
    profile,
    loading,
    login,
    loginWithSeed,
    register,
    logout,
    canAccess,
    isAdmin: profile?.role === 'admin',
    isAuthenticated: !!user,
    departmentId: profile?.departmentId || null
  };

  if (loading && !user && !localStorage.getItem('mavex_auth_session')) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#0a0f1d',
        color: '#f8fafc',
        fontFamily: 'Cairo, sans-serif'
      }}>
        <h2>جاري التحميل...</h2>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
