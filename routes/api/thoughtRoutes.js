const router = require('express').Router();

// Import logic for each thought request from the thought controller
const {
  getThoughts,
  getThought,
  createThought,
  updateThought,
  deleteThought,
  addReaction,
  deleteReaction,
} = require('../../controllers/thoughtController');

// Endpoint: /api/thoughts
// Handles requests to get all thought or post one
router.route('/')
  .get(getThoughts)
  .post(createThought);

// Endpoint: /api/thoughts/:thoughtId
// Handles requests to get a specific thought by ID, Update a thought, or delete one
router.route('/:thoughtId')
  .get(getThought)
  .put(updateThought)
  .delete(deleteThought);

// Endpoint: /api/thoughts/:thoughtId/reactions
// Used to add a reaction to a specified thought
router.route('/:thoughtId/reactions')
  .post(addReaction);

// Endpoint: /api/thoughts/:thoughtId/reactions/:reactionId
// Used to delete a reaction by id off of a specified thought
router.route('/:thoughtId/reactions/:reactionId')
  .delete(deleteReaction);

module.exports = router;
