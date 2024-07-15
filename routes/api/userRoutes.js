const router = require('express').Router();

// Import logic for each user request from the user controller
const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  addFriend,
  deleteFriend,
} = require('../../controllers/userController');

// Endpoint: /api/users/
// Handles requests to get all users, or create a new one
router.route('/')
  .get(getUsers)
  .post(createUser);

// Endpoint: /api/users/:userId/
// Handles requests to get a user by their ID, Update user info, or delete a user
router.route('/:userId')
  .get(getUser)
  .put(updateUser)
  .delete(deleteUser);

// Endpoint: /api/users/:userId/friends/:friendId/
// Used to add, or remove, a friend from a specific user
router.route('/:userId/friends/:friendId')
  .post(addFriend)
  .delete(deleteFriend);

module.exports = router;
