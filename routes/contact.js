var express = require('express');
var router = express.Router();


const { getContact, postContact, putStateContact, sendEmail, updateResponse, obtenerTotales } = require('../controllers/contact')


router.get('/', getContact);
router.post('/', postContact);
router.put('/stateContact/:id', putStateContact);
router.post('/sendEmail/:id', sendEmail);
router.put('/response/:id', updateResponse);
router.get('/obtenerTotales', obtenerTotales);


module.exports = router;