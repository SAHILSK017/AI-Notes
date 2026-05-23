const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const { errorHandler } = require('./middleware/error');
const authRoutes = require('./routes/authRoutes');
const noteRoutes = require('./routes/noteRoutes');
const sharedRoutes = require('./routes/sharedRoutes');

const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/shared', sharedRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'up', message: 'Server is healthy' });
});

app.use(errorHandler);

module.exports = app;

