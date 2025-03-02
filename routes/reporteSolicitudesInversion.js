const express = require('express');
const { getInversionesPendientes, getInversionesReversion, getInversionesProceso, getInversionesFinalizado } = require('../controllers/reporteSolicitudesInversion');
const { checkInvestmentRequest } = require('../helpers/nodeCron.js')

const router = express.Router();

router.get('/pendiente', getInversionesPendientes);
router.get('/proceso', getInversionesProceso);
router.get('/reversion', getInversionesReversion);
router.get('/finalizado', getInversionesFinalizado);
router.get('/tryRevert', checkInvestmentRequest);

module.exports = router;