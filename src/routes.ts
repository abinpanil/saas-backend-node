import { Router } from 'express';
import { healthRouter } from './health';

const router = Router();

router.use('/health', healthRouter);

// later:
// router.use('/auth', authRoutes);
// router.use('/users', userRoutes);

export default router;
