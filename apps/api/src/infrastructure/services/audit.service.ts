import { v4 as uuidv4 } from 'uuid';
import { AuditLog } from '@shared/types';
import { getContext } from '../../context/index.js';
import logger from '../logging/logger.js';
import { Request } from 'express';

// In-memory store for audit logs
export const mockAuditLogs: AuditLog[] = [];

export class AuditService {
  /**
   * Record a new audit log entry.
   * Scopes the log automatically using request context.
   */
  static record(
    action: string,
    entityType: string,
    entityId: string | null = null,
    changes: Record<string, unknown> | null = null,
    req?: Request
  ): AuditLog | null {
    const ctx = getContext();
    
    // Audit logs require a tenant context
    if (!ctx || !ctx.tenantId) {
      logger.warn({ action, entityType }, 'Failed to record audit log: No tenant context');
      return null;
    }

    const log: AuditLog = {
      id: uuidv4(),
      tenantId: ctx.tenantId,
      userId: ctx.userId,
      action,
      entityType,
      entityId,
      changes,
      ipAddress: req ? (req.ip || req.headers['x-forwarded-for'] as string || null) : null,
      userAgent: req ? (req.headers['user-agent'] || null) : null,
      createdAt: new Date(),
    };

    mockAuditLogs.push(log);

    logger.info({
      auditLogId: log.id,
      tenantId: log.tenantId,
      userId: log.userId,
      action: log.action,
      entityType: log.entityType,
    }, `[AuditLog] ${log.action} recorded on ${log.entityType}`);

    return log;
  }

  /**
   * Retrieve all audit logs for a tenant
   */
  static getByTenant(tenantId: string): AuditLog[] {
    return mockAuditLogs.filter(log => log.tenantId === tenantId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }
}
