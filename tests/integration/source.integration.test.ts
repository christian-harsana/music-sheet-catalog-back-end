import request from 'supertest';
import app from '../../src/app';
import { createTestUserAndGetToken } from '../helpers/auth.helper';
import { deleteTestUser, closeDbConnection } from '../helpers/db.helper';
import { db } from '../../src/config/db';
import { source } from '../../src/models/database/source.schema';
import { eq } from 'drizzle-orm';

describe('source API', () => {

    let token: string;
    let sourceId: number;

    beforeAll(async () => {
        token = await createTestUserAndGetToken();
    });

    afterAll(async () => {

        // For deleting the created source when delete test failed
        if (sourceId) {
            await db.delete(source).where(eq(source.id, sourceId));
        }

        await deleteTestUser();
        await closeDbConnection();
    });

    describe('POST /source', () => {

        it('should return 401 when no token is provided', async() => {

            const res = await request(app)
                .post('/api/source')
                .send({title: 'Test source'});
            
            expect(res.status).toBe(401);
            expect(res.body).toHaveProperty('success', false);
            expect(res.body).toHaveProperty('message', 'Access denied. No token provided.');
        });

        it('should return 400 when name is missing', async() => {

            const res = await request(app)
                .post('/api/source')
                .set('Authorization', `Bearer ${token}`)
                .send({});
            
            expect(res.status).toBe(400);
            expect(res.body).toHaveProperty('success', false);
            expect(res.body).toHaveProperty('message', 'Validation error.');
        });

        it('should return 201 when adding new source successfully', async() => {

            const res = await request(app)
                .post('/api/source')
                .set('Authorization', `Bearer ${token}`)
                .send({title: 'Test source'});
            
            expect(res.status).toBe(201);
            expect(res.body).toHaveProperty('success', true);
            expect(res.body).toHaveProperty('message', 'New source added successfully.');
            expect(res.body).toHaveProperty('data.id');
            expect(res.body).toHaveProperty('data.title', 'Test source');

            sourceId = res.body.data.id;
        });

    });

    describe('GET /source', () => {

        it('should return 401 when no token is provided', async() => {

            const res = await request(app)
                .get('/api/source');
            
            expect(res.status).toBe(401);
            expect(res.body).toHaveProperty('success', false);
            expect(res.body).toHaveProperty('message', 'Access denied. No token provided.');
        });

        it('should return 200 and return source data', async() => {

            const res = await request(app)
                .get('/api/source')
                .set('Authorization', `Bearer ${token}`);

            const createdSource = res.body.data.find((source: any) => source.id === sourceId);

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('success', true);
            expect(res.body).toHaveProperty('message', 'Sources data fetched successfully.');
            expect(res.body).toHaveProperty('data');
            expect(res.body).toHaveProperty('pagination');
            expect(createdSource).toBeDefined();
            expect(createdSource.title).toBe('Test source');
        });

    });


    describe('GET /source/lookup', () => {

        it('should return 401 when no token is provided', async() => {

            const res = await request(app)
                .get('/api/source/lookup');
            
            expect(res.status).toBe(401);
            expect(res.body).toHaveProperty('success', false);
            expect(res.body).toHaveProperty('message', 'Access denied. No token provided.');
        });

        it('should return 200 and return source lookup data', async() => {

            const res = await request(app)
                .get('/api/source/lookup')
                .set('Authorization', `Bearer ${token}`);

            const createdSource = res.body.data.find((source: any) => source.id === sourceId);

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('success', true);
            expect(res.body).toHaveProperty('message', 'Sources lookup data fetched successfully.');
            expect(res.body).toHaveProperty('data');
            expect(createdSource).toBeDefined();
            expect(createdSource.title).toBe('Test source');
        });

    });


    describe('PUT /source', () => {

        it('should return 401 when no token is provided', async() => {

            const res = await request(app)
                .put(`/api/source/${sourceId}`)
                .send({title: 'Updated source'});
            
            expect(res.status).toBe(401);
            expect(res.body).toHaveProperty('success', false);
            expect(res.body).toHaveProperty('message', 'Access denied. No token provided.');
        });

        it('should return 404 when source does not exist', async () => {
             const res = await request(app)
                .delete(`/api/source/9999`)
                .set('Authorization', `Bearer ${token}`)
                .send({title: 'Updated source'});
            
            expect(res.status).toBe(404);
            expect(res.body).toHaveProperty('success', false);
            expect(res.body).toHaveProperty('message', 'Source not found.');
        });

        it('should return 200 and update a source', async() => {

            const res = await request(app)
                    .put(`/api/source/${sourceId}`)
                    .set('Authorization', `Bearer ${token}`)
                    .send({title: 'Updated source'});

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('success', true);
            expect(res.body).toHaveProperty('message', 'Update is successful.');
            expect(res.body).toHaveProperty('data.title', 'Updated source');
        });
    });


    describe('DELETE /source', () => {

        it('should return 401 when no token is provided', async() => {

            const res = await request(app)
                .delete(`/api/source/${sourceId}`);
            
            expect(res.status).toBe(401);
            expect(res.body).toHaveProperty('success', false);
            expect(res.body).toHaveProperty('message', 'Access denied. No token provided.');
        });

        it('should return 404 when source does not exist', async () => {
             const res = await request(app)
                .delete(`/api/source/9999`)
                .set('Authorization', `Bearer ${token}`);
            
            expect(res.status).toBe(404);
            expect(res.body).toHaveProperty('success', false);
            expect(res.body).toHaveProperty('message', 'Source not found.');
        });

        it('should return 200 and delete a source', async() => {

            const res = await request(app)
                    .delete(`/api/source/${sourceId}`)
                    .set('Authorization', `Bearer ${token}`);

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('success', true);
            expect(res.body).toHaveProperty('message', 'Source successfully deleted.');
        
            // Reset - So Afterall cleanup skip it
            sourceId = 0;
        });
    }) 

});

