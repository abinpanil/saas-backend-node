import { Router } from 'express';
import { healthRouter } from './health';
import { authRouter } from './modules/auth/auth.routes';
import { tenantRouter } from './modules/tenants/tenant.routes';

const router = Router();

router.use('/health', healthRouter);
router.use('/auth', authRouter);
router.use('/tenants', tenantRouter);

export default router;
