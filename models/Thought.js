// Model that defines the schema for `User` data entries into the db

// Import important mongoose models to build the schema and export as a model
const { Schema, model } = require('mongoose');
const reactionSchema = require('./Reaction');
// Library used to return readable time formats
const moment = require('moment');

// Create a new instance of the schema
const thoughtSchema = new Schema(
// define the columns in the schema with the data we want, and special rules for each one
  {
    thoughtText: {
      // The type of data will be a string
      type: String,
      // Sets the range of characters this field excepts
      minlength: 1,
      maxlength: 280,
      // This field is required when trying to create a new thought
      required: 'Cannot except null entry.'
    },
    createdAt: {
      // The type of data will be a date
      type: Date,
      // Defaults to `Date.now` which returns UTC, which isn't very readable
      default: Date.now,
      // using the imported `moment` library, we can get the current time in a better format
      get: moment().format("MMM Do YYYY")
    },
    username: {
      type: String,
      required: true
    },
    // An array of reactions that follow the reactionSchema layout
    reactions: [reactionSchema]
  },
  {
    toJSON: {
      getters: true
    },
    id: false
  }
);

// Virtual returns the length of the reactiuons array as `reactionCount`
thoughtSchema.virtual('reactionCount').get(function() {
  return this.reactions.length;
});

// Export the thoughtSchema as a model named `Thought`
const Thought = model('Thought', thoughtSchema);

module.exports = Thought;