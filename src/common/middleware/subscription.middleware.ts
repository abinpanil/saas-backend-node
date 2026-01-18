import { Request, Response, NextFunction } from 'express';
import { AppDataSource } from '../../config/data-source';
import { Subscription, SubscriptionStatus } from '../../database/entities/subscription.entity';
import { User } from '../../database/entities/user.entity';
import { UnauthorizedError } from '../utils/errors';

/**
 * Subscription guard middleware
 * Enforces subscription plan limits (e.g., max users)
 * Should be applied to endpoints that need limit enforcement
 */
export function subscriptionMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  // This middleware is primarily for user creation
  // It checks if the tenant has reached their max users limit
  
  const tenantId = req.user?.tenantId;
  
  if (!tenantId) {
    return next(new UnauthorizedError('Tenant context required'));
  }

  // Get current subscription and check limits
  const subscriptionRepository = AppDataSource.getRepository(Subscription);
  const userRepository = AppDataSource.getRepository(User);

  Promise.all([
    subscriptionRepository.findOne({
      where: {
        tenant: { id: tenantId },
        status: SubscriptionStatus.ACTIVE,
      },
      relations: ['plan'],
    }),
    userRepository.count({
      where: { tenant: { id: tenantId } },
    }),
  ])
    .then(([subscription, currentUserCount]) => {
      if (!subscription) {
        return next(new UnauthorizedError('No active subscription found'));
      }

      // Check max users limit
      const maxUsers = subscription.plan.features?.max_users;
      
      if (maxUsers && currentUserCount >= maxUsers) {
        return next(
          new UnauthorizedError(
            `User limit reached. Your plan allows ${maxUsers} user(s).`
          )
        );
      }

      next();
    })
    .catch((error) => {
      next(error);
    });
}
