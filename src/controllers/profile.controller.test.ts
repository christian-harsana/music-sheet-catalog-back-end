import { Request, Response } from 'express';
import { db } from '../config/db';
import { getProfile } from './profile.controller';

jest.mock('../config/db');

const mockedDb = jest.mocked(db);

const mockProfile = {
    id: 1,
    email: 'tester@tester.com',
    name: 'Tester',
    password: 'HashedPassword',
    createdAt: new Date('2026-01-01')
}

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

describe('Get profile controller', () => {

    beforeEach(() => {
        req = {user: {userId: 1}} as Request;
    });

    test('Return 200 when user profile successfully fetched', async() => {

        // ARRANGE      
        mockedDb.query.appUser.findFirst.mockResolvedValue(mockProfile);

        // ACT
        await getProfile(req, res, next);

        // ASSERT
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            success: true,
            message: 'User profile succesfully fetched',
            data: { 
                userId: mockProfile.id, 
                email: mockProfile.email,
                name: mockProfile.name,
                createdAt: mockProfile.createdAt
            }
        });
    });

    test('Return 404 when user profile is not found', async() => {

        // ARRANGE
        mockedDb.query.appUser.findFirst.mockResolvedValue(undefined);

        // ACT
        await getProfile(req, res, next);

        // ASSERT
        expect(next).toHaveBeenCalledWith(expect.objectContaining({
            statusCode: 404,
            message: 'User not found'
        }));
    });
});