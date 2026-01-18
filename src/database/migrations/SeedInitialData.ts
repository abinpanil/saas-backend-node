import { MigrationInterface, QueryRunner } from 'typeorm';
import * as bcrypt from 'bcrypt';

export class SeedInitialData1700000000000 implements MigrationInterface {
  name = 'SeedInitialData1700000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1️⃣ Insert subscription plans
    await queryRunner.query(`
      INSERT INTO subscription_plans (id, name, price, features, created_at, updated_at)
      VALUES
        (uuid_generate_v4(), 'Free', 0, '{"max_users": 1, "api_access": false}', now(), now()),
        (uuid_generate_v4(), 'Basic', 29, '{"max_users": 5, "api_access": true}', now(), now()),
        (uuid_generate_v4(), 'Pro', 99, '{"max_users": 50, "api_access": true}', now(), now())
      ON CONFLICT (name) DO NOTHING;
    `);

    // 2️⃣ Create default tenant
    const tenantResult = await queryRunner.query(`
      INSERT INTO tenants (id, name, slug, status, created_at, updated_at)
      VALUES (uuid_generate_v4(), 'Demo Tenant', 'demo', 'active', now(), now())
      RETURNING id;
    `);

    const tenantId = tenantResult[0].id;

    // 3️⃣ Create admin user
    const passwordHash = await bcrypt.hash('Admin@123', 10);

    await queryRunner.query(
      `
      INSERT INTO users (
        id, email, password_hash, role, is_active, tenant_id, created_at, updated_at
      )
      VALUES (
        uuid_generate_v4(),
        $1,
        $2,
        'admin',
        true,
        $3,
        now(),
        now()
      );
      `,
      ['admin@demo.com', passwordHash, tenantId]
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DELETE FROM users WHERE email = 'admin@demo.com';
    `);

    await queryRunner.query(`
      DELETE FROM tenants WHERE slug = 'demo';
    `);

    await queryRunner.query(`
      DELETE FROM subscription_plans
      WHERE name IN ('Free', 'Basic', 'Pro');
    `);
  }
}
