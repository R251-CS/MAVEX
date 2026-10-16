const mongoose = require('mongoose');
const initialData = require('../seeds/initial-data.json');

function getMongoUri() {
  return process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/mavex';
}

let isConnected = false;
let isSeeded = false;

/**
 * Connect to MongoDB with timeout
 * @param {number} timeoutMs
 * @param {boolean} required - if true, throws error on failure
 */
async function connectMongoDB(timeoutMs = 10000, required = false) {
  if (isConnected && mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  const uri = getMongoUri();
  try {
    await mongoose.connect(uri, {
      dbName: 'mavex',
      serverSelectionTimeoutMS: timeoutMs,
      connectTimeoutMS: timeoutMs
    });
    isConnected = true;
    console.log(`[MongoDB] Connected successfully`);

    // Auto-seed baseline collections if empty
    await seedMongoIfEmpty();
    return mongoose.connection;
  } catch (err) {
    isConnected = false;
    console.error(`[MongoDB] Connection failed ${err.message}`);
    if (required) {
      throw err;
    }
    return null;
  }
}

/**
 * Seeds initial collections into MongoDB if they don't already have documents
 */
async function seedMongoIfEmpty() {
  if (isSeeded || !isConnected) return;
  try {
    const rawDb = mongoose.connection.db;
    if (!rawDb) return;

    for (const [key, records] of Object.entries(initialData)) {
      if (!Array.isArray(records) || records.length === 0) continue;
      const col = rawDb.collection(key);
      const count = await col.countDocuments();
      if (count === 0) {
        // Prepare documents ensuring each has _id and id
        const docs = records.map(r => ({
          ...r,
          _id: r.id || r._id || new mongoose.Types.ObjectId().toString(),
          id: r.id || r._id || new mongoose.Types.ObjectId().toString(),
          createdAt: r.createdAt || new Date().toISOString(),
          updatedAt: r.updatedAt || new Date().toISOString()
        }));
        await col.insertMany(docs);
        console.log(`[MongoDB Seed] Inserted ${docs.length} records into collection '${key}'`);
      }
    }
    isSeeded = true;
  } catch (seedErr) {
    console.warn('[MongoDB Seed] Warning during baseline seeding:', seedErr.message);
  }
}

/**
 * Tests database connectivity
 */
async function testConnection(timeoutMs = 3000) {
  if (mongoose.connection.readyState !== 1) {
    try {
      await connectMongoDB(timeoutMs);
    } catch {
      return { ok: false, error: 'MongoDB not connected' };
    }
  }

  if (mongoose.connection.readyState !== 1) {
    return { ok: false, error: 'MongoDB disconnected' };
  }

  try {
    const start = Date.now();
    await mongoose.connection.db.admin().ping();
    return {
      ok: true,
      latency: Date.now() - start,
      database: 'MongoDB',
      host: mongoose.connection.host,
      name: mongoose.connection.name
    };
  } catch (err) {
    return { ok: false, error: err.message };
  }
}

/**
 * MongoDB Query Builder that matches the repository interface
 * seamlessly translating to MongoDB queries
 */
class MongoCollectionQuery {
  constructor(collectionName, filters = {}, sortOptions = {}, limitNum = null) {
    this.collectionName = collectionName;
    this.filters = { ...filters };
    this.sortOptions = { ...sortOptions };
    this.limitNum = limitNum;
  }

  where(field, operator, value) {
    const newFilters = { ...this.filters };
    if (operator === '==' || operator === '===') {
      newFilters[field] = value;
    } else if (operator === '>') {
      newFilters[field] = { ...(newFilters[field] || {}), $gt: value };
    } else if (operator === '>=') {
      newFilters[field] = { ...(newFilters[field] || {}), $gte: value };
    } else if (operator === '<') {
      newFilters[field] = { ...(newFilters[field] || {}), $lt: value };
    } else if (operator === '<=') {
      newFilters[field] = { ...(newFilters[field] || {}), $lte: value };
    } else if (operator === 'in') {
      newFilters[field] = { $in: value };
    } else {
      newFilters[field] = value;
    }
    return new MongoCollectionQuery(this.collectionName, newFilters, this.sortOptions, this.limitNum);
  }

  orderBy(field, direction = 'asc') {
    const newSort = { ...this.sortOptions, [field]: direction.toLowerCase() === 'desc' ? -1 : 1 };
    return new MongoCollectionQuery(this.collectionName, this.filters, newSort, this.limitNum);
  }

  limit(n) {
    return new MongoCollectionQuery(this.collectionName, this.filters, this.sortOptions, n);
  }

  async get() {
    await connectMongoDB(1500);

    // If MongoDB is connected, query the collection directly
    if (mongoose.connection.readyState === 1 && mongoose.connection.db) {
      const col = mongoose.connection.db.collection(this.collectionName);
      let cursor = col.find(this.filters);
      if (Object.keys(this.sortOptions).length > 0) {
        cursor = cursor.sort(this.sortOptions);
      }
      if (this.limitNum) {
        cursor = cursor.limit(this.limitNum);
      }
      const rawDocs = await cursor.toArray();
      const docs = rawDocs.map(d => {
        const id = d.id || d._id?.toString();
        const dataObj = { ...d, id };
        return {
          id,
          data: () => dataObj,
          exists: true
        };
      });

      return {
        docs,
        empty: docs.length === 0,
        size: docs.length,
        forEach: (callback) => docs.forEach(callback)
      };
    }

    // Fallback to in-memory dataset if disconnected
    let list = [...(initialData[this.collectionName] || [])];
    for (const [k, v] of Object.entries(this.filters)) {
      list = list.filter(item => item[k] === v);
    }
    const docs = list.map(item => ({
      id: item.id,
      data: () => ({ ...item }),
      exists: true
    }));

    return {
      docs,
      empty: docs.length === 0,
      size: docs.length,
      forEach: (callback) => docs.forEach(callback)
    };
  }
}

/**
 * Document reference helper
 */
class MongoDocRef {
  constructor(collectionName, id) {
    this.collectionName = collectionName;
    this.id = id;
  }

  async get() {
    await connectMongoDB(1500);
    if (mongoose.connection.readyState === 1 && mongoose.connection.db) {
      const col = mongoose.connection.db.collection(this.collectionName);
      const doc = await col.findOne({ $or: [{ id: this.id }, { _id: this.id }] });
      if (!doc) {
        return { id: this.id, exists: false, data: () => null };
      }
      const dataObj = { ...doc, id: doc.id || doc._id?.toString() };
      return { id: this.id, exists: true, data: () => dataObj };
    }

    const item = (initialData[this.collectionName] || []).find(i => i.id === this.id);
    return {
      id: this.id,
      exists: Boolean(item),
      data: () => (item ? { ...item } : null)
    };
  }

  async set(data, options = {}) {
    await connectMongoDB(1500);
    const payload = {
      ...data,
      id: this.id,
      updatedAt: new Date().toISOString()
    };

    if (mongoose.connection.readyState === 1 && mongoose.connection.db) {
      const col = mongoose.connection.db.collection(this.collectionName);
      if (options.merge) {
        await col.updateOne(
          { $or: [{ id: this.id }, { _id: this.id }] },
          { $set: payload },
          { upsert: true }
        );
      } else {
        await col.replaceOne(
          { $or: [{ id: this.id }, { _id: this.id }] },
          payload,
          { upsert: true }
        );
      }
      return payload;
    }

    // In-memory update
    const arr = initialData[this.collectionName] || [];
    const idx = arr.findIndex(i => i.id === this.id);
    if (idx >= 0) {
      arr[idx] = options.merge ? { ...arr[idx], ...payload } : payload;
    } else {
      arr.unshift(payload);
    }
    return payload;
  }

  async delete() {
    await connectMongoDB(1500);
    if (mongoose.connection.readyState === 1 && mongoose.connection.db) {
      const col = mongoose.connection.db.collection(this.collectionName);
      await col.deleteOne({ $or: [{ id: this.id }, { _id: this.id }] });
      return true;
    }
    if (initialData[this.collectionName]) {
      initialData[this.collectionName] = initialData[this.collectionName].filter(i => i.id !== this.id);
    }
    return true;
  }
}

/**
 * Top-level Collection Manager
 */
class MongoCollection {
  constructor(name) {
    this.name = name;
  }

  where(field, operator, value) {
    return new MongoCollectionQuery(this.name).where(field, operator, value);
  }

  orderBy(field, direction) {
    return new MongoCollectionQuery(this.name).orderBy(field, direction);
  }

  limit(n) {
    return new MongoCollectionQuery(this.name).limit(n);
  }

  doc(id) {
    return new MongoDocRef(this.name, id);
  }

  async add(data) {
    await connectMongoDB(1500);
    const newId = data.id || `doc-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const payload = {
      ...data,
      id: newId,
      _id: newId,
      createdAt: data.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (mongoose.connection.readyState === 1 && mongoose.connection.db) {
      const col = mongoose.connection.db.collection(this.name);
      await col.insertOne(payload);
      return {
        id: newId,
        get: async () => ({ id: newId, exists: true, data: () => payload })
      };
    }

    if (!initialData[this.name]) initialData[this.name] = [];
    initialData[this.name].unshift(payload);
    return {
      id: newId,
      get: async () => ({ id: newId, exists: true, data: () => payload })
    };
  }

  async get() {
    return new MongoCollectionQuery(this.name).get();
  }
}

// Unified Database Interface
const db = {
  collection: (name) => new MongoCollection(name),
  runTransaction: async (fn) => fn({
    get: async (ref) => ref.get(),
    update: async (ref, data) => ref.set(data, { merge: true }),
    set: async (ref, data) => ref.set(data)
  })
};

module.exports = {
  mongoose,
  connectMongoDB,
  testConnection,
  db,
  isDbConfigured: true
};
