import request from 'supertest';
import app from '../src/app';

describe('Healthcheck API', ()=> {

    it('GET /healthcheck returns 200', async () => {
        const res = await request(app)
                        .get('/api/health');

        expect(res.status).toBe(200);
        expect(res.headers['content-type']).toMatch(/json/);
        expect(res.body).toHaveProperty('message', 'OK');
        expect(res.body).toHaveProperty('success', true);
        expect(res.body).toHaveProperty('timestamp');
    });

});

