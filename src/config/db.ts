import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { config } from './index';
import * as schema from '../models/schema';

// Create the connection pool
// NOTE: pool is for allowing multiple connections to db
const pool = new Pool({
    connectionString: config.database.url,
    ssl: {
        rejectUnauthorized: false  // Required for some providers
    }
})

// Create Drizzle instance
export const db = drizzle(pool, { schema });

// Optional: Export pool for manual queries or cleanup
export { pool };