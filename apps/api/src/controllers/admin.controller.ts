import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware.js';
import { analyticsService } from '../services/analytics.service.js';

export class AdminController {
  async getDashboardStats(_req: AuthRequest, res: Response) {
    try {
      const stats = await analyticsService.getAdminStats();
      return res.json({
        success: true,
        data: stats,
      });
    } catch (err: any) {
      return res.status(500).json({
        success: false,
        error: { code: 'ADMIN_STATS_ERROR', message: err.message },
      });
    }
  }

  async trackEvent(req: AuthRequest, res: Response) {
    const { eventType, metadata } = req.body;
    await analyticsService.trackEvent({
      eventType,
      metadata,
      userId: req.user?.userId,
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
    });

    return res.json({ success: true });
  }
}

export const adminController = new AdminController();
