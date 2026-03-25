import request from 'supertest';
import app from '../../src/app';
import { createTestUserAndGetToken } from '../helpers/auth.helper';
import { deleteTestUser, closeDbConnection } from '../helpers/db.helper';

describe('Stat API', () => {

    let token: string;

    beforeAll(async () => {
        token = await createTestUserAndGetToken();
    });

    afterAll(async () => {

        await deleteTestUser();
        await closeDbConnection();
    });

    describe('GET /stats', () => {

        it('should return 401 when no token is provided', async() => {

            const res = await request(app)
                .get('/api/stats');
            
            expect(res.status).toBe(401);
            expect(res.body).toHaveProperty('success', false);
            expect(res.body).toHaveProperty('message', 'Access denied. No token provided.');
        });

        it('should return 200 and return stats data', async() => {

            const res = await request(app)
                .get('/api/stats')
                .set('Authorization', `Bearer ${token}`);

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('success', true);
            expect(res.body).toHaveProperty('message', 'Stats sucessfully fetched.');
            expect(res.body).toHaveProperty('data');
        });
    });
});

