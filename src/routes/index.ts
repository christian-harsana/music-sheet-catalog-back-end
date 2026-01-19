import { Router, Request, Response } from 'express';
import healthRoutes from './health.routes';
import authRoutes from './auth.routes';
import profileRoutes from './profile.routes';
import genreRoutes from './genre.routes';
import levelRoutes from './level.routes';
import sourceRoutes from './source.routes';
import sheetRoutes from './sheet.routes';
import statRoutes from './stat.routes';

const router = Router();

router.use('/health', healthRoutes);
router.use('/auth', authRoutes);
router.use('/profile', profileRoutes);
router.use('/genre', genreRoutes);
router.use('/level', levelRoutes);
router.use('/source', sourceRoutes);
router.use('/sheet', sheetRoutes);
router.use('/stats', statRoutes);

export default router; 