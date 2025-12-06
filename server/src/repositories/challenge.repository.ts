// IMPORTANT: Repositories contain ALL Prisma/database calls
// Services must NOT call Prisma directly

import { PrismaClient, ChallengeType } from '@prisma/client';

const prisma = new PrismaClient();

export class ChallengeRepository {
  /**
   * Find active challenges by school
   */
  async findActiveChallengesBySchool(schoolId: string) {
    const now = new Date();
    
    return await prisma.challenge.findMany({
      where: {
        schoolId,
        isActive: true,
        startAt: { lte: now },
        endAt: { gte: now }
      },
      include: {
        createdBy: {
          select: {
            id: true,
            role: true
          }
        },
        _count: {
          select: { submissions: true }
        }
      },
      orderBy: { startAt: 'desc' }
    });
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
    startAt: Date;
    endAt: Date;
    isActive: boolean;
  }) {
    return await prisma.challenge.create({
      data,
      include: {
        createdBy: {
          select: {
            id: true,
            role: true
          }
        }
      }
    });
  }

  /**
   * Find challenge by ID
   */
  async findChallengeById(id: string) {
    return await prisma.challenge.findUnique({
      where: { id },
      include: {
        createdBy: {
          select: {
            id: true,
            role: true
          }
        }
      }
    });
  }

  /**
   * Create a challenge submission
   */
  async createSubmission(data: {
    challengeId: string;
    anonymousId: string;
    content: string;
  }) {
    return await prisma.challengeSubmission.create({
      data
    });
  }

  /**
   * List submissions for a challenge
   */
  async listSubmissions(challengeId: string) {
    return await prisma.challengeSubmission.findMany({
      where: { challengeId },
      orderBy: { createdAt: 'desc' }
    });
  }

  /**
   * Check if user already submitted to a challenge
   */
  async findSubmissionByAnonymousId(challengeId: string, anonymousId: string) {
    return await prisma.challengeSubmission.findFirst({
      where: {
        challengeId,
        anonymousId
      }
    });
  }
}
