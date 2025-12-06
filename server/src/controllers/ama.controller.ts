import { Request, Response } from 'express';
import { AMAService } from '../services/ama.service';

export class AMAController {
  private amaService: AMAService;

  constructor() {
    this.amaService = new AMAService();
  }

  /**
   * Get all AMA sessions
   * TODO: Extract pagination params, call amaService.getAMASessions
   */
  async getAMASessions(req: Request, res: Response): Promise<void> {
    try {
      // TODO: Extract page, limit from query params
      // TODO: Call this.amaService.getAMASessions()
      // TODO: Return paginated AMA sessions
      res.json({ message: 'AMA sessions retrieved successfully' });
    } catch (error) {
      // TODO: Handle error
      res.status(500).json({ error: 'Failed to retrieve AMA sessions' });
    }
  }

  /**
   * Create a new AMA session
   * Only STUDENT_COUNCIL can create AMA sessions
   * TODO: Extract title, description, startTime, endTime, call amaService.createAMASession
   */
  async createAMASession(req: Request, res: Response): Promise<void> {
    try {
      // TODO: Extract userId from JWT token (to verify STUDENT_COUNCIL role)
      // TODO: Extract title, description, startTime, endTime from request body
      // TODO: Call this.amaService.createAMASession()
      // TODO: Return created AMA session
      res.status(201).json({ message: 'AMA session created successfully' });
    } catch (error) {
      // TODO: Handle error
      res.status(500).json({ error: 'Failed to create AMA session' });
    }
  }

  /**
   * Submit a question to an AMA session
   * Questions are anonymous, linked to anonymousId
   * TODO: Extract amaId, question, call amaService.submitQuestion
   */
  async submitQuestion(req: Request, res: Response): Promise<void> {
    try {
      // TODO: Extract amaId from URL params
      // TODO: Extract anonymousId from JWT token
      // TODO: Extract question text from request body
      // TODO: Call this.amaService.submitQuestion()
      // TODO: Return created question with anonymousId
      res.status(201).json({ message: 'Question submitted successfully' });
    } catch (error) {
      // TODO: Handle error
      res.status(500).json({ error: 'Failed to submit question' });
    }
  }
}
