import {
  Column,
  Entity,
  ManyToOne,
  Index,
  JoinColumn,
} from 'typeorm';
import { BaseEntity } from './base.entity';
import { Tenant } from './tenant.entity';

export enum UserRole {
  ADMIN = 'admin',
  MEMBER = 'member',
}

@Entity({ name: 'users' })
@Index(['tenant', 'email'], { unique: true })
export class User extends BaseEntity {
  @Column()
  email!: string;

  @Column({ name: 'password_hash' })
  passwordHash!: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.MEMBER,
  })
  role!: UserRole;

  @Column({ name: 'is_active', default: true })
  isActive!: boolean;

  @ManyToOne(() => Tenant, (tenant) => tenant.users, { nullable: false })
  @JoinColumn({ name: 'tenant_id' })
  tenant!: Tenant;
}
