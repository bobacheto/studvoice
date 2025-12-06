import bcrypt from 'bcrypt';
import { customAlphabet } from 'nanoid';

// Generate anonymousId using nanoid (21 char string, URL-friendly)
const nanoid = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', 21);

export const HashUtil = {
  /**
   * Hash a password using bcrypt
   * @param password - Plain text password
   * @returns Hashed password
   */
  hashPassword(password: string): string {
    const saltRounds = 12; // High salt rounds for security
    const hash = bcrypt.hashSync(password, saltRounds);
    return hash;
  },

  /**
   * Compare a password with its hash
   * @param password - Plain text password
   * @param hash - Bcrypt hash
   * @returns True if password matches hash
   */
  comparePassword(password: string, hash: string): boolean {
    try {
      return bcrypt.compareSync(password, hash);
    } catch (error) {
      return false;
    }
  },

  /**
   * Generate a unique anonymousId for anonymous posts
   * @returns 21-character unique ID
   */
  generateAnonymousId(): string {
    return nanoid();
  },
};
