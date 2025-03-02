var express = require('express');
var router = express.Router();
const { forgotPassword, resetPassword } = require('../controllers/auth');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// Ruta para solicitar el restablecimiento de contraseña
router.post('/forgot-password', forgotPassword);

// Ruta para restablecer la contraseña
router.post('/reset-password/:token', resetPassword);

module.exports = router;