import { app } from './app';

const PORT = process.env.PORT || 5000;

// TODO: Initialize Prisma client
// TODO: Connect to database

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// TODO: Add graceful shutdown handling
// TODO: Add error event listeners
