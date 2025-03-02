
const express = require('express');
const router = express.Router();
const { getLogros, postLogros, putLogros, deleteLogros, patchLogrosEstado } = require('../controllers/logrosController');

// Rutas CRUD para logros
router.get('/', getLogros); // Obtener logros
router.post('/', postLogros); // Crear un logro
router.put('/:id', putLogros); // Actualizar un logro
router.delete('/:id', deleteLogros); // Eliminar un logro
router.patch('/estado/:id', patchLogrosEstado); // Cambiar estado de un logro

module.exports = router;
