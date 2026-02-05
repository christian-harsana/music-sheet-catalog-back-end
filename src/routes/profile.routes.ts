import { Router } from 'express';
import { profile } from '../controllers/profile.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { validationMiddleware } from '../middleware/validation.middleware';
import { getProfileSchema } from '../models/validation/profile.schema';

const router = Router();

router.get('/', authMiddleware, validationMiddleware(getProfileSchema), profile);

export default router;