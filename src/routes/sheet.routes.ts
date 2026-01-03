import { Router } from 'express';
import { addSheet, getSheet, updateSheet, deleteSheet } from '../controllers/sheet.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.post('/', authMiddleware, addSheet);
router.get('/', authMiddleware, getSheet);
router.put('/:id', authMiddleware, updateSheet);
router.delete('/:id', authMiddleware, deleteSheet);

export default router;