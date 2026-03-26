import request from 'supertest';
import app from '../../src/app';
import { createTestUserAndGetToken } from '../helpers/auth.helper';
import { deleteTestUser, closeDbConnection } from '../helpers/db.helper';
import { db } from '../../src/config/db';
import { level } from '../../src/models/database/level.schema';
import { eq } from 'drizzle-orm';

describe('LEVEL API', () => {

    let token: string;
    let levelId: number;

    beforeAll(async () => {
        token = await createTestUserAndGetToken();
    });

    afterAll(async () => {

        // For deleting the created level when delete test failed
        if (levelId) {
            await db.delete(level).where(eq(level.id, levelId));
        }

        await deleteTestUser();
        await closeDbConnection();
    });

    describe('POST /level', () => {

        it('should return 401 when no token is provided', async() => {

            const res = await request(app)
                .post('/api/level')
                .send({name: 'Test level'});
            
            expect(res.status).toBe(401);
            expect(res.body).toHaveProperty('success', false);
            expect(res.body).toHaveProperty('message', 'Access denied. No token provided.');
        });

        it('should return 400 when name is missing', async() => {

            const res = await request(app)
                .post('/api/level')
                .set('Authorization', `Bearer ${token}`)
                .send({});
            
            expect(res.status).toBe(400);
            expect(res.body).toHaveProperty('success', false);
            expect(res.body).toHaveProperty('message', 'Validation error.');
        });

        it('should return 201 when adding new level successfully', async() => {

            const res = await request(app)
                .post('/api/level')
                .set('Authorization', `Bearer ${token}`)
                .send({name: 'Test level'});
            
            expect(res.status).toBe(201);
            expect(res.body).toHaveProperty('success', true);
            expect(res.body).toHaveProperty('message', 'New level added successfully.');
            expect(res.body).toHaveProperty('data.id');
            expect(res.body).toHaveProperty('data.name', 'Test level');

            levelId = res.body.data.id;
        });

    });

    describe('GET /level', () => {

        it('should return 401 when no token is provided', async() => {

            const res = await request(app)
                .get('/api/level');
            
            expect(res.status).toBe(401);
            expect(res.body).toHaveProperty('success', false);
            expect(res.body).toHaveProperty('message', 'Access denied. No token provided.');
        });

        it('should return 200 and return level data', async() => {

            const res = await request(app)
                .get('/api/level')
                .set('Authorization', `Bearer ${token}`);

            const createdlevel = res.body.data.find((level: any) => level.id === levelId);

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('success', true);
            expect(res.body).toHaveProperty('message', 'All levels fetched successfully.');
            expect(createdlevel).toBeDefined();
            expect(createdlevel.name).toBe('Test level');
        });

    });


    describe('PUT /level', () => {

        it('should return 401 when no token is provided', async() => {

            const res = await request(app)
                .put(`/api/level/${levelId}`)
                .send({name: 'Updated level'});
            
            expect(res.status).toBe(401);
            expect(res.body).toHaveProperty('success', false);
            expect(res.body).toHaveProperty('message', 'Access denied. No token provided.');
        });

        it('should return 404 when level does not exist', async () => {
             const res = await request(app)
                .delete(`/api/level/9999`)
                .set('Authorization', `Bearer ${token}`)
                .send({name: 'Updated level'});
            
            expect(res.status).toBe(404);
            expect(res.body).toHaveProperty('success', false);
            expect(res.body).toHaveProperty('message', 'Level not found.');
        });

        it('should return 200 and update a level', async() => {

            const res = await request(app)
                    .put(`/api/level/${levelId}`)
                    .set('Authorization', `Bearer ${token}`)
                    .send({name: 'Updated level'});

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('success', true);
            expect(res.body).toHaveProperty('message', 'Update is successful.');
            expect(res.body).toHaveProperty('data.name', 'Updated level');
        });
    });


    describe('DELETE /level', () => {

        it('should return 401 when no token is provided', async() => {

            const res = await request(app)
                .delete(`/api/level/${levelId}`);
            
            expect(res.status).toBe(401);
            expect(res.body).toHaveProperty('success', false);
            expect(res.body).toHaveProperty('message', 'Access denied. No token provided.');
        });

        it('should return 404 when level does not exist', async () => {
             const res = await request(app)
                .delete(`/api/level/9999`)
                .set('Authorization', `Bearer ${token}`);
            
            expect(res.status).toBe(404);
            expect(res.body).toHaveProperty('success', false);
            expect(res.body).toHaveProperty('message', 'Level not found.');
        });

        it('should return 200 and delete a level', async() => {

            const res = await request(app)
                    .delete(`/api/level/${levelId}`)
                    .set('Authorization', `Bearer ${token}`);

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('success', true);
            expect(res.body).toHaveProperty('message', 'Level successfully deleted.');
        
            // Reset - So Afterall cleanup skip it
            levelId = 0;
        });
    }) 

});

