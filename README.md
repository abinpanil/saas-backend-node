# SaaS Backend – Production Ready

A production-ready, multi-tenant SaaS backend built using **Node.js, TypeScript, Docker, PostgreSQL, and Redis**.

This repository is intended as a **real-world reference implementation** demonstrating backend architecture, system design, and cloud-ready development practices suitable for SaaS products.

---

> **Note for readers:**  
> For most use cases, the sections **Overview**, **Architecture**, and **Local Development Setup** are sufficient to get started.  
> Deployment and advanced sections are provided for completeness and real-world scenarios.

---

## Overview

This backend is designed with a **modular, feature-based architecture** that supports:
- Multi-tenancy
- Authentication & authorization
- Clean separation of concerns
- Cloud-ready deployment

It is ideal as a foundation for **SaaS products, MVPs, and startup backends**.

---

## Key Features

- Node.js + TypeScript REST API
- Modular, feature-based architecture
- Multi-tenant support with tenant isolation
- JWT-based authentication
- Role-based access control (RBAC)
- PostgreSQL for persistent data
- Redis for caching and performance
- Dockerized for local and production use
- CI-ready structure (GitHub Actions compatible)

---

## Tech Stack

| Layer | Technology |
|------|-----------|
| Language | TypeScript |
| Runtime | Node.js |
| Framework | Express |
| Database | PostgreSQL |
| Cache | Redis |
| ORM | TypeORM |
| Authentication | JWT |
| Containers | Docker |
| CI/CD | GitHub Actions |
| Cloud Ready | AWS-compatible |

---

## Architecture

- **Modular monolith** (microservice-ready)
- Feature-based modules (auth, users, tenants, subscriptions)
- Controllers handle HTTP concerns
- Services contain business logic
- Centralized middleware for auth, tenant resolution, and errors

This structure allows **easy migration to microservices** if required.

---

## Multi-Tenancy Strategy

- Each request is associated with a `tenantId`
- Tenant context is resolved via middleware
- All database queries are scoped to the tenant
- Prevents cross-tenant data access

This approach ensures **data isolation and scalability** for SaaS environments.

---

## Project Structure

```bash
saas-backend-node/
├── .github/
│   └── workflows/
│       └── ci.yml
│
├── docker/
│   ├── Dockerfile
│   └── docker-compose.yml
│
├── src/
│   ├── app.ts
│   ├── server.ts
│   │
│   ├── docs/
│   │   ├── swagger-options.ts
│   │   └── swagger.ts
│   │
│   ├── config/
│   │   ├── env.ts
│   │   ├── data-source.ts        # TypeORM DataSource
│   │   ├── redis.ts
│   │   └── logger.ts
│   │
│   ├── database/
│   │   ├── entities/
│   │   │   ├── base.entity.ts
│   │   │   ├── user.entity.ts
│   │   │   ├── tenant.entity.ts
│   │   │   └── subscription.entity.ts
│   │   │
│   │   └── migrations/
│   │
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.routes.ts
│   │   │   └── auth.types.ts
│   │   │
│   │   ├── users/
│   │   │   ├── user.controller.ts
│   │   │   ├── user.service.ts
│   │   │   ├── user.routes.ts
│   │   │   └── user.types.ts
│   │   │
│   │   ├── tenants/
│   │   │   ├── tenant.controller.ts
│   │   │   ├── tenant.service.ts
│   │   │   ├── tenant.routes.ts
│   │   │   └── tenant.types.ts
│   │   │
│   │   └── subscriptions/
│   │       ├── subscription.controller.ts
│   │       ├── subscription.service.ts
│   │       ├── subscription.routes.ts
│   │       └── subscription.types.ts
│   │
│   ├── common/
│   │   ├── middleware/
│   │   │   ├── auth.middleware.ts
│   │   │   ├── tenant.middleware.ts
│   │   │   └── error.middleware.ts
│   │   │
│   │   ├── utils/
│   │   │   ├── jwt.ts
│   │   │   ├── password.ts
│   │   │   ├── pagination.ts
│   │   │   └── response.ts
│   │   │
│   │   └── constants/
│   │       └── roles.ts
│   │
│   ├── routes.ts
│   └── health.ts
│
├── tests/
│   ├── auth.test.ts
│   ├── user.test.ts
│   └── tenant.test.ts
│
├── .env.example
├── package.json
├── tsconfig.json
└── README.md
```

