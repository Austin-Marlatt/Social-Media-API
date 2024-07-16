// Handles request made to the API 

const router = require('express').Router();

// Reference to the JS files that handle server requests
const userRoutes = require('./userRoutes');
const thoughtRoutes = require('./thoughtRoutes');

// Designated Endpoints
router.use('/users', userRoutes);
router.use('/thoughts', thoughtRoutes);

module.exports = router;
