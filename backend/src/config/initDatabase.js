const fs = require('fs');
const path = require('path');
const prisma = require('./database');

async function initDatabase() {
  try {
    // Try a simple query to see if the User table exists
    await prisma.user.count();
  } catch (error) {
    if (error.code === 'P2021') {
      console.log('User table missing. Applying initial migration...');
      const migrationPath = path.join(
        __dirname,
        '../../prisma/migrations/20251129173350_init/migration.sql'
      );
      const sql = fs.readFileSync(migrationPath, 'utf-8');
      await prisma.$executeRawUnsafe(sql);
      console.log('Initial migration applied successfully.');
    } else {
      console.error('Database initialization error:', error);
    }
  }
}

module.exports = initDatabase;


