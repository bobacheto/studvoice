// Post Repository - ALL Prisma queries for posts
// Services must NOT call Prisma directly

import { PrismaClient, IdeaStatus } from '@prisma/client';

const prisma = new PrismaClient();

export class PostRepository {
  /**
   * Find posts by school with filters
   */
  async findManyBySchool(
    schoolId: string,
    filters?: {
      status?: IdeaStatus;
      limit?: number;
      offset?: number;
    }
  ): Promise<any[]> {
    try {
      const where: any = { schoolId };
      if (filters?.status) {
        where.status = filters.status;
      }

      const posts = await prisma.post.findMany({
        where,
        take: filters?.limit || 50,
        skip: filters?.offset || 0,
        orderBy: {
          createdAt: 'desc',
        },
        select: {
          id: true,
          anonymousId: true,
          title: true,
          content: true,
          status: true,
          schoolId: true,
          createdAt: true,
          updatedAt: true,
          _count: {
            select: {
              comments: true,
              reactions: true,
            },
          },
        },
      });

      return posts;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Find a single post by ID
   */
  async findById(id: string): Promise<any | null> {
    try {
      return await prisma.post.findUnique({
        where: { id },
        select: {
          id: true,
          anonymousId: true,
          title: true,
          content: true,
          status: true,
          schoolId: true,
          createdAt: true,
          updatedAt: true,
          _count: {
            select: {
              comments: true,
              reactions: true,
            },
          },
        },
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Create a new post
   */
  async createPost(data: {
    anonymousId: string;
    title?: string;
    content: string;
    schoolId: string;
  }): Promise<any> {
    try {
      return await prisma.post.create({
        data: {
          anonymousId: data.anonymousId,
          title: data.title || null,
          content: data.content,
          schoolId: data.schoolId,
          status: 'PENDING' as IdeaStatus,
        },
        select: {
          id: true,
          anonymousId: true,
          title: true,
          content: true,
          status: true,
          schoolId: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update post status
   */
  async updateStatus(postId: string, status: IdeaStatus): Promise<any> {
    try {
      return await prisma.post.update({
        where: { id: postId },
        data: { status },
        select: {
          id: true,
          status: true,
          updatedAt: true,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Delete a post
   */
  async deletePost(postId: string): Promise<void> {
    try {
      await prisma.post.delete({
        where: { id: postId },
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Create a report for a post (moved to report.repository.ts)
   */
}

export const postRepository = new PostRepository();
