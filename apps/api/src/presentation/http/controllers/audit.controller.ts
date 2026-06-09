import { Request, Response } from 'express';
import { AuditService } from '../../../infrastructure/services/audit.service.js';
import { getTenantId } from '../../../context/index.js';

export class AuditController {
  /**
   * Get audit logs for the current tenant
   */
  async getAuditLogs(req: Request, res: Response) {
    const tenantId = getTenantId();
    const logs = AuditService.getByTenant(tenantId);
    
    res.json({
      data: logs,
      meta: { total: logs.length }
    });
  }
}
