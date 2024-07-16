const { Thought, User } = require('../models');

// Variable used to house all the exported logic
const thoughtController = {

  // Returns all Thoughts in the db
  async getThoughts(req, res) {
    // try => Catch error handling
    try {
      const thoughtData = await Thought.find({})
      // `.sort` how the data is returned,
      //  `createdAt: -1` returns the thoughts by the time they were created, in decending order
      .sort({ createdAt: -1 });

      // Success, Return the data in JSON
      res.status(200).json(thoughtData);
    } catch (err) {
      // Failure, return server error status and return the error in JSON
      res.status(500).json(err);
    }
  },

  // Returns a specific thought by ID
  async getThought(req, res) {
    try {
      const thoughtData = await Thought.findOne(
        // Find One with the Thought ID passed in the params
        { _id: req.params.thoughtId }
      );

      // If no Thought data is returned, return a "File Not Found" status and a message
      if (!thoughtData) {
        return res.status(404).json({
          message: 'Could not find a Thought matching this ID, Try again.'
        });
      };

      // Success, Return the data in JSON
      res.status(200).json(thoughtData);
    } catch (err) {
      // Failure, return bad request status and return the error in JSON
      res.status(400).json(err);
    }
  },

  // Add a new thought to the db and assign it's ownership to the current User
  async createThought(req, res) {
    try {
      // Attempt a create method on the Thought model with the data in the request body
      const thoughtData = await Thought.create(req.body);

      // Finds the current user and adds the newly created thought to their thoughts array
      const userData = await User.findOneAndUpdate(
        { _id: req.body.userId },
        { $push: { thoughts: thoughtData._id } },
        { new: true }
      );

      // If the user is not found, Return an error message
      if (!userData) {
        return res.status(404).json({
          message: 'The Thought was created successfully, But no User matches the ID'
        });
      };

      // Success, Return a confirmation message
      res.status(200).json({
        message: 'The Thought was created succesfully and added to the User account'
      });
    } catch (err) {
      // Failure, return server error status and return the error in JSON
      res.status(500).json(err);
    }
  },

  // Update the content of a Thought
  async updateThought(req, res) {
    const thoughtData = await Thought.findOneAndUpdate(
      // Find a Thought with the id passed in the request body
      { _id: req.params.thoughtId },
      // `$set` allows us to set the value of a specific field
      // Therefore, only the fields passed in the req.body will be set to a new value
      { $set: req.body },
      // `RunValidators` only runs on updated fields and ensures the new value matches the schema rules
      { runValidators: true},
      // `new: true` returns the updated field *after* the updates are made
      {new: true }
    );

      // If no Thought data is returned, return a "File Not Found" status and a message
    if (!thoughtData) {
      return res.status(404).json({
        message: 'Could not find a Thought matching this ID, Try again.'
      });
    };

    // Success, Return the updated Thought
    res.status(200).json(thoughtData);
    // Failure, return bad request status and return the error in JSON
    res.status(400).json(err);
  },

  // Remove thought from db
  async deleteThought(req, res) {
    try {
      // Find a Thought using it's ID and delete
      const thoughtData = await Thought.findOneAndDelete({
        _id: req.params.thoughtId
      });

      // If no Thought data is found, return a "File Not Found" status and an error message
      if (!thoughtData) {
        return res.status(404).json({
          message: 'Could not find a Thought matching this ID, Try again.'
        });
      };

      // Removes thought from the User's thoughts array
      const userData = User.findOneAndUpdate(
        // Thought ID being deleted
        { thoughts: req.params.thoughtId },
        // `$pull` removes any existing values in an array that match the parameters
        { $pull: { thoughts: [req.params.thoughtId] } },
        // Return the updated User *after* the thought has been removed
        { new: true }
      );

      // If no user data is returned, return a "File Not Found" status and a message
      if (!userData) {
        return res.status(404).json({
          message: 'The user id provided doesnt not match any User, Could not successfully delete the Thought ID from User.'
        });
      }

      // Success, Return the updates User profile
      res.status(200).json({ message:
        'The Thought has successfully been removed from the db and reference subdocuments.'
      });
    } catch (err) {
      // Failure, return server error status and return the error in JSON
      res.status(500).json(err);
    }
  },

  // Adds a Reaction to a specifc Thought
  async addReaction(req, res) {
    try {
      const thoughtData = await Thought.findOneAndUpdate(
        // Find a Thought with the id passed in the req body
        { _id: req.params.thoughtId },
        // `$addToSet` adds a value to an array unless the value is already present
        // This way we can't accidentally add the same comment twice
        { $addToSet: { reactions: req.body } },
        // `RunValidators` only runs on updated fields and ensures the new value matches the schema rules
        { runValidators: true},
        // Return the updated Thought *after* the Reaction has been added
        {new: true }
      );

      // If no Thought data is returned, return a "File Not Found" status and a message
      if (!thoughtData) {
        return res.status(404).json({
          message: 'Could not find a Thought matching this ID, Try again.'
        });
      };

      // Success, Return the updated User profile
      res.status(200).json(thoughtData);
    } catch (err) {
      // Failure, return bad request status and return the error in JSON
      res.status(500).json(err);
    }
  },

  // Removes a reaction from a specific Thought
  async deleteReaction(req, res) {
    try {
      const thoughtData = await Thought.findOneAndUpdate(
        // Thought that the User want to remove a reaction from
        { _id: req.params.thoughtId },
        // `$pull` removes any existing values in an array that match the parameters
        { $pull: { reactions: { reactionId: req.params.reactionId } } },
        // `RunValidators` only runs on updated fields and ensures the new value matches the schema rules
        { runValidators: true},
        // Return the updated Thought *after* the Reaction has been removed
        {new: true }
      );

      // If no Thought data is returned, return a "File Not Found" status and a message
      if (!thoughtData) {
        return res.status(404).json({
          message: 'Could not find a Thought matching this ID, Try again.'
        });
      };

      // Success, Return the updated Thought
      res.status(200).json(thoughtData);
    } catch (err) {
      // Failure, return server error status and return the error in JSON
      res.status(500).json(err);
    }
  },
};

module.exports = thoughtController;
