import { db } from '../../src/config/db';
import { appUser } from '../../src/models/database/auth.schema';
import { eq } from 'drizzle-orm';

export const closeDbConnection = async () => {
	// Closes the PostgreSQL pool
	await db.$client.end();
};

export const deleteTestUser = async () => {
	await db.delete(appUser).where(eq(appUser.email, 'integration@tester.app'));
};
