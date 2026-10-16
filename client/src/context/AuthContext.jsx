import React, { createContext, useContext, useEffect, useState } from 'react';
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
    role: 'manager',
    departmentId: 'quality',
    title: 'مدير مراقبة الجودة'
  },
  {
    email: 'production@mavex.com',
    password: 'Production@123456',
    name: 'م. سامح عزت',
    role: 'manager',
    departmentId: 'production',
    title: 'مدير الإنتاج'
  },
  {
    email: 'maintenance@mavex.com',
    password: 'Maintenance@123456',
    name: 'م. ياسر عبد الله',
    role: 'manager',
    departmentId: 'maintenance',
    title: 'مدير الصيانة'
  },
  {
    email: 'safety@mavex.com',
    password: 'Safety@123456',
    name: 'أ. محمود فوزي',
    role: 'manager',
    departmentId: 'safety',
    title: 'مسؤول السلامة والصحة المهنية'
  }
];

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // استرجاع جلسة الدخول المخزنة محلياً إن وجدت
  useEffect(() => {
    const savedUser = localStorage.getItem('mavex_auth_session');
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        setUser({ uid: parsed.uid, email: parsed.email, displayName: parsed.name });
        setProfile(parsed);
      } catch (e) {
        console.error('Failed to parse saved auth session:', e);
      }
    }
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
              setProfile(userDoc.data());
            } else if (matchedSeed) {
              setProfile({
                uid: currentUser.uid,
                name: currentUser.displayName || matchedSeed.name,
                email: currentUser.email,
                role: matchedSeed.role,
                departmentId: matchedSeed.departmentId,
                title: matchedSeed.title
              });
            } else {
              setProfile({
                uid: currentUser.uid,
                name: currentUser.displayName || currentUser.email,
                role: 'admin',
                departmentId: null
              });
            }
          } catch (err) {
            console.warn('Profile fetch fallback:', err.message);
            if (matchedSeed) {
              setProfile({
                uid: currentUser.uid,
                name: currentUser.displayName || matchedSeed.name,
                email: currentUser.email,
                role: matchedSeed.role,
                departmentId: matchedSeed.departmentId,
                title: matchedSeed.title
              });
            } else {
              setProfile((prev) => prev || {
                uid: currentUser.uid,
                name: currentUser.displayName || currentUser.email,
                role: 'admin',
                departmentId: null
              });
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

    try {
      // محاولة تسجيل الدخول عبر Firebase Auth
      const cred = await signInWithEmailAndPassword(auth, trimmedEmail, password);
      return cred;
    } catch (firebaseErr) {
      // في حال لم يتم تفعيل Firebase Auth في Console أو حدث خطأ تكوين، ومطابقة الحساب التجريبي
      if (matchedSeed) {
        const simulatedUser = {
          uid: `seed-${matchedSeed.role}-${Date.now()}`,
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

        setUser(simulatedUser);
        setProfile(simulatedProfile);
        localStorage.setItem('mavex_auth_session', JSON.stringify(simulatedProfile));
        return { user: simulatedUser };
      }

      throw firebaseErr;
    }
  };

  const loginWithSeed = (account) => {
    const simulatedUser = {
      uid: `seed-${account.role}-${Date.now()}`,
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

  const register = async (email, password, displayName, role = 'user') => {
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

  const value = {
    user,
    profile,
    loading,
    login,
    loginWithSeed,
    register,
    logout,
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
