const express = require('express');
const router = express.Router();
const {
    getInversionesReversion,
} = require('../controllers/reporteReversion');

router.get('/', getInversionesReversion);

module.exports = router;