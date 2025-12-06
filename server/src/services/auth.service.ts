import { UserRepository } from '../repositories/user.repository';
import { SchoolRepository } from '../repositories/school.repository';
import { HashUtil } from '../utils/hash';
import { JWTUtil, JWTPayload } from '../utils/jwt';
import { AuthenticationError, ValidationError, ConflictError, NotFoundError } from '../utils/errors';

export class AuthService {
  private userRepository: UserRepository;
  private schoolRepository: SchoolRepository;

  constructor() {
    this.userRepository = new UserRepository();
    this.schoolRepository = new SchoolRepository();
  }

  /**
   * Register a new student
   * @param data - Registration data { email, password, schoolCode }
   * @returns JWT tokens and user data
   */
  async register(data: { email: string; password: string; schoolCode: string }) {
    // 1. Validate inputs
    if (!data.email || !data.password || !data.schoolCode) {
      throw new ValidationError('Email, password, and school code are required');
    }

    if (data.password.length < 8) {
      throw new ValidationError('Password must be at least 8 characters');
    }

    // 2. Check if school exists
    const school = await this.schoolRepository.findByCode(data.schoolCode);
    if (!school) {
      throw new NotFoundError('School code is invalid or not found');
    }

    // 3. Check if email is already registered
    const existingUser = await this.userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new ConflictError('Email is already registered');
    }

    // 4. Hash password
    const passwordHash = HashUtil.hashPassword(data.password);

    // 5. Generate anonymousId
    const anonymousId = HashUtil.generateAnonymousId();

    // 6. Create user
    const user = await this.userRepository.createUser({
      email: data.email,
      passwordHash,
      anonymousId,
      schoolId: school.id,
    });

    // 7. Generate JWT tokens
    const jwtPayload: JWTPayload = {
      userId: user.id,
      anonymousId: user.anonymousId,
      role: user.role,
      schoolId: user.schoolId,
    };

    const accessToken = JWTUtil.generateAccessToken(jwtPayload);
    const refreshToken = JWTUtil.generateRefreshToken(jwtPayload);

    // 8. Save refresh token to database
    const refreshTokenExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    await this.userRepository.saveRefreshToken(user.id, refreshToken, refreshTokenExpiresAt);

    // 9. Return tokens and user data
    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        anonymousId: user.anonymousId,
        role: user.role,
        schoolId: user.schoolId,
      },
    };
  }

  /**
   * Login a student
   * @param data - Login data { email, password, schoolCode }
   * @returns JWT tokens and user data
   */
  async login(data: { email: string; password: string; schoolCode: string }) {
    // 1. Validate inputs
    if (!data.email || !data.password || !data.schoolCode) {
      throw new ValidationError('Email, password, and school code are required');
    }

    // 2. Find user by email
    const user = await this.userRepository.findByEmail(data.email);
    if (!user) {
      throw new AuthenticationError('Invalid email or password');
    }

    // 3. Check if user is active
    if (!user.isActive) {
      throw new AuthenticationError('User account is inactive');
    }

    // 4. Verify school code matches
    if (user.school.code !== data.schoolCode) {
      throw new AuthenticationError('Invalid school code');
    }

    // 5. Compare password
    const isPasswordValid = HashUtil.comparePassword(data.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new AuthenticationError('Invalid email or password');
    }

    // 6. Generate JWT tokens
    const jwtPayload: JWTPayload = {
      userId: user.id,
      anonymousId: user.anonymousId,
      role: user.role,
      schoolId: user.schoolId,
    };

    const accessToken = JWTUtil.generateAccessToken(jwtPayload);
    const refreshToken = JWTUtil.generateRefreshToken(jwtPayload);

    // 7. Save refresh token to database
    const refreshTokenExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    await this.userRepository.saveRefreshToken(user.id, refreshToken, refreshTokenExpiresAt);

    // 8. Return tokens and user data
    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        anonymousId: user.anonymousId,
        role: user.role,
        schoolId: user.schoolId,
      },
    };
  }

  /**
   * Refresh access token using refresh token
   * @param refreshToken - Refresh token from request
   * @returns New JWT tokens
   */
  async refreshToken(refreshToken: string) {
    // 1. Validate refresh token is provided
    if (!refreshToken) {
      throw new ValidationError('Refresh token is required');
    }

    // 2. Verify and decode refresh token
    const decoded = JWTUtil.verifyRefreshToken(refreshToken);
    if (!decoded) {
      throw new AuthenticationError('Invalid or expired refresh token');
    }

    // 3. Check if token exists in database
    const tokenRecord = await this.userRepository.findRefreshToken(refreshToken);
    if (!tokenRecord) {
      throw new AuthenticationError('Refresh token not found or expired');
    }

    // 4. Get updated user data
    const user = await this.userRepository.findById(tokenRecord.user.id);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    // 5. Generate new token pair
    const jwtPayload: JWTPayload = {
      userId: user.id,
      anonymousId: user.anonymousId,
      role: user.role,
      schoolId: user.schoolId,
    };

    const newAccessToken = JWTUtil.generateAccessToken(jwtPayload);
    const newRefreshToken = JWTUtil.generateRefreshToken(jwtPayload);

    // 6. Replace refresh token in database
    const refreshTokenExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    await this.userRepository.deleteRefreshToken(refreshToken);
    await this.userRepository.saveRefreshToken(user.id, newRefreshToken, refreshTokenExpiresAt);

    // 7. Return new tokens
    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      user: {
        id: user.id,
        anonymousId: user.anonymousId,
        role: user.role,
        schoolId: user.schoolId,
      },
    };
  }
}
