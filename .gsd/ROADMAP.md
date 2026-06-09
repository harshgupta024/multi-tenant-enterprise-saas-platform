# ROADMAP.md

> **Current Phase**: Not started
> **Milestone**: v1.0

## Must-Haves (from SPEC)
- [x] Tenant context propagation and tenant verification middleware.
- [x] Safe cookie-based auth token registration and renewal.
- [x] Role-based access control checking on API endpoints.
- [x] Multi-tenant isolation verification test suite.

## Phases

### Phase 1: Authentication & Tenant Context
**Status**: ✅ Complete
**Objective**: Build cookie-based auth, register flow, token refresh, and tenant lookup middleware.
**Requirements**: Multi-tenant context propagation, basic signup/signin APIs.

### Phase 2: Organization & Team Management
**Status**: ✅ Complete
**Objective**: CRUD operations for Teams, Role authorization checks, and User profile settings.
**Requirements**: RBAC checks, Team and Member assignments.

### Phase 3: Invitation System & Auditing
**Status**: ✅ Complete
**Objective**: Invitation tokens generation, email log delivery, invitation accepts, and Audit logs capturing.
**Requirements**: VerificationToken models, AuditLog policies.

### Phase 4: Notifications & Analytics Dashboard
**Status**: ⬜ Not Started
**Objective**: Real-time notifications and aggregated analytics data for the dashboard.
**Requirements**: Dashboard endpoints, stats reporting.
