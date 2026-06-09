import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { Invitation, InviteUserRequest, AcceptInvitationRequest, User } from '@shared/types';
import { getTenantId, getUserId, runWithContext } from '../../../context/index.js';
import { EmailService } from '../../../infrastructure/services/email.service.js';
import { AuditService } from '../../../infrastructure/services/audit.service.js';
import { mockUsers } from './users.controller.js';
import { signAccessToken, signRefreshToken } from '../utils/jwt.utils.js';

// In-memory store for invitations
export const mockInvitations: Invitation[] = [];

export class InvitationsController {
  
  /**
   * Invite a user to the current tenant
   */
  async inviteUser(req: Request, res: Response) {
    const tenantId = getTenantId();
    const userId = getUserId();
    const payload: InviteUserRequest = req.body;

    if (!payload.email || !payload.role) {
      return res.status(400).json({ error: 'Bad Request', message: 'Email and role are required' });
    }

    // Check if user already exists in tenant
    const userExists = mockUsers.some(u => u.email === payload.email && u.tenantId === tenantId);
    if (userExists) {
      return res.status(409).json({ error: 'Conflict', message: 'User already exists in this tenant' });
    }

    const invitation: Invitation = {
      id: uuidv4(),
      tenantId,
      email: payload.email,
      role: payload.role,
      token: uuidv4(),
      invitedBy: userId || 'system',
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours expiry
      acceptedAt: null,
      createdAt: new Date(),
    };

    mockInvitations.push(invitation);

    // Send mock email
    await EmailService.sendInvitation(invitation.email, invitation.token, 'Tenant Platform');

    // Record Audit Log
    AuditService.record(
      'INVITE_USER',
      'Invitation',
      invitation.id,
      { email: invitation.email, role: invitation.role },
      req
    );

    res.status(201).json({ data: invitation });
  }

  /**
   * Get public details of an invitation by token
   */
  async getInvitation(req: Request, res: Response) {
    const { token } = req.params;

    const invitation = mockInvitations.find(i => i.token === token);
    if (!invitation) {
      return res.status(404).json({ error: 'Not Found', message: 'Invitation not found' });
    }

    if (invitation.acceptedAt) {
      return res.status(400).json({ error: 'Bad Request', message: 'Invitation has already been accepted' });
    }

    if (new Date() > invitation.expiresAt) {
      return res.status(400).json({ error: 'Bad Request', message: 'Invitation has expired' });
    }

    res.json({
      data: {
        email: invitation.email,
        role: invitation.role,
        tenantId: invitation.tenantId,
        expiresAt: invitation.expiresAt,
      }
    });
  }

  /**
   * Accept an invitation and register
   */
  async acceptInvitation(req: Request, res: Response) {
    const payload: AcceptInvitationRequest = req.body;

    if (!payload.token || !payload.firstName || !payload.lastName || !payload.password) {
      return res.status(400).json({ error: 'Bad Request', message: 'All fields are required' });
    }

    const invitation = mockInvitations.find(i => i.token === payload.token);
    if (!invitation) {
      return res.status(404).json({ error: 'Not Found', message: 'Invitation not found' });
    }

    if (invitation.acceptedAt) {
      return res.status(400).json({ error: 'Bad Request', message: 'Invitation has already been accepted' });
    }

    if (new Date() > invitation.expiresAt) {
      return res.status(400).json({ error: 'Bad Request', message: 'Invitation has expired' });
    }

    // Create user in mockUsers
    const newUser: User = {
      id: uuidv4(),
      tenantId: invitation.tenantId,
      email: invitation.email,
      firstName: payload.firstName,
      lastName: payload.lastName,
      role: invitation.role,
      status: 'active',
      avatarUrl: null,
      emailVerifiedAt: new Date(),
      lastLoginAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockUsers.push(newUser);

    // Mark invitation accepted
    invitation.acceptedAt = new Date();

    // Generate auth tokens
    const accessToken = signAccessToken({
      userId: newUser.id,
      tenantId: newUser.tenantId,
      email: newUser.email,
      role: newUser.role,
    });

    const refreshToken = signRefreshToken({
      userId: newUser.id,
      tenantId: newUser.tenantId,
      email: newUser.email,
      role: newUser.role,
    });

    // Cookie refresh token
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env['NODE_ENV'] === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Record Audit Log under new user's context
    runWithContext({ tenantId: invitation.tenantId, userId: newUser.id, userRole: newUser.role }, () => {
      AuditService.record(
        'ACCEPT_INVITATION',
        'User',
        newUser.id,
        { email: newUser.email },
        req
      );
    });

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: newUser.id,
          email: newUser.email,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          role: newUser.role,
        },
        accessToken,
      }
    });
  }
}
