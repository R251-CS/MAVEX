const mongo = require('./mongodb');

module.exports = {
  db: mongo.db,
  isDbConfigured: true,
  testConnection: mongo.testConnection,
  connectMongoDB: mongo.connectMongoDB,
  mongoose: mongo.mongoose
};


