import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';
import { Subscription } from './subscription.entity';

export enum TenantStatus {
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
}

@Entity({ name: 'tenants' })
export class Tenant extends BaseEntity {
  @Column()
  name!: string;

  @Column({ unique: true })
  slug!: string;

  @Column({
    type: 'enum',
    enum: TenantStatus,
    default: TenantStatus.ACTIVE,
  })
  status!: TenantStatus;

  @OneToMany(() => User, (user) => user.tenant)
  users!: User[];

  @OneToMany(() => Subscription, (subscription) => subscription.tenant)
  subscriptions!: Subscription[];
}
