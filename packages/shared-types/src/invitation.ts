import { UserRole } from './auth.js';

export interface Invitation {
  id: string;
  tenantId: string;
  email: string;
  role: UserRole;
  token: string;
  invitedBy: string;
  expiresAt: Date;
  acceptedAt: Date | null;
  createdAt: Date;
}

export interface InviteUserRequest {
  email: string;
  role: UserRole;
}

export interface AcceptInvitationRequest {
  token: string;
  firstName: string;
  lastName: string;
  password: string;
}
