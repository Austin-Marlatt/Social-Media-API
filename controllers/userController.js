const { User, Thought } = require('../models');

// Variable used to house all the exported logic
const userController = {
  // Returns all users in the db
  async getUsers(req, res) {
    // try => Catch error handling
    try {
        const userData = await User.find({})
      // '.select()' is a method that can include and exclude specific fields in a search
      // Here, we use `-` to exclude the version field from the response
      .select('-__v')
        // Populate the friends subdocument in the User Models
      .populate('friends')
        // Populate the thoughts subdocument in the User Models
      .populate('thoughts');
      // Success, Return the data in JSON
      res.status(200).json(userData);
    } catch (err) {
      // Failure, return server error status and return the error in JSON
      res.status(500).json(err);
    }
  },

  // Returns a specific User by ID
  async getUser(req, res) {
    try {
      
      const userData = await User.findOne(
        // Find One with the User ID passed in the params
        { _id: req.params.userId })
        // Exclude version key from response
        .select('-__v')
        // Populate the friends subdocument in the User Model 
        .populate('friends')
        // Populate the thoughts subdocument in the User Model
        .populate('thoughts');

      // If no user data is returned, return a "File Not Found" status and a message
      if (!userData) {
        return res.status(404).json({ 
          message: 'Could not find a User matching this ID, Try again.' 
        });
      }
      // Success, Return the found data
      res.status(200).json(userData);
    } catch (err) {
      // Failure, return server error status and return the error in JSON
      res.status(500).json(err);
    }
  },

  // Add a new User to the db
  async createUser(req, res) {
    try {
      // Attempt a create method on the User model with the data in the request body
      const userData = await User.create(req.body);

      // Success, Return the newly made user
      res.status(200).json(userData);
    } catch (err) {
      // Failure, return bad request status and return the err in JSON
      console.log(err);
      res.status(400).json(err);
    }
  },

  // Update a User's information
  async updateUser(req, res) {
    try {
      const userData = await User.findOneAndUpdate(
        // Find a user with the id passed in the req body
        { _id: req.params.userId },
        // `$set` allows us to set the value of a specific field
        // Therefore, only the fields passed in the req.body will be set to a new value
        { $set: req.body },
        // `RunValidators` only runs on updated fields and ensures the new value matches the schema rules
        { runValidators: true},
        // `new: true` returns the updated field *after* the updates are made
        { new: true }
      );

      // If no user data is returned, return a "File Not Found" status and a message
      if (!userData) {
        return res.status(404).json({
          message: 'Could not find a User matching this ID, Try again.'
        });
      };

      // Success, Return the updated User profile
      res.json(userData);
    } catch (err) {
      // Failure, return bad request status and return the error in JSON
      res.status(400).json(err);
    }
  },

  // Removes a user from the db and deletes all there associated content
  async deleteUser(req, res) {
    try {
      // Find by ID and delete
      const userData = await User.findOneAndDelete({ _id: req.params.userId });

      // If no user data is found, return a "File Not Found" status and an error message
      if (!userData) {
        return res.status(404).json({ 
          message: 'Could not find a User matching this ID, Try again.'
        });
      }

      // Deletes thoughts associated with the user
      // `$in` will find all the fields in `userData.thoughts` that match the field of `_id` and returns their values
      // Uses a `deleteMany` method to delete all the thoughts by their returned ID's
      await Thought.deleteMany({ _id: { $in: userData.thoughts } });
      res.status(200).json({ 
        message:'Successfully removed the User and all their associated data.' 
      });
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // Add a new friend to a specified User's friend list
  async addFriend(req, res) {
    try {
      const userData = await User.findOneAndUpdate(
        // user that is making the request
        { _id: req.params.userId },
        // `$addToSet` adds a value to an array unless the value is already present
        // This way we can't accidentally add someone to the same friends array twice
        { $addToSet: { friends: req.params.friendId } },
        // Return the updated User *after* the friend is added
        { new: true }
      );
      
      // If no user data is returned, return a "File Not Found" status and a message
      if (!userData) {
        return res.status(404).json({ 
          message: 'Could not find a User matching this ID, Try again.' 
        });
      }

      // Success, Return the updates User profile
      res.json(userData);
    } catch (err) {
      // Failure, return server error status and return the error in JSON
      res.status(500).json(err);
    }
  },

  // Remove a friend from the from the specified User's friend list
  async deleteFriend(req, res) {
    try {
      const userData = await User.findOneAndUpdate(
        // User that is making the request
        { _id: req.params.userId }, 
        // `$pull` removes any existing values in an array that match the parameters
        { $pull: { friends: req.params.friendId } },
        // Return the updated User *after* the friend has been removed
        { new: true });

      // If no user data is returned, return a "File Not Found" status and a message
      if (!userData) {
        return res.status(404).json({
          message: 'Could not find a User matching this ID, Try again.' 
          });
      }

      // Success, Return the updated User profile
      res.json(userData);
    } catch (err) {
      // Failure, return server error status and return the error in JSON
      res.status(500).json(err);
    }
  },
};

module.exports = userController;
