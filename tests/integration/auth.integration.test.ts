import request from 'supertest';
import app from '../../src/app';
import { createTestUser, loginWithTestUser } from '../helpers/auth.helper';
import { closeDbConnection, deleteTestUser } from '../helpers/db.helper';

describe('Auth API', () => {
	afterAll(async () => {
		await deleteTestUser();
		await closeDbConnection();
	});

	// SIGNUP
	describe('POST /auth/signUp', () => {
		it('should register a new user and return 201', async () => {
			const res = await createTestUser();

			expect(res.status).toBe(201);
			expect(res.body).toHaveProperty('success', true);
			expect(res.body).toHaveProperty('message', 'User registered successfully');
		});

		it('should return 409 if email is already exists', async () => {
			const res = await createTestUser();

			expect(res.status).toBe(409);
			expect(res.body).toHaveProperty('success', false);
			expect(res.body).toHaveProperty('message', 'User already exists');
		});
	});

	// LOGIN
	describe('POST /auth/login', () => {
		it('should return 200, user data, and a token', async () => {
			const res = await loginWithTestUser();

			expect(res.status).toBe(200);
			expect(res.body).toHaveProperty('success', true);
			expect(res.body).toHaveProperty('message', 'Login successful');
			expect(res.body).toHaveProperty('data.email', 'integration@tester.app');
			expect(res.body).toHaveProperty('data.name', 'Integration Tester');
			expect(res.body).toHaveProperty('data.token');
		});

		it('should return 401 when user is not exist', async () => {
			const res = await request(app).post('/api/auth/login').send({
				email: 'random@email.com',
				password: 'test1234567',
			});

			expect(res.status).toBe(401);
			expect(res.body).toHaveProperty('success', false);
			expect(res.body).toHaveProperty('message', 'Invalid email or password');
		});

		it('should return 401 when password is wrong', async () => {
			const res = await request(app).post('/api/auth/login').send({
				email: 'integration@tester.app',
				password: 'wrongpassword',
			});

			expect(res.status).toBe(401);
			expect(res.body).toHaveProperty('success', false);
			expect(res.body).toHaveProperty('message', 'Invalid email or password');
		});

		it('should have ratelimit properties inside the headers and return 409 when the limit exceeded', async () => {
			// NOTE: Counting previous tests, the limit should have been reached at this point
			const res = await request(app).post('/api/auth/login').send({
				email: 'integration@tester.app',
				password: 'wrongpassword',
			});

			expect(res.headers).toHaveProperty('ratelimit-limit', '5');
			expect(res.headers).toHaveProperty('ratelimit-remaining');
			expect(res.status).toBe(429);
			expect(res.text).toBe('Too many attempts, please try again later.');
		});
	});
});
