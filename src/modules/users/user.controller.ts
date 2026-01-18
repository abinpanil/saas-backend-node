import { Request, Response, NextFunction } from 'express';
import { UserService } from './user.service';
import { CreateUserDto, UpdateUserDto } from './user.types';

export class UserController {
  private userService = new UserService();

  /**
   * Get all users in tenant
   * GET /users
   */
  getAll = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const tenantId = req.user!.tenantId;
      const result = await this.userService.getAllUsers(tenantId);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Create new user
   * POST /users
   */
  create = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const tenantId = req.user!.tenantId;
      const dto: CreateUserDto = req.body;
      const result = await this.userService.createUser(tenantId, dto);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Update user
   * PUT /users/:id
   */
  update = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = req.params.id as string;
      const tenantId = req.user!.tenantId;
      const dto: UpdateUserDto = req.body;
      const result = await this.userService.updateUser(userId, tenantId, dto);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Delete user
   * DELETE /users/:id
   */
  delete = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = req.params.id as string;
      const tenantId = req.user!.tenantId;
      const currentUserId = req.user!.userId;
      
      await this.userService.deleteUser(userId, tenantId, currentUserId);
      res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
      next(error);
    }
  };
}
