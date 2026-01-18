import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt';
import { UnauthorizedError } from '../utils/errors';

/**
 * Authentication middleware
 * Verifies JWT token and attaches user context to request
 */
export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  try {
    // Extract token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedError('No token provided');
    }

    // Check if it's a Bearer token
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      throw new UnauthorizedError('Invalid token format');
    }

    const token = parts[1];

    // Verify token and extract payload
    const payload = verifyAccessToken(token);

    // Attach user context to request
    req.user = {
      userId: payload.userId,
      tenantId: payload.tenantId,
      role: payload.role,
    };

    next();
  } catch (error) {
    next(error);
  }
}
