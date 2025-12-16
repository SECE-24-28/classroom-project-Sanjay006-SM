const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require('./routes/auth');
const planRoutes = require('./routes/plans');
const rechargeHistoryRoutes = require('./routes/rechargeHistory');

app.use('/api/auth', authRoutes);
app.use('/api/plans', planRoutes);
app.use('/api/history', rechargeHistoryRoutes);

// Database Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/car_pro')
    .then(() => console.log('✅ MongoDB connected successfully'))
    .catch(err => console.error('❌ MongoDB connection error:', err));

// Root Route
app.get('/', (req, res) => {
    res.send('Car Pro Backend is Running');
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
