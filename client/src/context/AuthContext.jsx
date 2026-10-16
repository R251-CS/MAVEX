import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  updateProfile,
  signOut as firebaseSignOut 
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../services/firebase';

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
        return { uid: parsed.uid, email: parsed.email, displayName: parsed.name };
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

  // الاستماع لحدث انتهاء صلاحية الرمز الصادر من interceptor الشبكة
  useEffect(() => {
    const handleExpired = () => {
      localStorage.removeItem('mavex_auth_session');
      setUser(null);
      setProfile(null);
    };

    window.addEventListener('mavex:auth_expired', handleExpired);
    return () => window.removeEventListener('mavex:auth_expired', handleExpired);
  }, []);

  useEffect(() => {
    let unsubscribe = () => {};

    try {
      unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
        if (currentUser) {
          setUser(currentUser);
          const matchedSeed = SEED_ACCOUNTS.find(
            (acc) => acc.email.toLowerCase() === currentUser.email?.toLowerCase()
          );

          try {
            const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
            if (userDoc.exists()) {
              const data = userDoc.data();
              setProfile(data);
              localStorage.setItem('mavex_auth_session', JSON.stringify(data));
            } else if (matchedSeed) {
              const seedData = {
                uid: currentUser.uid,
                name: currentUser.displayName || matchedSeed.name,
                email: currentUser.email,
                role: matchedSeed.role,
                departmentId: matchedSeed.departmentId,
                title: matchedSeed.title
              };
              setProfile(seedData);
              localStorage.setItem('mavex_auth_session', JSON.stringify(seedData));
            } else {
              const defaultData = {
                uid: currentUser.uid,
                name: currentUser.displayName || currentUser.email,
                role: 'admin',
                departmentId: null
              };
              setProfile(defaultData);
              localStorage.setItem('mavex_auth_session', JSON.stringify(defaultData));
            }
          } catch (err) {
            console.warn('Profile fetch fallback:', err.message);
            if (matchedSeed) {
              const seedData = {
                uid: currentUser.uid,
                name: currentUser.displayName || matchedSeed.name,
                email: currentUser.email,
                role: matchedSeed.role,
                departmentId: matchedSeed.departmentId,
                title: matchedSeed.title
              };
              setProfile(seedData);
              localStorage.setItem('mavex_auth_session', JSON.stringify(seedData));
            }
          }
        }
        setLoading(false);
      }, (error) => {
        console.warn('Firebase Auth state listener:', error.message);
        setLoading(false);
      });
    } catch (e) {
      console.warn('Failed to attach auth listener:', e);
      setLoading(false);
    }

    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    const trimmedEmail = email.trim().toLowerCase();

    // 1. فحص إذا كان الحساب من الحسابات الجاهزة المعتمدة
    const matchedSeed = SEED_ACCOUNTS.find(
      (acc) => acc.email.toLowerCase() === trimmedEmail && acc.password === password
    );

    // إذا كان حساباً معتمداً، نفعله محلياً وفوراً
    if (matchedSeed) {
      const simulatedUser = {
        uid: `seed-${matchedSeed.departmentId || 'admin'}`,
        email: matchedSeed.email,
        displayName: matchedSeed.name
      };
      const simulatedProfile = {
        uid: simulatedUser.uid,
        name: matchedSeed.name,
        email: matchedSeed.email,
        role: matchedSeed.role,
        departmentId: matchedSeed.departmentId,
        title: matchedSeed.title
      };

      localStorage.setItem('mavex_auth_session', JSON.stringify(simulatedProfile));
      setUser(simulatedUser);
      setProfile(simulatedProfile);
      setLoading(false);

      return { user: simulatedUser };
    }

    // للمستخدمين الآخرين عبر Firebase
    try {
      const cred = await signInWithEmailAndPassword(auth, trimmedEmail, password);
      return cred;
    } catch (firebaseErr) {
      throw firebaseErr;
    }
  };

  const loginWithSeed = (account) => {
    const simulatedUser = {
      uid: `seed-${account.departmentId || 'admin'}-${Date.now()}`,
      email: account.email,
      displayName: account.name
    };
    const simulatedProfile = {
      uid: simulatedUser.uid,
      name: account.name,
      email: account.email,
      role: account.role,
      departmentId: account.departmentId,
      title: account.title
    };

    setUser(simulatedUser);
    setProfile(simulatedProfile);
    localStorage.setItem('mavex_auth_session', JSON.stringify(simulatedProfile));
    return simulatedUser;
  };

  const register = async (email, password, displayName, role = 'department_member') => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const newUser = userCredential.user;
    await updateProfile(newUser, { displayName });
    
    try {
      await setDoc(doc(db, 'users', newUser.uid), {
        name: displayName,
        email,
        role,
        departmentId: null,
        createdAt: serverTimestamp()
      });
    } catch (e) {
      console.warn('Firestore setDoc failed:', e.message);
    }
    return userCredential;
  };

  const logout = () => {
    localStorage.removeItem('mavex_auth_session');
    setUser(null);
    setProfile(null);
    return firebaseSignOut(auth).catch(() => {});
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

