import request from 'supertest';
import app from '../../src/app';
import { createTestUserAndGetToken } from '../helpers/auth.helper';
import { deleteTestUser, closeDbConnection } from '../helpers/db.helper';

describe('Profile API', () => {
	let token: string;

	beforeAll(async () => {
		token = await createTestUserAndGetToken();
	});

	afterAll(async () => {
		await deleteTestUser();
		await closeDbConnection();
	});

	describe('GET /profile', () => {
		it('should return 200 when user data successfully fetched', async () => {
			const res = await request(app).get('/api/profile').set('Authorization', `Bearer ${token}`);

			expect(res.status).toBe(200);
			expect(res.body).toHaveProperty('success', true);
			expect(res.body).toHaveProperty('message', 'User profile succesfully fetched');
			expect(res.body).toHaveProperty('data.email', 'integration@tester.app');
			expect(res.body).toHaveProperty('data.name', 'Integration Tester');
			expect(res.body).toHaveProperty('data.createdAt');
		});

		it('should return 401 when no token is provided', async () => {
			const res = await request(app).get('/api/profile');

			expect(res.status).toBe(401);
			expect(res.body).toHaveProperty('success', false);
			expect(res.body).toHaveProperty('message', 'Access denied. No token provided.');
		});

		it('should return 401 when token is invalid', async () => {
			const res = await request(app)
				.get('/api/profile')
				.set('Authorization', `Bearer InvalidToken`);

			expect(res.status).toBe(401);
			expect(res.body).toHaveProperty('success', false);
			expect(res.body).toHaveProperty('message', 'Invalid token.');
		});
	});
});
