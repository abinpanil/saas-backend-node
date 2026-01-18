import { Router } from 'express';
import { healthRouter } from './health';
import { authRouter } from './modules/auth/auth.routes';
import { tenantRouter } from './modules/tenants/tenant.routes';
import { userRouter } from './modules/users/user.routes';

const router = Router();

router.use('/health', healthRouter);
router.use('/auth', authRouter);
router.use('/tenants', tenantRouter);
router.use('/users', userRouter);

export default router;
