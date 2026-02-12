require('dotenv').config();

module.exports = {
  JWT_SECRET: process.env.JWT_SECRET || 'fallback-secret-key',
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'fallback-refresh-secret-key',
  JWT_EXPIRES_IN: '15m',
  JWT_REFRESH_EXPIRES_IN: '7d',
};

