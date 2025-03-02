var express = require('express');
var router = express.Router();
//importamos la coneccion a la base de datos
var conexion = require('../database');



/* GET listar faq. */
router.get('/', function (req, res, next) {

    console.log('Peticion de codigos');

    //creamos la consulta  
    var query = 'SELECT * FROM faq;';
    //ejecutamos la consulta
    conexion.query(query, function (error, results, fields) {
        if (error) {
            console.log(error);
            res.status(500).send({
                error: error,
                message: 'Error al realizar la peticion'
            })
        } else {
            console.log(results);
            res.status(200).send({
                data: results,
                message: 'Listado de faq'
            });
        }
    });
});


// POSTEAR faq
router.post('/', function (req, res, next) {
    const { pregunta, respuesta, } = req.body; // No necesitas created_at ni updated_at

    var query = `INSERT INTO faq (pregunta, respuesta, created_at, updated_at) 
                  VALUES ("${pregunta}", "${respuesta}",  CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP());`;

    // ejecutamos la consulta
    conexion.query(query, function (error, results, fields) {
        if (error) {
            console.log(error);
            res.status(500).send({
                error: error,
                message: 'Error al realizar la petición'
            });
        } else {
            console.log(results.insertId);
            res.status(200).send({
                data: results.insertId,
                message: 'FAQ registrado exitosamente'
            });
        }
    });
});


// PUT actualizar faq
router.put('/:id', function (req, res, next) {
    const { pregunta, respuesta, } = req.body;

    var query = `UPDATE faq SET 
                    pregunta = "${pregunta}",
                    respuesta = "${respuesta}",
                    
                    updated_at = CURRENT_TIMESTAMP()
                WHERE faq_id = ${req.params.id};`;

    // Ejecutamos la consulta
    conexion.query(query, function (error, results, fields) {
        if (error) {
            console.log(error);
            res.status(500).send({
                error: error,
                message: 'Error al realizar la petición'
            });
        } else {
            console.log(results);
            res.status(200).send({
                data: results,
                message: 'FAQ actualizado exitosamente'
            });
        }
    });
});


// DELETE marcar FAQ como inactivo (estado = 0)
router.delete('/:id', function (req, res, next) {
    var query = `UPDATE faq SET estado = 0 WHERE faq_id = ?`;  // 0 indica inactivo

    // Ejecutamos la consulta
    conexion.query(query, [req.params.id], function (error, results, fields) {
        if (error) {
            console.log(error);
            res.status(500).send({
                error: error,
                message: 'Error al realizar la petición'
            });
        } else {
            console.log(results);
            res.status(200).send({
                data: results,
                message: 'FAQ marcado como inactivo'
            });
        }
    });
});

// RUTA PARA RESTABLECER ELIMINACIÓN LÓGICA (marcar FAQ como activo, estado = 1)
router.patch('/:id/restaurar', function (req, res, next) {
    var query = `UPDATE faq SET estado = 1 WHERE faq_id = ?`;  // 1 indica eliminado lógicamente (activo)

    // Ejecutamos la consulta
    conexion.query(query, [req.params.id], function (error, results, fields) {
        if (error) {
            console.log(error);
            res.status(500).send({
                error: error,
                message: 'Error al realizar la petición'
            });
        } else {
            console.log(results);
            res.status(200).send({
                data: results,
                message: 'FAQ marcado como eliminado lógicamente (activo)'
            });
        }
    });
});

// DELETE definitivo
router.delete('/definitivo/:id', function (req, res, next) {
    var query = `DELETE FROM faq WHERE faq_id = ?`;

    conexion.query(query, [req.params.id], function (error, results, fields) {
        if (error) {
            console.log(error);
            res.status(500).send({
                error: error,
                message: 'Error al realizar la petición'
            });
        } else {
            res.status(200).send({
                data: results,
                message: 'FAQ eliminado definitivamente'
            });
        }
    });
});



 


module.exports = router;