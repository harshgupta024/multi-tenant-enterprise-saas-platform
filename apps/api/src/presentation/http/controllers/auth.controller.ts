import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import { prisma } from '@saas/database';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/jwt.utils.js';
import { RegisterRequest, TokenPayload } from '@saas/shared-types';

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env['NODE_ENV'] === 'production',
  sameSite: 'lax' as const,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

export async function signup(req: Request, res: Response, next: NextFunction): Promise<void> {
  const { tenantName, tenantSlug, firstName, lastName, email, password } = req.body as RegisterRequest;

  if (!tenantName || !tenantSlug || !firstName || !lastName || !email || !password) {
    res.status(400).json({
      success: false,
      error: { code: 'INVALID_INPUT', message: 'All fields are required.' },
    });
    return;
  }

  try {
    // Check if tenant slug already exists
    const existingTenant = await prisma.tenant.findUnique({
      where: { slug: tenantSlug },
    });

    if (existingTenant) {
      res.status(400).json({
        success: false,
        error: { code: 'SLUG_TAKEN', message: 'Tenant slug is already in use.' },
      });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 10);

    // Create tenant and first admin user in a transaction
    const result = await prisma.$transaction(async (tx) => {
      const tenant = await tx.tenant.create({
        data: {
          name: tenantName,
          slug: tenantSlug,
          status: 'active',
          plan: 'free',
        },
      });

      const user = await tx.user.create({
        data: {
          tenantId: tenant.id,
          firstName,
          lastName,
          email,
          passwordHash,
          role: 'tenant_admin',
          status: 'active',
        },
      });

      return { tenant, user };
    });

    const payload: TokenPayload = {
      userId: result.user.id,
      tenantId: result.tenant.id,
      email: result.user.email,
      role: result.user.role,
    };

    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);

    // Store refresh token
    await prisma.refreshToken.create({
      data: {
        userId: result.user.id,
        token: refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    res.cookie('accessToken', accessToken, COOKIE_OPTIONS);
    res.cookie('refreshToken', refreshToken, COOKIE_OPTIONS);

    res.status(201).json({
      success: true,
      data: {
        user: {
          id: result.user.id,
          firstName: result.user.firstName,
          lastName: result.user.lastName,
          email: result.user.email,
          role: result.user.role,
        },
        tenant: {
          id: result.tenant.id,
          name: result.tenant.name,
          slug: result.tenant.slug,
        },
        accessToken,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function signin(req: Request, res: Response, next: NextFunction): Promise<void> {
  const { email, password, tenantSlug } = req.body;
  const tenantIdHeader = req.headers['x-tenant-id'] as string;

  if (!email || !password) {
    res.status(400).json({
      success: false,
      error: { code: 'INVALID_INPUT', message: 'Email and password are required.' },
    });
    return;
  }

  try {
    let resolvedTenantId: string | undefined;

    if (tenantIdHeader) {
      resolvedTenantId = tenantIdHeader;
    } else if (tenantSlug) {
      const tenant = await prisma.tenant.findUnique({ where: { slug: tenantSlug } });
      resolvedTenantId = tenant?.id;
    } else {
      // Lookup if email exists in exactly one tenant
      const users = await prisma.user.findMany({
        where: { email },
        select: { tenantId: true },
      });

      if (users.length === 0) {
        res.status(401).json({
          success: false,
          error: { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password.' },
        });
        return;
      }

      if (users.length > 1) {
        res.status(400).json({
          success: false,
          error: {
            code: 'MULTIPLE_TENANTS',
            message: 'Email exists in multiple tenants. Please specify X-Tenant-ID header or tenantSlug in request body.',
          },
        });
        return;
      }

      resolvedTenantId = users[0]?.tenantId;
    }

    if (!resolvedTenantId) {
      res.status(401).json({
        success: false,
        error: { code: 'INVALID_CREDENTIALS', message: 'Invalid email, password, or tenant context.' },
      });
      return;
    }

    const user = await prisma.user.findFirst({
      where: {
        email,
        tenantId: resolvedTenantId,
      },
      include: {
        tenant: true,
      },
    });

    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      res.status(401).json({
        success: false,
        error: { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password.' },
      });
      return;
    }

    if (user.status !== 'active') {
      res.status(403).json({
        success: false,
        error: { code: 'USER_INACTIVE', message: `User status is currently ${user.status}.` },
      });
      return;
    }

    const payload: TokenPayload = {
      userId: user.id,
      tenantId: user.tenantId,
      email: user.email,
      role: user.role,
    };

    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);

    // Save refresh token
    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        token: refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    res.cookie('accessToken', accessToken, COOKIE_OPTIONS);
    res.cookie('refreshToken', refreshToken, COOKIE_OPTIONS);

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
        },
        tenant: {
          id: user.tenant.id,
          name: user.tenant.name,
          slug: user.tenant.slug,
        },
        accessToken,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function refresh(req: Request, res: Response, next: NextFunction): Promise<void> {
  const token = req.cookies['refreshToken'] || req.body.refreshToken;

  if (!token) {
    res.status(400).json({
      success: false,
      error: { code: 'MISSING_REFRESH_TOKEN', message: 'Refresh token is required.' },
    });
    return;
  }

  try {
    const claims = verifyRefreshToken(token);

    const savedToken = await prisma.refreshToken.findUnique({
      where: { token },
      include: { user: { include: { tenant: true } } },
    });

    if (!savedToken || savedToken.revokedAt || savedToken.expiresAt < new Date()) {
      res.status(401).json({
        success: false,
        error: { code: 'INVALID_REFRESH_TOKEN', message: 'Token has been revoked or expired.' },
      });
      return;
    }

    const payload: TokenPayload = {
      userId: savedToken.user.id,
      tenantId: savedToken.user.tenantId,
      email: savedToken.user.email,
      role: savedToken.user.role,
    };

    const newAccessToken = signAccessToken(payload);
    const newRefreshToken = signRefreshToken(payload);

    // Revoke old token and save new one
    await prisma.$transaction([
      prisma.refreshToken.update({
        where: { id: savedToken.id },
        data: { revokedAt: new Date() },
      }),
      prisma.refreshToken.create({
        data: {
          userId: savedToken.user.id,
          token: newRefreshToken,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
      }),
    ]);

    res.cookie('accessToken', newAccessToken, COOKIE_OPTIONS);
    res.cookie('refreshToken', newRefreshToken, COOKIE_OPTIONS);

    res.status(200).json({
      success: true,
      data: {
        accessToken: newAccessToken,
      },
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      error: { code: 'INVALID_REFRESH_TOKEN', message: 'Invalid refresh token.' },
    });
  }
}

export async function signout(req: Request, res: Response, next: NextFunction): Promise<void> {
  const token = req.cookies['refreshToken'] || req.body.refreshToken;

  if (token) {
    try {
      await prisma.refreshToken.updateMany({
        where: { token },
        data: { revokedAt: new Date() },
      });
    } catch {
      // Fail silently if token revoke fails
    }
  }

  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');

  res.status(200).json({
    success: true,
    message: 'Successfully signed out.',
  });
}
