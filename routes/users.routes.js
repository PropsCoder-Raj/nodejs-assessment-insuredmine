const { getAllCollection } = require('../controllers/user.controller');

router.get('/all-collection', upload.single('file'), getAllCollection);

module.exports = router;
