// IMPORTANT: Repositories contain ALL Prisma/database calls
// Services must NOT call Prisma directly

import { PrismaClient, AMAQuestionStatus } from '@prisma/client';
import type { Prisma } from '@prisma/client';

const prisma = new PrismaClient();

type AMAQuestionWithRelations = Prisma.AMAQuestionGetPayload<{
  include: {
    ama: { select: { id: true; schoolId: true; isActive: true } };
    answer: {
      include: {
        answeredBy: {
          select: {
            id: true;
            role: true;
          };
        };
      };
    };
  };
}>;

export class AMARepository {

  /**
   * Find all active AMA sessions by school
   */
  async findActiveBySchool(schoolId: string) {
    return await prisma.aMA.findMany({
      where: {
        schoolId,
        isActive: true
      },
      include: {
        createdBy: {
          select: {
            id: true,
            role: true
          }
        },
        _count: {
          select: { questions: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
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
    return await prisma.aMA.create({
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
   * Find AMA by ID with full details
   */
  async findAMAById(amaId: string) {
    return await prisma.aMA.findUnique({
      where: { id: amaId },
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
   * Create a question in an AMA session
   */
  async createQuestion(data: {
    amaId: string;
    anonymousId: string;
    content: string;
    status: AMAQuestionStatus;
  }) {
    return await prisma.aMAQuestion.create({
      data
    });
  }

  /**
   * Find question by ID
   */
  async findQuestionById(questionId: string): Promise<AMAQuestionWithRelations | null> {
    return await prisma.aMAQuestion.findUnique({
      where: { id: questionId },
      include: {
        ama: {
          select: {
            id: true,
            schoolId: true,
            isActive: true
          }
        },
        answer: {
          include: {
            answeredBy: {
              select: {
                id: true,
                role: true
              }
            }
          }
        }
      }
    });
  }

  /**
   * Create an answer to a question
   */
  async createAnswer(data: {
    questionId: string;
    answeredByUserId: string;
    content: string;
  }) {
    return await prisma.aMAAnswer.create({
      data,
      include: {
        answeredBy: {
          select: {
            id: true,
            role: true
          }
        }
      }
    });
  }

  /**
   * Update question status
   */
  async updateQuestionStatus(questionId: string, status: AMAQuestionStatus) {
    return await prisma.aMAQuestion.update({
      where: { id: questionId },
      data: { status }
    });
  }

  /**
   * List questions for an AMA session
   */
  async listQuestions(amaId: string) {
    return await prisma.aMAQuestion.findMany({
      where: { amaId },
      include: {
        answer: {
          include: {
            answeredBy: {
              select: {
                id: true,
                role: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }
}
