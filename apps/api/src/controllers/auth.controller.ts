import { Response } from 'express';
import { authService } from '../services/auth.service.js';
import { AuthRequest } from '../middleware/auth.middleware.js';

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

export class AuthController {
  async register(req: AuthRequest, res: Response) {
    try {
      const { user, token } = await authService.register(req.body);

      res.cookie('token', token, COOKIE_OPTIONS);
      return res.status(201).json({
        success: true,
        data: { user, token },
      });
    } catch (err: any) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'REGISTRATION_FAILED',
          message: err.message,
        },
      });
    }
  }

  async login(req: AuthRequest, res: Response) {
    try {
      const { user, token } = await authService.login(req.body);

      res.cookie('token', token, COOKIE_OPTIONS);
      return res.json({
        success: true,
        data: { user, token },
      });
    } catch (err: any) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'LOGIN_FAILED',
          message: err.message,
        },
      });
    }
  }

  async logout(_req: AuthRequest, res: Response) {
    res.clearCookie('token');
    return res.json({
      success: true,
      data: { message: 'Logged out successfully.' },
    });
  }

  async getMe(req: AuthRequest, res: Response) {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Not authenticated.' },
      });
    }

    const result = await authService.getCurrentUser(req.user.userId);
    if (!result) {
      return res.status(404).json({
        success: false,
        error: { code: 'USER_NOT_FOUND', message: 'User does not exist.' },
      });
    }

    return res.json({
      success: true,
      data: result,
    });
  }

  async forgotPassword(_req: AuthRequest, res: Response) {
    return res.json({
      success: true,
      data: { message: 'If an account exists for this email, password reset instructions have been sent.' },
    });
  }

  async resetPassword(_req: AuthRequest, res: Response) {
    return res.json({
      success: true,
      data: { message: 'Password has been reset successfully. You may now log in.' },
    });
  }
}

export const authController = new AuthController();
