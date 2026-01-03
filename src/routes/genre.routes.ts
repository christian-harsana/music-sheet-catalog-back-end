import { Router } from 'express';
import { addGenre, getGenre, updateGenre, deleteGenre } from '../controllers/genre.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.post('/', authMiddleware, addGenre);
router.get('/', authMiddleware, getGenre);
router.put('/:id', authMiddleware, updateGenre);
router.delete('/:id', authMiddleware, deleteGenre);

export default router;