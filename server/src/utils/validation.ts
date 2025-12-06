import { z } from 'zod';

/**
 * Validation schemas for authentication endpoints
 */

export const RegisterSchema = z.object({
  email: z
    .string()
    .email('Invalid email format')
    .toLowerCase()
    .trim(),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password is too long'),
  schoolCode: z
    .string()
    .min(1, 'School code is required')
    .trim(),
});

export type RegisterInput = z.infer<typeof RegisterSchema>;

export const LoginSchema = z.object({
  email: z
    .string()
    .email('Invalid email format')
    .toLowerCase()
    .trim(),
  password: z
    .string()
    .min(1, 'Password is required'),
  schoolCode: z
    .string()
    .min(1, 'School code is required')
    .trim(),
});

export type LoginInput = z.infer<typeof LoginSchema>;

export const RefreshTokenSchema = z.object({
  refreshToken: z
    .string()
    .min(1, 'Refresh token is required'),
});

export type RefreshTokenInput = z.infer<typeof RefreshTokenSchema>;

/**
 * Validation schemas for posts
 */

export const CreatePostSchema = z.object({
  title: z
    .string()
    .max(200, 'Title must be less than 200 characters')
    .optional(),
  content: z
    .string()
    .min(1, 'Content is required')
    .max(5000, 'Content must be less than 5000 characters')
    .trim(),
});

export type CreatePostInput = z.infer<typeof CreatePostSchema>;

export const UpdatePostStatusSchema = z.object({
  status: z.enum(['PENDING', 'UNDER_REVIEW', 'ACCEPTED', 'COMPLETED', 'REJECTED'], {
    errorMap: () => ({ message: 'Invalid status' }),
  }),
});

export type UpdatePostStatusInput = z.infer<typeof UpdatePostStatusSchema>;

/**
 * Validation schemas for comments
 */

export const CreateCommentSchema = z.object({
  content: z
    .string()
    .min(1, 'Content is required')
    .max(2000, 'Content must be less than 2000 characters')
    .trim(),
});

export type CreateCommentInput = z.infer<typeof CreateCommentSchema>;

/**
 * Validation schemas for reactions
 */

export const CreateReactionSchema = z.object({
  type: z.enum(['LIKE', 'SUPPORT', 'GREAT', 'THINKING'], {
    errorMap: () => ({ message: 'Invalid reaction type' }),
  }),
});

export type CreateReactionInput = z.infer<typeof CreateReactionSchema>;

/**
 * Validation schemas for reports
 */

export const CreateReportSchema = z.object({
  targetType: z.enum(['POST', 'COMMENT'], {
    errorMap: () => ({ message: 'Target type must be POST or COMMENT' }),
  }),
  targetId: z
    .string()
    .min(1, 'Target ID is required'),
  reason: z
    .string()
    .min(1, 'Reason is required')
    .max(1000, 'Reason must be less than 1000 characters')
    .trim(),
});

export type CreateReportInput = z.infer<typeof CreateReportSchema>;

export const UpdateReportStatusSchema = z.object({
  status: z.enum(['OPEN', 'REVIEWED', 'RESOLVED'], {
    errorMap: () => ({ message: 'Invalid report status' }),
  }),
});

export type UpdateReportStatusInput = z.infer<typeof UpdateReportStatusSchema>;

/**
 * Validation schemas for strikes (moderation)
 */

export const CreateStrikeSchema = z.object({
  anonymousId: z
    .string()
    .min(1, 'Anonymous ID is required'),
  type: z.enum(['MUTE', 'WARNING', 'BAN'], {
    errorMap: () => ({ message: 'Strike type must be MUTE, WARNING, or BAN' }),
  }),
  durationHours: z
    .number()
    .positive('Duration must be positive')
    .optional(),
  reason: z
    .string()
    .max(1000, 'Reason must be less than 1000 characters')
    .optional(),
});

export type CreateStrikeInput = z.infer<typeof CreateStrikeSchema>;

/**
 * Validation schemas for Polls
 */

export const CreatePollSchema = z.object({
  title: z
    .string()
    .min(1, 'Poll title is required')
    .max(200, 'Poll title must be less than 200 characters')
    .trim(),
  description: z
    .string()
    .max(1000, 'Description must be less than 1000 characters')
    .trim()
    .optional(),
  options: z
    .array(z.string().min(1, 'Option text is required').max(100, 'Option text must be less than 100 characters'))
    .min(2, 'Poll must have at least 2 options')
    .max(10, 'Poll cannot have more than 10 options'),
  expiresAt: z
    .string()
    .datetime({ message: 'Invalid expiration date format' })
    .optional(),
});

export type CreatePollInput = z.infer<typeof CreatePollSchema>;

export const VotePollSchema = z.object({
  optionId: z
    .string()
    .min(1, 'Option ID is required'),
});

export type VotePollInput = z.infer<typeof VotePollSchema>;

/**
 * Validation schemas for AMA (Ask Me Anything)
 */

export const CreateAMASchema = z.object({
  title: z
    .string()
    .min(1, 'AMA title is required')
    .max(200, 'AMA title must be less than 200 characters')
    .trim(),
  description: z
    .string()
    .max(2000, 'Description must be less than 2000 characters')
    .trim()
    .optional(),
  isActive: z
    .boolean()
    .optional(),
});

export type CreateAMAInput = z.infer<typeof CreateAMASchema>;

export const CreateAMAQuestionSchema = z.object({
  content: z
    .string()
    .min(1, 'Question content is required')
    .max(1000, 'Question must be less than 1000 characters')
    .trim(),
});

export type CreateAMAQuestionInput = z.infer<typeof CreateAMAQuestionSchema>;

export const CreateAMAAnswerSchema = z.object({
  content: z
    .string()
    .min(1, 'Answer content is required')
    .max(5000, 'Answer must be less than 5000 characters')
    .trim(),
});

export type CreateAMAAnswerInput = z.infer<typeof CreateAMAAnswerSchema>;

export const UpdateAMAQuestionStatusSchema = z.object({
  status: z.enum(['PENDING', 'ANSWERED', 'REJECTED'], {
    errorMap: () => ({ message: 'Invalid AMA question status' }),
  }),
});

export type UpdateAMAQuestionStatusInput = z.infer<typeof UpdateAMAQuestionStatusSchema>;

/**
 * Validation schemas for Challenges
 */

export const CreateChallengeSchema = z.object({
  title: z
    .string()
    .min(1, 'Challenge title is required')
    .max(200, 'Challenge title must be less than 200 characters')
    .trim(),
  description: z
    .string()
    .min(1, 'Challenge description is required')
    .max(2000, 'Description must be less than 2000 characters')
    .trim(),
  type: z.enum(['GRATITUDE', 'IDEA_SPRINT', 'PROBLEM_SOLVER', 'CUSTOM'], {
    errorMap: () => ({ message: 'Invalid challenge type' }),
  }),
  startAt: z
    .string()
    .datetime({ message: 'Invalid start date format' }),
  endAt: z
    .string()
    .datetime({ message: 'Invalid end date format' }),
  isActive: z
    .boolean()
    .optional(),
});

export type CreateChallengeInput = z.infer<typeof CreateChallengeSchema>;

export const CreateChallengeSubmissionSchema = z.object({
  content: z
    .string()
    .min(1, 'Submission content is required')
    .max(5000, 'Submission must be less than 5000 characters')
    .trim(),
});

export type CreateChallengeSubmissionInput = z.infer<typeof CreateChallengeSubmissionSchema>;
