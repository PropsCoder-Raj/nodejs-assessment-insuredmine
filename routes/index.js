const express = require('express');
const router = express.Router();

// Users route
const userRoutes = require('./users.routes');
router.use('/users', userRoutes);

// Policy route
const policyRoutes = require('./policy.routes');
router.use('/policy', policyRoutes);

// Message route
const messageRoutes = require('./message.routes');
router.use('/message', messageRoutes);

module.exports = router;
