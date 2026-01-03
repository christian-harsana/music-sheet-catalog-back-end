import { Router } from 'express';
import { addSource, getSource, updateSource, deleteSource } from '../controllers/source.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.post('/', authMiddleware, addSource);
router.get('/', authMiddleware, getSource);
router.put('/:id', authMiddleware, updateSource);
router.delete('/:id', authMiddleware, deleteSource);

export default router;