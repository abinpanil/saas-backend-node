/**
 * Data Transfer Objects for User Module
 */

// Create User Request DTO
export interface CreateUserDto {
  email: string;
  password: string;
  role: 'admin' | 'member';
}

// Update User Request DTO
export interface UpdateUserDto {
  role?: 'admin' | 'member';
  isActive?: boolean;
}

// User Response DTO
export interface UserResponseDto {
  id: string;
  email: string;
  role: string;
  isActive: boolean;
}
