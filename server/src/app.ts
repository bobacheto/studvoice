import express, { Express } from 'express';

// Route imports
import authRoutes from './routes/auth.routes';
import postsRoutes from './routes/posts.routes';
import commentsRoutes from './routes/comments.routes';
import pollsRoutes from './routes/polls.routes';
import amaRoutes from './routes/ama.routes';
import moderationRoutes from './routes/moderation.routes';
import analyticsRoutes from './routes/analytics.routes';

export const app: Express = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// TODO: Add CORS middleware
// TODO: Add request logging middleware
// TODO: Add error handling middleware

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postsRoutes);
app.use('/api/comments', commentsRoutes);
app.use('/api/polls', pollsRoutes);
app.use('/api/ama', amaRoutes);
app.use('/api/moderation', moderationRoutes);
app.use('/api/analytics', analyticsRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

// TODO: Add global error handling middleware
// TODO: Add 404 handler for undefined routes
