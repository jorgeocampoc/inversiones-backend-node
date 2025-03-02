const express = require('express')
const router = express.Router();

const { getPlanPagosByIdSolicitud,pagarCuota } = require('../controllers/planPagos')

router.get('/getPlanPagosByIdSolicitud/:id', getPlanPagosByIdSolicitud)
router.post('/', pagarCuota)

module.exports = router;
