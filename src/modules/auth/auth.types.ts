/**
 * Data Transfer Objects for Authentication Module
 */

// Register Request DTO
export interface RegisterDto {
  tenantName: string;
  tenantSlug: string;
  email: string;
  password: string;
}

// Register Response DTO
export interface RegisterResponseDto {
  message: string;
  tenantId: string;
  userId: string;
}

// Login Request DTO
export interface LoginDto {
  email: string;
  password: string;
}

// Login Response DTO
export interface LoginResponseDto {
  accessToken: string;
  refreshToken: string;
  expiresIn: string;
}

// Refresh Token Request DTO
export interface RefreshTokenDto {
  refreshToken: string;
}

// Refresh Token Response DTO
export interface RefreshTokenResponseDto {
  accessToken: string;
}
