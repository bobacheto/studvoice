// Polls Service - Business logic for polls and voting
// NO Prisma calls - only repository calls

import { PollRepository } from '../repositories/poll.repository';
import { ModerationService } from './moderation.service';
import { AppError } from '../utils/errors';

const pollRepository = new PollRepository();
const moderationService = new ModerationService();

type PollWithOptions = Awaited<ReturnType<typeof pollRepository.findManyActiveBySchool>>[number];
type PollOptionWithCount = PollWithOptions['options'][number];

export class PollsService {
  /**
   * Get all active polls for a school
   */
  async getPolls(schoolId: string) {
    const polls = await pollRepository.findManyActiveBySchool(schoolId);

    // Transform to include vote counts
    return polls.map((poll: PollWithOptions) => ({
      id: poll.id,
      title: poll.title,
      description: poll.description,
      createdByAnonymousId: poll.createdByAnonymousId,
      createdAt: poll.createdAt,
      expiresAt: poll.expiresAt,
      options: poll.options.map((option: PollOptionWithCount) => ({
        id: option.id,
        text: option.text,
        voteCount: option._count.votes
      }))
    }));
  }

  /**
   * Create a new poll
   */
  async createPoll(data: {
    title: string;
    description?: string;
    options: string[];
    schoolId: string;
    createdByAnonymousId: string;
    expiresAt?: string;
  }) {
    // Validate options
    if (!data.options || data.options.length < 2) {
      throw new AppError(400, 'Poll must have at least 2 options');
    }

    if (data.options.length > 10) {
      throw new AppError(400, 'Poll cannot have more than 10 options');
    }

    // Validate expiration date
    let expiresAt: Date | undefined;
    if (data.expiresAt) {
      expiresAt = new Date(data.expiresAt);
      if (expiresAt <= new Date()) {
        throw new AppError(400, 'Expiration date must be in the future');
      }
    }

    // Create poll
    const poll = await pollRepository.createPoll({
      title: data.title,
      description: data.description,
      schoolId: data.schoolId,
      createdByAnonymousId: data.createdByAnonymousId,
      expiresAt
    });

    // Create poll options
    await pollRepository.createPollOptions(poll.id, data.options);

    // Fetch and return complete poll with options
    const completePoll = await pollRepository.findById(poll.id);
    
    if (!completePoll) {
      throw new AppError(404, 'Poll not found');
    }

    return {
      id: completePoll.id,
      title: completePoll.title,
      description: completePoll.description,
      createdByAnonymousId: completePoll.createdByAnonymousId,
      createdAt: completePoll.createdAt,
      expiresAt: completePoll.expiresAt,
      options: completePoll.options.map((option: PollOptionWithCount) => ({
        id: option.id,
        text: option.text,
        voteCount: option._count.votes
      }))
    };
  }

  /**
   * Delete a poll
   */
  async deletePoll(pollId: string) {
    const poll = await pollRepository.findById(pollId);
    if (!poll) {
      throw new AppError(404, 'Poll not found');
    }

    await pollRepository.deletePoll(pollId);
  }

  /**
   * Vote on a poll
   */
  async vote(data: {
    pollId: string;
    optionId: string;
    anonymousId: string;
    schoolId: string;
  }) {
    // Check if user is muted or banned
    await moderationService.checkCanPerformAction(data.anonymousId);

    // Verify poll exists
    const poll = await pollRepository.findById(data.pollId);
    if (!poll) {
      throw new AppError(404, 'Poll not found');
    }

    // Verify poll belongs to user's school
    if (poll.schoolId !== data.schoolId) {
      throw new AppError(403, 'Cannot vote on polls from other schools');
    }

    // Check if poll is expired
    if (poll.expiresAt && poll.expiresAt < new Date()) {
      throw new AppError(400, 'This poll has expired');
    }

    // Check if user already voted
    const existingVote = await pollRepository.findVote(data.pollId, data.anonymousId);
    if (existingVote) {
      throw new AppError(409, 'You have already voted on this poll');
    }

    // Verify option belongs to poll
    const isValidOption = await pollRepository.verifyOptionBelongsToPoll(data.pollId, data.optionId);
    if (!isValidOption) {
      throw new AppError(400, 'Invalid poll option');
    }

    // Create vote
    await pollRepository.createVote({
      pollId: data.pollId,
      pollOptionId: data.optionId,
      anonymousId: data.anonymousId
    });

    // Return updated results
    const results = await pollRepository.getResults(data.pollId);
    return {
      pollId: data.pollId,
      results
    };
  }
}
