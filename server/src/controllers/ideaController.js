const IdeaModel = require('../models/ideaModel');
const { validate, createIdeaSchema } = require('../utils/validators');

exports.getAllIdeas = async (req, res, next) => {
  try {
    const ideas = await IdeaModel.getAllIdeas();
    res.json(ideas);
  } catch (err) {
    next(err);
  }
};

exports.createIdea = async (req, res, next) => {
  try {
    const data = validate(createIdeaSchema, req.body);
    const ideaId = await IdeaModel.createIdea(data.title, data.description || '', req.user.userId, 'Анонимен');
    res.status(201).json({ message: 'Idea submitted', ideaId });
  } catch (err) {
    next(err);
  }
};

exports.upvoteIdea = async (req, res, next) => {
  try {
    const { id } = req.params;
    const idea = await IdeaModel.getIdeaById(id);
    if (!idea) return res.status(404).json({ error: 'Idea not found' });
    if (await IdeaModel.userHasUpvoted(id, req.user.userId)) {
      return res.status(409).json({ error: 'You have already upvoted this idea' });
    }
    await IdeaModel.addUpvote(id, req.user.userId);
    res.json({ message: 'Idea upvoted' });
  } catch (err) {
    next(err);
  }
};
