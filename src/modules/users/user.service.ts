import { AppDataSource } from '../../config/data-source';
import { User, UserRole } from '../../database/entities/user.entity';
import { Tenant } from '../../database/entities/tenant.entity';
import { hashPassword } from '../../common/utils/password';
import {
  ConflictError,
  NotFoundError,
  ValidationError,
  UnauthorizedError,
} from '../../common/utils/errors';
import { CreateUserDto, UpdateUserDto, UserResponseDto } from './user.types';

export class UserService {
  private userRepository = AppDataSource.getRepository(User);
  private tenantRepository = AppDataSource.getRepository(Tenant);

  /**
   * Get all users in tenant
   */
  async getAllUsers(tenantId: string): Promise<UserResponseDto[]> {
    const users = await this.userRepository.find({
      where: { tenant: { id: tenantId } },
      order: { createdAt: 'DESC' },
    });

    return users.map((user) => ({
      id: user.id,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
    }));
  }

  /**
   * Create new user in tenant
   */
  async createUser(
    tenantId: string,
    dto: CreateUserDto
  ): Promise<UserResponseDto> {
    // Validate input
    if (!dto.email || !dto.password || !dto.role) {
      throw new ValidationError('Email, password, and role are required');
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(dto.email)) {
      throw new ValidationError('Invalid email format');
    }

    // Validate role
    if (!['admin', 'member'].includes(dto.role)) {
      throw new ValidationError('Role must be either admin or member');
    }

    // Check if email already exists in this tenant
    const existingUser = await this.userRepository.findOne({
      where: {
        email: dto.email,
        tenant: { id: tenantId },
      },
    });

    if (existingUser) {
      throw new ConflictError('Email already exists in this tenant');
    }

    // Get tenant
    const tenant = await this.tenantRepository.findOne({
      where: { id: tenantId },
    });

    if (!tenant) {
      throw new NotFoundError('Tenant not found');
    }

    // Hash password
    const passwordHash = await hashPassword(dto.password);

    // Create user
    const user = this.userRepository.create({
      email: dto.email,
      passwordHash,
      role: dto.role as UserRole,
      tenant,
    });

    await this.userRepository.save(user);

    return {
      id: user.id,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
    };
  }

  /**
   * Update user
   */
  async updateUser(
    userId: string,
    tenantId: string,
    dto: UpdateUserDto
  ): Promise<UserResponseDto> {
    // Validate input
    if (!dto.role && dto.isActive === undefined) {
      throw new ValidationError('At least one field must be provided');
    }

    // Validate role if provided
    if (dto.role && !['admin', 'member'].includes(dto.role)) {
      throw new ValidationError('Role must be either admin or member');
    }

    // Find user in tenant
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
        tenant: { id: tenantId },
      },
    });

    if (!user) {
      throw new NotFoundError('User not found in this tenant');
    }

    // Update fields
    if (dto.role) {
      user.role = dto.role as UserRole;
    }
    if (dto.isActive !== undefined) {
      user.isActive = dto.isActive;
    }

    await this.userRepository.save(user);

    return {
      id: user.id,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
    };
  }

  /**
   * Delete user
   */
  async deleteUser(
    userId: string,
    tenantId: string,
    currentUserId: string
  ): Promise<void> {
    // Prevent self-deletion
    if (userId === currentUserId) {
      throw new UnauthorizedError('Cannot delete yourself');
    }

    // Find user in tenant
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
        tenant: { id: tenantId },
      },
    });

    if (!user) {
      throw new NotFoundError('User not found in this tenant');
    }

    await this.userRepository.remove(user);
  }
}
