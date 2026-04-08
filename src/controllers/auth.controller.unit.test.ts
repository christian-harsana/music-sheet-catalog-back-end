import { Request, Response } from 'express';
import { db } from '../config/db';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { signUp, login, verifyToken } from './auth.controller';

jest.mock('../config/db'); // NOTE: Provide Jest with the path to intercept, this one is hoisted to run first even if the order of the code doesn't reflect this
jest.mock('bcrypt');
jest.mock('jsonwebtoken');

// Wrap the required modules with jest.mocked to access jest methods and make TS happy
const mockedDb = jest.mocked(db);
const mockedBcrypt = jest.mocked(bcrypt);
const mockedJwt = jest.mocked(jwt);

const mockUser = {
	id: 1,
	email: 'test@test.com',
	name: 'tester',
	password: 'hashedPassword',
	createdAt: new Date('2026-01-01'),
};

let req: Request;
let res: Response;
let next: jest.Mock;

beforeEach(() => {
	// Reset mocks between tests
	jest.resetAllMocks();

	// Define repeated values
	res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;
	next = jest.fn();
});

describe('SignUp controller', () => {
	test('Return 201 when user successfully registered', async () => {
		// ARRANGE
		req = {
			body: { email: 'user@test.app', password: 'testPassword123', name: 'Tester' },
		} as Request;
		mockedDb.query.appUser.findFirst.mockResolvedValue(undefined);
		(mockedBcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword'); // NOTE: 'as jest.Mock' is necessary due to bcrypt.hash has more than 1 signatures which return different type
		(mockedDb.insert as jest.Mock).mockReturnValue({
			values: jest.fn().mockReturnValue({
				returning: jest.fn().mockResolvedValue([
					{
						id: 1,
						email: 'test@test.com',
						createdAt: new Date(),
					},
				]),
			}),
		});

		// ACT
		await signUp(req, res, next);

		// ASSERT
		expect(res.status).toHaveBeenCalledWith(201);
		expect(res.json).toHaveBeenCalledWith({
			success: true,
			message: 'User registered successfully',
		});
	});

	test('Return 409 when user already exist when signing up', async () => {
		// ARRANGE
		req = {
			body: { email: 'test@test.com', password: 'testPassword123', name: 'Tester' },
		} as Request;
		mockedDb.query.appUser.findFirst.mockResolvedValue({
			id: 1,
			email: 'test@test.com',
			name: 'test',
			password: '1234567',
			createdAt: new Date('2026-01-01'),
		});

		// ACT
		await signUp(req, res, next);

		// ASSERT
		expect(next).toHaveBeenCalledWith(
			expect.objectContaining({
				statusCode: 409,
				message: 'User already exists',
			}),
		);
	});

	test('Calls next with error when db query fails', async () => {
		// ARRANGE
		req = {
			body: { email: 'test@test.com', password: 'testPassword123', name: 'Tester' },
		} as Request;
		mockedDb.query.appUser.findFirst.mockRejectedValue(new Error('Database connection failed'));

		// ACT
		await signUp(req, res, next);

		// ASSERT
		expect(next).toHaveBeenCalledWith(expect.any(Error));
	});
});

describe('Login controller', () => {
	test('Return 200 when login is successful', async () => {
		// ARRANGE
		req = { body: { email: 'test@test.com', password: 'testPassword123' } } as Request;
		mockedDb.query.appUser.findFirst.mockResolvedValue(mockUser);
		(mockedBcrypt.compare as jest.Mock).mockResolvedValue(true); // Mock Bcrypt (password) compare to return true
		(mockedJwt.sign as jest.Mock).mockReturnValue('mockedJWTToken');

		// ACT
		await login(req, res, next);

		// ASSERT
		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith({
			success: true,
			message: 'Login successful test',
			data: {
				userId: mockUser.id,
				email: mockUser.email,
				name: mockUser.name,
				token: 'mockedJWTToken',
			},
		});
	});

	test('Return 401 when email is invalid', async () => {
		// ARRANGE
		req = { body: { email: 'test@test.com', password: 'testPassword123' } } as Request;
		mockedDb.query.appUser.findFirst.mockResolvedValue(undefined);

		// ACT
		await login(req, res, next);

		// ASSERT
		expect(next).toHaveBeenCalledWith(
			expect.objectContaining({
				statusCode: 401,
				message: 'Invalid email or password',
			}),
		);
	});

	test('Return 401 when password is invalid', async () => {
		// ARRANGE
		req = { body: { email: 'test@test.com', password: 'testPassword123' } } as Request;
		mockedDb.query.appUser.findFirst.mockResolvedValue(mockUser);
		(mockedBcrypt.compare as jest.Mock).mockResolvedValue(false); // Mock Bcrypt compare to return false

		// ACT
		await login(req, res, next);

		// ASSERT
		expect(next).toHaveBeenCalledWith(
			expect.objectContaining({
				statusCode: 401,
				message: 'Invalid email or password',
			}),
		);
	});
});

describe('Verify token controller', () => {
	test('Return 200 when token verification is successful', async () => {
		// ARRANGE
		(mockedJwt.verify as jest.Mock).mockReturnValue({
			userId: 1,
			email: 'test@test.com',
		});
		mockedDb.query.appUser.findFirst.mockResolvedValue(mockUser);

		// ACT
		await verifyToken(req, res, next);

		// ASSERT
		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith({
			success: true,
			message: 'Verification successful',
			data: {
				userId: mockUser.id,
				email: mockUser.email,
				name: mockUser.name,
			},
		});
	});

	test('Return 404 when user is not found', async () => {
		// ARRANGE
		(mockedJwt.verify as jest.Mock).mockReturnValue({
			userId: 1,
			email: 'test@test.com',
		});
		mockedDb.query.appUser.findFirst.mockResolvedValue(undefined);

		// ACT
		await verifyToken(req, res, next);

		// ASSERT
		expect(next).toHaveBeenCalledWith(
			expect.objectContaining({
				statusCode: 404,
				message: 'User not found',
			}),
		);
	});
});
