import { Request, Response, NextFunction } from 'express';
import { SubscriptionService } from './subscription.service';
import { ChangePlanDto } from './subscription.types';

export class SubscriptionController {
  private subscriptionService = new SubscriptionService();

  /**
   * Get available subscription plans
   * GET /subscriptions/plans
   */
  getPlans = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const result = await this.subscriptionService.getAvailablePlans();
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get current subscription
   * GET /subscriptions/current
   */
  getCurrent = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const tenantId = req.user!.tenantId;
      const result = await this.subscriptionService.getCurrentSubscription(
        tenantId
      );
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Change subscription plan
   * POST /subscriptions/change
   */
  changePlan = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const tenantId = req.user!.tenantId;
      const dto: ChangePlanDto = req.body;
      const result = await this.subscriptionService.changePlan(tenantId, dto);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };
}
