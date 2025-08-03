const express = require('express');
const {
  getPolicyByUsername,
  getAggregatedPolicies
} = require('../controllers/policy.controller');

const router = express.Router();

router.get('/by-user/:name', getPolicyByUsername);

module.exports = router;
