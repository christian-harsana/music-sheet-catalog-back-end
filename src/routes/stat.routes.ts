import { Router } from 'express';
import { summary } from '../controllers/stat.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.get('/', authMiddleware, summary);

export default router;