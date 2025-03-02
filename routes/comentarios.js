const connection = require("../database");
var express = require('express');
var router = express.Router();
const cloudinary = require('cloudinary').v2;

cloudinary.config(process.env.CLOUDINARY_URL);

router.get("/", (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const estado = req.query.estado || '';

    const offset = (page - 1) * limit;

    let filter = '';
    if (search) {
        filter += ` AND c.comentario LIKE ?`;
    }
    if (estado) {
        filter += ` AND c.estado = ?`;
    }

    // Consulta para contar los registros totales
    const countQuery = `
        SELECT COUNT(*) AS total
        FROM comentarios c
        WHERE 1=1 ${filter}
    `;

    // Consulta para obtener datos paginados incluyendo nombre y apellido de cliente e inversor
    const dataQuery = `
        SELECT c.*, 
               u1.nombre AS cliente_nombre, u1.apellido AS cliente_apellido,
               u2.nombre AS inversor_nombre, u2.apellido AS inversor_apellido
        FROM comentarios c
        LEFT JOIN usuarios u1 ON c.cliente_id = u1.usuario_id
        LEFT JOIN usuarios u2 ON c.inversor_id = u2.usuario_id
        WHERE 1=1 ${filter}
        ORDER BY c.created_at DESC
        LIMIT ? OFFSET ?
    `;

    connection.query(countQuery, [search ? `%${search}%` : null, estado || null].filter(v => v !== null), (err, countResult) => {
        if (err) {
            return res.status(500).send({ error: err, message: "Error al contar los registros" });
        }

        const total = countResult[0].total;
        const totalPages = Math.ceil(total / limit);

        connection.query(dataQuery, [search ? `%${search}%` : null, estado || null, limit, offset].filter(v => v !== null), (err, dataResult) => {
            if (err) {
                return res.status(500).send({ error: err, message: "Error al obtener los comentarios" });
            }

            const pagination = {
                total: total,
                current: page,
                pages: totalPages,
                next: page < totalPages ? page + 1 : null,
                previous: page > 1 ? page - 1 : null,
            };

            res.status(200).send({
                data: dataResult,
                pagination: pagination,
            });
        });
    });
});


// Ruta para obtener comentarios por cliente_id
router.get("/cliente/:id", function (req, res, next) {
    const clienteId = req.params.id;

    const comentarios = `
        SELECT c.comentario, c.calificacion FROM comentarios c WHERE c.cliente_id = ?`;

        connection.query(comentarios, [clienteId], function (err, results) {
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


router.post("/", (req, res) => {
    const { cliente_id, inversor_id, comentario, calificacion } = req.body;

    const query = `
        INSERT INTO comentarios (cliente_id, inversor_id, comentario, calificacion, created_at)
        VALUES (?, ?, ?, ?, NOW())
    `;

    connection.query(query, [cliente_id, inversor_id, comentario, calificacion], (err, result) => {
        if (err) {
            res.status(500).send({
                error: err,
                message: "Error al insertar el comentario",
            });
        } else {
            res.status(201).send({
                message: "Comentario insertado con éxito",
                data: result,
            });
        }
    });
});

router.patch("/aprobar/:id", function (req, res, next) { 
    var query = `UPDATE comentarios SET 
    estado = 'Aprobado'
    WHERE id_comentarios = '${req.params.id}';`;
  
    connection.query(query, function (error, results, fields) {
      if (error) {
        console.log(error);
        res.status(500).send({
          error: error,
          message: "Error al realizar la petición",
        });
      } else {
        console.log(results.insertId);
        res.status(200).send({
          data: results.insertId,
          message: "Comentario aprobado correctamente",
        });
      }
    });
  });
  
  
  router.patch("/rechazar/:id", function (req, res, next) { 
    var query = `UPDATE comentarios SET 
    estado = 'Rechazado'
    WHERE id_comentarios = '${req.params.id}';`;
  
    connection.query(query, function (error, results, fields) {
      if (error) {
        console.log(error);
        res.status(500).send({
          error: error,
          message: "Error al realizar la petición",
        });
      } else {
        console.log(results.insertId);
        res.status(200).send({
          data: results.insertId,
          message: "Comentario rechazado correctamente",
        });
      }
    });
  });

  router.get("/clientes", (req, res) => {
    const search = req.query.search || '';

    const query = `
        SELECT usuario_id, nombre, apellido
        FROM usuarios
        WHERE nombre LIKE ? OR apellido LIKE ?
        LIMIT 10;
    `;

    connection.query(query, [`%${search}%`, `%${search}%`], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json(results);
    });
});

router.get("/estadisticas/:usuario_id", (req, res) => {
    const usuario_id = req.params.usuario_id;

    const query = `
        SELECT 
            COUNT(*) AS total_aprobados,
            AVG(calificacion) AS promedio_calificaciones
        FROM comentarios
        WHERE cliente_id = ? AND estado = 'Aprobado';
    `;

    connection.query(query, [usuario_id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        res.status(200).json({
            totalAprobados: results[0].total_aprobados,
            promedioCalificaciones: results[0].promedio_calificaciones || 0,
        });
    });
});


module.exports = router;
