import { z } from 'zod';

export const signupSchema = z.object({
    body: z.object({
        email: z.email('Invalid email format'),
        password: z.string()
            .min(8, 'Password length must be at least 8 characters'),
        name: z.string()
            .optional()
            .nullable()
    })
});


export const loginSchema = z.object({
    body: z.object({
        email: z.email('Invalid email format'),
        password: z.string()
            .min(1, 'Password is required'),
    })
});

export const tokenVerificationSchema = z.object({
    body: z.object({
        token: z.jwt('Invalid JWT format')
    })
});