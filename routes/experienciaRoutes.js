const express = require('express');
const router = express.Router();
const {getExperiencia, postExperiencia,putExperiencia, patchExperiencia } = require ('../controllers/experienciaController')


// (POST)


// Obtener todas las experiencias o por cliente_id (GET)
router.get('/', getExperiencia);
router.post('/', postExperiencia);
router.put('/:id', putExperiencia);
router.patch('/:id', patchExperiencia);


// Obtener una experiencia por su ID (GET)


// (PUT)


// (DELETE)

module.exports = router;
