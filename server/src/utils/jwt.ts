import jwt from 'jsonwebtoken';

export interface JWTPayload {
  userId: string;
  anonymousId: string;
  role: string;
  schoolId: string;
}

export const JWTUtil = {
  /**
   * Generate an access token (short-lived, typically 15 minutes)
   */
  generateAccessToken(payload: JWTPayload): string {
    const secret = process.env.JWT_SECRET || 'your-secret-key';
    const expiresIn = process.env.JWT_ACCESS_EXPIRY || '15m';

    return jwt.sign(payload, secret, {
      expiresIn,
      algorithm: 'HS256',
    });
  },

  /**
   * Generate a refresh token (long-lived, typically 7 days)
   */
  generateRefreshToken(payload: JWTPayload): string {
    const secret = process.env.JWT_REFRESH_SECRET || 'your-refresh-secret';
    const expiresIn = process.env.JWT_REFRESH_EXPIRY || '7d';

    return jwt.sign(payload, secret, {
      expiresIn,
      algorithm: 'HS256',
    });
  },

  /**
   * Verify and decode an access token
   */
  verifyAccessToken(token: string): JWTPayload | null {
    try {
      const secret = process.env.JWT_SECRET || 'your-secret-key';
      const decoded = jwt.verify(token, secret, {
        algorithms: ['HS256'],
      }) as JWTPayload;
      return decoded;
    } catch (error) {
      return null;
    }
  },

  /**
   * Verify and decode a refresh token
   */
  verifyRefreshToken(token: string): JWTPayload | null {
    try {
      const secret = process.env.JWT_REFRESH_SECRET || 'your-refresh-secret';
      const decoded = jwt.verify(token, secret, {
        algorithms: ['HS256'],
      }) as JWTPayload;
      return decoded;
    } catch (error) {
      return null;
    }
  },

  /**
   * Extract token from Authorization header (Bearer <token>)
   */
  extractToken(authHeader: string | undefined): string | null {
    if (!authHeader) return null;
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') return null;
    return parts[1];
  },

  /**
   * Decode token without verification (for debugging)
   */
  decodeToken(token: string): any {
    try {
      return jwt.decode(token);
    } catch (error) {
      return null;
    }
  },
};
