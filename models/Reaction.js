// This file defines only a Schema, and not a model type.
// It can be refereneced by other models to take in data following this schema as one of its fields
// It will not have individual entries on the db

// Import important mongoose models to build the schema and define schema data types
const { Schema, Types } = require('mongoose');
// Library used to return readable time formats
const moment = require('moment');

// Create a new instance of the schema 
const reactionSchema = new Schema(
  {
    reactionId: {
      // The type of data will be Mongoose's Objectid
      type: Schema.Types.ObjectId,
      // Default to a function that returns a new object id
      default: () => new Types.ObjectId()
    },
    reactionBody: {
      // The type of data will be a string
      type: String,
      required: true,
      // Max amount of characters excepted
      maxlength: 280
    },
    username: {
      type: String,
      required: true
    },
    createdAt: {
      // The type of data will be a date\
      type: Date,
      // Defaults to `Date.now` which returns UTC, which isn't very readable
      default: Date.now,
      // using the imported `moment` library, we can get the current time in a better format
      get: moment().format("MMM Do YYYY")
    }
  },
  {
    toJSON: {
      getters: true
    },
    id: false
  }
);

// Expoting the module as a schema and NOT converting into a model
module.exports = reactionSchema;