import { Router } from 'express';
import { 
	addLevel, 
	getLevel,
	getLevelLookup, 
	updateLevel, 
	deleteLevel 
} from '../controllers/level.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { validationMiddleware } from '../middleware/validation.middleware';
import {
	createLevelSchema,
	getLevelSchema,
	getLevelLookupSchema,
	updateLevelSchema,
	deleteLevelSchema,
} from '../models/validation/level.schema';

const router = Router();

router.post('/', authMiddleware, validationMiddleware(createLevelSchema), addLevel);
router.get('/', authMiddleware, validationMiddleware(getLevelSchema), getLevel);
router.get('/', authMiddleware, validationMiddleware(getLevelLookupSchema), getLevelLookup);
router.put('/:id', authMiddleware, validationMiddleware(updateLevelSchema), updateLevel);
router.delete('/:id', authMiddleware, validationMiddleware(deleteLevelSchema), deleteLevel);

export default router;
