# Aether — Production-Grade Multi-Tenant Enterprise SaaS Platform

Aether is an enterprise-grade, portfolio-ready Multi-Tenant SaaS Platform built using a clean monorepo architecture. It showcases industry-standard engineering patterns, including PostgreSQL Row-Level Security (RLS), tenant context propagation via Node's `AsyncLocalStorage`, granular Role-Based Access Control (RBAC), and real-time dashboard analytics.

---

## 🏗️ Architecture & Features

Aether is designed to support **10,000+ organizations** and **1,000,000+ users** with robust tenant isolation:

1. **Row-Level Tenant Isolation**: Complete data separation at the database layer using PostgreSQL RLS policies or client-level prisma middleware to guarantee no cross-tenant data leaks.
2. **Context Propagation (AsyncLocalStorage)**: Direct flow of tenant credentials (tenant ID, correlation ID) across request lifecycles without manual prop-drilling.
3. **Granular RBAC Authorization**: Role policies governing read/write routes (OWNER, ADMIN, MEMBER, VIEWER).
4. **Structured Monorepo**: Managed with Turborepo and pnpm for rapid development, code sharing, and type consistency.

---

## 🛠️ Technology Stack

- **Core Frameworks**: Next.js 15 (App Router + Tailwind v4) & Express.js 5
- **Monorepo Manager**: Turborepo + pnpm Workspace
- **Database Engine**: PostgreSQL + Prisma Client Singleton
- **Cache & Rate Limiting**: Redis + ioredis
- **Logging & Auditing**: Pino + pino-pretty (development)
- **Validation**: Zod (type-safe schemas)

---

## 📂 Project Directory Structure

```text
├── apps
│   ├── api                 # Express.js backend application
│   └── web                 # Next.js 15 frontend client
├── packages
│   ├── config              # Shared typescript and lint configurations
│   ├── database            # Shared Prisma Client, schema, and migrations
│   └── shared-types        # Shared typescript models and API interfaces
├── docker
│   └── docker-compose.yml  # Docker Compose file for local PostgreSQL & Redis
├── package.json            # Root workspace configurations
├── pnpm-workspace.yaml     # pnpm workspace configurations
└── turbo.json              # Turborepo task pipeline cache configuration
```

---

## 🚀 Local Development Setup

### Prerequisites
- Node.js >= 20.0.0
- pnpm >= 9.0.0
- Docker & Docker Compose (or local installations of PostgreSQL & Redis)

### 1. Clone & Install Dependencies
Run the following at the repository root:
```bash
pnpm install
```

### 2. Configure Environment Variables
Copy the example environment file to `.env`:
```bash
cp .env.example .env
```
Ensure your database connection strings (`DATABASE_URL`, `REDIS_URL`) match your local environment.

### 3. Spin Up Local Services
Start the local PostgreSQL and Redis databases using Docker:
```bash
pnpm docker:up
```

### 4. Setup the Database Schema
Push the Prisma schemas and generate the Prisma Client:
```bash
pnpm db:generate
```

### 5. Start Development Servers
Run the dev task to spin up both the Next.js app (`localhost:3000`) and the Express.js API (`localhost:4000`):
```bash
pnpm dev
```

---

## 📜 Available Command Scripts

| Script | Command | Purpose |
| :--- | :--- | :--- |
| `pnpm dev` | `turbo run dev` | Launch both frontend & backend in watch mode |
| `pnpm build` | `turbo run build` | Compile and build production bundles for all apps |
| `pnpm lint` | `turbo run lint` | Run code quality linters across all packages |
| `pnpm test` | `turbo run test` | Run unit tests across all suites |
| `pnpm db:generate` | `turbo run db:generate` | Generate the Prisma Client for database queries |
| `pnpm docker:up` | `docker compose ... up -d` | Start PostgreSQL & Redis services |
| `pnpm docker:down` | `docker compose ... down` | Terminate local Docker services |

---

## 🔒 Security Practices
- **Never expose database credentials**: Always load credentials through environment variables.
- **Strict Tenant Context Verification**: Every API query executes inside an `AsyncLocalStorage` tenant scope validation callback.
- **Graceful Shutdown**: The API server hooks into system events (`SIGTERM`, `SIGINT`) to close database pools cleanly and prevent memory leakage.
