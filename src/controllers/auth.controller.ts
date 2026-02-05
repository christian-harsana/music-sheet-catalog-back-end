import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { eq } from 'drizzle-orm';
import { db } from '../config/db';
import { appUser } from '../models/database/auth.schema';
import { config } from '../config/index';
import { z, ZodError } from 'zod';

// SIGN UP
export const signUp = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const { email, password, name } = req.body;

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
        next(error);
    }
};


// LOGIN
export const login = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const { email, password } = req.body;

        // Validate - Check if user exists
        const user = await db.query.appUser.findFirst({
            where: eq(appUser.email, email)
        });

        if (!user) {
            console.log('1');
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
        next(error);
    }
};


// VERIFY
export const verifyToken = async(req: Request, res: Response, next: NextFunction) => {

    try {

        const { token } = req.body;
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
        next(error);
    }
}