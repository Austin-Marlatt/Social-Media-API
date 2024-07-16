const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/socialnetwork');

module.exports = mongoose.connection;