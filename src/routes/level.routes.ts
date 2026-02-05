import { Router } from 'express';
import { addLevel, getLevel, updateLevel, deleteLevel } from '../controllers/level.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { validationMiddleware } from '../middleware/validation.middleware';
import { createLevelSchema, getLevelSchema, updateLevelSchema, deleteLevelSchema } from '../models/validation/level.schema';


const router = Router();

router.post('/', authMiddleware, validationMiddleware(createLevelSchema), addLevel);
router.get('/', authMiddleware, validationMiddleware(getLevelSchema), getLevel);
router.put('/:id', authMiddleware, validationMiddleware(updateLevelSchema), updateLevel);
router.delete('/:id', authMiddleware, validationMiddleware(deleteLevelSchema), deleteLevel);

export default router;