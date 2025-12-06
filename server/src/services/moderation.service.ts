// Moderation Service - Business logic for strikes, reports, and moderation
// NO Prisma calls - only repository calls

import { strikeRepository } from '../repositories/strike.repository';
import { reportRepository } from '../repositories/report.repository';
import { StrikeType, ReportStatus, ReportTargetType } from '@prisma/client';

export class ModerationService {
  /**
   * Issue a strike (MUTE, WARNING, BAN)
   */
  async issueStrike(data: {
    anonymousId: string;
    type: StrikeType;
    durationHours?: number;
    reason?: string;
  }): Promise<any> {
    try {
      // Validate duration for mutes
      if (data.type === 'MUTE' && !data.durationHours) {
        throw new Error('Duration is required for mutes');
      }

      // Bans and warnings don't have expiration
      if (data.type !== 'MUTE' && data.durationHours) {
        throw new Error('Duration is only allowed for mutes');
      }

      const strike = await strikeRepository.createStrike({
        anonymousId: data.anonymousId,
        type: data.type,
        durationHours: data.durationHours,
        reason: data.reason,
      });

      return strike;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get active moderation status for a user
   */
  async getActiveStatus(anonymousId: string): Promise<{ isMuted: boolean; isBanned: boolean }> {
    try {
      return await strikeRepository.isMutedOrBanned(anonymousId);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Check if user can perform action (post/comment/react)
   */
  async checkCanPerformAction(anonymousId: string): Promise<void> {
    try {
      const { isMuted, isBanned } = await this.getActiveStatus(anonymousId);

      if (isBanned) {
        throw new Error('USER_BANNED');
      }

      if (isMuted) {
        throw new Error('USER_MUTED');
      }
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get all strikes for a user (for moderation history)
   */
  async getStrikeHistory(anonymousId: string): Promise<any[]> {
    try {
      return await strikeRepository.findAllByAnonymousId(anonymousId);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Create a report for a post or comment
   */
  async createReport(data: {
    anonymousId: string;
    targetType: ReportTargetType;
    targetId: string;
    reason: string;
  }): Promise<any> {
    try {
      const reportData: any = {
        anonymousId: data.anonymousId,
        targetType: data.targetType,
        reason: data.reason,
      };

      if (data.targetType === 'POST') {
        reportData.postId = data.targetId;
      } else if (data.targetType === 'COMMENT') {
        reportData.commentId = data.targetId;
      }

      const report = await reportRepository.createReport(reportData);
      return report;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get reports for a school
   */
  async getReports(schoolId: string, status?: ReportStatus): Promise<any[]> {
    try {
      return await reportRepository.findManyBySchool(schoolId, status);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update report status
   */
  async updateReportStatus(reportId: string, status: ReportStatus): Promise<any> {
    try {
      return await reportRepository.updateStatus(reportId, status);
    } catch (error) {
      throw error;
    }
  }
}

export const moderationService = new ModerationService();
