import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { config } from './index';
import * as schema from '../models/database/schema';

// Create the connection pool
// NOTE: pool is for allowing multiple connections to db
const pool = new Pool({
    connectionString: config.database.url,
    connectionTimeoutMillis: 5000,
    idleTimeoutMillis: 60000,
    keepAlive: true,
    ssl: {
        rejectUnauthorized: false  // Required for some providers
    }
})

// Create Drizzle instance
export const db = drizzle(pool, { schema });

// Optional: Export pool for manual queries or cleanup
export { pool };