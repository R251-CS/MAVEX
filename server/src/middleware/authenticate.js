const { auth, db, isDbConfigured } = require('../config/firebase-admin');
const { UnauthorizedError } = require('../shared/errors');
const { ROLES, normalizeRole } = require('../shared/constants');
const initialData = require('../seeds/initial-data.json');

/**
 * Middleware to verify Firebase ID token or authorized dev token,
 * loading user profile with normalized role and department scope.
 */
async function authenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('رمز المصادقة غير موجود أو غير صالح');
    }

    const token = authHeader.split('Bearer ')[1].trim();
    if (!token) {
      throw new UnauthorizedError('رمز المصادقة فارغ');
    }

    // ─── 1. Development & Demo Tokens ───
    if (token === 'dev-token-admin' || token === 'demo-token' || token === 'admin') {
      const seedAdmin = initialData.users.find(u => u.role === 'admin') || {};
      req.user = {
        uid: seedAdmin.id || 'seed-admin-uid',
        email: seedAdmin.email || 'admin@mavex.com',
        role: ROLES.ADMIN,
        departmentId: null,
        name: seedAdmin.name || 'مدير النظام (أدمن)'
      };
      return next();
    }

    // Structured dev token: dev-token:<role>:<departmentId>:<email>
    if (token.startsWith('dev-token:')) {
      const parts = token.split(':');
      const rawRole = parts[1] || 'department_member';
      const rawDept = parts[2] === 'none' || parts[2] === 'null' || !parts[2] ? null : parts[2];
      const email = parts[3] || 'user@mavex.com';

      const matchedSeed = initialData.users.find(
        u => u.email.toLowerCase() === email.toLowerCase()
      );

      req.user = {
        uid: matchedSeed?.id || `seed-${Date.now()}`,
        email: matchedSeed?.email || email,
        role: normalizeRole(rawRole || matchedSeed?.role),
        departmentId: rawDept || matchedSeed?.departmentId || null,
        name: matchedSeed?.name || email.split('@')[0]
      };
      return next();
    }

    // ─── 2. Direct MongoDB User Session Token Verification ───
    if (db) {
      try {
        // Check if token matches a user ID or email in MongoDB
        let userDoc = await db.collection('users').doc(token).get();
        if (!userDoc.exists) {
          const snapshot = await db.collection('users').where('email', '==', token.toLowerCase()).get();
          if (!snapshot.empty) {
            userDoc = snapshot.docs[0];
          }
        }

        if (userDoc && userDoc.exists) {
          const userData = userDoc.data();
          req.user = {
            uid: userData.id || userData._id || token,
            email: userData.email,
            role: normalizeRole(userData.role),
            departmentId: userData.departmentId || null,
            name: userData.name || userData.email?.split('@')[0]
          };
          return next();
        }
      } catch (dbErr) {
        console.warn('MongoDB auth lookup notice:', dbErr.message);
      }
    }

    // ─── 3. Firebase Auth Fallback (if configured) ───
    if (auth && typeof auth.verifyIdToken === 'function') {
      try {
        const decodedToken = await auth.verifyIdToken(token);
        let userProfile = null;

        if (db) {
          try {
            const userDoc = await db.collection('users').doc(decodedToken.uid).get();
            if (userDoc.exists) {
              userProfile = userDoc.data();
            }
          } catch (dbErr) {
            console.warn('User profile fetch notice:', dbErr.message);
          }
        }

        if (!userProfile) {
          userProfile = initialData.users.find(
            u => u.email?.toLowerCase() === decodedToken.email?.toLowerCase() || u.id === decodedToken.uid
          );
        }

        req.user = {
          uid: decodedToken.uid,
          email: decodedToken.email,
          role: normalizeRole(userProfile?.role || decodedToken.role || decodedToken.admin ? ROLES.ADMIN : ROLES.DEPARTMENT_MEMBER),
          departmentId: userProfile?.departmentId || decodedToken.departmentId || null,
          name: userProfile?.name || decodedToken.name || decodedToken.email?.split('@')[0]
        };
        return next();
      } catch (verifyErr) {
        if (verifyErr.code === 'auth/id-token-expired') {
          throw new UnauthorizedError('انتهت صلاحية جلسة الدخول. يرجى تسجيل الدخول مجدداً');
        }
        if (verifyErr.code && verifyErr.code.startsWith('auth/')) {
          throw new UnauthorizedError('رمز المصادقة غير صالح أو تم إلغاؤه');
        }
      }
    }

    // Fallback seed user match
    const seedUser = initialData.users.find(
      u => u.email.toLowerCase() === token.toLowerCase() || u.id === token
    );
    if (seedUser) {
      req.user = {
        uid: seedUser.id,
        email: seedUser.email,
        role: normalizeRole(seedUser.role),
        departmentId: seedUser.departmentId || null,
        name: seedUser.name
      };
      return next();
    }

    throw new UnauthorizedError('فشل التحقق من رمز المصادقة');
  } catch (err) {
    next(err);
  }
}

module.exports = authenticate;

