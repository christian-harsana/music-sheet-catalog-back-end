import { Router } from 'express';
import { signUp, login, verifyToken } from '../controllers/auth.controller'
import { loginSchema, signupSchema, tokenVerificationSchema } from '../models/auth.schema';
import { validationMiddleware } from '../middleware/validation.middleware';

const router = Router();

router.post('/signup', validationMiddleware(signupSchema), signUp);
router.post('/login', validationMiddleware(loginSchema), login);
router.post('/verify', validationMiddleware(tokenVerificationSchema), verifyToken);

export default router;