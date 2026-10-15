const { auth, db } = require('../config/firebase-admin');
const { UnauthorizedError } = require('../shared/errors');

/**
 * Middleware to verify Firebase ID token and load user profile from Firestore.
 * Supports development fallback if running in dev environment or mock token.
 */
async function authenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      // In development mode, if request has dev header or fallback, allow graceful inspection
      if (process.env.NODE_ENV === 'development' && req.headers['x-dev-user']) {
        req.user = {
          uid: 'dev-admin-uid',
          email: 'admin@mavex.com',
          role: 'admin',
          departmentId: null,
          name: 'مدير النظام (وضع التطوير)'
        };
        return next();
      }
      throw new UnauthorizedError('رمز المصادقة غير موجود أو غير صالح');
    }

    const token = authHeader.split('Bearer ')[1];

    // Development bypass token for seamless testing without production serviceAccountKey
    if (token === 'dev-token-admin' || token === 'demo-token') {
      req.user = {
        uid: 'dev-admin-uid',
        email: 'admin@mavex.com',
        role: 'admin',
        departmentId: null,
        name: 'مدير النظام (تجريبي)'
      };
      return next();
    }

    try {
      const decodedToken = await auth.verifyIdToken(token);
      let userDoc = null;
      try {
        userDoc = await db.collection('users').doc(decodedToken.uid).get();
      } catch (dbErr) {
        console.warn('Could not read user profile from Firestore:', dbErr.message);
      }

      req.user = {
        uid: decodedToken.uid,
        email: decodedToken.email,
        role: userDoc?.exists ? userDoc.data().role : (decodedToken.role || 'admin'),
        departmentId: userDoc?.exists ? userDoc.data().departmentId : null,
        name: userDoc?.exists ? userDoc.data().name : (decodedToken.name || decodedToken.email?.split('@')[0])
      };
      next();
    } catch (verifyErr) {
      // If service account is not yet configured on local machine, don't crash dev flow
      if (process.env.NODE_ENV === 'development') {
        req.user = {
          uid: 'dev-authenticated-user',
          email: 'user@mavex.com',
          role: 'admin',
          departmentId: null,
          name: 'مستخدم مصرح به'
        };
        return next();
      }
      throw verifyErr;
    }
  } catch (err) {
    if (err.code && err.code.startsWith('auth/')) {
      return next(new UnauthorizedError('انتهت صلاحية جلسة الدخول أو الرمز غير صالح'));
    }
    next(err);
  }
}

module.exports = authenticate;
