import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';

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
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://192.168.0.102:5174', 'http://192.168.0.102:5173', 'http://172.25.240.1:5174', 'http://172.25.240.1:5173'], // Frontend URLs (localhost + network IPs)
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path}`);
  next();
});

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

// 404 handler for undefined routes
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.path} not found`,
  });
});

// Global error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message || 'An unexpected error occurred',
  });
});
