import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { eq } from 'drizzle-orm';
import { db } from '../config/db';
import { appUser } from '../models/app-user.schema';
import { config } from '../config/index';

// SIGN UP
export const signUp = async (req: Request, res: Response) => {

    const { email, password, name } = req.body;

    // Validate Input - Required 
    if (!email || !password) {
         return res.status(400).json({ 
            status: 'error', 
            message: 'Email and password are required'
        });
    }
    
    try {
        // Validate - Check if user exists
        // const existingUser = await db.select().from(appUser).where(eq(appUser.email, email));

        const existingUser = await db.query.appUser.findFirst({
            where: eq(appUser.email, email)
        });

        if (existingUser) {
            return res.status(409).json({ 
                status: 'error', 
                message: 'User already exists'
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
            status: 'success', 
            message: 'User registered successfully' 
        });
    }
    catch (error: unknown) {

        const errorMessage = error instanceof Error ? error.message : 'Unknown error';

        return res.status(500).json({ 
            status: 'error', 
            message: 'Server error',
            error: errorMessage 
        });
    }
};


// LOGIN
export const login = async (req: Request, res: Response) => {
  
    const { email, password } = req.body;

    // Validate Input
    if (!email || !password) {
         return res.status(400).json({ 
            status: 'error', 
            message: 'Email and password are required'
        });
    }

    try {
        // Validate - Check if user exists
        const user = await db.query.appUser.findFirst({
            where: eq(appUser.email, email)
        });

        if (!user) {
            return res.status(401).json({
                status: 'error',
                message: 'Invalid email or password'
            });
        }

        // Compare Password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({
                status: 'error',
                message: 'Invalid email or password'
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
            status: 'success',
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

        const errorMessage = error instanceof Error ? error.message : 'Unknown error';

        return res.status(500).json({
            status: 'error',
            message: 'Server error',
            error: errorMessage
        })
    }
};