const connection = require("../database");
var express = require('express');
var router = express.Router();

router.get("/", (req, res) => {
    var categoria_posts = "SELECT * FROM categoria_posts";
    connection.query(categoria_posts, function(err, results)  {
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
                message: "Lista de categorías",
            });
        }
    })
});

router.post("/", (req, res) => {
    const {nombre}= req.body;
    var categoria_posts = `INSERT INTO categoria_posts(nombre) VALUES ("${nombre}");`;
    connection.query(categoria_posts, (err, results) => {
        if (err) {
            //console.log(err);
            res.status(500).send({
                error: err,
                message: "Error en la peticion",
            });
        } else {
            //console.log(result);
            res.status(200).send({
                message: "Registro exitoso",
            });
        }
    })
});

router.put("/:categoria_id", (req, res) => {
    const { nombre } = req.body;
    const { categoria_id } = req.params;
    const categoria_posts = `UPDATE categoria_posts SET nombre = "${nombre}" WHERE categoria_id = "${categoria_id}";`;
    connection.query(categoria_posts, (err, results) => {
        if (err) {
            //console.log(err);
            res.status(500).send({
                error: err,
                message: "Error en la peticion",
            });
        } else {
            //console.log(result);
            res.status(200).send({
                message: "Registro exitoso",
            });
        }
    })
});

router.delete("/:categoria_id", (req, res) => {
    const { categoria_id } = req.params;
    const categoria_posts = `DELETE FROM categoria_posts WHERE categoria_id = "${categoria_id}";`;
    connection.query(categoria_posts, (err, results) => {
        if (err) {
            //console.log(err);
            res.status(500).send({
                error: err,
                message: "Error en la peticion",
            });
        } else {
            //console.log(result);
            res.status(200).send({
                message: "Registro exitoso",
            });
        }
    })
});

router.patch('/estado/:id', function (req, res, next) {
    // res.send('estas eliminando productos');
    const { nombre } = req.body;
    var query = `UPDATE categoria_posts SET estado= !estado WHERE categoria_id = ${req.params.id};`;

    connection.query(query, function (error, results, fields) {
        if (error) {
            console.log(error);
            res.status(500).send({
                error: error,
                message: 'Error al realizar la peticion'
            });
        } else {
            console.log(req.results);
            res.status(200).send({
                data: results,
                message: 'Estado actualizado correctamente'
            });
        }
    })
});

module.exports = router;