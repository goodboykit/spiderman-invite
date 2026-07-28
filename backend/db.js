import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;
const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/spiderman_db';

const pool = new Pool({
  connectionString,
  ssl: connectionString.includes('localhost') ? false : { rejectUnauthorized: false }
});

// Initialize database table on server start
pool.query(`
  CREATE TABLE IF NOT EXISTS hangout_schedules (
    id SERIAL PRIMARY KEY,
    occasion VARCHAR(255),
    film VARCHAR(255),
    selected_date VARCHAR(255),
    time_slot VARCHAR(255),
    status VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`).then(() => {
  console.log('✅ [Backend DB] Postgres table hangout_schedules is ready.');
}).catch((err) => {
  console.error('⚠️ [Backend DB] Note on Postgres connection:', err.message);
});

export default pool;
