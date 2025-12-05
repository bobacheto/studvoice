const express = require('express');
const router = express.Router();
const ideaController = require('../controllers/ideaController');
const authMiddleware = require('../middleware/authMiddleware');
const { createLimiter } = require('../middleware/rateLimiter');

router.get('/', (req, res, next) => {
  ideaController.getAllIdeas(req, res, next);
});

router.post('/create', authMiddleware, createLimiter, (req, res, next) => {
  ideaController.createIdea(req, res, next);
});

router.post('/:id/upvote', authMiddleware, createLimiter, (req, res, next) => {
  ideaController.upvoteIdea(req, res, next);
});

module.exports = router;
