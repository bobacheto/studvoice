// Reaction Repository - ALL Prisma queries for reactions
// Services must NOT call Prisma directly

import { PrismaClient, ReactionType } from '@prisma/client';

const prisma = new PrismaClient();

export class ReactionRepository {
  /**
   * Find a specific reaction by post, user, and type
   */
  async findByPostAndUserAndType(
    postId: string,
    anonymousId: string,
    type: ReactionType
  ): Promise<{ id: string; postId: string; anonymousId: string; type: ReactionType; createdAt: Date } | null> {
    try {
      return await prisma.reaction.findFirst({
        where: {
          postId,
          anonymousId,
          type,
        },
        select: {
          id: true,
          postId: true,
          anonymousId: true,
          type: true,
          createdAt: true,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Create a new reaction
   */
  async createReaction(data: {
    postId: string;
    anonymousId: string;
    type: ReactionType;
  }): Promise<{ id: string; postId: string; anonymousId: string; type: ReactionType; createdAt: Date }> {
    try {
      return await prisma.reaction.create({
        data: {
          postId: data.postId,
          anonymousId: data.anonymousId,
          type: data.type,
        },
        select: {
          id: true,
          postId: true,
          anonymousId: true,
          type: true,
          createdAt: true,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Delete a reaction by ID
   */
  async deleteReaction(id: string): Promise<void> {
    try {
      await prisma.reaction.delete({
        where: { id },
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Count reactions by post ID, grouped by type
   */
  async countReactionsByPost(postId: string): Promise<{ type: ReactionType; count: number }[]> {
    try {
      const reactions = await prisma.reaction.groupBy({
        by: ['type'],
        where: { postId },
        _count: {
          type: true,
        },
      });

      return reactions.map((r: typeof reactions[number]) => ({
        type: r.type,
        count: r._count.type,
      }));
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get all reaction counts for a post as an object
   */
  async getReactionCounts(postId: string): Promise<Record<string, number>> {
    try {
      const counts = await this.countReactionsByPost(postId);
      const result: Record<string, number> = {
        LIKE: 0,
        SUPPORT: 0,
        GREAT: 0,
        THINKING: 0,
      };

      counts.forEach((c) => {
        result[c.type] = c.count;
      });

      return result;
    } catch (error) {
      throw error;
    }
  }
}

export const reactionRepository = new ReactionRepository();
