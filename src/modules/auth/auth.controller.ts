import { Request, Response, NextFunction } from 'express';
import { AuthService } from './auth.service';
import {
  RegisterDto,
  LoginDto,
  RefreshTokenDto,
} from './auth.types';

export class AuthController {
  private authService = new AuthService();

  /**
   * Register a new tenant and admin user
   * POST /auth/register
   */
  register = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const dto: RegisterDto = req.body;
      const result = await this.authService.register(dto);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Login user and return JWT tokens
   * POST /auth/login
   */
  login = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const dto: LoginDto = req.body;
      const result = await this.authService.login(dto);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Refresh access token
   * POST /auth/refresh
   */
  refresh = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const dto: RefreshTokenDto = req.body;
      const result = await this.authService.refreshToken(dto);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };
}
