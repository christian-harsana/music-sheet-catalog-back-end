import { Router } from 'express';
import { signUp, login, verifyToken } from '../controllers/auth.controller'
import { validationMiddleware } from '../middleware/validation.middleware';
import { authRouteLimiter } from '../middleware/rateLimiter.middleware';
import { loginSchema, signupSchema, tokenVerificationSchema } from '../models/validation/auth.schema';

const router = Router();

router.post('/signup', authRouteLimiter, validationMiddleware(signupSchema), signUp);
router.post('/login', authRouteLimiter, validationMiddleware(loginSchema), login);
router.post('/verify', validationMiddleware(tokenVerificationSchema), verifyToken);

export default router;