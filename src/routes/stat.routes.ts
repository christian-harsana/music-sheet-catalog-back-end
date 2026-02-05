import { Router } from 'express';
import { summary } from '../controllers/stat.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { validationMiddleware } from '../middleware/validation.middleware';
import { getStatSchema } from '../models/validation/stat.schema';

const router = Router();

router.get('/', authMiddleware, validationMiddleware(getStatSchema), summary);

export default router;