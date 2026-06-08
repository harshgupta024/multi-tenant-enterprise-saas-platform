# SPEC.md — Project Specification

> **Status**: `FINALIZED`

## Vision
Aether is an enterprise-grade, production-ready, multi-tenant enterprise SaaS platform that demonstrates robust tenant isolation (using PostgreSQL tenant ID fields), AsyncLocalStorage context tracing, secure cookie-based JWT authentication, granular user roles, invitations, audit logs, notifications, and real-time dashboard analytics.

## Goals
1. **Multi-Tenant Isolation**: Implement request context propagation with AsyncLocalStorage and tenant validation middleware.
2. **Secure Cookie JWT Authentication**: Sign-in, sign-up, session refresh, and token revocation.
3. **Role-Based Access Control**: Standardized permissions for `super_admin`, `tenant_admin`, `manager`, and `employee`.
4. **Member & Team Management**: CRUD operations for teams and roles inside a tenant.
5. **Invitations Flow**: Invitation generation, secure token delivery, and acceptance workflows.
6. **Audit & Log Monitoring**: Capture and query audit logs per tenant.
7. **Real-time Dashboard**: Aggregated statistics and charts.
8. **Automated Integration Tests**: Full API testing coverage.

## Non-Goals (Out of Scope)
- Actual external payment processing integrations (Stripe checkout UI) - we will use mock checkout/billing responses instead.
- Sending real SMTP emails - we will log invitations and verification links to the pino console.

## Users
- **Super Admin**: Platform operator managing plan limits, overall tenants status.
- **Tenant Admin**: Owner of the organization profile, subscription plans, and team leads.
- **Manager**: Intermediate user with scope-limited access to teams.
- **Employee**: Basic member of a tenant.

## Constraints
- Next.js 16 (Turbopack) & React 19.
- Express.js 5.
- Must run in pnpm monorepo.
- Prisma Client + local PostgreSQL / Redis.

## Success Criteria
- [ ] Database schema successfully deployed and seeded.
- [ ] All API endpoints covered by Supertest integration tests.
- [ ] End-to-end user signup, signin, token refresh, and invitation accepts pass verification.
- [ ] Multi-tenant isolation verified (one user cannot access another tenant's data).
