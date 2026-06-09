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

// We'll spy on verifyAccessToken to mock roles
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

describe('Teams API Endpoints', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/teams', () => {
    it('should allow employee to list teams', async () => {
      const token = mockUserContext('employee');
      
      const response = await request(app)
        .get('/api/teams')
        .set('Authorization', token);

      expect(response.status).toBe(200);
      expect(response.body.data).toBeInstanceOf(Array);
    });
  });

  describe('POST /api/teams', () => {
    it('should deny employee from creating a team', async () => {
      const token = mockUserContext('employee');
      
      const response = await request(app)
        .post('/api/teams')
        .set('Authorization', token)
        .send({ name: 'New Team' });

      expect(response.status).toBe(403);
    });

    it('should allow manager to create a team', async () => {
      const token = mockUserContext('manager');
      
      const response = await request(app)
        .post('/api/teams')
        .set('Authorization', token)
        .send({ name: 'New Team' });

      expect(response.status).toBe(201);
      expect(response.body.data.name).toBe('New Team');
    });
  });
});
