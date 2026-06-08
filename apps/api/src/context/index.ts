import { AsyncLocalStorage } from 'node:async_hooks';
import { v4 as uuidv4 } from 'uuid';

// ─── Context Shape ──────────────────────────────────────────────

export interface RequestContext {
  /** Unique per-request correlation ID for distributed tracing */
  correlationId: string;
  /** Unique request ID */
  requestId: string;
  /** Tenant ID extracted from JWT or header */
  tenantId: string | null;
  /** Authenticated user ID */
  userId: string | null;
  /** User role for authorization checks */
  userRole: string | null;
  /** Request start timestamp for duration tracking */
  startTime: number;
}

// ─── Storage Instance ───────────────────────────────────────────

const asyncLocalStorage = new AsyncLocalStorage<RequestContext>();

// ─── Public API ─────────────────────────────────────────────────

/**
 * Run a callback within a new request context.
 * Typically called from the context middleware at the start of each request.
 */
export function runWithContext<T>(
  context: Partial<RequestContext>,
  fn: () => T,
): T {
  const fullContext: RequestContext = {
    correlationId: context.correlationId || uuidv4(),
    requestId: context.requestId || uuidv4(),
    tenantId: context.tenantId || null,
    userId: context.userId || null,
    userRole: context.userRole || null,
    startTime: context.startTime || Date.now(),
  };
  return asyncLocalStorage.run(fullContext, fn);
}

/**
 * Get the current request context.
 * Returns undefined if called outside of a request scope (e.g., in a background job).
 */
export function getContext(): RequestContext | undefined {
  return asyncLocalStorage.getStore();
}

/**
 * Get the current tenant ID. Throws if called outside of a tenant-scoped context.
 */
export function getTenantId(): string {
  const ctx = getContext();
  if (!ctx?.tenantId) {
    throw new Error('Tenant context not available. Ensure this is called within a tenant-scoped request.');
  }
  return ctx.tenantId;
}

/**
 * Get the current user ID. Returns null if not authenticated.
 */
export function getUserId(): string | null {
  return getContext()?.userId ?? null;
}

/**
 * Get the correlation ID for the current request.
 */
export function getCorrelationId(): string {
  return getContext()?.correlationId ?? uuidv4();
}
