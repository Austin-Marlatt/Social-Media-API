// Routing file, acts as a middleman for API requests

const router = require('express').Router();
const apiRoutes = require('./api');

// Defined endpoint
router.use('/api', apiRoutes);

// Response to requests that navigate to an endpoint that doesn't start with `/api/`
router.use((req, res) => {
  return res.send('Wrong route!');
});

module.exports = router;
