const connection = require("../database");
var express = require('express');
var router = express.Router();

router.get('/:id', function (req, res, next) {
    const clienteId = req.params.id;
    const preview = `SELECT e.cargo AS experiencia, 
       l.descripcion AS logro, 
       AVG(c.calificacion) AS promedio 
FROM experiencia e 
INNER JOIN usuarios u ON e.cliente_id = u.usuario_id 
INNER JOIN logros l ON l.cliente_id = e.cliente_id 
INNER JOIN comentarios c ON c.cliente_id = u.usuario_id 
WHERE c.estado = "aprobado" 
  AND u.usuario_id = '${clienteId}' 
GROUP BY e.cargo, l.descripcion 
ORDER BY promedio DESC 
LIMIT 1;`;

    connection.query(preview, [clienteId], function (err, results) {
        if (err) {
            res.status(500).send({
                error: err,
                message: "Error en la petición",
            });
        } else {
            res.status(200).json({
                data: results,
                message: "Lista de perfil",
            });
        }
    })
});

module.exports = router;