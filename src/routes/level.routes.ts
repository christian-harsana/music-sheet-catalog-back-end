import { Router } from 'express';
import { addLevel, getLevel, updateLevel, deleteLevel } from '../controllers/level.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.post('/', authMiddleware, addLevel);
router.get('/', authMiddleware, getLevel);
router.put('/:id', authMiddleware, updateLevel);
router.delete('/:id', authMiddleware, deleteLevel);

export default router;