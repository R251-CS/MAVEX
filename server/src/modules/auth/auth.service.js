const authRepository = require('./auth.repository');
const { hashPassword, comparePassword, generateToken } = require('../../shared/utils/auth.utils');
const { UnauthorizedError, BadRequestError, NotFoundError } = require('../../shared/errors');
const { normalizeRole } = require('../../shared/constants');

/**
 * Standard seed passwords map for seamless backward compatibility
 */
const SEED_FALLBACK_PASSWORDS = {
  'admin@mavex.com': ['admin123', 'Admin@123456'],
  'quality@mavex.com': ['qual123', 'Quality@123456'],
  'production@mavex.com': ['prod123', 'Production@123456'],
  'maintenance@mavex.com': ['maint123', 'Maintenance@123456'],
  'safety@mavex.com': ['safe123', 'Safety@123456'],
  'finance@mavex.com': ['fin123', 'Finance@123456'],
  'warehouse@mavex.com': ['ware123', 'Warehouse@123456'],
  'office@mavex.com': ['office123', 'Office@123456']
};

class AuthService {
  async login(email, password) {
    if (!email || !password) {
      throw new BadRequestError('يرجى إدخال البريد الإلكتروني وكلمة المرور');
    }

    const cleanEmail = email.trim().toLowerCase();
    const user = await authRepository.findUserByEmail(cleanEmail);

    if (!user) {
      throw new UnauthorizedError('البريد الإلكتروني أو كلمة المرور غير صحيحة');
    }

    if (user.isActive === false) {
      throw new UnauthorizedError('هذا الحساب تم تعطيله. يرجى مراجعة إدارة النظام');
    }

    let isMatch = false;

    // 1. Verify bcrypt hash from MongoDB
    if (user.passwordHash) {
      isMatch = await comparePassword(password, user.passwordHash);
    }

    // 2. Fallback check for initial setup or legacy seed passwords
    if (!isMatch && SEED_FALLBACK_PASSWORDS[cleanEmail]) {
      const allowedPasswords = SEED_FALLBACK_PASSWORDS[cleanEmail];
      if (allowedPasswords.includes(password)) {
        isMatch = true;
        // Migrate/update hash in MongoDB immediately
        const newHash = await hashPassword(password);
        await authRepository.updateUser(user.id, { passwordHash: newHash });
      }
    }

    if (!isMatch) {
      throw new UnauthorizedError('البريد الإلكتروني أو كلمة المرور غير صحيحة');
    }

    const userPayload = {
      uid: user.id || user._id,
      id: user.id || user._id,
      email: user.email,
      name: user.name,
      role: normalizeRole(user.role),
      departmentId: user.departmentId || null,
      title: user.title || null
    };

    const token = generateToken(userPayload);

    return {
      token,
      user: userPayload
    };
  }

  async register(data) {
    const { email, password, name, role = 'department_member', departmentId = null, title = 'موظف' } = data;

    if (!email || !password || !name) {
      throw new BadRequestError('البريد الإلكتروني، الاسم، وكلمة المرور مطلوبة');
    }

    if (password.length < 6) {
      throw new BadRequestError('كلمة المرور يجب ألا تقل عن 6 أحرف');
    }

    const cleanEmail = email.trim().toLowerCase();
    const existing = await authRepository.findUserByEmail(cleanEmail);
    if (existing) {
      throw new BadRequestError('البريد الإلكتروني مسجل بالفعل');
    }

    const passwordHash = await hashPassword(password);
    const newUser = await authRepository.createUser({
      email: cleanEmail,
      passwordHash,
      name: name.trim(),
      role: normalizeRole(role),
      departmentId: departmentId || null,
      title: title.trim()
    });

    const userPayload = {
      uid: newUser.id,
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role,
      departmentId: newUser.departmentId,
      title: newUser.title
    };

    const token = generateToken(userPayload);

    return {
      token,
      user: userPayload
    };
  }

  async getMe(userId) {
    if (!userId) {
      throw new UnauthorizedError('المستخدم غير مصرح');
    }

    const user = await authRepository.findUserById(userId);
    if (!user) {
      throw new NotFoundError('لم يتم العثور على بيانات المستخدم');
    }

    return {
      uid: user.id || user._id,
      id: user.id || user._id,
      email: user.email,
      name: user.name,
      role: normalizeRole(user.role),
      departmentId: user.departmentId || null,
      title: user.title || null,
      isActive: user.isActive !== false
    };
  }
}

module.exports = new AuthService();
