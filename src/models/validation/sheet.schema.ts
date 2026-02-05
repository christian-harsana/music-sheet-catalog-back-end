import { z } from 'zod';


export const createSheetSchema = z.object({
    body: z.object({
        title: z.string()
            .trim()
            .min(1, 'Sheet title is required'),
        key: z.string().nullable().optional(),
        sourceId: z.number()
            .int('Source Id must be an integer')
            .positive('Source Id must be positive')
            .nullable()
            .optional(),
        levelId: z.number()
            .int('Level Id must be an integer')
            .positive('Level Id must be positive')
            .nullable()
            .optional(),
        genreId: z.number()
            .int('Genre Id must be an integer')
            .positive('Genre Id must be positive')
            .nullable()
            .optional()
    }),
    user: z.object({
        userId: z.number()
            .int('User Id must be an integer')
            .positive('User Id must be positive')
    })
});

export const getSheetSchema = z.object({
    user: z.object({
        userId: z.number()
            .int('User Id must be an integer')
            .positive('User Id must be positive')
    })
});

export const updateSheetSchema = z.object({
    params: z.object({
        id: z.string()
            .trim()
            .min(1, 'Sheet Id is required')
    }),
    body: z.object({
        title: z.string()
            .trim()
            .min(1, 'Sheet title is required'),
        key: z.string().nullable().optional(),
        sourceId: z.number()
            .int('Source Id must be an integer')
            .positive('Source Id must be positive')
            .nullable()
            .optional(),
        levelId: z.number()
            .int('Level Id must be an integer')
            .positive('Level Id must be positive')
            .nullable()
            .optional(),
        genreId: z.number()
            .int('Genre Id must be an integer')
            .positive('Genre Id must be positive')
            .nullable()
            .optional()
    }),
    user: z.object({
        userId: z.number()
            .int('User Id must be an integer')
            .positive('User Id must be positive')
    })
});

export const deleteSheetSchema = z.object({
    params: z.object({
        id: z.string()
            .trim()
            .min(1, 'Sheet Id is required')
    }),
    user: z.object({
        userId: z.number()
            .int('User Id must be an integer')
            .positive('User Id must be positive')
    })
});