---

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** or **yarn** - Package manager
- **Docker** and **Docker Compose** - [Download](https://www.docker.com/products/docker-desktop)
- **PostgreSQL** (v14 or higher) - For local development without Docker
- **Redis** (v6 or higher) - For caching
- **Git** - Version control

---

## Local Development Setup

### 1. Clone the Repository

```bash
git clone https://github.com/abinpanil/saas-backend-node.git
cd saas-backend-node
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Update the `.env` file with your configuration:

### 4. Database Setup

#### Option A: Using Docker (Recommended)

```bash
# Start PostgreSQL and Redis containers
docker-compose up -d postgres redis

# Run migrations
npm run migration:run
```

#### Option B: Local PostgreSQL

```bash
# Create database
createdb saas_backend

# Run migrations
npm run migration:run
```

### 5. Start Development Server

```bash
# Development mode with hot reload
npm run dev

# Production build
npm run build
npm start
```

The server will start at `http://localhost:3000`

---

## API Documentation

This project uses **Swagger/OpenAPI** for interactive API documentation.

### Accessing Documentation

Once the server is running, visit:

```
http://localhost:3000/api-docs
```

### Features

- **Interactive API Explorer** - Test endpoints directly from the browser
- **Request/Response Schemas** - View detailed data models
- **Authentication Testing** - Test protected endpoints with JWT tokens
- **Auto-generated** - Documentation updates automatically from code annotations

---

## Deployment

### Docker Deployment

#### 1. Build Docker Image

```bash
# Build the image
docker build -t saas-backend-node -f docker/Dockerfile .

# Or use docker-compose
docker-compose build
```

#### 2. Run with Docker Compose

```bash
# Start all services (app, postgres, redis)
docker-compose up -d

# View logs
docker-compose logs -f app

# Stop services
docker-compose down
```

#### 3. Environment Variables

Update `docker-compose.yml` or create a `.env.production` file with production values.

### AWS Deployment

#### Using AWS ECS (Elastic Container Service)

1. **Push Docker Image to ECR**

```bash
# Authenticate Docker to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <account-id>.dkr.ecr.us-east-1.amazonaws.com

# Tag and push image
docker tag saas-backend-node:latest <account-id>.dkr.ecr.us-east-1.amazonaws.com/saas-backend-node:latest
docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/saas-backend-node:latest
```

2. **Set Up RDS (PostgreSQL) and ElastiCache (Redis)**

- Create RDS PostgreSQL instance
- Create ElastiCache Redis cluster
- Update security groups to allow ECS access

3. **Create ECS Task Definition**

- Define container with environment variables
- Set up CloudWatch logging
- Configure health checks

4. **Deploy to ECS**

- Create ECS cluster
- Create service with load balancer
- Configure auto-scaling

#### Using AWS Elastic Beanstalk

```bash
# Initialize EB
eb init -p docker saas-backend-node

# Create environment
eb create production

# Deploy
eb deploy
```

### Heroku Deployment

```bash
# Login to Heroku
heroku login

# Create app
heroku create your-app-name

# Add PostgreSQL and Redis
heroku addons:create heroku-postgresql:hobby-dev
heroku addons:create heroku-redis:hobby-dev

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your_secret_key

# Deploy
git push heroku main

# Run migrations
heroku run npm run migration:run
```

### DigitalOcean App Platform

1. Connect your GitHub repository
2. Configure build and run commands:
   - **Build Command**: `npm install && npm run build`
   - **Run Command**: `npm start`
3. Add environment variables in the dashboard
4. Add PostgreSQL and Redis databases
5. Deploy

---

## Database Migrations

### Create a New Migration

```bash
npm run migration:generate -- -n MigrationName
```

### Run Migrations

```bash
npm run migration:run
```

### Revert Last Migration

```bash
npm run migration:revert
```

---

## Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

---

## Roadmap

- [ ] GraphQL API support
- [ ] WebSocket real-time features
- [ ] Advanced caching strategies
- [ ] Monitoring and observability (Prometheus, Grafana)
- [ ] Rate limiting per tenant
- [ ] API versioning
- [ ] Automated backup strategies

