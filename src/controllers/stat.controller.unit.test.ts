import { Request, Response } from 'express';
import { db } from '../config/db';
import { getStats } from './stat.controller';

jest.mock('../config/db');

const mockedDb = jest.mocked(db);

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

describe('Get stat controller', () => {

    beforeEach(() => {
        req = {user: {userId: 1}} as Request;
    });

    test('Return 200 when stats successfully fetched', async() => {

        // ARRANGE
        const mockSheetsByLevel = [{ levelId: 1, levelName: 'Beginner', count: 5 }];
        const mockSheetsByGenre = [{ genreId: 1, genreName: 'Classical', count: 3 }];
        const mockSheetsWithMissingData = [{ count: 2 }];
        const mockSheetsTotal = [{ count: 10 }];
        const mockSourcesTotal = [{ count: 4 }];
        const mockLevelsTotal = [{ count: 3 }];
        const mockGenresTotal = [{ count: 5 }];
        
        (mockedDb.select as jest.Mock)
            .mockReturnValueOnce({
                from: jest.fn().mockReturnValue({
                    leftJoin: jest.fn().mockReturnValue({
                        where: jest.fn().mockReturnValue({
                            groupBy: jest.fn().mockReturnValue({
                                orderBy: jest.fn().mockResolvedValue(mockSheetsByLevel)
                            })
                        })
                    })
                })
            })
            .mockReturnValueOnce({
                from: jest.fn().mockReturnValue({
                    leftJoin: jest.fn().mockReturnValue({
                        where: jest.fn().mockReturnValue({
                            groupBy: jest.fn().mockReturnValue({
                                orderBy: jest.fn().mockResolvedValue(mockSheetsByGenre)
                            })
                        })
                    })
                })
            })
            .mockReturnValueOnce({
                from: jest.fn().mockReturnValue({
                    where: jest.fn().mockResolvedValue(mockSheetsWithMissingData)
                })
            })
            .mockReturnValueOnce({
                from: jest.fn().mockReturnValue({
                    where: jest.fn().mockResolvedValue(mockSheetsTotal)
                })
            })
            .mockReturnValueOnce({
                from: jest.fn().mockReturnValue({
                    where: jest.fn().mockResolvedValue(mockSourcesTotal)
                })
            })
            .mockReturnValueOnce({
                from: jest.fn().mockReturnValue({
                    where: jest.fn().mockResolvedValue(mockLevelsTotal)
                })
            })
            .mockReturnValueOnce({
                from: jest.fn().mockReturnValue({
                    where: jest.fn().mockResolvedValue(mockGenresTotal)
                })
            });

        // ACT
        await getStats(req, res, next);

        // ASSERT
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            success: true,
            message: 'Stats sucessfully fetched.',
            data: [
                mockSheetsByLevel,
                mockSheetsByGenre,
                mockSheetsWithMissingData,
                mockSheetsTotal,
                mockSourcesTotal,
                mockLevelsTotal,
                mockGenresTotal
            ]
        });
    });

    test('Calls next with error when db query fails', async() => {
    
        // ARRANGE
        const remainingCountMock = {
                from: jest.fn().mockReturnValue({
                    where: jest.fn().mockResolvedValue([])
                })
            };

        (mockedDb.select as jest.Mock)
            .mockReturnValueOnce({
                from: jest.fn().mockReturnValue({
                    leftJoin: jest.fn().mockReturnValue({
                        where: jest.fn().mockReturnValue({
                            groupBy: jest.fn().mockReturnValue({
                                orderBy: jest.fn().mockRejectedValue(new Error('Database connection failed'))
                            })
                        })
                    })
                })
            })
            .mockReturnValueOnce({
                from: jest.fn().mockReturnValue({
                    leftJoin: jest.fn().mockReturnValue({
                        where: jest.fn().mockReturnValue({
                            groupBy: jest.fn().mockReturnValue({
                                orderBy: jest.fn().mockResolvedValue([])
                            })
                        })
                    })
                })
            })
            .mockReturnValueOnce(remainingCountMock)
            .mockReturnValueOnce(remainingCountMock)
            .mockReturnValueOnce(remainingCountMock)
            .mockReturnValueOnce(remainingCountMock)
            .mockReturnValueOnce(remainingCountMock);

        // ACT
        await getStats(req, res, next);

        // ASSERT
        expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
});