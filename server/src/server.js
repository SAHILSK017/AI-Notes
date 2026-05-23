require('dotenv').config();

const app = require('./app');
const connectDB = require('./config/db');

const startServer = async () => {
  try {
    const PORT = process.env.PORT || 5000;

    await connectDB();

    app.listen(PORT, () => {
      console.log(`\x1b[32m%s\x1b[0m`, `✓ Server running on port ${PORT}`);
      console.log(`\x1b[36m%s\x1b[0m`, `→ Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error(`\x1b[31m%s\x1b[0m`, `✗ Failed to start:`, error.message);
    process.exit(1);
  }
};

startServer();
