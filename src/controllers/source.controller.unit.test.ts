import { Request, Response } from 'express';
import { db } from '../config/db';
import {
	addSource,
	getSource,
	getSourceLookup,
	updateSource,
	deleteSource,
} from './source.controller';

jest.mock('../config/db');

const mockedDb = jest.mocked(db);

const mockSource = {
	id: 1,
	title: 'Source Title 1',
	author: 'Author 1',
	format: 'print',
	userId: 1,
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

describe('Add source controller', () => {
	beforeEach(() => {
		req = {
			body: { title: 'Source title 1', author: 'author 1', format: 'print' },
			user: { userId: 1 },
		} as Request;
	});

	test('Return 201 when new source successfully added', async () => {
		// ARRANGE
		mockedDb.query.source.findFirst.mockResolvedValue(undefined);
		(mockedDb.insert as jest.Mock).mockReturnValue({
			values: jest.fn().mockReturnValue({
				returning: jest.fn().mockResolvedValue([mockSource]),
			}),
		});

		// ACT
		await addSource(req, res, next);

		// ASSERT
		expect(res.status).toHaveBeenCalledWith(201);
		expect(res.json).toHaveBeenCalledWith({
			success: true,
			message: 'New source added successfully.',
			data: mockSource,
		});
	});

	test('Return 409 when source already exist', async () => {
		// ARRANGE
		mockedDb.query.source.findFirst.mockResolvedValue(mockSource);

		// ACT
		await addSource(req, res, next);

		// ASSERT
		expect(next).toHaveBeenCalledWith(
			expect.objectContaining({
				statusCode: 409,
				message: 'Source title already exists.',
			}),
		);
	});
});

describe('Get source controller', () => {
	beforeEach(() => {
		req = { user: { userId: 1 }, query: { page: '1', limit: '10' } } as unknown as Request;
	});

	test('Return 200 when sources successfully fetched', async () => {
		// ARRANGE
		const mockSources = [
			{ id: 1, title: 'Source Title 1', author: 'Author 1', format: 'print', userId: 1 },
			{ id: 2, title: 'Source Title 2', author: 'Author 2', format: 'print', userId: 1 },
		];

		mockedDb.query.source.findMany.mockResolvedValue(mockSources);
		(mockedDb.select as jest.Mock).mockReturnValue({
			from: jest.fn().mockReturnValue({
				where: jest.fn().mockResolvedValue([{ count: 2 }]),
			}),
		});

		// ACT
		await getSource(req, res, next);

		// ASSERT
		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith({
			success: true,
			message: 'Sources data fetched successfully.',
			data: mockSources,
			pagination: {
				currentPage: 1,
				pageSize: 10,
				totalItems: 2,
				totalPages: 1,
				hasNextPage: false,
				hasPreviousPage: false,
			},
		});
	});

	test('Return 200 when source fetch return no result', async () => {
		// ARRANGE
		mockedDb.query.source.findMany.mockResolvedValue([]);
		(mockedDb.select as jest.Mock).mockReturnValue({
			from: jest.fn().mockReturnValue({
				where: jest.fn().mockResolvedValue([{ count: 0 }]),
			}),
		});

		// ACT
		await getSource(req, res, next);

		// ASSERT
		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith({
			success: true,
			message: 'Sources data fetched successfully.',
			data: [],
			pagination: {
				currentPage: 1,
				pageSize: 10,
				totalItems: 0,
				totalPages: 0,
				hasNextPage: false,
				hasPreviousPage: false,
			},
		});
	});
});

describe('Get source lookup controller', () => {
	beforeEach(() => {
		req = { user: { userId: 1 } } as Request;
	});

	test('Return 200 when source lookup data successfully fetched', async () => {
		// ARRANGE
		const mockSourceLookup = [
			{ id: 1, title: 'Source 1' },
			{ id: 2, title: 'Source 2' },
		];
		(mockedDb.select as jest.Mock).mockReturnValue({
			from: jest.fn().mockReturnValue({
				where: jest.fn().mockReturnValue({
					orderBy: jest.fn().mockResolvedValue(mockSourceLookup),
				}),
			}),
		});

		// ACT
		await getSourceLookup(req, res, next);

		// ASSERT
		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith({
			success: true,
			message: 'Sources lookup data fetched successfully.',
			data: mockSourceLookup,
		});
	});
});

describe('Update source controller', () => {
	beforeEach(() => {
		req = {
			body: { title: 'New Source Title' },
			user: { userId: 1 },
			params: { id: '1' },
		} as unknown as Request;
	});

	test('Return 200 when source successfully updated', async () => {
		// ARRANGE
		(mockedDb.update as jest.Mock).mockReturnValue({
			set: jest.fn().mockReturnValue({
				where: jest.fn().mockReturnValue({
					returning: jest.fn().mockResolvedValue([mockSource]),
				}),
			}),
		});

		// ACT
		await updateSource(req, res, next);

		// ASSERT
		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith({
			success: true,
			message: 'Update is successful.',
			data: mockSource,
		});
	});

	test('Return 404 when source is not found', async () => {
		// ARRANGE
		(mockedDb.update as jest.Mock).mockReturnValue({
			set: jest.fn().mockReturnValue({
				where: jest.fn().mockReturnValue({
					returning: jest.fn().mockResolvedValue([]),
				}),
			}),
		});

		// ACT
		await updateSource(req, res, next);

		// ASSERT
		expect(next).toHaveBeenCalledWith(
			expect.objectContaining({
				statusCode: 404,
				message: 'Source not found.',
			}),
		);
	});
});

describe('Delete source controller', () => {
	beforeEach(() => {
		req = { user: { userId: 1 }, params: { id: '1' } } as unknown as Request;
	});

	test('Return 200 when source successfully deleted', async () => {
		// ARRANGE
		(mockedDb.delete as jest.Mock).mockReturnValue({
			where: jest.fn().mockReturnValue({
				returning: jest.fn().mockResolvedValue([mockSource]),
			}),
		});

		// ACT
		await deleteSource(req, res, next);

		// ASSERT
		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith({
			success: true,
			message: 'Source successfully deleted.',
		});
	});

	test('Return 404 when source is not found', async () => {
		// ARRANGE
		(mockedDb.delete as jest.Mock).mockReturnValue({
			where: jest.fn().mockReturnValue({
				returning: jest.fn().mockResolvedValue([]),
			}),
		});

		// ACT
		await deleteSource(req, res, next);

		// ASSERT
		expect(next).toHaveBeenCalledWith(
			expect.objectContaining({
				statusCode: 404,
				message: 'Source not found.',
			}),
		);
	});
});
