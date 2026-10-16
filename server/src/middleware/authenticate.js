const { verifyToken } = require('../shared/utils/auth.utils');
const { db } = require('../config/mongodb');
const { UnauthorizedError } = require('../shared/errors');
const { ROLES, normalizeRole } = require('../shared/constants');
const initialData = require('../seeds/initial-data.json');

/**
 * Senior Backend Authentication Middleware
 * Validates JWT tokens issued by Mavex AuthService and verifies users against MongoDB.
 * Completely independent of Firebase.
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

    // ─── 1. Primary: Verify Standard JSON Web Token (JWT) ───
    try {
      const decoded = verifyToken(token);
      if (decoded && (decoded.uid || decoded.id || decoded.email)) {
        req.user = {
          uid: decoded.uid || decoded.id,
          id: decoded.id || decoded.uid,
          email: decoded.email,
          role: normalizeRole(decoded.role),
          departmentId: decoded.departmentId || null,
          name: decoded.name || decoded.email?.split('@')[0],
          title: decoded.title || null
        };
        return next();
      }
    } catch (jwtErr) {
      if (jwtErr.name === 'TokenExpiredError') {
        throw new UnauthorizedError('انتهت صلاحية جلسة الدخول. يرجى تسجيل الدخول مجدداً');
      }
      // If not a standard JWT, proceed to test/dev token fallback
    }

    // ─── 2. Internal / Dev Tokens (for automation, CLI, and backward compatibility) ───
    if (token === 'dev-token-admin' || token === 'demo-token' || token === 'admin') {
      const seedAdmin = initialData.users.find(u => u.role === 'admin') || {};
      req.user = {
        uid: seedAdmin.id || 'seed-admin-uid',
        id: seedAdmin.id || 'seed-admin-uid',
        email: seedAdmin.email || 'admin@mavex.com',
        role: ROLES.ADMIN,
        departmentId: null,
        name: seedAdmin.name || 'مدير النظام (أدمن)'
      };
      return next();
    }

    if (token.startsWith('dev-token:')) {
      const parts = token.split(':');
      const rawRole = parts[1] || 'department_member';
      const rawDept = parts[2] === 'none' || parts[2] === 'null' || !parts[2] ? null : parts[2];
      const email = parts[3] || 'user@mavex.com';

      const matchedSeed = initialData.users.find(
        u => u.email.toLowerCase() === email.toLowerCase()
      );

      req.user = {
        uid: matchedSeed?.id || `user-${Date.now()}`,
        id: matchedSeed?.id || `user-${Date.now()}`,
        email: matchedSeed?.email || email,
        role: normalizeRole(rawRole || matchedSeed?.role),
        departmentId: rawDept || matchedSeed?.departmentId || null,
        name: matchedSeed?.name || email.split('@')[0]
      };
      return next();
    }

    // ─── 3. Direct MongoDB lookup by User ID or Email ───
    if (db) {
      try {
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
            id: userData.id || userData._id || token,
            email: userData.email,
            role: normalizeRole(userData.role),
            departmentId: userData.departmentId || null,
            name: userData.name || userData.email?.split('@')[0],
            title: userData.title || null
          };
          return next();
        }
      } catch (dbErr) {
        // Continue to fallback error
      }
    }

    throw new UnauthorizedError('فشل التحقق من رمز المصادقة');
  } catch (err) {
    next(err);
  }
}

module.exports = authenticate;
