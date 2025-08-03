const express = require('express');
const {
    postMessages
} = require('../controllers/message.controller');

const router = express.Router();

router.post('/schedule-message', postMessages);

module.exports = router;
