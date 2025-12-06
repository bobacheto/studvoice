import { CommentRepository } from '../repositories/comment.repository';

export class CommentsService {
  private commentRepository: CommentRepository;

  constructor() {
    this.commentRepository = new CommentRepository();
  }

  /**
   * Create a new comment on a post
   * TODO: Validate content
   * TODO: Create comment linked to anonymousId (not userId)
   * TODO: Return created comment
   */
  async createComment(postId: string, anonymousId: string, content: string): Promise<any> {
    try {
      // TODO: Validate content is not empty
      // TODO: Verify post exists
      // TODO: Call this.commentRepository.create()
      // TODO: Return created comment with anonymousId
      return { message: 'Create comment service' };
    } catch (error) {
      throw error;
    }
  }
}
