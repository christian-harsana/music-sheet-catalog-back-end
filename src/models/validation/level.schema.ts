import { z } from 'zod';

export const createLevelSchema = z.object({
    body: z.object({
        name: z.string()
            .trim()
            .min(1, 'Level name is required')
    }),
    user: z.object({
        userId: z.number()
            .int('User Id must be an integer')
            .positive('User Id must be positive')
    })
});

export const getLevelSchema = z.object({
    user: z.object({
        userId: z.number()
            .int('User Id must be an integer')
            .positive('User Id must be positive')
    })
});

export const updateLevelSchema = z.object({
    params: z.object({
        id: z.string()
            .trim()
            .min(1, 'Level Id is required')
    }),
    body: z.object({
        name: z.string()
            .trim()
            .min(1, 'Level Name is required')
    }),
    user: z.object({
        userId: z.number()
            .int('User Id must be an integer')
            .positive('User Id must be positive')
    })
});

export const deleteLevelSchema = z.object({
    params: z.object({
        id: z.string()
            .trim()
            .min(1, 'Level Id is required')
    }),
    user: z.object({
        userId: z.number()
            .int('User Id must be an integer')
            .positive('User Id must be positive')
    })
});