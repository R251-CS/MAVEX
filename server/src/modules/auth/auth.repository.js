const { mongoose, db } = require('../../config/mongodb');
const { hashPassword } = require('../../shared/utils/auth.utils');

/**
 * Returns the raw MongoDB collection for users
 */
function getUsersCollection() {
  if (mongoose.connection && mongoose.connection.readyState === 1 && mongoose.connection.db) {
    return mongoose.connection.db.collection('users');
  }
  return null;
}

/**
 * Find user by email (case-insensitive)
 */
async function findUserByEmail(email) {
  if (!email) return null;
  const col = getUsersCollection();
  if (col) {
    const cleanEmail = email.trim().toLowerCase();
    const user = await col.findOne({
      email: { $regex: new RegExp(`^${cleanEmail.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') }
    });
    if (user) {
      return { ...user, id: user.id || user._id.toString() };
    }
  }
  return null;
}

/**
 * Find user by id or _id
 */
async function findUserById(id) {
  if (!id) return null;
  const col = getUsersCollection();
  if (col) {
    let user = await col.findOne({ id: String(id) });
    if (!user) {
      try {
        const { ObjectId } = require('mongodb');
        if (ObjectId.isValid(id)) {
          user = await col.findOne({ _id: new ObjectId(id) });
        }
      } catch (e) {
        // invalid ObjectId format
      }
    }
    if (user) {
      return { ...user, id: user.id || user._id.toString() };
    }
  }
  return null;
}

/**
 * Create a new user with passwordHash
 */
async function createUser(userData) {
  const col = getUsersCollection();
  if (!col) {
    throw new Error('Database connection is not available');
  }

  const cleanEmail = userData.email.trim().toLowerCase();
  const id = userData.id || `user-${Date.now()}`;
  const now = new Date().toISOString();

  const userDoc = {
    _id: id,
    id: id,
    email: cleanEmail,
    passwordHash: userData.passwordHash,
    name: userData.name || cleanEmail.split('@')[0],
    role: userData.role || 'department_member',
    departmentId: userData.departmentId || null,
    title: userData.title || 'موظف',
    isActive: true,
    createdAt: now,
    updatedAt: now
  };

  await col.insertOne(userDoc);
  return userDoc;
}

/**
 * Update user document
 */
async function updateUser(id, updateData) {
  const col = getUsersCollection();
  if (!col) return null;

  const now = new Date().toISOString();
  await col.updateOne(
    { $or: [{ id: String(id) }, { _id: String(id) }] },
    { $set: { ...updateData, updatedAt: now } }
  );

  return findUserById(id);
}

/**
 * Ensures all default system seed accounts exist in MongoDB with valid hashed passwords
 */
async function ensureDefaultUsersWithPasswords() {
  const col = getUsersCollection();
  if (!col) return;

  const defaultAccounts = [
    {
      id: 'user-admin',
      email: 'admin@mavex.com',
      password: 'admin123',
      name: 'مدير النظام (أدمن)',
      role: 'admin',
      departmentId: null,
      title: 'الإدارة العليا'
    },
    {
      id: 'user-quality',
      email: 'quality@mavex.com',
      password: 'qual123',
      name: 'م. طارق محمود',
      role: 'department_manager',
      departmentId: 'quality',
      title: 'مدير مراقبة الجودة'
    },
    {
      id: 'user-production',
      email: 'production@mavex.com',
      password: 'prod123',
      name: 'م. سامح عزت',
      role: 'department_manager',
      departmentId: 'production',
      title: 'مدير الإنتاج'
    },
    {
      id: 'user-maintenance',
      email: 'maintenance@mavex.com',
      password: 'maint123',
      name: 'م. ياسر عبد الله',
      role: 'department_manager',
      departmentId: 'maintenance',
      title: 'مدير الصيانة'
    },
    {
      id: 'user-safety',
      email: 'safety@mavex.com',
      password: 'safe123',
      name: 'أ. محمود فوزي',
      role: 'department_manager',
      departmentId: 'safety',
      title: 'مسؤول السلامة والصحة المهنية'
    },
    {
      id: 'user-finance',
      email: 'finance@mavex.com',
      password: 'fin123',
      name: 'أ. حسام فوزي',
      role: 'department_manager',
      departmentId: 'finance',
      title: 'مدير الحسابات والمالية'
    },
    {
      id: 'user-warehouse',
      email: 'warehouse@mavex.com',
      password: 'ware123',
      name: 'م. كريم سامي',
      role: 'department_manager',
      departmentId: 'warehouse',
      title: 'مدير التخطيط والمستودعات'
    },
    {
      id: 'user-office',
      email: 'office@mavex.com',
      password: 'office123',
      name: 'م. أحمد حسن',
      role: 'department_manager',
      departmentId: 'technical_office',
      title: 'مدير المكتب الفني'
    }
  ];

  for (const acc of defaultAccounts) {
    const existing = await findUserByEmail(acc.email);
    const hash = await hashPassword(acc.password);

    if (!existing) {
      await createUser({
        id: acc.id,
        email: acc.email,
        passwordHash: hash,
        name: acc.name,
        role: acc.role,
        departmentId: acc.departmentId,
        title: acc.title
      });
      console.log(`[Auth Migration] Created seed user in MongoDB: ${acc.email}`);
    } else if (!existing.passwordHash) {
      await updateUser(existing.id, {
        passwordHash: hash,
        role: acc.role,
        departmentId: acc.departmentId || existing.departmentId,
        title: acc.title || existing.title
      });
      console.log(`[Auth Migration] Stored hashed password in MongoDB for: ${acc.email}`);
    }
  }
}

module.exports = {
  findUserByEmail,
  findUserById,
  createUser,
  updateUser,
  ensureDefaultUsersWithPasswords
};
