// ─── API Response Types ─────────────────────────────────────────

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: ApiError;
  meta?: PaginationMeta;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, string[]>;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
}

// ─── Team Types ─────────────────────────────────────────────────

export interface Team {
  id: string;
  tenantId: string;
  name: string;
  description: string | null;
  department: string | null;
  leadId: string | null;
  memberCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTeamRequest {
  name: string;
  description?: string;
  department?: string;
  leadId?: string;
}

export interface UpdateTeamRequest {
  name?: string;
  description?: string;
  department?: string;
  leadId?: string;
}

// ─── Notification Types ─────────────────────────────────────────

export type NotificationType = 'info' | 'success' | 'warning' | 'error';

export interface Notification {
  id: string;
  tenantId: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  readAt: Date | null;
  createdAt: Date;
}

// ─── Audit Log Types ────────────────────────────────────────────

export interface AuditLog {
  id: string;
  tenantId: string;
  userId: string | null;
  action: string;
  entityType: string;
  entityId: string | null;
  changes: Record<string, unknown> | null;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: Date;
}

// ─── Dashboard Types ────────────────────────────────────────────

export interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalTeams: number;
  totalAuditLogs: number;
  userGrowth: number;
  teamGrowth: number;
}

export interface GrowthDataPoint {
  date: string;
  count: number;
}
