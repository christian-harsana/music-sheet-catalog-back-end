import { Router } from 'express';
import { addSource, getSource, updateSource, deleteSource } from '../controllers/source.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { validationMiddleware } from '../middleware/validation.middleware';
import { createSourceSchema, getSourceSchema, updateSourceSchema, deleteSourceSchema } from '../models/validation/source.schema';


const router = Router();

router.post('/', authMiddleware, validationMiddleware(createSourceSchema), addSource);
router.get('/', authMiddleware, validationMiddleware(getSourceSchema), getSource);
router.put('/:id', authMiddleware, validationMiddleware(updateSourceSchema), updateSource);
router.delete('/:id', authMiddleware, validationMiddleware(deleteSourceSchema), deleteSource);

export default router;