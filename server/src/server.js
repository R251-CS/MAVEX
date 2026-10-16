require('dotenv').config();
const app = require('./app');
const { connectMongoDB } = require('./config/mongodb');

const PORT = process.env.PORT || 5000;

console.log('[Mavex Server] Initializing MongoDB connection...');

// Strict Database Requirement: Server will NOT start without active database
connectMongoDB(10000, true)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`[Mavex Server] Database connected successfully. Server listening on port ${PORT} 🚀`);
    });
  })
  .catch((err) => {
    console.error(`\n❌ [Mavex Server FATAL ERROR] Cannot start server without active MongoDB connection!`);
    console.error(`   Error details: ${err.message}`);
    console.error(`   Please check your MONGODB_URI in server/.env\n`);
    process.exit(1);
  });


