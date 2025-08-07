// server/server.js
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors'); // <-- 1. IMPORT CORS

// Load environment variables
dotenv.config();

const app = express();

// --- MIDDLEWARE ---
app.use(express.json());
app.use(cors()); // <-- 2. USE CORS MIDDLEWARE

// --- Database Connection ---
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.error(err));

// --- Basic Route ---
app.get('/', (req, res) => {
    res.send('Welcome to the Cricket Scorer API');
});

// --- API Routes ---
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/matches', require('./routes/matchRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));