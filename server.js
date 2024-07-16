// Server file initializes application

// Required modules
// Express allows the creation of an express server
const express = require('express');
// Variable to reference the routes location
const routes = require('./routes');
// Variable to reference the connection to the DB
const connection = require('./config/connection');

// Port to run server on, uses the process enviroment declared port, or 3001
const PORT = process.env.PORT || 3001;
// Variable to reference the initialized server
const app = express();

// Midddleware used for processing sent and recieved data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Tell our app what routes to listen for and where to route specific endpoint requests
app.use(routes);

// Waits for the connection to the DB to be establised and then spins up the server
connection.once('open', () => {
  app.listen(PORT, () => {
    console.log(`Server open at http://localhost:${PORT}/`);
  });
});