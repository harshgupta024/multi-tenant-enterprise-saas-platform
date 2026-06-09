import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import request from 'supertest';
import app from '../src/server.js';
import * as jwtUtils from '../src/presentation/http/utils/jwt.utils.js';
import { TokenPayload } from '@shared/types';

jest.mock('@saas/database', () => ({
  prisma: {
    $disconnect: jest.fn(),
  },
}));

const verifySpy = jest.spyOn(jwtUtils, 'verifyAccessToken');

function mockUserContext(role: string, userId: string = 'mock-user-1') {
  const payload: TokenPayload = {
    userId,
    tenantId: 'mock-tenant-id',
    email: 'test@example.com',
    role: role as any,
  };
  verifySpy.mockReturnValue(payload);
  return 'Bearer valid-token';
}

describe('Users API Endpoints', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/users/me', () => {
    it('should return the current user profile', async () => {
      const token = mockUserContext('tenant_admin', 'mock-user-1');
      
      const response = await request(app)
        .get('/api/users/me')
        .set('Authorization', token);

      expect(response.status).toBe(200);
      expect(response.body.data.id).toBe('mock-user-1');
    });

    it('should return 401 without auth token', async () => {
      const response = await request(app)
        .get('/api/users/me');

      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/users', () => {
    it('should deny employee from listing all users', async () => {
      const token = mockUserContext('employee');
      
      const response = await request(app)
        .get('/api/users')
        .set('Authorization', token);

      expect(response.status).toBe(403);
    });

    it('should allow manager to list all users', async () => {
      const token = mockUserContext('manager');
      
      const response = await request(app)
        .get('/api/users')
        .set('Authorization', token);

      expect(response.status).toBe(200);
      expect(response.body.data).toBeInstanceOf(Array);
    });
  });
});
