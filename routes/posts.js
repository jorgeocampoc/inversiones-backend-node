const connection = require("../database");
var express = require('express');
var router = express.Router();
const cloudinary = require('cloudinary').v2;

cloudinary.config(process.env.CLOUDINARY_URL)


router.get("/", (req, res) => {
    var logros = "SELECT * FROM posts";
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

router.post("/", async (req, res) => {
    try {
        const { tempFilePath } = req.files.imagen_portada;
        const result = await cloudinary.uploader.upload(tempFilePath, {
            public_id: `posts/${Date.now()}`,
            folder: 'posts'
        });
        const { secure_url } = result;
        const { titulo, contenido, estado } = req.body;
        var posts = `INSERT INTO posts(titulo, imagen_portada, contenido, estado) VALUES ("${titulo}", "${secure_url}", "${contenido}", "${estado}");`;
        connection.query(posts, (err, results) => {
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
    } catch (error) {
        console.log(error);
        res.status(500).send({
            error: error,
            message: "Error en la peticion",
        });
    }
});


// router.put("/:post_id", async (req, res) => {
//     try {
//       let secure_url;
//       // Verificar si se cargó una imagen
//       if (req.files && req.files.imagen_portada) {
//         const { tempFilePath } = req.files.imagen_portada;
//         const result = await cloudinary.uploader.upload(tempFilePath, {
//           public_id: `posts/${Date.now()}`,
//           folder: 'posts',
//         });
//         secure_url = result.secure_url;
//       }
  
//       const { titulo, contenido, estado } = req.body;
//       const { post_id } = req.params;
//       const posts = `UPDATE posts SET titulo = "${titulo}", 
//                       ${secure_url ? `imagen_portada = "${secure_url}",` : ""}
//                       contenido = "${contenido}", estado = "${estado}" 
//                       WHERE post_id = "${post_id}";`;
//       connection.query(posts, (err, results) => {
//         if (err) {
//           console.error("Error en la actualización de post:", err);
//           return res.status(500).send({
//             error: err,
//             message: "Error en la petición",
//           });
//         }
//         res.status(200).send({
//           message: "Post actualizado exitosamente",
//         });
//       });
//     } catch (error) {
//       console.error("Error en la actualización de post:", error);
//       res.status(500).send({
//         error: error,
//         message: "Error en la petición",
//       });
//     }
//   });
  

router.put("/:post_id", async (req, res) => {
    try {
        const { titulo, contenido, estado } = req.body; // Extraer datos del cuerpo
        const { post_id } = req.params; // Extraer el ID del post desde los parámetros

        if (!titulo || !contenido || !estado || !post_id) {
            return res.status(400).send({
                message: "Todos los campos (titulo, contenido, estado) y el post_id son requeridos.",
            });
        }

        let secure_url;

        // Si se envía una imagen, la subimos a Cloudinary
        if (req.files && req.files.imagen_portada) {
            const { tempFilePath } = req.files.imagen_portada;
            const result = await cloudinary.uploader.upload(tempFilePath, {
                public_id: `posts/${Date.now()}`,
                folder: "posts",
            });
            secure_url = result.secure_url;
        }

        // Construcción de la consulta SQL
        const query = `UPDATE posts SET 
                        titulo = ?, 
                        ${secure_url ? `imagen_portada = ?,` : ""}
                        contenido = ?, 
                        estado = ? 
                        WHERE post_id = ?`;

        const values = secure_url
            ? [titulo, secure_url, contenido, estado, post_id]
            : [titulo, contenido, estado, post_id];

        // Ejecutar la consulta
        connection.query(query, values, (err, results) => {
            if (err) {
                console.error("Error en la actualización de post:", err);
                return res.status(500).send({
                    error: err,
                    message: "Error en la petición al actualizar el post.",
                });
            }

            if (results.affectedRows === 0) {
                return res.status(404).send({
                    message: "Post no encontrado o no se pudo actualizar.",
                });
            }

            res.status(200).send({
                message: "Post actualizado exitosamente.",
            });
        });
    } catch (error) {
        console.error("Error en la actualización de post:", error);
        res.status(500).send({
            error: error,
            message: "Error interno del servidor al actualizar el post.",
        });
    }
});

router.delete("/:post_id", (req, res) => {
    const { post_id } = req.params;
    const posts = `DELETE FROM posts WHERE post_id = "${post_id}";`;
    connection.query(posts, (err, results) => {
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

router.patch('/estado/:post_id', (req, res) => {
    const { post_id } = req.params;
    const query = `UPDATE posts SET estado = IF(estado = 'Activo', 'Inactivo', 'Activo') WHERE post_id = ?`;
    connection.query(query, [post_id], (error, results) => {
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

router.get("/activos", (req, res) => {
    const query = "SELECT * FROM posts WHERE estado = 'Activo'";
    connection.query(query, (err, results) => {
        if (err) {
            res.status(500).send({
                error: err,
                message: "Error en la petición",
            });
        } else {
            res.status(200).json({
                data: results,
                message: "Lista de posts activos",
            });
        }
    });
});

router.get("/:post_id", (req, res) => {
    const { post_id } = req.params;
    const query = `SELECT * FROM posts WHERE post_id = ?`;
    connection.query(query, [post_id], (err, results) => {
        if (err) {
            res.status(500).send({
                error: err,
                message: "Error en la petición",
            });
        } else if (results.length === 0) {
            res.status(404).send({
                message: "Post no encontrado",
            });
        } else {
            res.status(200).json({
                data: results[0],
                message: "Post encontrado",
            });
        }
    });
});
module.exports = router;

