import { db, pool } from './config/db';
import { sql } from 'drizzle-orm';

async function testConnection() {
    try {

        console.log('LOG: Connect to db...');

        // Simple direct SQL query using pg to test connection
        const result = await pool.query('SELECT NOW()');
        console.log('RESULT:' + result.rows[0]);

        // Simple SQL query using Drizzle

        const resultORM = await db.execute(sql`SELECT NOW()`);
        console.log(`Current timestamp: ${resultORM.rows[0]}`);
    
        console.log('LOG: Database connection successful!');

        await pool.end();
        process.exit(0);
    }
    catch (error) {
        console.error('Database connection failed', error);

        await pool.end();
        process.exit(1);
    }
}

testConnection();