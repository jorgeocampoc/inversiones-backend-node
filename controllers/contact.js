const { response: res, request: req } = require('express')
const conexion = require('../database');

const transporter = require('../helpers/mailer');

/**
 * Controlador para manejar solicitudes GET y obtener la lista de contactos almacenados en la base de datos.
 * @param {object} req - El objeto de solicitud de Express, contiene detalles de la solicitud HTTP.
 * @param {object} res - El objeto de respuesta de Express, se utiliza para enviar una respuesta HTTP al cliente.
 */
// const getContact = (req, res) => {
//     let sql = 'select * from contacto';
//     conexion.query(sql, (error, results) => {
//         if (error) {
//             res.status(500).json({
//                 error
//             });
//         } else {
//             res.status(200).json({
//                 results,
//                 cant: results.length
//             });
//         }
//     });
// }


const getContact = (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 7;
    const offset = (page - 1) * limit;
    const search = req.query.search || '';

    let sql = 'SELECT * FROM contacto WHERE nombre LIKE ? OR apellido LIKE ? OR email LIKE ? LIMIT ? OFFSET ?';
    conexion.query(sql, [`%${search}%`, `%${search}%`, `%${search}%`, limit, offset], (error, results) => {
        if (error) {
            res.status(500).json({ error });
        } else {
            conexion.query('SELECT COUNT(*) AS total FROM contacto WHERE nombre LIKE ? OR apellido LIKE ? OR email LIKE ?', [`%${search}%`, `%${search}%`, `%${search}%`], (countError, countResults) => {
                if (countError) {
                    res.status(500).json({ error: countError });
                } else {
                    const totalItems = countResults[0].total;
                    const totalPages = Math.ceil(totalItems / limit);

                    res.status(200).json({
                        results,
                        currentPage: page,
                        totalPages,
                        totalItems,
                        itemsPerPage: limit
                    });
                }
            });
        }
    });
};


/**
 * Controlador para manejar solicitudes POST y agregar un nuevo contacto(Comentario) a la base de datos.
 * Además, envía un correo electrónico con los detalles del nuevo contacto(Comentario).
 * @param {object} req - El objeto de solicitud de Express, contiene los datos del nuevo contacto en req.body.
 * @param {object} res - El objeto de respuesta de Express, se utiliza para enviar una respuesta HTTP al cliente.
 */
const postContact = async (req, res) => {
    const { nombre, apellido, email, telefono, comentarios } = req.body;
    const sql = `INSERT INTO contacto(nombre, apellido, email, telefono, comentarios,estado) VALUES (?, ?, ?, ?, ?, 0)`;
    let values = [nombre, apellido, email, telefono, comentarios]

    conexion.query(sql, values, async (error) => {
        if (error) {
            res.status(500).json({
                message: 'Error al realizar la peticion',
                error: error.message
            })
        } else {

            try {
                await transporter.sendMail({
                    from: email,
                    to: process.env.GG_EMAIL,
                    subject: `Nuevo comentario de ${nombre} ${apellido}`,
                    text: `Has recibido un nuevo comentario:\n\nNombre: ${nombre} ${apellido}\nEmail: ${email}\nTeléfono: ${telefono}`,
                    html: `<!DOCTYPE html>
                            <html lang="en">
                            <head>
                                <meta charset="UTF-8" />
                                <meta http-equiv="X-UA-Compatible" content="IE=edge" />
                                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                                <title>Comentarios Clientes!!</title>
                                <link rel="preconnect" href="https://fonts.googleapis.com" />
                                <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
                                <link
                                href="https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@600&display=swap"
                                rel="stylesheet" />
                                <style>
                                html {
                                    height: 100%;
                                }
                                body {
                                    position: absolute;
                                    bottom: 0;
                                    right: 0;
                                    font-family: "Instrument Sans", sans-serif;
                                }
                                .content {
                                    top: 0;
                                    margin: 0 auto;
                                    width: 90%;
                                    height: 100vh;
                                    background-color: #f2f4f8;
                                }
                                .logo {
                                    position: absolute;
                                    bottom: 0;
                                    right: 0;
                                    margin: 10px;
                                    width: 150px;
                                    margin-right: 50px;
                                }
                                    h1 {
                                    color: #22b5a0;
                                    padding: 30px 5px;
                                    }
                                    h3 {
                                    text-align: center;
                                    }
                                    section {
                                    padding: 5px 50px;
                                    }
                                    p {
                                    text-align: justify;
                                    color: #666 !important;
                                    font-family: "Instrument Sans", sans-serif;
                                    }
                                    hr {
                                    border: 1px solid #eee;
                                }
                                </style>
                            </head>
                            <body>
                                <div class="content">
                                <h1 style="text-align: center">
                                    !Hemos Recibido un Nuevo Comentario!!! 
                                    <hr />
                                </h1>

                                <section>
                                    <h3>
                                    Este correo electrónico fue enviado por ${nombre} ${apellido}.
                                    </h3>
                                    <p>
                                    ${comentarios}
                                    </p>
                                    <br />
                                    <h3>${email}</h3>
                                </section>
                                </div>
                            </body>
                            </html>`
                })
                res.status(200).send({
                    message: 'Comentario enviado',
                    data: values.length,
                    data: values
                })

            } catch (mailError) {
                res.status(500).send({
                    message: 'Error al enviar el email',
                    error: mailError.message
                })


            }
        }
    });

}

