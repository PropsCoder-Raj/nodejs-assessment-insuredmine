const express = require('express');
const router = express.Router();

// Users route
const userRoutes = require('./users.routes');
router.use('/users', userRoutes);

module.exports = router;
