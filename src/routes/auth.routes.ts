import { Router } from 'express';
import { signUp, login, verify } from '../controllers/auth.controller'
import { validationMiddleware } from '../middleware/validation.middleware';

const router = Router();

router.post('/signup', signUp);
router.post('/login', login);
router.post('/verify', verify );

export default router;