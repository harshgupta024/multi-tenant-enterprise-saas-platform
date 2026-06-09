import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import request from 'supertest';
import app from '../src/server.js';
import * as jwtUtils from '../src/presentation/http/utils/jwt.utils.js';
import { TokenPayload } from '@shared/types';
import { mockInvitations } from '../src/presentation/http/controllers/invitations.controller.js';

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

describe('Invitations API Endpoints', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockInvitations.length = 0; // Clear the mock store
  });

  describe('POST /api/invitations', () => {
    it('should deny employee from inviting users', async () => {
      const token = mockUserContext('employee');
      
      const response = await request(app)
        .post('/api/invitations')
        .set('Authorization', token)
        .send({ email: 'new@example.com', role: 'employee' });

      expect(response.status).toBe(403);
    });

    it('should allow manager to invite users', async () => {
      const token = mockUserContext('manager');
      
      const response = await request(app)
        .post('/api/invitations')
        .set('Authorization', token)
        .send({ email: 'invited@example.com', role: 'employee' });

      expect(response.status).toBe(201);
      expect(response.body.data.email).toBe('invited@example.com');
      expect(response.body.data.token).toBeDefined();
    });
  });

  describe('GET /api/invitations/:token', () => {
    it('should return public invitation details', async () => {
      // Setup mock invitation
      const inviteToken = 'test-token-uuid';
      mockInvitations.push({
        id: 'invite-1',
        tenantId: 'mock-tenant-id',
        email: 'invited@example.com',
        role: 'employee',
        token: inviteToken,
        invitedBy: 'mock-user-123',
        expiresAt: new Date(Date.now() + 10000),
        acceptedAt: null,
        createdAt: new Date(),
      });

      const response = await request(app)
        .get(`/api/invitations/${inviteToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data.email).toBe('invited@example.com');
    });

    it('should return 404 for invalid token', async () => {
      const response = await request(app)
        .get('/api/invitations/invalid-token');

      expect(response.status).toBe(404);
    });
  });

  describe('POST /api/invitations/accept', () => {
    it('should create user and return tokens', async () => {
      const inviteToken = 'test-token-uuid';
      mockInvitations.push({
        id: 'invite-1',
        tenantId: 'mock-tenant-id',
        email: 'invited@example.com',
        role: 'employee',
        token: inviteToken,
        invitedBy: 'mock-user-123',
        expiresAt: new Date(Date.now() + 10000),
        acceptedAt: null,
        createdAt: new Date(),
      });

      const response = await request(app)
        .post('/api/invitations/accept')
        .send({
          token: inviteToken,
          firstName: 'Guest',
          lastName: 'User',
          password: 'securePassword123'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.user.email).toBe('invited@example.com');
      expect(response.body.data.accessToken).toBeDefined();
      expect(response.headers['set-cookie']).toBeDefined();
    });
  });
});
