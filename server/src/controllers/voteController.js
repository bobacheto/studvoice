const VoteModel = require('../models/voteModel');
const { validate, createVoteSchema, voteOnPollSchema } = require('../utils/validators');

exports.getAllVotes = async (req, res, next) => {
  try {
    const votes = await VoteModel.getAllVotes('approved');
    res.json(votes);
  } catch (err) {
    next(err);
  }
};

exports.createVote = async (req, res, next) => {
  try {
    const data = validate(createVoteSchema, req.body);
    const voteId = await VoteModel.createVote(data.question, data.optionYes, data.optionNo, req.user.userId);
    res.status(201).json({ message: 'Vote created', voteId });
  } catch (err) {
    next(err);
  }
};

exports.voteOnPoll = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = validate(voteOnPollSchema, req.body);
    const vote = await VoteModel.getVoteById(id);
    if (!vote) return res.status(404).json({ error: 'Vote not found' });
    if (await VoteModel.userHasVoted(id, req.user.userId)) {
      return res.status(409).json({ error: 'You have already voted' });
    }
    await VoteModel.addVote(id, req.user.userId, data.choice);
    res.json({ message: 'Vote recorded', choice: data.choice });
  } catch (err) {
    next(err);
  }
};
