const connection = require("../database");
var express = require('express');
var router = express.Router();

router.get('/listaPerfil', function(req, res, next) {
    var perfil = "SELECT * FROM usuarios";
    connection.query(perfil, function (err, results) {
        if (err) {
            res.status(500).send({
                error: err,
                message: "Error en la peticion",
            });
        } else {
            res.status(200).json({
                data: results,
                message: "Lista de perfil",
            });
        }
    })
});

router.put('/actualizarPerfil/:id', function(req, res, next) {
    const {codigopais, telefono, userName, pais_residencia } = req.body;
    var query = `UPDATE usuarios SET codigo_pais = '${codigopais}', numero_telefono = '${telefono}', username = '${userName}', pais_residencia = '${pais_residencia}' WHERE usuario_id = '${req.params.id}'`;

    connection.query(query, function (err, results) {
        if(err){
            res.status(500).send({
                error: err,
                message: "Error en la peticion",
            });
        }else{
            res.status(200).send({
                id:results,
                message: "Perfil actualizado",
            });
        }
    });
})


module.exports = router;