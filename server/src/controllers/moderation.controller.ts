// Moderation Controller - HTTP request handlers for moderation actions
// Validates input and calls service layer

import { Request, Response } from 'express';
import { moderationService } from '../services/moderation.service';
import { CreateReportSchema, UpdateReportStatusSchema, CreateStrikeSchema } from '../utils/validation';
import { ReportStatus } from '@prisma/client';

export class ModerationController {
  /**
   * POST /reports - Create a report for a post or comment
   */
  async createReport(req: Request, res: Response): Promise<void> {
    try {
      // Validate input
      const validation = CreateReportSchema.safeParse(req.body);
      if (!validation.success) {
        res.status(400).json({
          status: 'error',
          message: 'Validation failed',
          errors: validation.error.errors,
        });
        return;
      }

      const { targetType, targetId, reason } = validation.data;
      const anonymousId = req.user!.anonymousId;

      const report = await moderationService.createReport({
        anonymousId,
        targetType: targetType as any,
        targetId,
        reason,
      });

      res.status(201).json({
        status: 'success',
        data: { report },
      });
    } catch (error: any) {
      res.status(500).json({
        status: 'error',
        message: error.message || 'Failed to create report',
      });
    }
  }

  /**
   * GET /reports - Get all reports for the school (moderators only)
   */
  async getReports(req: Request, res: Response): Promise<void> {
    try {
      const schoolId = req.user!.schoolId;
      const status = req.query.status as ReportStatus | undefined;

      const reports = await moderationService.getReports(schoolId, status);

      res.status(200).json({
        status: 'success',
        data: { reports },
      });
    } catch (error: any) {
      res.status(500).json({
        status: 'error',
        message: error.message || 'Failed to retrieve reports',
      });
    }
  }

  /**
   * PATCH /reports/:id/status - Update report status (moderators only)
   */
  async updateReportStatus(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      // Validate input
      const validation = UpdateReportStatusSchema.safeParse(req.body);
      if (!validation.success) {
        res.status(400).json({
          status: 'error',
          message: 'Validation failed',
          errors: validation.error.errors,
        });
        return;
      }

      const { status } = validation.data;

      const updatedReport = await moderationService.updateReportStatus(id, status as ReportStatus);

      res.status(200).json({
        status: 'success',
        data: { report: updatedReport },
      });
    } catch (error: any) {
      res.status(500).json({
        status: 'error',
        message: error.message || 'Failed to update report status',
      });
    }
  }

  /**
   * POST /moderation/strikes - Issue a strike (moderators only)
   */
  async issueStrike(req: Request, res: Response): Promise<void> {
    try {
      // Validate input
      const validation = CreateStrikeSchema.safeParse(req.body);
      if (!validation.success) {
        res.status(400).json({
          status: 'error',
          message: 'Validation failed',
          errors: validation.error.errors,
        });
        return;
      }

      const { anonymousId, type, durationHours, reason } = validation.data;

      const strike = await moderationService.issueStrike({
        anonymousId,
        type: type as any,
        durationHours,
        reason,
      });

      res.status(201).json({
        status: 'success',
        data: { strike },
      });
    } catch (error: any) {
      res.status(400).json({
        status: 'error',
        message: error.message || 'Failed to issue strike',
      });
    }
  }

  /**
   * GET /moderation/strikes/:anonymousId - Get strike history for a user (moderators only)
   */
  async getStrikeHistory(req: Request, res: Response): Promise<void> {
    try {
      const { anonymousId } = req.params;

      const strikes = await moderationService.getStrikeHistory(anonymousId);

      res.status(200).json({
        status: 'success',
        data: { strikes },
      });
    } catch (error: any) {
      res.status(500).json({
        status: 'error',
        message: error.message || 'Failed to retrieve strike history',
      });
    }
  }
}

export const moderationController = new ModerationController();
