// IMPORTANT: Repositories contain ALL Prisma/database calls
// Services must NOT call Prisma directly

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class PollRepository {
  /**
   * Find all active polls by school
   */
  async findManyActiveBySchool(schoolId: string) {
    return await prisma.poll.findMany({
      where: {
        schoolId,
        OR: [
          { expiresAt: null },
          { expiresAt: { gte: new Date() } }
        ]
      },
      include: {
        options: {
          include: {
            _count: {
              select: { votes: true }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  /**
   * Find poll by ID with options and vote counts
   */
  async findById(pollId: string) {
    return await prisma.poll.findUnique({
      where: { id: pollId },
      include: {
        options: {
          include: {
            _count: {
              select: { votes: true }
            }
          }
        }
      }
    });
  }

  /**
   * Create a new poll
   */
  async createPoll(data: {
    title: string;
    description?: string;
    schoolId: string;
    createdByAnonymousId: string;
    expiresAt?: Date;
  }) {
    return await prisma.poll.create({
      data
    });
  }

  /**
   * Create poll options
   */
  async createPollOptions(pollId: string, options: string[]) {
    const optionsData = options.map(text => ({
      pollId,
      text
    }));

    return await prisma.pollOption.createMany({
      data: optionsData
    });
  }

  /**
   * Find existing vote for a poll by anonymousId
   */
  async findVote(pollId: string, anonymousId: string) {
    return await prisma.pollVote.findUnique({
      where: {
        pollId_anonymousId: {
          pollId,
          anonymousId
        }
      }
    });
  }

  /**
   * Create a vote
   */
  async createVote(data: {
    pollId: string;
    pollOptionId: string;
    anonymousId: string;
  }) {
    return await prisma.pollVote.create({
      data
    });
  }

  /**
   * Get poll results (vote counts per option)
   */
  async getResults(pollId: string) {
    const options = await prisma.pollOption.findMany({
      where: { pollId },
      include: {
        _count: {
          select: { votes: true }
        }
      }
    });

    return options.map((option: typeof options[number]) => ({
      optionId: option.id,
      text: option.text,
      voteCount: option._count.votes
    }));
  }

  /**
   * Verify poll option belongs to poll
   */
  async verifyOptionBelongsToPoll(pollId: string, optionId: string): Promise<boolean> {
    const option = await prisma.pollOption.findFirst({
      where: {
        id: optionId,
        pollId
      }
    });

    return !!option;
  }
}
