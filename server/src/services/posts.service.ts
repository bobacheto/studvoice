// Posts Service - Business logic for posts and reactions
// NO Prisma calls - only repository calls

import { postRepository } from '../repositories/post.repository';
import { reactionRepository } from '../repositories/reaction.repository';
import { moderationService } from './moderation.service';
import { IdeaStatus, ReactionType } from '@prisma/client';

export class PostsService {
  /**
   * Get posts for a school with filters
   */
  async getPosts(
    schoolId: string,
    filters?: {
      status?: IdeaStatus;
      limit?: number;
      offset?: number;
    }
  ): Promise<any[]> {
    try {
      const posts = await postRepository.findManyBySchool(schoolId, filters);

      // Add reaction counts to each post
      const postsWithReactions = await Promise.all(
        posts.map(async (post: any) => {
          const reactionCounts = await reactionRepository.getReactionCounts(post.id);
          return {
            ...post,
            commentCount: post._count.comments,
            reactionCounts,
          };
        })
      );

      // Remove _count from response
      return postsWithReactions.map((post: any) => {
        const { _count, ...rest } = post;
        return rest;
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get a single post by ID
   */
  async getPostById(postId: string): Promise<any> {
    try {
      const post = await postRepository.findById(postId);

      if (!post) {
        throw new Error('POST_NOT_FOUND');
      }

      const reactionCounts = await reactionRepository.getReactionCounts(postId);

      const { _count, ...postData } = post;

      return {
        ...postData,
        commentCount: _count.comments,
        reactionCounts,
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Create a new post
   */
  async createPost(data: {
    anonymousId: string;
    schoolId: string;
    title?: string;
    content: string;
  }): Promise<any> {
    try {
      // Check if user is muted or banned
      await moderationService.checkCanPerformAction(data.anonymousId);

      // Create the post
      const post = await postRepository.createPost({
        anonymousId: data.anonymousId,
        schoolId: data.schoolId,
        title: data.title,
        content: data.content,
      });

      return post;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update post status (for moderators/student council)
   */
  async updatePostStatus(postId: string, status: IdeaStatus): Promise<any> {
    try {
      // Verify post exists
      const post = await postRepository.findById(postId);

      if (!post) {
        throw new Error('POST_NOT_FOUND');
      }

      // Update status
      const updatedPost = await postRepository.updateStatus(postId, status);

      return updatedPost;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Delete a post
   */
  async deletePost(postId: string): Promise<void> {
    try {
      // Verify post exists
      const post = await postRepository.findById(postId);

      if (!post) {
        throw new Error('POST_NOT_FOUND');
      }

      // Delete the post
      await postRepository.deletePost(postId);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Toggle reaction on a post
   */
  async toggleReaction(data: {
    postId: string;
    anonymousId: string;
    type: ReactionType;
  }): Promise<any> {
    try {
      // Check if user is muted or banned
      await moderationService.checkCanPerformAction(data.anonymousId);

      // Verify post exists
      const post = await postRepository.findById(data.postId);

      if (!post) {
        throw new Error('POST_NOT_FOUND');
      }

      // Check if reaction already exists
      const existingReaction = await reactionRepository.findByPostAndUserAndType(
        data.postId,
        data.anonymousId,
        data.type
      );

      if (existingReaction) {
        // Remove reaction (toggle off)
        await reactionRepository.deleteReaction(existingReaction.id);
      } else {
        // Add reaction (toggle on)
        await reactionRepository.createReaction({
          postId: data.postId,
          anonymousId: data.anonymousId,
          type: data.type,
        });
      }

      // Return updated reaction counts
      const reactionCounts = await reactionRepository.getReactionCounts(data.postId);

      return {
        postId: data.postId,
        reactionCounts,
        toggled: !existingReaction, // true if added, false if removed
      };
    } catch (error) {
      throw error;
    }
  }
}

export const postsService = new PostsService();
