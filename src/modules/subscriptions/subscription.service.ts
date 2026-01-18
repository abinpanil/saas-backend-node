import { AppDataSource } from '../../config/data-source';
import { SubscriptionPlan } from '../../database/entities/subscription-plan.entity';
import {
  Subscription,
  SubscriptionStatus,
} from '../../database/entities/subscription.entity';
import { Tenant } from '../../database/entities/tenant.entity';
import { NotFoundError, ValidationError } from '../../common/utils/errors';
import {
  PlanResponseDto,
  CurrentSubscriptionResponseDto,
  ChangePlanDto,
} from './subscription.types';

export class SubscriptionService {
  private planRepository = AppDataSource.getRepository(SubscriptionPlan);
  private subscriptionRepository = AppDataSource.getRepository(Subscription);
  private tenantRepository = AppDataSource.getRepository(Tenant);

  /**
   * Get all available subscription plans
   */
  async getAvailablePlans(): Promise<PlanResponseDto[]> {
    const plans = await this.planRepository.find({
      order: { price: 'ASC' },
    });

    return plans.map((plan) => ({
      id: plan.id,
      name: plan.name,
      price: Number(plan.price),
      features: plan.features,
    }));
  }

  /**
   * Get current subscription for tenant
   */
  async getCurrentSubscription(
    tenantId: string
  ): Promise<CurrentSubscriptionResponseDto> {
    const subscription = await this.subscriptionRepository.findOne({
      where: {
        tenant: { id: tenantId },
        status: SubscriptionStatus.ACTIVE,
      },
      relations: ['plan'],
      order: { createdAt: 'DESC' },
    });

    if (!subscription) {
      throw new NotFoundError('No active subscription found');
    }

    return {
      plan: subscription.plan.name,
      status: subscription.status,
      expiresAt: subscription.expiresAt.toISOString().split('T')[0],
    };
  }

  /**
   * Change subscription plan
   */
  async changePlan(
    tenantId: string,
    dto: ChangePlanDto
  ): Promise<CurrentSubscriptionResponseDto> {
    // Validate input
    if (!dto.planId) {
      throw new ValidationError('Plan ID is required');
    }

    // Find the new plan
    const newPlan = await this.planRepository.findOne({
      where: { id: dto.planId },
    });

    if (!newPlan) {
      throw new NotFoundError('Subscription plan not found');
    }

    // Find tenant
    const tenant = await this.tenantRepository.findOne({
      where: { id: tenantId },
    });

    if (!tenant) {
      throw new NotFoundError('Tenant not found');
    }

    // Find current active subscription
    const currentSubscription = await this.subscriptionRepository.findOne({
      where: {
        tenant: { id: tenantId },
        status: SubscriptionStatus.ACTIVE,
      },
    });

    // If there's an active subscription, expire it
    if (currentSubscription) {
      currentSubscription.status = SubscriptionStatus.EXPIRED;
      await this.subscriptionRepository.save(currentSubscription);
    }

    // Create new subscription
    const newExpiryDate = new Date();
    newExpiryDate.setDate(newExpiryDate.getDate() + 30); // 30 days from now

    const newSubscription = this.subscriptionRepository.create({
      tenant,
      plan: newPlan,
      status: SubscriptionStatus.ACTIVE,
      startedAt: new Date(),
      expiresAt: newExpiryDate,
    });

    await this.subscriptionRepository.save(newSubscription);

    return {
      plan: newPlan.name,
      status: newSubscription.status,
      expiresAt: newSubscription.expiresAt.toISOString().split('T')[0],
    };
  }
}
