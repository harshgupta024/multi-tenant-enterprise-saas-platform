import { Request, Response } from 'express';
import { User, UpdateUserRequest } from '@shared/types';
import { getTenantId, getUserId } from '../../../context/index.js';

// In-memory mock data for users
let mockUsers: User[] = [
  {
    id: 'mock-user-1',
    tenantId: 'mock-tenant-id',
    email: 'admin@tenant.com',
    firstName: 'Admin',
    lastName: 'User',
    role: 'tenant_admin',
    status: 'active',
    avatarUrl: null,
    emailVerifiedAt: new Date(),
    lastLoginAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'mock-user-2',
    tenantId: 'mock-tenant-id',
    email: 'employee@tenant.com',
    firstName: 'Employee',
    lastName: 'User',
    role: 'employee',
    status: 'active',
    avatarUrl: null,
    emailVerifiedAt: new Date(),
    lastLoginAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  }
];

export class UsersController {
  
  /**
   * Get the current user's profile based on context
   */
  async getProfile(req: Request, res: Response) {
    const userId = getUserId();
    const tenantId = getTenantId();
    
    const user = mockUsers.find(u => u.id === userId && u.tenantId === tenantId);
    
    if (!user) {
      return res.status(404).json({ error: 'Not Found', message: 'User not found' });
    }
    
    res.json({ data: user });
  }

  /**
   * Update the current user's profile
   */
  async updateProfile(req: Request, res: Response) {
    const userId = getUserId();
    const tenantId = getTenantId();
    const payload: UpdateUserRequest = req.body;
    
    const index = mockUsers.findIndex(u => u.id === userId && u.tenantId === tenantId);
    
    if (index === -1) {
      return res.status(404).json({ error: 'Not Found', message: 'User not found' });
    }
    
    const updatedUser = {
      ...mockUsers[index],
      ...payload,
      updatedAt: new Date(),
    };
    
    mockUsers[index] = updatedUser;
    
    res.json({ data: updatedUser });
  }

  /**
   * Get all users for the current tenant
   */
  async getTenantUsers(req: Request, res: Response) {
    const tenantId = getTenantId();
    const users = mockUsers.filter(u => u.tenantId === tenantId);
    
    res.json({
      data: users,
      meta: { total: users.length }
    });
  }
}
