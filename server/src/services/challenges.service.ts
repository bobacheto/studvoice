// Challenges Service - Business logic for gamification challenges
// NO Prisma calls - only repository calls

import { ChallengeRepository } from '../repositories/challenge.repository';
import { ModerationService } from './moderation.service';
import { ChallengeType } from '@prisma/client';
import { AppError } from '../utils/errors';

const challengeRepository = new ChallengeRepository();
const moderationService = new ModerationService();

export class ChallengesService {
  /**
   * Get active challenges for a school
   */
  async getActiveChallenges(schoolId: string) {
    return await challengeRepository.findActiveChallengesBySchool(schoolId);
  }

  /**
   * Create a new challenge
   */
  async createChallenge(data: {
    title: string;
    description: string;
    type: ChallengeType;
    schoolId: string;
    createdByUserId: string;
    startAt: string;
    endAt: string;
    isActive: boolean;
  }) {
    // Validate dates
    const startAt = new Date(data.startAt);
    const endAt = new Date(data.endAt);

    if (startAt >= endAt) {
      throw new AppError(400, 'Start date must be before end date');
    }

    if (endAt <= new Date()) {
      throw new AppError(400, 'End date must be in the future');
    }

    return await challengeRepository.createChallenge({
      title: data.title,
      description: data.description,
      type: data.type,
      schoolId: data.schoolId,
      createdByUserId: data.createdByUserId,
      startAt,
      endAt,
      isActive: data.isActive
    });
  }

  /**
   * Submit content for a challenge
   */
  async submitToChallenge(data: {
    challengeId: string;
    anonymousId: string;
    content: string;
    schoolId: string;
  }) {
    // Check if user is muted or banned
    await moderationService.checkCanPerformAction(data.anonymousId);

    // Verify challenge exists
    const challenge = await challengeRepository.findChallengeById(data.challengeId);
    if (!challenge) {
      throw new AppError(404, 'Challenge not found');
    }

    // Verify challenge belongs to user's school
    if (challenge.schoolId !== data.schoolId) {
      throw new AppError(403, 'Cannot submit to challenges from other schools');
    }

    // Check if challenge is active
    if (!challenge.isActive) {
      throw new AppError(400, 'This challenge is no longer active');
    }

    // Check if challenge has started
    const now = new Date();
    if (challenge.startAt > now) {
      throw new AppError(400, 'This challenge has not started yet');
    }

    // Check if challenge has ended
    if (challenge.endAt < now) {
      throw new AppError(400, 'This challenge has ended');
    }

    // Check if user already submitted
    const existingSubmission = await challengeRepository.findSubmissionByAnonymousId(
      data.challengeId,
      data.anonymousId
    );
    if (existingSubmission) {
      throw new AppError(409, 'You have already submitted to this challenge');
    }

    // Create submission
    return await challengeRepository.createSubmission({
      challengeId: data.challengeId,
      anonymousId: data.anonymousId,
      content: data.content
    });
  }

  /**
   * Get all submissions for a challenge (moderators only)
   */
  async getSubmissions(data: {
    challengeId: string;
    schoolId: string;
  }) {
    // Verify challenge exists
    const challenge = await challengeRepository.findChallengeById(data.challengeId);
    if (!challenge) {
      throw new AppError(404, 'Challenge not found');
    }

    // Verify challenge belongs to user's school
    if (challenge.schoolId !== data.schoolId) {
      throw new AppError(403, 'Cannot access challenges from other schools');
    }

    return await challengeRepository.listSubmissions(data.challengeId);
  }
}
