const mongoose = require("mongoose");

const mongoURL = process.env.mongoURL
mongoose.connect(mongoURL)

const db = mongoose.connection;

db.on('connected', () => {
    console.log('Connected to MongoDB server');
})

db.on('error', (err) => {
    consolelog('MongoDB connection error', err);
})

db.on('disconnected', () => {
    console.log("MongoDB disconnected");
})

module.exports = db;