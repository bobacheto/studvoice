// Report Repository - ALL Prisma queries for reports
// Services must NOT call Prisma directly

import { PrismaClient, ReportStatus, ReportTargetType } from '@prisma/client';

const prisma = new PrismaClient();

export class ReportRepository {
  /**
   * Create a new report
   */
  async createReport(data: {
    postId?: string;
    commentId?: string;
    anonymousId: string;
    targetType: ReportTargetType;
    reason: string;
  }): Promise<any> {
    try {
      return await prisma.report.create({
        data: {
          postId: data.postId || null,
          commentId: data.commentId || null,
          anonymousId: data.anonymousId,
          targetType: data.targetType,
          reason: data.reason,
          status: 'OPEN' as ReportStatus,
        },
        select: {
          id: true,
          postId: true,
          commentId: true,
          anonymousId: true,
          targetType: true,
          reason: true,
          status: true,
          createdAt: true,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Find reports by school (via post/comment relation)
   */
  async findManyBySchool(schoolId: string, status?: ReportStatus): Promise<any[]> {
    try {
      const where: any = {
        status: status || undefined,
        OR: [
          {
            post: {
              schoolId,
            },
          },
          {
            comment: {
              post: {
                schoolId,
              },
            },
          },
        ],
      };

      return await prisma.report.findMany({
        where,
        select: {
          id: true,
          postId: true,
          commentId: true,
          targetType: true,
          reason: true,
          status: true,
          createdAt: true,
          reviewedAt: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update report status
   */
  async updateStatus(id: string, status: ReportStatus): Promise<any> {
    try {
      return await prisma.report.update({
        where: { id },
        data: {
          status,
          reviewedAt: status !== 'OPEN' ? new Date() : null,
        },
        select: {
          id: true,
          status: true,
          reviewedAt: true,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Find report by ID
   */
  async findById(id: string): Promise<any | null> {
    try {
      return await prisma.report.findUnique({
        where: { id },
        select: {
          id: true,
          postId: true,
          commentId: true,
          anonymousId: true,
          targetType: true,
          reason: true,
          status: true,
          createdAt: true,
          reviewedAt: true,
        },
      });
    } catch (error) {
      throw error;
    }
  }
}

export const reportRepository = new ReportRepository();
