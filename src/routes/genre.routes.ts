import { Router } from 'express';
import { addGenre, getGenre, updateGenre, deleteGenre } from '../controllers/genre.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { validationMiddleware } from '../middleware/validation.middleware';
import { createGenreSchema, getGenreSchema, updateGenreSchema, deleteGenreSchema } from '../models/validation/genre.schema';

const router = Router();

router.post('/', authMiddleware, validationMiddleware(createGenreSchema), addGenre);
router.get('/', authMiddleware, validationMiddleware(getGenreSchema), getGenre);
router.put('/:id', authMiddleware, validationMiddleware(updateGenreSchema), updateGenre);
router.delete('/:id', authMiddleware, validationMiddleware(deleteGenreSchema), deleteGenre);

export default router;