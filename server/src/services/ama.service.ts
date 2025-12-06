// AMA Service - Business logic for Ask Me Anything sessions
// NO Prisma calls - only repository calls

import { AMARepository } from '../repositories/ama.repository';
import { ModerationService } from './moderation.service';
import { AMAQuestionStatus } from '@prisma/client';
import { AppError } from '../utils/errors';

const amaRepository = new AMARepository();
const moderationService = new ModerationService();

export class AMAService {
  /**
   * Get all active AMA sessions for a school
   */
  async getActiveSessions(schoolId: string) {
    return await amaRepository.findActiveBySchool(schoolId);
  }

  /**
   * Create a new AMA session
   */
  async createAMA(data: {
    title: string;
    description?: string;
    schoolId: string;
    createdByUserId: string;
    isActive: boolean;
  }) {
    return await amaRepository.createAMA(data);
  }

  /**
   * Submit a question to an AMA session
   */
  async submitQuestion(data: {
    amaId: string;
    anonymousId: string;
    content: string;
    schoolId: string;
  }) {
    // Check if user is muted or banned
    await moderationService.checkCanPerformAction(data.anonymousId);

    // Verify AMA exists
    const ama = await amaRepository.findAMAById(data.amaId);
    if (!ama) {
      throw new AppError(404, 'AMA session not found');
    }

    // Verify AMA belongs to user's school
    if (ama.schoolId !== data.schoolId) {
      throw new AppError(403, 'Cannot submit questions to AMA sessions from other schools');
    }

    // Check if AMA is active
    if (!ama.isActive) {
      throw new AppError(400, 'This AMA session is no longer active');
    }

    // Create question
    return await amaRepository.createQuestion({
      amaId: data.amaId,
      anonymousId: data.anonymousId,
      content: data.content,
      status: 'PENDING' as AMAQuestionStatus
    });
  }

  /**
   * Answer a question
   */
  async answerQuestion(data: {
    questionId: string;
    answeredByUserId: string;
    content: string;
    schoolId: string;
  }) {
    // Verify question exists
    const question = await amaRepository.findQuestionById(data.questionId);
    if (!question) {
      throw new AppError(404, 'Question not found');
    }

    // Verify question belongs to user's school
    if (question.ama.schoolId !== data.schoolId) {
      throw new AppError(403, 'Cannot answer questions from other schools');
    }

    // Check if AMA is still active
    if (!question.ama.isActive) {
      throw new AppError(400, 'This AMA session is no longer active');
    }

    // Check if question is already answered
    if (question.answer) {
      throw new AppError(409, 'This question has already been answered');
    }

    // Check if question is rejected
    if (question.status === 'REJECTED') {
      throw new AppError(400, 'Cannot answer a rejected question');
    }

    // Create answer
    const answer = await amaRepository.createAnswer({
      questionId: data.questionId,
      answeredByUserId: data.answeredByUserId,
      content: data.content
    });

    // Update question status to ANSWERED
    await amaRepository.updateQuestionStatus(data.questionId, 'ANSWERED' as AMAQuestionStatus);

    return answer;
  }

  /**
   * Update question status (approve/reject)
   */
  async updateQuestionStatus(data: {
    questionId: string;
    status: AMAQuestionStatus;
    schoolId: string;
  }) {
    // Verify question exists
    const question = await amaRepository.findQuestionById(data.questionId);
    if (!question) {
      throw new AppError(404, 'Question not found');
    }

    // Verify question belongs to user's school
    if (question.ama.schoolId !== data.schoolId) {
      throw new AppError(403, 'Cannot update questions from other schools');
    }

    // Update status
    return await amaRepository.updateQuestionStatus(data.questionId, data.status);
  }

  /**
   * List all questions for an AMA session
   */
  async listQuestions(data: {
    amaId: string;
    schoolId: string;
  }) {
    // Verify AMA exists
    const ama = await amaRepository.findAMAById(data.amaId);
    if (!ama) {
      throw new AppError(404, 'AMA session not found');
    }

    // Verify AMA belongs to user's school
    if (ama.schoolId !== data.schoolId) {
      throw new AppError(403, 'Cannot access AMA sessions from other schools');
    }

    return await amaRepository.listQuestions(data.amaId);
  }
}
