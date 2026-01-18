import { Request, Response, NextFunction } from 'express';
import { UnauthorizedError } from '../utils/errors';

/**
 * Admin authorization middleware
 * Checks if authenticated user has admin role
 * Must be used after authMiddleware
 */
export function adminMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  try {
    // Check if user context exists (should be set by authMiddleware)
    if (!req.user) {
      throw new UnauthorizedError('Authentication required');
    }

    // Check if user has admin role
    if (req.user.role !== 'admin') {
      throw new UnauthorizedError('Admin access required');
    }

    next();
  } catch (error) {
    next(error);
  }
}
