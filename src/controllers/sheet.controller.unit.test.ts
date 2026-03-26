import { Request, Response } from "express";
import { db } from "../config/db";
import { addSheet, getSheet, updateSheet, deleteSheet } from "./sheet.controller";
import { assert } from "console";
import { STATUS_CODES } from "http";

jest.mock('../config/db');

const mockedDb = jest.mocked(db);

const mockSheet = {
    id: 1,
    title: 'Sheet Title 1', 
    key: 'C#', 
    composer: 'Composer 1',
    sourceId: 1,
    levelId: 1,
    genreId: 1,
    examPiece: true,
    userId: 1
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


describe('Add sheet controller', () => {

    beforeEach(() => {
        req = {
                body: {
                    title: 'Sheet Title 1', 
                    key: 'C#', 
                    composer: 'Composer 1',
                    sourceId: 1,
                    levelId: 1,
                    genreId: 1,
                    examPiece: true,
                    userId: 1}, 
                user: {userId: 1}
                } as Request;
    });

    test('Return 201 when new sheet successfully added', async() => {

        // ARRANGE
        (mockedDb.insert as jest.Mock).mockReturnValue({
            values: jest.fn().mockReturnValue({
                returning: jest.fn().mockResolvedValue([mockSheet])
            })
        });
            
        // ACT
        await addSheet(req, res, next);

        // ASSERT
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({
            success: true,
            message: 'New sheet added successfully.',
            data: mockSheet
        });
    });

    test('Calls next with error when db query fails', async() => {

        // ARRANGE
        (mockedDb.insert as jest.Mock).mockReturnValue({
            values: jest.fn().mockReturnValue({
                returning: jest.fn().mockRejectedValue(new Error('Database connection failed'))
            })
        });
        
        // ACT
        await addSheet(req, res, next);

        // ASSERT
        expect(next).toHaveBeenCalledWith(expect.any(Error));
    });

});


describe('Get sheet controller', () => {

    beforeEach(() => {
        req = {user: {userId: 1}, query: {page: '1', limit: '10'}} as unknown as Request;
    });

    test('Return 200 when sheets successfuly fetched', async() => {

        // ARRANGE
        const mockSheets = [{
            id: 1,
            title: 'Sheet Title 1', 
            key: 'C#', 
            composer: 'Composer 1',
            sourceId: 1,
            levelId: 1,
            genreId: 1,
            examPiece: true,
            userId: 1
        }, {
            id: 2,
            title: 'Sheet Title 2', 
            key: 'F#', 
            composer: 'Composer 2',
            sourceId: 2,
            levelId: 2,
            genreId: 2,
            examPiece: false,
            userId: 1
        }];

        (mockedDb.select as jest.Mock).mockReturnValueOnce({
            from: jest.fn().mockReturnValue({
                leftJoin: jest.fn().mockReturnValue({
                    leftJoin: jest.fn().mockReturnValue({
                        leftJoin: jest.fn().mockReturnValue({
                            where: jest.fn().mockReturnValue({
                                limit: jest.fn().mockReturnValue({
                                    offset: jest.fn().mockReturnValue({
                                        orderBy: jest.fn().mockResolvedValue(mockSheets)
                                    })
                                })
                            })
                        })
                    })    
                })
            })
        });

        (mockedDb.select as jest.Mock).mockReturnValueOnce({
            from: jest.fn().mockReturnValue({
                leftJoin: jest.fn().mockReturnValue({
                    where: jest.fn().mockResolvedValue([{count: 2}])
                })
            })
        })

        // ACT
        await getSheet(req, res, next);

        // ASSERT
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            success: true,
            message: 'Sheets data fetched successfully.',
            data: mockSheets,
            pagination: {
                currentPage: 1,
                pageSize: 10,
                totalItems: 2,
                totalPages: 1,
                hasNextPage: false,
                hasPreviousPage: false 
            }
        })
    });


    test('Return 200 when sheets fetch return no result', async() => {

        (mockedDb.select as jest.Mock).mockReturnValueOnce({
            from: jest.fn().mockReturnValue({
                leftJoin: jest.fn().mockReturnValue({
                    leftJoin: jest.fn().mockReturnValue({
                        leftJoin: jest.fn().mockReturnValue({
                            where: jest.fn().mockReturnValue({
                                limit: jest.fn().mockReturnValue({
                                    offset: jest.fn().mockReturnValue({
                                        orderBy: jest.fn().mockResolvedValue([])
                                    })
                                })
                            })
                        })
                    })    
                })
            })
        });

        (mockedDb.select as jest.Mock).mockReturnValueOnce({
            from: jest.fn().mockReturnValue({
                leftJoin: jest.fn().mockReturnValue({
                    where: jest.fn().mockResolvedValue([{count: 0}])
                })
            })
        })

        // ACT
        await getSheet(req, res, next);

        // ASSERT
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            success: true,
            message: 'Sheets data fetched successfully.',
            data: [],
            pagination: {
                currentPage: 1,
                pageSize: 10,
                totalItems: 0,
                totalPages: 0,
                hasNextPage: false,
                hasPreviousPage: false 
            }
        })
        
    });

});


describe('Update sheet controller', () => {

    beforeEach(() => {

        req = {body: {title: 'New Sheet Title 1'}, user: {userId: 1}, params: {id: '1'}} as unknown as Request;

    });

    test('Return 200 when update is successful', async () => {

        // ARRANGE
        (mockedDb.update as jest.Mock).mockReturnValue({
            set: jest.fn().mockReturnValue({
                where: jest.fn().mockReturnValue({
                    returning: jest.fn().mockResolvedValue([mockSheet])
                })
            })
        });

        // ACT
        await updateSheet(req, res, next);

        // ASSERT
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            success: true,
            message: 'Update is successful.',
            data: mockSheet
        });
    });


    test('Return 404 when sheet is not found', async () => {

        // ARRANGE
        (mockedDb.update as jest.Mock).mockReturnValue({
            set: jest.fn().mockReturnValue({
                where: jest.fn().mockReturnValue({
                    returning: jest.fn().mockResolvedValue(undefined)
                })
            })
        });

        // ACT
        await updateSheet(req, res, next);

        // ASSERT
        expect(next).toHaveBeenCalledWith(expect.objectContaining({
            statusCode: 404,
            message: 'Sheet not found.'
        }));
    });

});


describe('Delete sheet controller', () => {

    beforeEach(() => {

        req = {user: {userId: 1}, params: {id: '1'}} as unknown as Request;

    });

    test('Return 200 when update is successful', async () => {

        // ARRANGE
        (mockedDb.delete as jest.Mock).mockReturnValue({
            where: jest.fn().mockReturnValue({
                returning: jest.fn().mockResolvedValue(mockSheet)
            })
        });

        // ACT
        await deleteSheet(req, res, next);

        // ASSERT
        expect(res.status). toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            success: true,
            message: 'Sheet successfully deleted.'
        })
    });


    test('Return 404 when sheet is not found', async () => {

        // ARRANGE
        (mockedDb.delete as jest.Mock).mockReturnValue({
            where: jest.fn().mockReturnValue({
                returning: jest.fn().mockResolvedValue(undefined)
            })
        });

        // ACT
        await deleteSheet(req, res, next);

        // ASSERT
        expect(next).toHaveBeenCalledWith(expect.objectContaining({
            statusCode: 404,
            message: 'Sheet not found.'
        }));

    });
});