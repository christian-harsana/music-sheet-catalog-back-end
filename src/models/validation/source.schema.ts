
import { z } from 'zod';

export const createSourceSchema = z.object({
    body: z.object({
        title: z.string()
            .trim()
            .min(1, 'Source title is required'),
        author: z.string().optional(),
        format: z.string().optional()
    }),
    user: z.object({
        userId: z.number()
            .int('User Id must be an integer')
            .positive('User Id must be positive')
    })
});

export const getSourceSchema = z.object({
    user: z.object({
        userId: z.number()
            .int('User Id must be an integer')
            .positive('User Id must be positive')
    })
});

export const updateSourceSchema = z.object({
    params: z.object({
        id: z.string()
            .trim()
            .min(1, 'Source Id is required')
    }),
    body: z.object({
        title: z.string()
            .trim()
            .min(1, 'Source title is required'),
        author: z.string().optional(),
        format: z.string().optional()
    }),
    user: z.object({
        userId: z.number()
            .int('User Id must be an integer')
            .positive('User Id must be positive')
    })
});

export const deleteSourceSchema = z.object({
    params: z.object({
        id: z.string()
            .trim()
            .min(1, 'Source Id is required')
    }),
    user: z.object({
        userId: z.number()
            .int('User Id must be an integer')
            .positive('User Id must be positive')
    })
});