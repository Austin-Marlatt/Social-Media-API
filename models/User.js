// Model that defines the schema for `User` data entries into the db

// Import important mongoose models to build the schema and export as a model
const { Schema, model } = require('mongoose');

// Create a new instance of the schema
const userSchema = new Schema(
// define the columns in the schema with the data we want, and special rules for each one
  {
    username: {
      // The type of data will be a string
      type: String,
      // Must not match another `User` instance's username
      unique: true,
      // This field is required in order to creaate a new user
      required: true,
      // Trim off excess whitspace at the beginning and end of the string
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      // Runs a validator function on this email field, checks the input against a Regex that tests if it matches a standard email layout
      validate: {
        validator: (v) => {
            return /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/.test(v);
        },
        message: "Please use a valid E-mail."
        },
      required: [true, "E-mail Required"]
    },
    // Array of id's that reference the `Thought` model
    // Reference used to tell mongoose which model to use during population
    thoughts: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Thought',
      },
    ],
    // Array of id's that reference's itself
    // Reference used to tell mongoose which model to use during population
    friends: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  // converts the format to JSON and allows vutuals to be added without an id
  {
    toJSON: {
      virtuals: true,
    },
    id: false,
  }
);

// Virtual that returns the length of the `friends` field array as `friendcount` when this model is queried
userSchema.virtual('friendCount').get(() => {
  return this.friends.length;
});

// Export the User Schema from above as a model named `User`
const User = model('User', userSchema);

module.exports = User;