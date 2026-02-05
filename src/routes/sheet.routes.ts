import { Router } from 'express';
import { addSheet, getSheet, updateSheet, deleteSheet } from '../controllers/sheet.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { validationMiddleware } from '../middleware/validation.middleware';
import { createSheetSchema, getSheetSchema, updateSheetSchema, deleteSheetSchema } from '../models/validation/sheet.schema';


const router = Router();

router.post('/', authMiddleware, validationMiddleware(createSheetSchema), addSheet);
router.get('/', authMiddleware, validationMiddleware(getSheetSchema), getSheet);
router.put('/:id', authMiddleware, validationMiddleware(updateSheetSchema), updateSheet);
router.delete('/:id', authMiddleware, validationMiddleware(deleteSheetSchema),deleteSheet);

export default router;