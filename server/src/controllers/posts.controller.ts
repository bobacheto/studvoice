import { Request, Response } from 'express';
import { PostsService } from '../services/posts.service';

export class PostsController {
  private postsService: PostsService;

  constructor() {
    this.postsService = new PostsService();
  }

  /**
   * Get all posts (paginated)
   * TODO: Extract pagination params, call postsService.getPosts
   */
  async getPosts(req: Request, res: Response): Promise<void> {
    try {
      // TODO: Extract page, limit from query params
      // TODO: Call this.postsService.getPosts()
      // TODO: Return paginated posts
      res.json({ message: 'Posts retrieved successfully' });
    } catch (error) {
      // TODO: Handle error
      res.status(500).json({ error: 'Failed to retrieve posts' });
    }
  }

  /**
   * Create a new anonymous post
   * Posts are linked to anonymousId, not userId
   * TODO: Extract content, optionally title, call postsService.createPost
   */
  async createPost(req: Request, res: Response): Promise<void> {
    try {
      // TODO: Extract anonymousId from JWT token in request
      // TODO: Extract title (optional), content from request body
      // TODO: Call this.postsService.createPost()
      // TODO: Return created post with anonymousId
      res.status(201).json({ message: 'Post created successfully' });
    } catch (error) {
      // TODO: Handle error
      res.status(500).json({ error: 'Failed to create post' });
    }
  }

  /**
   * Add a reaction (emoji) to a post
   * TODO: Extract postId, emoji, call postsService.addReaction
   */
  async addReaction(req: Request, res: Response): Promise<void> {
    try {
      // TODO: Extract postId from URL params
      // TODO: Extract anonymousId from JWT token
      // TODO: Extract emoji from request body
      // TODO: Call this.postsService.addReaction()
      // TODO: Return updated post
      res.json({ message: 'Reaction added successfully' });
    } catch (error) {
      // TODO: Handle error
      res.status(500).json({ error: 'Failed to add reaction' });
    }
  }

  /**
   * Report a post for moderation
   * TODO: Extract postId, reason, call postsService.reportPost
   */
  async reportPost(req: Request, res: Response): Promise<void> {
    try {
      // TODO: Extract postId from URL params
      // TODO: Extract reason from request body
      // TODO: Call this.postsService.reportPost()
      // TODO: Return confirmation
      res.json({ message: 'Post reported successfully' });
    } catch (error) {
      // TODO: Handle error
      res.status(500).json({ error: 'Failed to report post' });
    }
  }
}
