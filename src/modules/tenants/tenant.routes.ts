import { Router } from 'express';
import { TenantController } from './tenant.controller';
import { authMiddleware } from '../../common/middleware/auth.middleware';
import { adminMiddleware } from '../../common/middleware/admin.middleware';

const router = Router();
const tenantController = new TenantController();

// Apply authentication and admin middleware to all routes
router.use(authMiddleware);
router.use(adminMiddleware);

/**
 * @swagger
 * components:
 *   schemas:
 *     TenantResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           example: f8c15ee4-947e-7f64-4a00-c15ee
 *         name:
 *           type: string
 *           example: Acme Corp
 *         slug:
 *           type: string
 *           example: acme
 *         status:
 *           type: string
 *           enum: [active, suspended]
 *           example: active
 *     UpdateTenantRequest:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         name:
 *           type: string
 *           description: New tenant name
 *           example: Acme Corporation
 */

/**
 * @swagger
 * tags:
 *   - name: Tenants
 *     description: Tenant management endpoints (Admin only)
 */

/**
 * @swagger
 * /api/v1/tenants/me:
 *   get:
 *     summary: Get current tenant
 *     description: Retrieves the current tenant's information (Admin only)
 *     tags: [Tenants]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Tenant information retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TenantResponse'
 *       401:
 *         description: Unauthorized - missing or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               message: No token provided
 *       403:
 *         description: Forbidden - admin access required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               message: Admin access required
 *       404:
 *         description: Tenant not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               message: Tenant not found
 */
router.get('/me', tenantController.getMe);

/**
 * @swagger
 * /api/v1/tenants/me:
 *   put:
 *     summary: Update current tenant
 *     description: Updates the current tenant's information (Admin only)
 *     tags: [Tenants]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateTenantRequest'
 *     responses:
 *       200:
 *         description: Tenant updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TenantResponse'
 *       400:
 *         description: Validation error - invalid tenant name
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               message: Tenant name is required
 *       401:
 *         description: Unauthorized - missing or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               message: No token provided
 *       403:
 *         description: Forbidden - admin access required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               message: Admin access required
 *       404:
 *         description: Tenant not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               message: Tenant not found
 */
router.put('/me', tenantController.updateMe);

export { router as tenantRouter };
