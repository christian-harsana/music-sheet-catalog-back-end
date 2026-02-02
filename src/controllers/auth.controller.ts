import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { eq } from 'drizzle-orm';
import { db } from '../config/db';
import { appUser } from '../models/app-user.schema';
import { config } from '../config/index';
import { success, z, ZodError } from 'zod';

// SIGN UP
export const signUp = async (req: Request, res: Response) => {

    // Define expected data schema
    const newUserSchema = z.object({
        email: z.email(),
        password: z.string().min(8),
        name: z.string().optional(),
    });
    
    try {

        const { email, password, name } = req.body;

        newUserSchema.parse({
            email: email,
            password: password,
            name: name
        });

        // Validate - Check if user exists
        const existingUser = await db.query.appUser.findFirst({
            where: eq(appUser.email, email)
        });

        if (existingUser) {
            return res.status(409).json({ 
                success: false, 
                message: 'User already exists',
                errors: []
            });
        }

        // Hash Password (bcrypt)
        const saltRounds = 10; // NOTE: Higher number = more secure but slower, typical value 10-12
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Save User
        const newUser = await db.insert(appUser).values({
            email: email.toLowerCase(),
            name: name?.trim(),
            password: hashedPassword
        }).returning();


        // Return Success
        return res.status(201).json({ 
            success: true, 
            message: 'User registered successfully'
        });

    }
    catch (error: unknown) {

        if (error instanceof ZodError) {
            return res.status(400).json({ 
                success: false, 
                message: 'Validation Error',
                errors: error.issues.map(issue => ({
                    field: issue.path.join('.'),
                    message: issue.message
                }))
            });
        }

        const errorMessage = error instanceof Error ? error.message : 'Unknown error';

        return res.status(500).json({ 
            success: false,
            message: errorMessage,
            errors: []
        });

        // TODO:
        // Implement environment check for message, only show details on DEV
        // process.env.NODE_ENV === 'development' ? errorMessage: 'An unexpected error occurred. Please try again later.'
    }
};


// LOGIN
export const login = async (req: Request, res: Response) => {
  
    // Define expected data schema
    const loginSchema = z.object({
        email: z.email(),
        password: z.string().min(8)
    });

    try {

        const { email, password } = req.body;

        loginSchema.parse({
            email: email,
            password: password
        });

        // Validate - Check if user exists
        const user = await db.query.appUser.findFirst({
            where: eq(appUser.email, email)
        });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password',
                errors: []
            });
        }

        // Compare Password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password',
                errors: []
            });
        }

        // Sign JWT
        const token = jwt.sign(
            {
                userId: user.id,
                email: user.email
            },
            config.jwt.secret,
            {
                expiresIn: Number(config.jwt.expiresIn)
            }
        );

        // Return login successful - token, user
        return res.status(200).json({
            success: true,
            message: 'Login successful',
            data: { 
                userId: user.id, 
                email: user.email,
                name: user.name,
                token: token
            }
        });

    }
    catch (error: unknown) {

        if (error instanceof ZodError) {
            return res.status(400).json({ 
                success: false, 
                message: 'Validation Error',
                errors: error.issues.map(issue => ({
                    field: issue.path.join('.'),
                    message: issue.message
                }))
            });
        }

        const errorMessage = error instanceof Error ? error.message : 'Unknown error';

        return res.status(500).json({
            success: false,
            message: errorMessage,
            errors: []
        });

        // TODO:
        // Implement environment check for message, only show details on DEV
        // process.env.NODE_ENV === 'development' ? errorMessage: 'An unexpected error occurred. Please try again later.'
    }
};


// VERIFY
export const verify = async(req: Request, res: Response) => {

    const tokenVerificationSchema = z.object({
        token: z.jwt()
    })

    try {

        const { token } = req.body;

        tokenVerificationSchema.parse({
            token: token
        })

        const decoded = jwt.verify(token, config.jwt.secret) as JwtPayload;
       
        // Update the user
        const  user = await db.query.appUser.findFirst({
            where: eq(appUser.id, parseInt(decoded.userId))
        });

        if (!user) {
            return res.status(400).json({
                success: false, 
                message: 'User not found',
                errors: []
            });
        }

        return res.status(200).json({
            success: true, 
            message: 'Verification successful',
            data: { 
                userId: user.id, 
                email: user.email,
                name: user.name
            }
        })
    }
    catch(error) {

        if (error instanceof ZodError) {
            return res.status(400).json({ 
                success: false, 
                message: 'Validation Error',
                errors: error.issues.map(issue => ({
                    field: issue.path.join('.'),
                    message: issue.message
                }))
            });
        }

        if (error instanceof Error) {

            // Handle specific JWT errors
            if (error.name === 'JsonWebTokenError') {
                return res.status(401).json({ 
                    success: false,
                    message: 'Invalid token.' 
                });
            }
                
            if (error.name === 'TokenExpiredError') {
                return res.status(401).json({ 
                    success: false,
                    message: 'Token expired.' 
                });
            }
        }

        res.status(400).json({
            success: false,
            message: 'Token verification failed'
        });
    }
}