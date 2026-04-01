import request from 'supertest';
import app from '../../src/app';
import { createTestUserAndGetToken } from '../helpers/auth.helper';
import { deleteTestUser, closeDbConnection } from '../helpers/db.helper';
import { db } from '../../src/config/db';
import { genre } from '../../src/models/database/genre.schema';
import { genreResponse } from '../../src/types/genre';
import { eq } from 'drizzle-orm';

describe('Genre API', () => {
	let token: string;
	let genreId: number;

	beforeAll(async () => {
		token = await createTestUserAndGetToken();
	});

	afterAll(async () => {
		// For deleting the created genre when delete test failed
		if (genreId) {
			await db.delete(genre).where(eq(genre.id, genreId));
		}

		await deleteTestUser();
		await closeDbConnection();
	});

	describe('POST /genre', () => {
		it('should return 401 when no token is provided', async () => {
			const res = await request(app).post('/api/genre').send({ name: 'Test Genre' });

			expect(res.status).toBe(401);
			expect(res.body).toHaveProperty('success', false);
			expect(res.body).toHaveProperty('message', 'Access denied. No token provided.');
		});

		it('should return 400 when name is missing', async () => {
			const res = await request(app)
				.post('/api/genre')
				.set('Authorization', `Bearer ${token}`)
				.send({});

			expect(res.status).toBe(400);
			expect(res.body).toHaveProperty('success', false);
			expect(res.body).toHaveProperty('message', 'Validation error.');
		});

		it('should return 201 when adding new genre successfully', async () => {
			const res = await request(app)
				.post('/api/genre')
				.set('Authorization', `Bearer ${token}`)
				.send({ name: 'Test Genre' });

			expect(res.status).toBe(201);
			expect(res.body).toHaveProperty('success', true);
			expect(res.body).toHaveProperty('message', 'New genre added successfully.');
			expect(res.body).toHaveProperty('data.id');
			expect(res.body).toHaveProperty('data.name', 'Test Genre');

			genreId = res.body.data.id;
		});
	});

	describe('GET /genre', () => {
		it('should return 401 when no token is provided', async () => {
			const res = await request(app).get('/api/genre');

			expect(res.status).toBe(401);
			expect(res.body).toHaveProperty('success', false);
			expect(res.body).toHaveProperty('message', 'Access denied. No token provided.');
		});

		it('should return 200 and return genre data', async () => {
			const res = await request(app).get('/api/genre').set('Authorization', `Bearer ${token}`);

			const createdGenre = res.body.data.find((genre: genreResponse) => genre.id === genreId);

			expect(res.status).toBe(200);
			expect(res.body).toHaveProperty('success', true);
			expect(res.body).toHaveProperty('message', 'All genres fetched successfully.');
			expect(createdGenre).toBeDefined();
			expect(createdGenre.name).toBe('Test Genre');
		});
	});

	describe('PUT /genre', () => {
		it('should return 401 when no token is provided', async () => {
			const res = await request(app).put(`/api/genre/${genreId}`).send({ name: 'Updated Genre' });

			expect(res.status).toBe(401);
			expect(res.body).toHaveProperty('success', false);
			expect(res.body).toHaveProperty('message', 'Access denied. No token provided.');
		});

		it('should return 404 when genre does not exist', async () => {
			const res = await request(app)
				.delete(`/api/genre/9999`)
				.set('Authorization', `Bearer ${token}`)
				.send({ name: 'Updated Genre' });

			expect(res.status).toBe(404);
			expect(res.body).toHaveProperty('success', false);
			expect(res.body).toHaveProperty('message', 'Genre not found.');
		});

		it('should return 200 and update a genre', async () => {
			const res = await request(app)
				.put(`/api/genre/${genreId}`)
				.set('Authorization', `Bearer ${token}`)
				.send({ name: 'Updated Genre' });

			expect(res.status).toBe(200);
			expect(res.body).toHaveProperty('success', true);
			expect(res.body).toHaveProperty('message', 'Update is successful.');
			expect(res.body).toHaveProperty('data.name', 'Updated Genre');
		});
	});

	describe('DELETE /genre', () => {
		it('should return 401 when no token is provided', async () => {
			const res = await request(app).delete(`/api/genre/${genreId}`);

			expect(res.status).toBe(401);
			expect(res.body).toHaveProperty('success', false);
			expect(res.body).toHaveProperty('message', 'Access denied. No token provided.');
		});

		it('should return 404 when genre does not exist', async () => {
			const res = await request(app)
				.delete(`/api/genre/9999`)
				.set('Authorization', `Bearer ${token}`);

			expect(res.status).toBe(404);
			expect(res.body).toHaveProperty('success', false);
			expect(res.body).toHaveProperty('message', 'Genre not found.');
		});

		it('should return 200 and delete a genre', async () => {
			const res = await request(app)
				.delete(`/api/genre/${genreId}`)
				.set('Authorization', `Bearer ${token}`);

			expect(res.status).toBe(200);
			expect(res.body).toHaveProperty('success', true);
			expect(res.body).toHaveProperty('message', 'Genre successfully deleted.');

			// Reset - So Afterall cleanup skip it
			genreId = 0;
		});
	});
});
