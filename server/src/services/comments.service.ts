// Comments Service - Business logic for comments
// NO Prisma calls - only repository calls

import { commentRepository } from '../repositories/comment.repository';
import { postRepository } from '../repositories/post.repository';
import { moderationService } from './moderation.service';

export class CommentsService {
  /**
   * Get comments for a post
   */
  async getCommentsByPostId(
    postId: string,
    schoolId: string,
    limit?: number,
    offset?: number
  ): Promise<any[]> {
    try {
      // Verify post exists and belongs to the school
      const post = await postRepository.findById(postId);

      if (!post) {
        throw new Error('POST_NOT_FOUND');
      }

      if (post.schoolId !== schoolId) {
        throw new Error('UNAUTHORIZED_ACCESS');
      }

      // Get comments
      const comments = await commentRepository.findByPostId(postId, limit, offset);

      return comments;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Create a new comment on a post
   */
  async createComment(data: {
    postId: string;
    anonymousId: string;
    schoolId: string;
    content: string;
  }): Promise<any> {
    try {
      // Check if user is muted or banned
      await moderationService.checkCanPerformAction(data.anonymousId);

      // Verify post exists and belongs to the school
      const post = await postRepository.findById(data.postId);

      if (!post) {
        throw new Error('POST_NOT_FOUND');
      }

      if (post.schoolId !== data.schoolId) {
        throw new Error('UNAUTHORIZED_ACCESS');
      }

      // Create comment
      const comment = await commentRepository.createComment({
        postId: data.postId,
        anonymousId: data.anonymousId,
        content: data.content,
      });

      return comment;
    } catch (error) {
      throw error;
    }
  }
}

export const commentsService = new CommentsService();
