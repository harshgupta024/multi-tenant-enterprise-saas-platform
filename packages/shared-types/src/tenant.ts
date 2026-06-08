// ─── Tenant Types ───────────────────────────────────────────────

export type TenantStatus = 'active' | 'suspended' | 'pending' | 'cancelled';
export type TenantPlan = 'free' | 'starter' | 'professional' | 'enterprise';

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  domain: string | null;
  status: TenantStatus;
  plan: TenantPlan;
  settings: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTenantRequest {
  name: string;
  slug: string;
  domain?: string;
  plan?: TenantPlan;
}

export interface UpdateTenantRequest {
  name?: string;
  domain?: string;
  settings?: Record<string, unknown>;
}
