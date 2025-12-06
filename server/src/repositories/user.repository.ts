import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class UserRepository {
  /**
   * Create a new user
   * @param data - User creation data
   * @returns Created user
   */
  async createUser(data: {
    email: string;
    passwordHash: string;
    anonymousId: string;
    schoolId: string;
  }) {
    return prisma.user.create({
      data: {
        email: data.email,
        passwordHash: data.passwordHash,
        anonymousId: data.anonymousId,
        schoolId: data.schoolId,
        role: 'STUDENT', // Default role
      },
      select: {
        id: true,
        email: true,
        anonymousId: true,
        role: true,
        schoolId: true,
        createdAt: true,
      },
    });
  }

  /**
   * Find user by email
   * @param email - User email
   * @returns User with password hash for comparison
   */
  async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
      include: {
        school: {
          select: { id: true, code: true, name: true },
        },
      },
    });
  }

  /**
   * Find user by ID
   * @param userId - User ID
   * @returns User data (without password)
   */
  async findById(userId: string) {
    return prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        anonymousId: true,
        role: true,
        schoolId: true,
        createdAt: true,
      },
    });
  }

  /**
   * Find user by anonymousId
   * @param anonymousId - Anonymous ID
   * @returns User
   */
  async findByAnonymousId(anonymousId: string) {
    return prisma.user.findUnique({
      where: { anonymousId },
      select: {
        id: true,
        email: true,
        anonymousId: true,
        role: true,
        schoolId: true,
      },
    });
  }

  /**
   * Save refresh token to database
   * @param userId - User ID
   * @param token - Refresh token
   * @param expiresAt - Token expiration date
   * @returns Saved refresh token
   */
  async saveRefreshToken(userId: string, token: string, expiresAt: Date) {
    // Delete old refresh tokens for this user
    await prisma.refreshToken.deleteMany({
      where: { userId },
    });

    return prisma.refreshToken.create({
      data: {
        userId,
        token,
        expiresAt,
      },
    });
  }

  /**
   * Find refresh token
   * @param token - Refresh token
   * @returns Token data if found and not expired
   */
  async findRefreshToken(token: string) {
    const refreshToken = await prisma.refreshToken.findUnique({
      where: { token },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            anonymousId: true,
            role: true,
            schoolId: true,
          },
        },
      },
    });

    // Check if token is not expired
    if (refreshToken && refreshToken.expiresAt > new Date()) {
      return refreshToken;
    }

    return null;
  }

  /**
   * Delete refresh token
   * @param token - Refresh token to delete
   */
  async deleteRefreshToken(token: string) {
    return prisma.refreshToken.delete({
      where: { token },
    }).catch(() => null); // Silently fail if token doesn't exist
  }

  /**
   * Update user role
   * @param userId - User ID
   * @param role - New role
   */
  async updateUserRole(userId: string, role: import('@prisma/client').Role) {
    return prisma.user.update({
      where: { id: userId },
      data: { role },
      select: {
        id: true,
        email: true,
        anonymousId: true,
        role: true,
        schoolId: true,
      },
    });
  }

  /**
   * Deactivate user
   * @param userId - User ID
   */
  async deactivateUser(userId: string) {
    return prisma.user.update({
      where: { id: userId },
      data: { isActive: false },
    });
  }
}
