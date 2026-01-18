# 🚀 SaaS Backend – Production Ready

A **production-ready, multi-tenant SaaS backend** built with **Node.js, TypeScript, Docker, PostgreSQL, Redis, and TypeORM**.

This repository serves as a **real-world reference implementation** for building scalable SaaS backends with clean architecture, tenant isolation, and cloud-ready deployment.

---

## ✨ Highlights

- Modular, feature-based architecture
- Secure multi-tenant data isolation
- JWT authentication with role-based access control (RBAC)
- Docker-first development & production setup
- Managed PostgreSQL and Redis support
- CI/CD-ready with GitHub Actions
- Designed for real SaaS products (not toy examples)

---

## 🧱 Architecture Overview

- **Architecture style:** Modular monolith (microservice-ready)
- **Separation of concerns:** Controllers → Services → Data layer
- **Tenant isolation:** Enforced at middleware and database query level
- **Stateless API:** Horizontal scaling ready
- **Infrastructure:** Container-based, cloud-agnostic

This architecture allows the system to scale and evolve into microservices if required.

---

## 🏢 Multi-Tenancy Strategy

- Each request is associated with a `tenantId` (derived from JWT)
- Tenant context is resolved via middleware
- All database queries are scoped to the tenant
- Cross-tenant access is structurally prevented

This ensures **data safety and scalability** in SaaS environments.

---

## 🛠️ Tech Stack

| Layer | Technology |
|------|-----------|
| Language | TypeScript |
| Runtime | Node.js (18 LTS) |
| Framework | Express |
| ORM | TypeORM |
| Database | PostgreSQL |
| Cache | Redis |
| Authentication | JWT |
| Containers | Docker |
| CI/CD | GitHub Actions |
| Cloud | Railway / AWS compatible |

---

## 📁 Project Structure

```bash
saas-backend-node/
├── .github/workflows/ci.yml
├── docker/
│   ├── Dockerfile
│   ├── Dockerfile.dev
│   ├── docker-compose.yml
│   └── docker-compose.dev.yml
├── src/
│   ├── app.ts
│   ├── server.ts
│   ├── config/
│   ├── database/
│   │   ├── entities/
│   │   └── migrations/
│   ├── modules/
│   │   ├── auth/
│   │   ├── users/
│   │   ├── tenants/
│   │   └── subscriptions/
│   ├── common/
│   │   ├── middleware/
│   │   ├── utils/
│   │   └── constants/
│   ├── docs/        # Swagger configuration
│   ├── routes.ts
│   └── health.ts
├── tests/
├── .env.example
├── package.json
├── tsconfig.json
└── README.md
```

---

## Prerequisites

- **Node.js** ≥ 18
- **Docker** & **Docker Compose**
- **Git**

**Optional** (if not using Docker locally):
- **PostgreSQL** ≥ 14
- **Redis** ≥ 6

---

## Local Development

### Clone the Repository

```bash
git clone https://github.com/abinpanil/saas-backend-node.git
cd saas-backend-node
```

### Environment Configuration

```bash
cp .env.example .env
```

Update values as required.

### Run with Docker (Recommended)

```bash
cd docker
docker-compose -f docker-compose.dev.yml up --build
```

**Features:**
- Hot reload enabled
- PostgreSQL and Redis included
- Close parity with production

### Run Database Migrations

```bash
npm run migration:run
```

### Access Services

- **API:** http://localhost:3000
- **Health check:** http://localhost:3000/health
- **Swagger docs:** http://localhost:3000/api-docs

---

## API Documentation (Swagger)

Swagger UI is available at:

```
/api-docs
```

**Includes:**
- JWT authentication testing
- Request/response schemas
- Auto-generated documentation

---

## Health Check

```
GET /health
```

**Used by:**
- Docker
- Cloud platforms
- Load balancers
- Monitoring systems

Returns **200 OK** when the service is alive.

---

## Database Migrations

### Generate a Migration

```bash
npm run migration:generate
```

### Run Migrations

```bash
npm run migration:run
```

### Revert Migration

```bash
npm run migration:revert
```

> **Note:** Migrations are not auto-run in production and should be executed as a controlled deployment step.

---

## Production Deployment

### Docker (Production)

```bash
docker-compose up --build -d
```

**Production features:**
- Multi-stage Docker builds
- Non-root container user
- Optimized image size
- Health checks and restart policies

### Railway Deployment (Recommended)

- Dockerfile-based deployment
- Managed PostgreSQL and Redis
- CI via GitHub Actions
- Secrets managed via GitHub Environments

**Best practices:**
- Node.js 18 runtime
- Manual migration execution
- Health-based deployments

---

## CI/CD

- **Continuous Integration** via GitHub Actions
- **Continuous Deployment** handled by Railway
- Secrets stored securely using GitHub Environments
- No secrets committed to the repository

---

## Testing

```bash
npm test
```

**Includes:**
- Authentication tests
- Tenant isolation tests
- Core API tests

---

## Security Considerations

- JWT-based authentication
- Role-based authorization
- Tenant-level data isolation
- No runtime schema synchronization
- Non-root Docker containers

---

## Roadmap

- [ ] Rate limiting using Redis
- [ ] Subscription enforcement middleware
- [ ] Background job processing
- [ ] Observability (metrics and tracing)
- [ ] Staging environment
- [ ] WebSocket support