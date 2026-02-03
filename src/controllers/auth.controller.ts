import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { eq } from 'drizzle-orm';
import { db } from '../config/db';
import { appUser } from '../models/app-user.schema';
import { config } from '../config/index';
import { z, ZodError } from 'zod';

// SIGN UP
export const signUp = async (req: Request, res: Response, next: NextFunction) => {

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
            throw new Error("Conflict", {cause: "User already exists"});
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

        next(error);
    }
};


// LOGIN
export const login = async (req: Request, res: Response, next: NextFunction) => {
  
    // Define expected data schema
    const loginSchema = z.object({
        email: z.email(),
        password: z.string().min(7)
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
            throw new Error('Unauthorized', {cause: 'Invalid email or password'});
        }

        // Compare Password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            throw new Error('Unauthorized', {cause: 'Invalid email or password'});
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

        next(error);
    }
};


// VERIFY
export const verify = async(req: Request, res: Response, next: NextFunction) => {

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
            throw new Error('Not Found', {cause: 'User not found'});
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
    catch(error: unknown) {

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

        next(error);
    }
}