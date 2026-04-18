require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { execSync } = require('child_process');
const path = require('path');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const roomRoutes = require('./routes/roomRoutes');
const studentRoutes = require('./routes/studentRoutes');
const complaintRoutes = require('./routes/complaintRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');

const app = express();

// ✔ FIX: Render required PORT support
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/attendance', attendanceRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ message: 'Server is running', status: 'ok' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Auto-run migrations on startup
console.log('🗄️ Initializing database...');
try {
  console.log('  - Generating Prisma client...');
  execSync('npx prisma generate', { stdio: 'inherit', cwd: path.join(__dirname, '..') });
  
  console.log('  - Running migrations...');
  execSync('npx prisma migrate deploy', { stdio: 'inherit', cwd: path.join(__dirname, '..') });
  
  console.log('  - Seeding database...');
  try {
    const seedPath = path.join(__dirname, '..', 'prisma', 'seed.js');
    execSync(`node ${seedPath}`, { stdio: 'inherit', cwd: path.join(__dirname, '..') });
  } catch (seedErr) {
    console.warn('  ⚠️ Seeding failed (database might already be seeded)');
  }
  
  console.log('✅ Database initialization complete!');
} catch (error) {
  console.error('❌ Database initialization failed:', error.message);
  console.warn('⚠️ Continuing without database initialization (may not work properly)');
}

// Server start
app.listen(PORT, () => {
  console.log(`🚀 Backend running on port ${PORT}`);
});
