import request from 'supertest';
import app from '../../src/app';
import { createTestUserAndGetToken } from '../helpers/auth.helper';
import { deleteTestUser, closeDbConnection } from '../helpers/db.helper';
import { db } from '../../src/config/db';
import { sheet } from '../../src/models/database/sheet.schema';
import { eq } from 'drizzle-orm';

describe('Sheet API', () => {

    let token: string;
    let sheetId: number;

    beforeAll(async () => {
        token = await createTestUserAndGetToken();
    });

    afterAll(async () => {

        // For deleting the created sheet when delete test failed
        if (sheetId) {
            await db.delete(sheet).where(eq(sheet.id, sheetId));
        }

        await deleteTestUser();
        await closeDbConnection();
    });

    describe('POST /sheet', () => {

        it('should return 401 when no token is provided', async() => {

            const res = await request(app)
                .post('/api/sheet')
                .send({title: 'Test sheet'});
            
            expect(res.status).toBe(401);
            expect(res.body).toHaveProperty('success', false);
            expect(res.body).toHaveProperty('message', 'Access denied. No token provided.');
        });

        it('should return 400 when title is missing', async() => {

            const res = await request(app)
                .post('/api/sheet')
                .set('Authorization', `Bearer ${token}`)
                .send({});
            
            expect(res.status).toBe(400);
            expect(res.body).toHaveProperty('success', false);
            expect(res.body).toHaveProperty('message', 'Validation error.');
        });

        it('should return 201 when adding new sheet successfully', async() => {

            const res = await request(app)
                .post('/api/sheet')
                .set('Authorization', `Bearer ${token}`)
                .send({title: 'Test sheet'});
            
            expect(res.status).toBe(201);
            expect(res.body).toHaveProperty('success', true);
            expect(res.body).toHaveProperty('message', 'New sheet added successfully.');
            expect(res.body).toHaveProperty('data.id');
            expect(res.body).toHaveProperty('data.title', 'Test sheet');

            sheetId = res.body.data.id;
        });

    });

    describe('GET /sheet', () => {

        it('should return 401 when no token is provided', async() => {

            const res = await request(app)
                .get('/api/sheet');
            
            expect(res.status).toBe(401);
            expect(res.body).toHaveProperty('success', false);
            expect(res.body).toHaveProperty('message', 'Access denied. No token provided.');
        });

        it('should return 200 and return sheet data', async() => {

            const res = await request(app)
                .get('/api/sheet')
                .set('Authorization', `Bearer ${token}`);

            const createdsheet = res.body.data.find((sheet: any) => sheet.id === sheetId);

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('success', true);
            expect(res.body).toHaveProperty('message', 'Sheets data fetched successfully.');
            expect(res.body).toHaveProperty('data');
            expect(res.body).toHaveProperty('pagination');
            expect(createdsheet).toBeDefined();
            expect(createdsheet.title).toBe('Test sheet');
        });

    });


    describe('PUT /sheet', () => {

        it('should return 401 when no token is provided', async() => {

            const res = await request(app)
                .put(`/api/sheet/${sheetId}`)
                .send({title: 'Updated sheet'});
            
            expect(res.status).toBe(401);
            expect(res.body).toHaveProperty('success', false);
            expect(res.body).toHaveProperty('message', 'Access denied. No token provided.');
        });

        it('should return 404 when sheet does not exist', async () => {
             const res = await request(app)
                .delete(`/api/sheet/9999`)
                .set('Authorization', `Bearer ${token}`)
                .send({title: 'Updated sheet'});
            
            expect(res.status).toBe(404);
            expect(res.body).toHaveProperty('success', false);
            expect(res.body).toHaveProperty('message', 'Sheet not found.');
        });

        it('should return 200 and update a sheet', async() => {

            const res = await request(app)
                    .put(`/api/sheet/${sheetId}`)
                    .set('Authorization', `Bearer ${token}`)
                    .send({title: 'Updated sheet'});

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('success', true);
            expect(res.body).toHaveProperty('message', 'Update is successful.');
            expect(res.body).toHaveProperty('data.title', 'Updated sheet');
        });
    });


    describe('DELETE /sheet', () => {

        it('should return 401 when no token is provided', async() => {

            const res = await request(app)
                .delete(`/api/sheet/${sheetId}`);
            
            expect(res.status).toBe(401);
            expect(res.body).toHaveProperty('success', false);
            expect(res.body).toHaveProperty('message', 'Access denied. No token provided.');
        });

        it('should return 404 when sheet does not exist', async () => {
             const res = await request(app)
                .delete(`/api/sheet/9999`)
                .set('Authorization', `Bearer ${token}`);
            
            expect(res.status).toBe(404);
            expect(res.body).toHaveProperty('success', false);
            expect(res.body).toHaveProperty('message', 'Sheet not found.');
        });

        it('should return 200 and delete a sheet', async() => {

            const res = await request(app)
                    .delete(`/api/sheet/${sheetId}`)
                    .set('Authorization', `Bearer ${token}`);

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('success', true);
            expect(res.body).toHaveProperty('message', 'Sheet successfully deleted.');
        
            // Reset - So Afterall cleanup skip it
            sheetId = 0;
        });
    }) 

});

