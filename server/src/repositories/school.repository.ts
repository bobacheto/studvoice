import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class SchoolRepository {
  /**
   * Find school by code
   * @param schoolCode - School registration code
   * @returns School data if found
   */
  async findByCode(schoolCode: string) {
    return prisma.school.findUnique({
      where: { code: schoolCode },
      select: {
        id: true,
        name: true,
        code: true,
        createdAt: true,
      },
    });
  }

  /**
   * Find school by ID
   * @param schoolId - School ID
   * @returns School data if found
   */
  async findById(schoolId: string) {
    return prisma.school.findUnique({
      where: { id: schoolId },
      select: {
        id: true,
        name: true,
        code: true,
        createdAt: true,
      },
    });
  }

  /**
   * Create a new school
   * @param data - School creation data
   * @returns Created school
   */
  async createSchool(data: { name: string; code: string }) {
    return prisma.school.create({
      data: {
        name: data.name,
        code: data.code,
      },
      select: {
        id: true,
        name: true,
        code: true,
        createdAt: true,
      },
    });
  }
}
