import { Request, Response } from 'express';
import { db } from '../config/db';
import { addLevel, getLevel, updateLevel, deleteLevel } from './level.controller';

jest.mock('../config/db');

const mockedDb = jest.mocked(db);

const mockLevel = {
    id: 1,
    name: 'Level 1',
    description: 'Level 1 description',
    userId: 1
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

describe('Add level controller', () => {

    beforeEach(() => {
        req = {body: {name: 'new level'}, user: {userId: 1}} as Request;
    });

    test('Return 201 when new level successfully added', async() => {

        // ARRANGE
        mockedDb.query.level.findFirst.mockResolvedValue(undefined);
        (mockedDb.insert as jest.Mock).mockReturnValue({
            values: jest.fn().mockReturnValue({
                returning: jest.fn().mockResolvedValue([mockLevel])
            })    
        });

        // ACT
        await addLevel(req, res, next);

        // ASSERT
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({
            success: true,
            message: 'New level added successfully',
            data: mockLevel
        });
    });


    test('Return 409 when level already exist', async() => {

        // ARRANGE
        mockedDb.query.level.findFirst.mockResolvedValue(mockLevel);

        // ACT
        await addLevel(req, res, next);

        // ASSERT
        expect(next).toHaveBeenCalledWith(expect.objectContaining({
            statusCode: 409,
            message: 'Level name already exists'
        }));
    });

});

describe('Get level controller', () => {

    beforeEach(() => {
        req = {user: {userId: 1}} as Request;
    });

    test('Return 200 when levels successfully fetched', async() => {

        // ARRANGE
        const mockLevels = [
            {id: 1, name: 'Level 1', description: 'Level 1 description', userId: 1},
            {id: 2, name: 'Level 2', description: 'Level 2 description', userId: 1},
        ]
        
        mockedDb.query.level.findMany.mockResolvedValue(mockLevels);

        // ACT
        await getLevel(req, res, next);

        // ASSERT
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            success: true,
            message: 'All levels fetched successfully',
            data: mockLevels
        });
    });

    test('Return 200 when level fetch return no result', async() => {

        // ARRANGE
        mockedDb.query.level.findMany.mockResolvedValue([]);

        // ACT
        await getLevel(req, res, next);

        // ASSERT
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            success: true,
            message: 'All levels fetched successfully',
            data: []
        });
    });
});

describe('Update level controller', () => {

    beforeEach(() => {
        req = {body: {name: 'updated level'}, user: {userId: 1}, params: {id: '1'}} as unknown as Request;
    });

    test('Return 200 when level successfully updated', async() => {

        // ARRANGE
        (mockedDb.update as jest.Mock).mockReturnValue({
            set: jest.fn().mockReturnValue({
                where: jest.fn().mockReturnValue({
                    returning: jest.fn().mockResolvedValue([mockLevel])
                })
            })
        });

        // ACT
        await updateLevel(req, res, next);

        // ASSERT
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            success: true,
            message: 'Update is successful',
            data: mockLevel
        });
    });

    test('Return 404 when level is not found', async() => {

        // ARRANGE
        (mockedDb.update as jest.Mock).mockReturnValue({
            set: jest.fn().mockReturnValue({
                where: jest.fn().mockReturnValue({
                    returning: jest.fn().mockResolvedValue([])
                })
            })
        });

        // ACT
        await updateLevel(req, res, next);

        // ASSERT
        expect(next).toHaveBeenCalledWith(expect.objectContaining({
            statusCode: 404,
            message: 'Level not found'
        }));
    });

});

describe('Delete level controller', () => {

    beforeEach(() => {
        req = {user: {userId: 1}, params: {id: '1'}} as unknown as Request;
    });

    test('Return 200 when level successfully deleted', async() => {

        // ARRANGE
        (mockedDb.delete as jest.Mock).mockReturnValue({
            where: jest.fn().mockReturnValue({
                returning: jest.fn().mockResolvedValue([mockLevel])
            })
        });

        // ACT
        await deleteLevel(req, res, next);

        // ASSERT
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            success: true,
            message: 'Level successfully deleted'
        });
    });


    test('Return 404 when level is not found', async() => {

        // ARRANGE
        (mockedDb.delete as jest.Mock).mockReturnValue({
            where: jest.fn().mockReturnValue({
                returning: jest.fn().mockResolvedValue([])
            })
        });

        // ACT
        await deleteLevel(req, res, next);

        // ASSERT
        expect(next).toHaveBeenCalledWith(expect.objectContaining({
            statusCode: 404,
            message: 'Level not found'
        }));
    });

});