const { z } = require('zod');

const registerSchema = z.object({
  email: z.string().email('Invalid email'),
  username: z.string().min(3, 'Username must be at least 3 characters'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  school_code: z.string().optional()
});

const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Password required')
});

const createVoteSchema = z.object({
  question: z.string().min(5, 'Question too short'),
  optionYes: z.string().min(1).optional(),
  optionNo: z.string().min(1).optional()
});

const voteOnPollSchema = z.object({
  choice: z.enum(['yes', 'no'])
});

const createIdeaSchema = z.object({
  title: z.string().min(5, 'Title too short'),
  description: z.string().min(10).optional()
});

function validate(schema, data) {
  try {
    return schema.parse(data);
  } catch (err) {
    if (err.errors) {
      const msg = err.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ');
      const error = new Error(msg);
      error.type = 'VALIDATION_ERROR';
      throw error;
    }
    throw err;
  }
}

module.exports = {
  validate,
  registerSchema,
  loginSchema,
  createVoteSchema,
  voteOnPollSchema,
  createIdeaSchema
};
