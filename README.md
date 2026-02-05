# Adaptive Client Questionnaire System

> An intelligent backend API for adaptive client questionnaires with automated document generation

[![Node.js Version](https://img.shields.io/badge/node-%3E%3D20.0.0-brightgreen)](https://nodejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3.3-blue)](https://www.typescriptlang.org/)
[![NestJS](https://img.shields.io/badge/NestJS-10.3.0-red)](https://nestjs.com/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Getting Started](#getting-started)
- [Development](#development)
- [Testing](#testing)
- [Deployment](#deployment)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Overview

The Adaptive Client Questionnaire System is a sophisticated backend API that enables intelligent, context-aware questionnaires for gathering client information. The system features adaptive logic that dynamically shows or hides questions based on previous answers, and automatically generates professional documentation (CTO, CFO, and Business Analyst documents) from collected responses.

### Key Capabilities

- **Adaptive Questionnaires:** Dynamic question flow based on conditional logic
- **Multi-tenant Architecture:** Organization and user management with role-based access
- **Document Generation:** Auto-generate CTO, CFO, and BA documentation from responses
- **Engineering Standards Mapping:** Link responses to industry engineering standards
- **Session Management:** Save progress and resume questionnaires
- **Secure Authentication:** JWT-based auth with refresh tokens and MFA support
- **API Key Management:** Programmatic access with scoped permissions
- **Comprehensive Audit Logging:** Track all resource changes

## ✨ Features

### Core Features
- ✅ User authentication and authorization (JWT + MFA)
- ✅ Organization multi-tenancy
- ✅ Questionnaire template management
- ✅ Adaptive question visibility rules
- ✅ Session-based progress tracking
- ✅ Response validation and storage
- ✅ Document auto-generation (PDF, DOCX)
- ✅ Engineering standards framework
- ✅ API key authentication
- ✅ Rate limiting and throttling
- ✅ Comprehensive audit trails

### Security Features
- 🔒 JWT authentication with refresh tokens
- 🔒 Password hashing with bcrypt (12 rounds)
- 🔒 Multi-factor authentication (MFA) support
- 🔒 Role-based access control (RBAC)
- 🔒 API key authentication with scoped permissions
- 🔒 Rate limiting (3-tier: short/medium/long)
- 🔒 Helmet.js security headers
- 🔒 CORS configuration
- 🔒 Account lockout on failed login attempts

## 🛠 Technology Stack

### Backend
- **Framework:** [NestJS](https://nestjs.com/) 10.3.0
- **Language:** [TypeScript](https://www.typescriptlang.org/) 5.3.3
- **Runtime:** Node.js ≥20.0.0

### Database & Caching
- **Database:** PostgreSQL 15
- **ORM:** [Prisma](https://www.prisma.io/) 5.8.0
- **Cache:** Redis 7 with ioredis

### DevOps & Infrastructure
- **Build Tool:** Turbo (monorepo orchestration)
- **Containerization:** Docker & Docker Compose
- **CI/CD:** Azure Pipelines
- **IaC:** Terraform 1.5.7
- **Cloud:** Azure (Container Apps, ACR, PostgreSQL, Redis)

### Development Tools
- **Testing:** Jest 29.7.0
- **API Docs:** Swagger/OpenAPI
- **Linting:** ESLint with TypeScript
- **Formatting:** Prettier
- **Git Hooks:** Husky + lint-staged

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed:

- **Node.js:** ≥20.0.0 ([Download](https://nodejs.org/))
- **npm:** ≥10.0.0 (included with Node.js)
- **Docker:** Latest version ([Download](https://www.docker.com/))
- **Docker Compose:** Latest version

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Avi-Bendetsky/Quiz-to-build.git
   cd Quiz-to-build
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start infrastructure services:**
   ```bash
   npm run docker:up
   ```
   This starts PostgreSQL and Redis in Docker containers.

5. **Run database migrations:**
   ```bash
   npm run db:migrate
   ```

6. **Seed the database (optional):**
   ```bash
   npm run db:seed
   ```

7. **Start the development server:**
   ```bash
   npm run dev
   ```

The API will be available at `http://localhost:3000`

### Quick Start with Docker

For a complete Docker-based setup:

```bash
# Start all services (PostgreSQL, Redis, API)
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

## 💻 Development

### Project Structure

```
Quiz-to-build/
├── apps/
│   └── api/                    # Main NestJS application
│       ├── src/
│       │   ├── modules/        # Feature modules
│       │   │   ├── auth/       # Authentication & authorization
│       │   │   ├── users/      # User management
│       │   │   ├── questionnaire/  # Questionnaire templates
│       │   │   ├── session/    # Session management
│       │   │   ├── adaptive-logic/ # Adaptive engine
│       │   │   └── standards/  # Engineering standards
│       │   ├── common/         # Filters, interceptors, guards
│       │   ├── config/         # Configuration
│       │   └── main.ts         # Application entry point
│       └── test/               # E2E tests
├── libs/
│   ├── database/              # Prisma client wrapper
│   ├── redis/                 # Redis service wrapper
│   └── shared/                # Shared DTOs and utilities
├── prisma/
│   ├── schema.prisma          # Database schema
│   ├── migrations/            # Database migrations
│   └── seed.ts                # Database seeding
├── infrastructure/            # Terraform IaC
├── docs/                      # Business & technical documentation
└── docker/                    # Docker configurations
```

### Available Scripts

#### Development
```bash
npm run dev              # Start all services in watch mode
npm run start:dev        # Start API in watch mode
npm run build            # Build all packages
```

#### Database
```bash
npm run db:generate      # Generate Prisma client
npm run db:migrate       # Run migrations (development)
npm run db:migrate:prod  # Run migrations (production)
npm run db:seed          # Seed database with test data
npm run db:studio        # Open Prisma Studio (GUI)
npm run db:reset         # Reset database (WARNING: deletes all data)
```

#### Testing
```bash
npm run test             # Run unit tests
npm run test:watch       # Run tests in watch mode
npm run test:cov         # Run tests with coverage
npm run test:e2e         # Run end-to-end tests
npm run test:debug       # Run tests in debug mode
```

#### Code Quality
```bash
npm run lint             # Run ESLint
npm run lint:fix         # Auto-fix linting issues
npm run format           # Format code with Prettier
npm run format:check     # Check code formatting
```

#### Docker
```bash
npm run docker:up        # Start Docker services
npm run docker:down      # Stop Docker services
npm run docker:logs      # View service logs
```

### Environment Variables

Copy `.env.example` to `.env` and configure:

```env
# Application
NODE_ENV=development
PORT=3000
API_PREFIX=api/v1

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/questionnaire_db

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# JWT
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=your-refresh-secret-change-in-production
JWT_REFRESH_EXPIRES_IN=7d

# Security
BCRYPT_ROUNDS=12

# Rate Limiting
THROTTLE_TTL=60000
THROTTLE_LIMIT=100
THROTTLE_LOGIN_LIMIT=5

# CORS
CORS_ORIGIN=http://localhost:3001
```

### Database Schema

The application uses Prisma ORM with PostgreSQL. Key models include:

- **Organization:** Multi-tenant organization management
- **User:** User accounts with authentication
- **Questionnaire:** Questionnaire templates and structure
- **Section:** Questionnaire sections
- **Question:** Individual questions with 10+ types
- **VisibilityRule:** Adaptive logic rules
- **Session:** User session tracking
- **Response:** User responses to questions
- **Document:** Generated documents
- **EngineeringStandard:** Industry standards mapping

To view the full schema, check `prisma/schema.prisma` or run:
```bash
npm run db:studio
```

## 🧪 Testing

### Unit Tests

Run unit tests with coverage:
```bash
npm run test:cov
```

Coverage threshold is set to 80% for:
- Branches
- Functions
- Lines
- Statements

### E2E Tests

Run end-to-end tests:
```bash
npm run test:e2e
```

### Test Structure

- Unit tests: `*.spec.ts` files alongside source code
- E2E tests: `apps/api/test/*.e2e-spec.ts`

## 📦 Deployment

### Docker Deployment

Build production Docker image:
```bash
docker build -f docker/api/Dockerfile -t questionnaire-api:latest .
```

### Azure Deployment

The project includes a complete Azure CI/CD pipeline (`azure-pipelines.yml`) with:

1. **Build & Test:** Lint, type-check, test with coverage
2. **Security:** npm audit, Trivy scanning
3. **Infrastructure:** Terraform provisioning
4. **Deploy:** Container Apps deployment
5. **Verification:** Health check validation

Infrastructure is managed with Terraform modules:
- Networking (VNet, subnets)
- Database (PostgreSQL managed instance)
- Cache (Redis managed instance)
- Container Apps (application hosting)
- Key Vault (secrets management)
- Container Registry (ACR)
- Monitoring (logging & diagnostics)

### Environment-Specific Configuration

- **Development:** `.env.local` (git-ignored)
- **Production:** `.env.production.example` (template)
- **Azure:** Environment variables set in Container Apps configuration

## 📚 API Documentation

### Swagger/OpenAPI

When running in development mode, interactive API documentation is available at:

```
http://localhost:3000/docs
```

### Authentication

Most endpoints require JWT authentication:

```bash
# Login to get token
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password"}'

# Use token in subsequent requests
curl http://localhost:3000/api/v1/users/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Health Endpoints

```bash
# Liveness probe
GET /health

# Readiness probe
GET /health/ready
```

### API Versioning

All API endpoints are prefixed with `/api/v1/` by default.

## 🏗 Project Architecture

### Monorepo Structure

This project uses Turbo for monorepo management:

- **apps/api:** Main NestJS application
- **libs/database:** Shared database access layer
- **libs/redis:** Shared Redis cache layer
- **libs/shared:** Shared types, DTOs, and utilities

### Module Architecture

Each feature is organized as a NestJS module with:

- **Controllers:** HTTP request handling
- **Services:** Business logic
- **DTOs:** Data transfer objects with validation
- **Guards:** Authentication and authorization
- **Interceptors:** Cross-cutting concerns

### Adaptive Logic Engine

The adaptive logic engine evaluates visibility rules in real-time:

1. User submits a response
2. System evaluates all visibility rules
3. Questions are shown/hidden based on conditions
4. Document mappings are updated based on current state

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details.

### Development Workflow

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Make your changes
4. Run tests: `npm run test`
5. Run linter: `npm run lint:fix`
6. Commit changes: `git commit -m "feat: add my feature"`
7. Push to branch: `git push origin feature/my-feature`
8. Open a Pull Request

### Commit Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting)
- `refactor:` Code refactoring
- `test:` Adding or updating tests
- `chore:` Maintenance tasks

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For issues and questions:

- 🐛 **Bug Reports:** [GitHub Issues](https://github.com/Avi-Bendetsky/Quiz-to-build/issues)
- 💡 **Feature Requests:** [GitHub Issues](https://github.com/Avi-Bendetsky/Quiz-to-build/issues)
- 📖 **Documentation:** [docs/](docs/)

## 🙏 Acknowledgments

- Built with [NestJS](https://nestjs.com/)
- Database powered by [Prisma](https://www.prisma.io/)
- Deployed on [Azure](https://azure.microsoft.com/)

---

**Happy coding! 🚀**
