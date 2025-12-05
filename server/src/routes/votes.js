const express = require('express');
const router = express.Router();
const voteController = require('../controllers/voteController');
const authMiddleware = require('../middleware/authMiddleware');
const { createLimiter } = require('../middleware/rateLimiter');

router.get('/', (req, res, next) => {
  voteController.getAllVotes(req, res, next);
});

router.post('/create', authMiddleware, createLimiter, (req, res, next) => {
  voteController.createVote(req, res, next);
});

router.post('/:id/vote', authMiddleware, createLimiter, (req, res, next) => {
  voteController.voteOnPoll(req, res, next);
});

module.exports = router;
