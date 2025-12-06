// Strike Repository - ALL Prisma queries for strikes (mutes/warnings/bans)
// Services must NOT call Prisma directly

import { PrismaClient, StrikeType } from '@prisma/client';

const prisma = new PrismaClient();

export class StrikeRepository {
  /**
   * Create a new strike
   */
  async createStrike(data: {
    anonymousId: string;
    type: StrikeType;
    reason?: string;
    durationHours?: number;
  }): Promise<any> {
    try {
      const expiresAt = data.durationHours
        ? new Date(Date.now() + data.durationHours * 60 * 60 * 1000)
        : null;

      return await prisma.strike.create({
        data: {
          anonymousId: data.anonymousId,
          type: data.type,
          reason: data.reason || null,
          durationHours: data.durationHours || null,
          expiresAt,
        },
        select: {
          id: true,
          anonymousId: true,
          type: true,
          reason: true,
          durationHours: true,
          createdAt: true,
          expiresAt: true,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Find active strikes for a user
   */
  async findActiveStrikesByAnonymousId(anonymousId: string): Promise<any[]> {
    try {
      const now = new Date();

      return await prisma.strike.findMany({
        where: {
          anonymousId,
          OR: [
            { expiresAt: null }, // Permanent strikes (BAN, WARNING)
            { expiresAt: { gte: now } }, // Active temporary strikes (MUTE)
          ],
        },
        select: {
          id: true,
          anonymousId: true,
          type: true,
          reason: true,
          durationHours: true,
          createdAt: true,
          expiresAt: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Check if a user is currently muted or banned
   */
  async isMutedOrBanned(anonymousId: string): Promise<{ isMuted: boolean; isBanned: boolean }> {
    try {
      const strikes = await this.findActiveStrikesByAnonymousId(anonymousId);

      const isBanned = strikes.some((s) => s.type === 'BAN');
      const isMuted = strikes.some((s) => s.type === 'MUTE');

      return { isMuted, isBanned };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get all strikes for a user (for moderation history)
   */
  async findAllByAnonymousId(anonymousId: string): Promise<any[]> {
    try {
      return await prisma.strike.findMany({
        where: { anonymousId },
        select: {
          id: true,
          anonymousId: true,
          type: true,
          reason: true,
          durationHours: true,
          createdAt: true,
          expiresAt: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    } catch (error) {
      throw error;
    }
  }
}

export const strikeRepository = new StrikeRepository();
