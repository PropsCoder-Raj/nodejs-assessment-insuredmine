const express = require('express');
const multer = require('multer');
const { uploadData, getAllCollection } = require('../controllers/user.controller');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.get('/all-collection', getAllCollection);
router.post('/upload-data', upload.single('file'), uploadData);

module.exports = router;
