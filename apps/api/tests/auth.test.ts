import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import request from 'supertest';
import express from 'express';
import cookieParser from 'cookie-parser';
import bcrypt from 'bcryptjs';
import app from '../src/server.js';
import { prisma } from '@saas/database';

// Mock the database client
jest.mock('@saas/database', () => {
  return {
    prisma: {
      tenant: {
        findUnique: jest.fn(),
        create: jest.fn(),
      },
      user: {
        findFirst: jest.fn(),
        create: jest.fn(),
        findMany: jest.fn(),
        update: jest.fn(),
      },
      refreshToken: {
        create: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        updateMany: jest.fn(),
      },
      $transaction: jest.fn((callback: any) => callback(prisma)),
    },
    default: jest.fn(),
  };
});

describe('Auth Endpoints', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/auth/signup', () => {
    it('should successfully register a new tenant and admin user', async () => {
      (prisma.tenant.findUnique as any).mockResolvedValue(null);
      (prisma.tenant.create as any).mockResolvedValue({
        id: 'tenant-123',
        name: 'Acme',
        slug: 'acme',
      });
      (prisma.user.create as any).mockResolvedValue({
        id: 'user-123',
        tenantId: 'tenant-123',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        role: 'tenant_admin',
      });
      (prisma.refreshToken.create as any).mockResolvedValue({});

      const response = await request(app)
        .post('/api/auth/signup')
        .send({
          tenantName: 'Acme',
          tenantSlug: 'acme',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          password: 'securepassword',
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.user.email).toBe('john@example.com');
      expect(response.body.data.tenant.slug).toBe('acme');
      expect(response.headers['set-cookie']).toBeDefined();
    });

    it('should fail if required fields are missing', async () => {
      const response = await request(app)
        .post('/api/auth/signup')
        .send({
          email: 'john@example.com',
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/auth/signin', () => {
    it('should log in successfully with valid credentials', async () => {
      const hashedPassword = await bcrypt.hash('password123', 10);
      (prisma.tenant.findUnique as any).mockResolvedValue({
        id: 'tenant-123',
        name: 'Acme',
        slug: 'acme',
      });
      (prisma.user.findFirst as any).mockResolvedValue({
        id: 'user-123',
        tenantId: 'tenant-123',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        passwordHash: hashedPassword,
        role: 'tenant_admin',
        status: 'active',
        tenant: {
          id: 'tenant-123',
          name: 'Acme',
          slug: 'acme',
        },
      });
      (prisma.refreshToken.create as any).mockResolvedValue({});
      (prisma.user.update as any).mockResolvedValue({});

      const response = await request(app)
        .post('/api/auth/signin')
        .send({
          email: 'john@example.com',
          password: 'password123',
          tenantSlug: 'acme',
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.accessToken).toBeDefined();
    });

    it('should fail with invalid credentials', async () => {
      (prisma.tenant.findUnique as any).mockResolvedValue({
        id: 'tenant-123',
        name: 'Acme',
        slug: 'acme',
      });
      (prisma.user.findFirst as any).mockResolvedValue(null);

      const response = await request(app)
        .post('/api/auth/signin')
        .send({
          email: 'john@example.com',
          password: 'wrongpassword',
          tenantSlug: 'acme',
        });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });
});
