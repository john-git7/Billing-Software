const mongoose = require('mongoose');
const User = require('../models/userModel');

const fs = require('fs');
const path = require('path');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${mongoose.connection.host}`);
    } catch (error) {
        console.log('Local MongoDB connection failed, attempting to start in-memory database...');
        try {
            const { MongoMemoryServer } = require('mongodb-memory-server');
            const mongod = await MongoMemoryServer.create();
            const uri = mongod.getUri();
            await mongoose.connect(uri);
            console.log(`MongoDB Connected (In-Memory): ${uri}`);

            // Seed Admin User if it doesn't exist
            const existingAdmin = await User.findOne({ email: 'admin@example.com' });
            if (!existingAdmin) {
                await User.create({
                    name: 'Admin User',
                    email: 'admin@example.com',
                    password: 'password', // Hash handled by model pre-save
                    role: 'admin'
                });
                console.log('Admin user seeded in memory DB');
            }
        } catch (memError) {
            const logPath = path.join(__dirname, '../../backend_startup_error.txt');
            const errorMsg = `[${new Date().toISOString()}] DB Connection Error: ${memError.message}\nStack: ${memError.stack}\n`;
            fs.writeFileSync(logPath, errorMsg);
            console.error(`Error: ${memError.message}`);
            // process.exit(1); // Temporarily disabled to check if server listens
        }
    }
};

module.exports = connectDB;


