import jwt from 'jsonwebtoken';
import { env } from '../../config/env';

export interface JwtPayload {
  userId: string;
  tenantId: string;
  role: string;
}

/**
 * Generate an access token
 * @param payload - JWT payload containing userId, tenantId, and role
 * @returns Signed JWT access token
 */
export function generateAccessToken(payload: JwtPayload): string {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  } as jwt.SignOptions);
}

/**
 * Generate a refresh token
 * @param payload - JWT payload containing userId, tenantId, and role
 * @returns Signed JWT refresh token
 */
export function generateRefreshToken(payload: JwtPayload): string {
  return jwt.sign(payload, env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRES_IN,
  } as jwt.SignOptions);
}

/**
 * Verify and decode an access token
 * @param token - JWT access token
 * @returns Decoded JWT payload
 */
export function verifyAccessToken(token: string): JwtPayload {
  return jwt.verify(token, env.JWT_SECRET) as JwtPayload;
}

/**
 * Verify and decode a refresh token
 * @param token - JWT refresh token
 * @returns Decoded JWT payload
 */
export function verifyRefreshToken(token: string): JwtPayload {
  return jwt.verify(token, env.JWT_REFRESH_SECRET) as JwtPayload;
}
