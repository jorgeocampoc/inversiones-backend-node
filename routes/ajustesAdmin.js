const express = require('express');
const router = express.Router();
const { postCombinedData, getCombinedData, putCombinedData } = require('../controllers/ajustesAdmin');

router.post('/', postCombinedData);
router.get('/', getCombinedData);
router.put('/:id', putCombinedData);

module.exports = router;
