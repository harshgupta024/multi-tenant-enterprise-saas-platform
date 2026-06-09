import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import request from 'supertest';
import app from '../src/server.js';
import * as jwtUtils from '../src/presentation/http/utils/jwt.utils.js';
import { TokenPayload } from '@shared/types';
import { mockAuditLogs, AuditService } from '../src/infrastructure/services/audit.service.js';
import { runWithContext } from '../src/context/index.js';

jest.mock('@saas/database', () => ({
  prisma: {
    $disconnect: jest.fn(),
  },
}));

const verifySpy = jest.spyOn(jwtUtils, 'verifyAccessToken');

function mockUserContext(role: string) {
  const payload: TokenPayload = {
    userId: 'mock-user-123',
    tenantId: 'mock-tenant-id',
    email: 'test@example.com',
    role: role as any,
  };
  verifySpy.mockReturnValue(payload);
  return 'Bearer valid-token';
}

describe('Audit Logs API & Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockAuditLogs.length = 0; // Clear mock store
  });

  describe('AuditService', () => {
    it('should successfully record a log when inside tenant context', () => {
      runWithContext({ tenantId: 'mock-tenant-id', userId: 'user-1' }, () => {
        const log = AuditService.record('CREATE_TEAM', 'Team', 'team-1', { name: 'Engineering' });
        expect(log).toBeDefined();
        expect(log?.action).toBe('CREATE_TEAM');
        expect(mockAuditLogs.length).toBe(1);
      });
    });

    it('should fail to record a log when outside tenant context', () => {
      const log = AuditService.record('CREATE_TEAM', 'Team');
      expect(log).toBeNull();
      expect(mockAuditLogs.length).toBe(0);
    });
  });

  describe('GET /api/audit-logs', () => {
    it('should deny employee from fetching audit logs', async () => {
      const token = mockUserContext('employee');
      
      const response = await request(app)
        .get('/api/audit-logs')
        .set('Authorization', token);

      expect(response.status).toBe(403);
    });

    it('should allow tenant_admin to fetch audit logs', async () => {
      const token = mockUserContext('tenant_admin');
      
      // Seed a log
      runWithContext({ tenantId: 'mock-tenant-id', userId: 'user-1' }, () => {
        AuditService.record('CREATE_TEAM', 'Team');
      });

      const response = await request(app)
        .get('/api/audit-logs')
        .set('Authorization', token);

      expect(response.status).toBe(200);
      expect(response.body.data.length).toBe(1);
    });
  });
});
