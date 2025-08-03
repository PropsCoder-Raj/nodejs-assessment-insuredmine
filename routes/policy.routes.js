const express = require('express');
const {
  getPolicyByUsername,
  getAggregatedPolicies
} = require('../controllers/policy.controller');

const router = express.Router();

router.get('/by-user/:name', getPolicyByUsername);
router.get('/aggregate-by-user', getAggregatedPolicies);

module.exports = router;
