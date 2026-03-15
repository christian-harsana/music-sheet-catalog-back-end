import { Request, Response } from 'express';
import { db } from '../config/db';
import { addGenre, getGenre, updateGenre, deleteGenre } from './genre.controller';

jest.mock('../config/db');

const mockedDb = jest.mocked(db);

const mockGenre = {
    id: 1,
    name: 'Genre 1',
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

describe('Add genre controller', () => {

    beforeEach(() => {
        req = {body: {name: 'new genre'}, user: {userId: 1}} as Request;
    });

    test('Return 201 when new genre successfully added', async() => {

        // ARRANGE
        mockedDb.query.genre.findFirst.mockResolvedValue(undefined);
        (mockedDb.insert as jest.Mock).mockReturnValue({
            values: jest.fn().mockReturnValue({
                returning: jest.fn().mockResolvedValue([mockGenre])
            })    
        });

        // ACT
        await addGenre(req, res, next);

        // ASSERT
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({
            success: true,
            message: 'New genre added successfully',
            data: mockGenre
        });
    });


    test('Return 409 when genre already exist', async() => {

        // ARRANGE
        mockedDb.query.genre.findFirst.mockResolvedValue(mockGenre);

        // ACT
        await addGenre(req, res, next);

        // ASSERT
        expect(next).toHaveBeenCalledWith(expect.objectContaining({
            statusCode: 409,
            message: 'Genre name already exists'
        }));
    });

});

describe('Get genre controller', () => {

    beforeEach(() => {
        req = {user: {userId: 1}} as Request;
    });

    test('Return 200 when genres successfully fetched', async() => {

        // ARRANGE
        const mockGenres = [
            {id: 1, name: 'genre 1', userId: 1},
            {id: 2, name: 'genre 2', userId: 1},
        ]
        
        mockedDb.query.genre.findMany.mockResolvedValue(mockGenres);

        // ACT
        await getGenre(req, res, next);

        // ASSERT
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            success: true,
            message: 'All genres fetched successfully',
            data: mockGenres
        });
    });

    test('Return 200 when genre fetch return no result', async() => {

        // ARRANGE
        mockedDb.query.genre.findMany.mockResolvedValue([]);

        // ACT
        await getGenre(req, res, next);

        // ASSERT
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            success: true,
            message: 'All genres fetched successfully',
            data: []
        });
    });
});

describe('Update genre controller', () => {

    beforeEach(() => {
        req = {body: {name: 'updated genre'}, user: {userId: 1}, params: {id: '1'}} as unknown as Request;
    });

    test('Return 200 when genres successfully updated', async() => {

        // ARRANGE
        (mockedDb.update as jest.Mock).mockReturnValue({
            set: jest.fn().mockReturnValue({
                where: jest.fn().mockReturnValue({
                    returning: jest.fn().mockResolvedValue([mockGenre])
                })
            })
        });

        // ACT
        await updateGenre(req, res, next);

        // ASSERT
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            success: true,
            message: 'Update is successful',
            data: mockGenre
        });
    });

    test('Return 404 when genre is not found', async() => {

        // ARRANGE
        (mockedDb.update as jest.Mock).mockReturnValue({
            set: jest.fn().mockReturnValue({
                where: jest.fn().mockReturnValue({
                    returning: jest.fn().mockResolvedValue([])
                })
            })
        });

        // ACT
        await updateGenre(req, res, next);

        // ASSERT
        expect(next).toHaveBeenCalledWith(expect.objectContaining({
            statusCode: 404,
            message: 'Genre not found'
        }));
    });

});

describe('Delete genre controller', () => {

    beforeEach(() => {
        req = {user: {userId: 1}, params: {id: '1'}} as unknown as Request;
    });

    test('Return 200 when genre successfully deleted', async() => {

        // ARRANGE
        (mockedDb.delete as jest.Mock).mockReturnValue({
            where: jest.fn().mockReturnValue({
                returning: jest.fn().mockResolvedValue([mockGenre])
            })
        });

        // ACT
        await deleteGenre(req, res, next);

        // ASSERT
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            success: true,
            message: 'Genre successfully deleted'
        });
    });


    test('Return 404 when genre is not found', async() => {

        // ARRANGE
        (mockedDb.delete as jest.Mock).mockReturnValue({
            where: jest.fn().mockReturnValue({
                returning: jest.fn().mockResolvedValue([])
            })
        });

        // ACT
        await deleteGenre(req, res, next);

        // ASSERT
        expect(next).toHaveBeenCalledWith(expect.objectContaining({
            statusCode: 404,
            message: 'Genre not found'
        }));
    });

});