import { Router } from 'express';
import { addSource, getSource, updateSource, deleteSource } from '../controllers/source.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { createSourceSchema, getSourceSchema, updateSourceSchema, deleteSourceSchema } from '../models/source.schema';
import { validationMiddleware } from '../middleware/validation.middleware';


const router = Router();

router.post('/', authMiddleware, validationMiddleware(createSourceSchema), addSource);
router.get('/', authMiddleware, validationMiddleware(getSourceSchema), getSource);
router.put('/:id', authMiddleware, validationMiddleware(updateSourceSchema), updateSource);
router.delete('/:id', authMiddleware, validationMiddleware(deleteSourceSchema), deleteSource);

export default router;