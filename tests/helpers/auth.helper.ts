import request, { Response } from 'supertest';
import app from '../../src/app';

export const createTestUser = async (): Promise<Response> => {
	return request(app).post('/api/auth/signup').send({
		email: 'integration@tester.app',
		password: 'test1234567',
		name: 'Integration Tester',
	});
};

export const loginWithTestUser = async (): Promise<Response> => {
	return request(app).post('/api/auth/login').send({
		email: 'integration@tester.app',
		password: 'test1234567',
	});
};

export const createTestUserAndGetToken = async (): Promise<string> => {
	await createTestUser();
	const res = await loginWithTestUser();
	return res.body.data.token;
};
