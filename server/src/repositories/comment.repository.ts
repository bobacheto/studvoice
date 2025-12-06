// Comment Repository - ALL Prisma queries for comments
// Services must NOT call Prisma directly

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class CommentRepository {
  /**
   * Create a new comment
   */
  async createComment(data: {
    postId: string;
    anonymousId: string;
    content: string;
  }): Promise<any> {
    try {
      return await prisma.comment.create({
        data: {
          postId: data.postId,
          anonymousId: data.anonymousId,
          content: data.content,
        },
        select: {
          id: true,
          postId: true,
          anonymousId: true,
          content: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Find all comments for a post
   */
  async findByPostId(postId: string, limit?: number, offset?: number): Promise<any[]> {
    try {
      return await prisma.comment.findMany({
        where: { postId },
        take: limit || 100,
        skip: offset || 0,
        orderBy: {
          createdAt: 'asc',
        },
        select: {
          id: true,
          postId: true,
          anonymousId: true,
          content: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Find comment by ID
   */
  async findById(id: string): Promise<any | null> {
    try {
      return await prisma.comment.findUnique({
        where: { id },
        select: {
          id: true,
          postId: true,
          anonymousId: true,
          content: true,
          createdAt: true,
          updatedAt: true,
          post: {
            select: {
              schoolId: true,
            },
          },
        },
      });
    } catch (error) {
      throw error;
    }
  }
}

export const commentRepository = new CommentRepository();
