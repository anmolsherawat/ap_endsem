const fs = require('fs');
const path = require('path');
const prisma = require('./database');

async function initDatabase() {
  try {
    // Try a simple query to see if the User table exists
    await prisma.user.count();
    console.log('Database tables already exist.');
  } catch (error) {
    if (error.code === 'P2021' || error.message?.includes('no such table')) {
      console.log('Tables missing. Applying initial migration...');
      const migrationPath = path.join(
        __dirname,
        '../../prisma/migrations/20251129173350_init/migration.sql'
      );
      const sql = fs.readFileSync(migrationPath, 'utf-8');

      // Split migration SQL into individual statements and execute each one
      const statements = sql
        .split(';')
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      for (const statement of statements) {
        try {
          await prisma.$executeRawUnsafe(statement);
        } catch (err) {
          // Ignore "table already exists" errors
          if (!err.message?.includes('already exists')) {
            console.error('Migration statement error:', err.message);
          }
        }
      }
      console.log('Initial migration applied successfully.');
    } else {
      console.error('Database initialization error:', error);
    }
  }
}

module.exports = initDatabase;
