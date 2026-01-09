require('dotenv').config();
const http = require('http');
const app = require('./src/app');
const connectDB = require('./src/config/db');

const app = require('./src/app');
const connectDB = require('./src/config/db');

// Connect to Database
connectDB();

const PORT = process.env.PORT || 5001;

// Only start the server if this file is run directly (Local Dev)
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    });
}

// Export app for Vercel Serverless
module.exports = app;
