import { Router } from 'express';
import { getStats } from '../controllers/stat.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { validationMiddleware } from '../middleware/validation.middleware';
import { getStatSchema } from '../models/validation/stat.schema';

const router = Router();

router.get('/', authMiddleware, validationMiddleware(getStatSchema), getStats);

export default router;
