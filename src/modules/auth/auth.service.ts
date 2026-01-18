import { AppDataSource } from '../../config/data-source';
import { Tenant } from '../../database/entities/tenant.entity';
import { User, UserRole } from '../../database/entities/user.entity';
import { RefreshToken } from '../../database/entities/refresh-token.entity';
import { hashPassword, comparePassword } from '../../common/utils/password';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from '../../common/utils/jwt';
import {
  ConflictError,
  UnauthorizedError,
  ValidationError,
} from '../../common/utils/errors';
import { env } from '../../config/env';
import {
  RegisterDto,
  RegisterResponseDto,
  LoginDto,
  LoginResponseDto,
  RefreshTokenDto,
  RefreshTokenResponseDto,
} from './auth.types';

export class AuthService {
  private tenantRepository = AppDataSource.getRepository(Tenant);
  private userRepository = AppDataSource.getRepository(User);
  private refreshTokenRepository = AppDataSource.getRepository(RefreshToken);

  /**
   * Register a new tenant and its first admin user
   */
  async register(dto: RegisterDto): Promise<RegisterResponseDto> {
    // Validate input
    if (!dto.tenantName || !dto.tenantSlug || !dto.email || !dto.password) {
      throw new ValidationError('All fields are required');
    }

    // Check if tenant slug already exists
    const existingTenant = await this.tenantRepository.findOne({
      where: { slug: dto.tenantSlug },
    });

    if (existingTenant) {
      throw new ConflictError('Tenant slug already exists');
    }

    // Check if email already exists for any tenant
    const existingUser = await this.userRepository.findOne({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new ConflictError('Email already exists');
    }

    // Hash password
    const passwordHash = await hashPassword(dto.password);

    // Create tenant and admin user in a transaction
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Create tenant
      const tenant = this.tenantRepository.create({
        name: dto.tenantName,
        slug: dto.tenantSlug,
      });
      await queryRunner.manager.save(tenant);

      // Create admin user
      const user = this.userRepository.create({
        email: dto.email,
        passwordHash,
        role: UserRole.ADMIN,
        tenant,
      });
      await queryRunner.manager.save(user);

      await queryRunner.commitTransaction();

      return {
        message: 'Tenant registered successfully',
        tenantId: tenant.id,
        userId: user.id,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * Login user and generate JWT tokens
   */
  async login(dto: LoginDto): Promise<LoginResponseDto> {
    // Validate input
    if (!dto.email || !dto.password) {
      throw new ValidationError('Email and password are required');
    }

    // Find user by email
    const user = await this.userRepository.findOne({
      where: { email: dto.email },
      relations: ['tenant'],
    });

    if (!user) {
      throw new UnauthorizedError('Invalid credentials');
    }

    // Verify password
    const isPasswordValid = await comparePassword(
      dto.password,
      user.passwordHash
    );

    if (!isPasswordValid) {
      throw new UnauthorizedError('Invalid credentials');
    }

    // Check if user is active
    if (!user.isActive) {
      throw new UnauthorizedError('User account is inactive');
    }

    // Generate tokens
    const payload = {
      userId: user.id,
      tenantId: user.tenant.id,
      role: user.role,
    };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    // Store refresh token in database
    const refreshTokenEntity = this.refreshTokenRepository.create({
      user,
      token: refreshToken,
      expiresAt: new Date(
        Date.now() +
          this.parseExpiryToMs(env.JWT_REFRESH_EXPIRES_IN)
      ),
    });
    await this.refreshTokenRepository.save(refreshTokenEntity);

    return {
      accessToken,
      refreshToken,
      expiresIn: env.JWT_EXPIRES_IN,
    };
  }

  /**
   * Refresh access token using refresh token
   */
  async refreshToken(dto: RefreshTokenDto): Promise<RefreshTokenResponseDto> {
    // Validate input
    if (!dto.refreshToken) {
      throw new ValidationError('Refresh token is required');
    }

    // Verify refresh token
    let payload;
    try {
      payload = verifyRefreshToken(dto.refreshToken);
    } catch (error) {
      throw new UnauthorizedError('Invalid refresh token');
    }

    // Check if refresh token exists in database
    const refreshTokenEntity = await this.refreshTokenRepository.findOne({
      where: { token: dto.refreshToken },
      relations: ['user', 'user.tenant'],
    });

    if (!refreshTokenEntity) {
      throw new UnauthorizedError('Invalid refresh token');
    }

    // Check if refresh token is expired
    if (refreshTokenEntity.expiresAt < new Date()) {
      throw new UnauthorizedError('Refresh token expired');
    }

    // Generate new access token
    const newAccessToken = generateAccessToken({
      userId: payload.userId,
      tenantId: payload.tenantId,
      role: payload.role,
    });

    return {
      accessToken: newAccessToken,
    };
  }

  /**
   * Parse expiry string (e.g., "7d", "30d") to milliseconds
   */
  private parseExpiryToMs(expiry: string): number {
    const unit = expiry.slice(-1);
    const value = parseInt(expiry.slice(0, -1));

    switch (unit) {
      case 'd':
        return value * 24 * 60 * 60 * 1000;
      case 'h':
        return value * 60 * 60 * 1000;
      case 'm':
        return value * 60 * 1000;
      default:
        return value * 1000;
    }
  }
}
