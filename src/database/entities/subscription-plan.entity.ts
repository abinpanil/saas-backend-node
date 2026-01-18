import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity({ name: 'subscription_plans' })
export class SubscriptionPlan extends BaseEntity {
  @Column({ unique: true })
  name!: string;

  @Column({ type: 'decimal' })
  price!: number;

  @Column({ type: 'jsonb' })
  features!: Record<string, any>;
}
