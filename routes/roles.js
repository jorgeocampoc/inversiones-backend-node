const connection = require("../database");
var express = require('express');
var router = express.Router();
const cloudinary = require('cloudinary').v2;

cloudinary.config(process.env.CLOUDINARY_URL)


router.get("/", (req, res) => {
    var logros = "SELECT * FROM usuarios";
    connection.query(logros, function (err, results) {
        if (err) {
            //console.log(err);
            res.status(500).send({
                error: err,
                message: "Error en la peticion",
            });
        } else {
            //console.log(result);
            res.status(200).json({
                data: results,
                message: "Lista de posts",
            });
        }
    })
});

router.patch("/updateRole/:id", (req, res) => {
    const { id } = req.params;
    const { rol } = req.body;
    const updateQuery = "UPDATE usuarios SET rol = ? WHERE usuario_id = ?";

    connection.query(updateQuery, [rol, id], (err, result) => {
        if (err) {
            res.status(500).send({
                error: err,
                message: "Error al actualizar el rol del usuario",
            });
        } else {
            res.status(200).send({
                message: "Rol actualizado correctamente",
            });
        }
    });
});
module.exports = router;
