import request from 'supertest';
import app from '../src/app';
import { db } from '../src/config/db';
import { eq } from 'drizzle-orm';
import { appUser } from '../src/models/database/auth.schema';

describe('Auth API', ()=> {

    let token: string;

    afterAll(async () => {
        await db.delete(appUser).where(eq(appUser.email, 'integration@tester.app'));
        
        // Closes the PostgreSQL pool
        await db.$client.end();
    });


    // SIGNUP
    describe('POST /auth/signUp', () => {

        it('should register a new user and return 201', async() => {

            const res = await request(app)
                .post('/api/auth/signup')
                .send({ 
                    email: 'integration@tester.app',
                    password: 'test1234567',
                    name: 'Integration Tester' 
                });
            
            expect(res.status).toBe(201);
            expect(res.body).toHaveProperty('success', true);
            expect(res.body).toHaveProperty('message', 'User registered successfully');
        });    

        it('should return 409 if email is already exists', async() => {

            const res = await request(app)
                .post('/api/auth/signup')
                .send({ 
                    email: 'integration@tester.app',
                    password: 'test1234567',
                    name: 'Integration Tester' 
                });
            
            expect(res.status).toBe(409);
            expect(res.body).toHaveProperty('success', false);
            expect(res.body).toHaveProperty('message', 'User already exists');
        });

    });


    // LOGIN
    describe('POST /auth/login', () => {

        it('should return 200, user data, and a token', async() => {

            const res = await request(app)
                .post('/api/auth/login')
                .send({ 
                    email: 'integration@tester.app',
                    password: 'test1234567'
                });
            
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('success', true);
            expect(res.body).toHaveProperty('message', 'Login successful');
            expect(res.body).toHaveProperty('data.email', 'integration@tester.app');
            expect(res.body).toHaveProperty('data.name', 'Integration Tester');
            expect(res.body).toHaveProperty('data.token');
        
            token = res.body.data.token;
        });

        it('should return 401 when user is not exist', async() => {

            const res = await request(app)
                .post('/api/auth/login')
                .send({ 
                    email: 'random@email.com',
                    password: 'test1234567'
                });
            
            expect(res.status).toBe(401);
            expect(res.body).toHaveProperty('success', false);
            expect(res.body).toHaveProperty('message', 'Invalid email or password');
        });

        it('should return 401 when password is wrong', async() => {

            const res = await request(app)
                .post('/api/auth/login')
                .send({ 
                    email: 'integration@tester.app',
                    password: 'wrongpassword'
                });
            
            expect(res.status).toBe(401);
            expect(res.body).toHaveProperty('success', false);
            expect(res.body).toHaveProperty('message', 'Invalid email or password');
        });

    });
    

    // PROTECTED ROUTE - PROFILE
    describe('GET /profile', () => {

        it('should return 200 when user data successfully fetched', async() => {

            const res = await request(app)
                .get('/api/profile')
                .set('Authorization', `Bearer ${token}`);
            
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('success', true);
            expect(res.body).toHaveProperty('message', 'User profile succesfully fetched');
            expect(res.body).toHaveProperty('data.email', 'integration@tester.app');
            expect(res.body).toHaveProperty('data.name', 'Integration Tester');
            expect(res.body).toHaveProperty('data.createdAt');
        });

        it('should return 401 when token is invalid', async() => {

            const res = await request(app)
                .get('/api/profile')
                .set('Authorization', `Bearer InvalidToken`);

            expect(res.status).toBe(401);
            expect(res.body).toHaveProperty('success', false);
            expect(res.body).toHaveProperty('message', 'Invalid token.');
        });
    });
});