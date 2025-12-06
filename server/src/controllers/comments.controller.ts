import { Request, Response } from 'express';
import { CommentsService } from '../services/comments.service';

export class CommentsController {
  private commentsService: CommentsService;

  constructor() {
    this.commentsService = new CommentsService();
  }

  /**
   * Create a new comment on a post
   * Comments are anonymous, linked to anonymousId
   * TODO: Extract postId, content, call commentsService.createComment
   */
  async createComment(req: Request, res: Response): Promise<void> {
    try {
      // TODO: Extract postId from request body
      // TODO: Extract anonymousId from JWT token
      // TODO: Extract content from request body
      // TODO: Call this.commentsService.createComment()
      // TODO: Return created comment with anonymousId
      res.status(201).json({ message: 'Comment created successfully' });
    } catch (error) {
      // TODO: Handle error
      res.status(500).json({ error: 'Failed to create comment' });
    }
  }
}
