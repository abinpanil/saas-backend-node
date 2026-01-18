import { Router } from 'express';
import { SubscriptionController } from './subscription.controller';
import { authMiddleware } from '../../common/middleware/auth.middleware';
import { adminMiddleware } from '../../common/middleware/admin.middleware';

const router = Router();
const subscriptionController = new SubscriptionController();

// Apply authentication and admin middleware to all routes
router.use(authMiddleware);
router.use(adminMiddleware);

/**
 * @swagger
 * components:
 *   schemas:
 *     PlanResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *           example: Free
 *         price:
 *           type: number
 *           example: 0
 *         features:
 *           type: object
 *           example: { "max_users": 1 }
 *     CurrentSubscriptionResponse:
 *       type: object
 *       properties:
 *         plan:
 *           type: string
 *           example: Basic
 *         status:
 *           type: string
 *           enum: [active, expired, canceled]
 *           example: active
 *         expiresAt:
 *           type: string
 *           format: date
 *           example: "2025-12-31"
 *     ChangePlanRequest:
 *       type: object
 *       required:
 *         - planId
 *       properties:
 *         planId:
 *           type: string
 *           format: uuid
 *           description: ID of the new subscription plan
 */

/**
 * @swagger
 * tags:
 *   - name: Subscriptions
 *     description: Subscription management endpoints (Admin only)
 */

/**
 * @swagger
 * /api/v1/subscriptions/plans:
 *   get:
 *     summary: Get available subscription plans
 *     description: Retrieves all available subscription plans
 *     tags: [Subscriptions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Plans retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/PlanResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/plans', subscriptionController.getPlans);

/**
 * @swagger
 * /api/v1/subscriptions/current:
 *   get:
 *     summary: Get current subscription
 *     description: Retrieves the current active subscription for the tenant
 *     tags: [Subscriptions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current subscription retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CurrentSubscriptionResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: No active subscription found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/current', subscriptionController.getCurrent);

/**
 * @swagger
 * /api/v1/subscriptions/change:
 *   post:
 *     summary: Change subscription plan
 *     description: Changes the tenant's subscription to a new plan
 *     tags: [Subscriptions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ChangePlanRequest'
 *     responses:
 *       200:
 *         description: Subscription plan changed successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CurrentSubscriptionResponse'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Plan not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/change', subscriptionController.changePlan);

export { router as subscriptionRouter };
