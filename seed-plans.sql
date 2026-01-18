-- Seed subscription plans
INSERT INTO subscription_plans (id, name, price, features, created_at, updated_at) VALUES
  (gen_random_uuid(), 'Free', 0, '{"max_users": 1}', NOW(), NOW()),
  (gen_random_uuid(), 'Basic', 9.99, '{"max_users": 5}', NOW(), NOW()),
  (gen_random_uuid(), 'Pro', 29.99, '{"max_users": 20}', NOW(), NOW()),
  (gen_random_uuid(), 'Enterprise', 99.99, '{"max_users": 100}', NOW(), NOW())
ON CONFLICT (name) DO NOTHING;
