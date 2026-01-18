import { Request, Response, NextFunction } from 'express';
import { TenantService } from './tenant.service';
import { UpdateTenantDto } from './tenant.types';

export class TenantController {
  private tenantService = new TenantService();

  /**
   * Get current tenant
   * GET /tenants/me
   */
  getMe = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      // Extract tenantId from authenticated user context
      const tenantId = req.user!.tenantId;
      
      const result = await this.tenantService.getCurrentTenant(tenantId);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Update current tenant
   * PUT /tenants/me
   */
  updateMe = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      // Extract tenantId from authenticated user context
      const tenantId = req.user!.tenantId;
      const dto: UpdateTenantDto = req.body;
      
      const result = await this.tenantService.updateTenant(tenantId, dto);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };
}
