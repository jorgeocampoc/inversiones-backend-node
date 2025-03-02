const connection = require("../database");
var express = require('express');
var router = express.Router();

// Obtener logros (opcionalmente filtrado por cliente_id)
router.get("/", (req, res) => {
    const { cliente_id } = req.query;  // Obtener el cliente_id desde los parámetros de consulta
    let query = "SELECT * FROM logros";

    // Si se pasa cliente_id, filtramos los resultados
    if (cliente_id) {
        query += " WHERE cliente_id = ?";
    }

    connection.query(query, [cliente_id], function (err, results) {
        if (err) {
            res.status(500).send({
                error: err,
                message: "Error en la petición",
            });
        } else {
            res.status(200).json({
                data: results,
                message: "Lista de logros",
            });
        }
    });
});

// Crear un nuevo logro
router.post("/", (req, res) => {
    const { cliente_id, descripcion, fecha } = req.body;
    const query = "INSERT INTO logros(cliente_id, descripcion, fecha) VALUES (?, ?, ?)";

    connection.query(query, [cliente_id, descripcion, fecha], (err, results) => {
        if (err) {
            res.status(500).send({
                error: err,
                message: "Error en la petición",
            });
        } else {
            res.status(200).send({
                message: "Registro exitoso",
            });
        }
    });
});

// Actualizar un logro existente
router.put("/:id", (req, res) => {
    const { cliente_id, descripcion } = req.body;
    const { id } = req.params;
    const query = "UPDATE logros SET cliente_id = ?, descripcion = ? WHERE id = ?";

    connection.query(query, [cliente_id, descripcion, id], (err, results) => {
        if (err) {
            res.status(500).send({
                error: err,
                message: "Error en la petición",
            });
        } else {
            res.status(200).send({
                message: "Registro actualizado correctamente",
            });
        }
    });
});

// Eliminar un logro
router.delete("/:id", (req, res) => {
    const { id } = req.params;
    const query = "DELETE FROM logros WHERE id = ?";

    connection.query(query, [id], (err, results) => {
        if (err) {
            res.status(500).send({
                error: err,
                message: "Error en la petición",
            });
        } else {
            res.status(200).send({
                message: "Registro eliminado correctamente",
            });
        }
    });
});

// Actualizar el estado de un logro
router.patch('/estado/:id', function (req, res) {
    const { id } = req.params;
    const query = "UPDATE logros SET estado = !estado WHERE logro_id = ?";

    connection.query(query, [id], function (error, results) {
        if (error) {
            res.status(500).send({
                error: error,
                message: 'Error al realizar la petición'
            });
        } else {
            res.status(200).send({
                data: results,
                message: 'Estado actualizado correctamente'
            });
        }
    });
});

router.get('/logrosfechas/:id', function (req, res, next) {
    const clienteId = req.params.id;
    const logros = `SELECT l.fecha, l.descripcion FROM usuarios u INNER JOIN logros l ON u.usuario_id = l.cliente_id WHERE l.cliente_id = ?`;

    connection.query(logros, [clienteId], function (err, results) {
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
    });
});

router.get('/experiencia/:id', function (req, res, next) {
    const clienteId = req.params.id;
    const logros = `SELECT e.institucion, e.cargo, e.actividades, e.fecha_inicio, e.fecha_final 
FROM usuarios u 
INNER JOIN experiencia e ON e.cliente_id = u.usuario_id WHERE e.cliente_id = ?`;
    connection.query(logros, [clienteId], function (err, results) {
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
    });
});

module.exports = router;