/**
 * Controlador para manejar solicitudes PUT y cambiar el estado de un contacto específico en la base de datos.
 * @param {object} req - El objeto de solicitud de Express, contiene el ID del contacto a modificar en req.params.id.
 * @param {object} res - El objeto de respuesta de Express, se utiliza para enviar una respuesta HTTP al cliente.
 */
const putStateContact = async (req, res) => {
    let sql = `SELECT * FROM contacto WHERE contacto_id = ?`;
    let values = [req.params.id];

    conexion.query(sql, values, (error, results) => {
        if (error) {
            res.status(500).json({
                message: 'Error al realizar la petición',
                error: error.message
            });
        } else {
            if (results.length === 0) {
                res.status(404).json({
                    message: `El contacto con el id ${req.params.id} no existe`
                });
            } else {
                let sql2 = `
                    UPDATE contacto 
                    SET estado = CASE WHEN estado = 1 THEN 0 ELSE 1 END 
                    WHERE contacto_id = ?`;

                conexion.query(sql2, values, (error) => {
                    if (error) {
                        res.status(500).json({
                            message: 'Error al realizar la petición',
                            error: error.message
                        });
                    } else {
                        res.status(200).json({
                            message: 'Estado del contacto cambiado correctamente',
                            results: results,
                            contacto_id: req.params.id

                        });
                    }
                });
            }
        }
    });
}

const sendEmail = async (req, res) => {

};

const updateResponse = async (req, res) => {
    const { id } = req.params;
    const { respuesta } = req.body;

    const sqlSelect = `SELECT * FROM contacto WHERE contacto_id = ?`;
    conexion.query(sqlSelect, [id], (error, results) => {
        if (error) {
            return res.status(500).json({
                message: 'Error al consultar el contacto',
                error: error.message
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                message: `El contacto con el id ${id} no existe`
            });
        }

        const contacto = results[0];

        const sqlUpdate = `UPDATE contacto SET respuesta = ? WHERE contacto_id = ?`;
        conexion.query(sqlUpdate, [respuesta, id], async (updateError) => {
            if (updateError) {
                return res.status(500).json({
                    message: 'Error al actualizar la respuesta en la base de datos',
                    error: updateError.message
                });
            }


            try {
                await transporter.sendMail({
                    from: process.env.GG_EMAIL,
                    to: contacto.email,
                    replyTo: process.env.GG_EMAIL,
                    subject: 'Respuesta a tu comentario',
                    text: `Hola ${contacto.nombre},\n\n${respuesta}`,
                    html: `
            <html lang="en">

                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Respuesta a tu Comentario</title>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            background-color: gray;
                            margin: 0;
                            padding: 0;
                            color: #fff;
                        }
                        .email-container {
                            background-color: #050133;
                            margin: 30px auto;
                            text-align: center;
                            color: #fff;
                            width: 80%;
                            padding: 20px;
                            border-radius: 8px;
                            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                        }
                        .header {
                            background-color:#de5302 ;
                            color: #fff;
                            padding: 10px;
                            text-align: center;                            
                            border-radius: 8px 8px 0 0;
                        }
                        .content {
                            font-size: 16px;
                            color: #fff;
                        }
                        .content p {
                            color: #fff;
                        }
                        .response {
                            background-color: #de5302;
                            color: #fff;
                            padding: 10px;
                            text-align: center;
                            border-radius: 5px;
                        }
                        .footer {
                            text-align: center;
                            font-size: 14px;
                            color: #fff;
                            margin-top: 30px;
                        }
                        .footer a {
                            color: #fff;
                            text-decoration:underline;
                        }
                        .footer a:hover {
                            text-decoration: underline;
                            color:#de5302;
                        }
                    </style>
                </head>
                <body>
                    <div class="email-container">
                        <div class="header">
                            <h2>Respuesta a tu comentario</h2>
                        </div>
                        <div class="content">
                            <p>Hola ${contacto.nombre},</p>
                            <p>Gracias por ponerte en contacto con nosotros. A continuación, te compartimos nuestra respuesta:</p>
                            <div class="response">
                                <p>${respuesta}</p>
                            </div>
                            <p>Esperamos que esta información te haya sido útil. Si tienes más dudas, no dudes en escribirnos.</p>
                        </div>
                        <div class="footer">
                            <p>Saludos cordiales,<br>El equipo de atención al cliente</p>
                            <p><a href="mailto:${process.env.GG_EMAIL}">Contacta con nosotros</a></p>
                        </div>
                    </div>
                </body>
    

</html>
        `
                });

                res.status(200).json({
                    message: 'Respuesta actualizada y correo enviado correctamente',
                    contacto_id: id,
                    respuesta
                });
            } catch (emailError) {
                res.status(500).json({
                    message: 'Respuesta actualizada, pero hubo un error al enviar el correo electrónico',
                    error: emailError.message
                });
            }
        });
    });
};
const obtenerTotales = async (req, res) => {
    
    const queryTotales = `
      SELECT
        (SELECT COUNT(*) FROM solicitudes_retiro) AS total,
        (SELECT COUNT(*) FROM solicitudes_retiro WHERE estado = 1) AS activos,
        (SELECT COUNT(*) FROM solicitudes_retiro WHERE estado = 0) AS inactivos;
    `;
  
    connection.query(queryTotales, function (error, results) {
      if (error) {
        res.status(500).send({ error, message: "Error al obtener los totales" });
      } else {
        res.status(200).send(results[0]);
      }
    });
  };


module.exports = {
    getContact,
    postContact,
    putStateContact,
    sendEmail,
    updateResponse,
    obtenerTotales
}
