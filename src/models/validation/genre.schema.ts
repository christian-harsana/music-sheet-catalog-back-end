import { z } from 'zod';

export const createGenreSchema = z.object({
    body: z.object({
        name: z.string()
            .trim()
            .min(1, 'Genre name is required')
    }),
    user: z.object({
        userId: z.number()
            .int('User Id must be an integer')
            .positive('User Id must be positive')
    })
});

export const getGenreSchema = z.object({
    user: z.object({
        userId: z.number()
            .int('User Id must be an integer')
            .positive('User Id must be positive')
    })
});

export const updateGenreSchema = z.object({
    params: z.object({
        id: z.string()
            .trim()
            .min(1, 'Genre Id is required')
    }),
    body: z.object({
        name: z.string()
            .trim()
            .min(1, 'Genre Name is required')
    }),
    user: z.object({
        userId: z.number()
            .int('User Id must be an integer')
            .positive('User Id must be positive')
    })
});

export const deleteGenreSchema = z.object({
    params: z.object({
        id: z.string()
            .trim()
            .min(1, 'Genre Id is required')
    }),
    user: z.object({
        userId: z.number()
            .int('User Id must be an integer')
            .positive('User Id must be positive')
    })
});