const { response: res, request: req } = require("express");
const conexion = require("../database");
const bcrypt = require("bcrypt");
const fs = require("fs");
const path = require("path");
const { uploadFile } = require("../helpers/uploadImage");
const { v4: uuidv4 } = require("uuid");
const cloudinary = require("cloudinary").v2;
const transporter = require("../helpers/mailer");
const crypto = require("crypto");
const middlewareControlAdmin = require("../middlewares/middlewareControlAdmin");
cloudinary.config(process.env.CLOUDINARY_URL);
var dotenv = require('dotenv');
dotenv.config();

/**
 * Solo para rol admin
 * Esta funsion obtiene la lista de todos los usuarios (clientes/inversores)
 * mas que todo para el admin
 * Se nesestia enviar el rol de admin como query  porque solo el admin deberia realizar el listado
 */
const getUsers = (req, res) => {
  middlewareControlAdmin(req.query.rol)(req, res, (err) => {
    if (err) {
      return res.status(err.status || 403).json({
        msg: err.message || "No tiene permisos para acceder a esta sección.",
      });
    }
    const page = parseInt(req.query.page) || 1;
    const size = parseInt(req.query.size) || 10;
    const offset = (page - 1) * size;

    let query = `
    SELECT 
        u.usuario_id,
        u.nombre, 
        u.apellido, 
        u.aprobado,
        u.correo, 
        u.categoria_persona_id,
        u.username, 
        u.pais_residencia,
        u.edad, 
        u.aprobado,
        u.verificado,
        u.imagen,
        u.rol, 
        u.porcentaje_registro,
        u.estado,
        i.ocupacion, 
        i.descripcion, 
        i.monto_inversion, 
        i.cantidad_maxima_inversiones,
        i.preparacion, 
        i.video,
        i.estudios, 
        i.vision,
        c.nombre as categoria
    FROM 
        usuarios AS u
    LEFT JOIN 
        informacion AS i ON u.usuario_id = i.cliente_id
    LEFT JOIN 
        categoria_personas AS c ON u.categoria_persona_id = c.categoria_persona_id
    LIMIT ? OFFSET ?`;

    conexion.query(query, [size, offset], (err, results) => {
      if (err) {
        res.status(500).json({
          msg: "Error al buscar clientes",
        });
        return;
      }

      const countQuery = `SELECT COUNT(*) AS total FROM usuarios`;
      conexion.query(countQuery, (err, countResults) => {
        if (err) {
          res.status(500).json({
            msg: "Error al contar usuarios",
          });
          return;
        }

        const totalUsers = countResults[0].total;
        const totalPages = Math.ceil(totalUsers / size);

        const prevPage =
          page > 1 ? `/api/users?page=${page - 1}&size=${size}` : null;
        const nextPage =
          page < totalPages ? `/api/users?page=${page + 1}&size=${size}` : null;

        res.status(200).json({
          results,
          cant: results.length,
          total: totalUsers,
          totalPages: totalPages,
          currentPage: page,
          prev: prevPage,
          next: nextPage,
        });
      });
    });
  });
};

/**
 * Solo para rol Admin
 * Esta funsion filtra por su nombre a todos los usuarios (clientes/inversores/admins)
 * mas que todo para el uso de admin
 * Se requiere que se mande el rol por query
 */

const getUsersByname = (req, res) => {
  middlewareControlAdmin(req.query.rol)(req, res, (err) => {
    if (err) {
      return res.status(err.status || 403).json({
        msg: err.message || "No tiene permisos para acceder a esta sección.",
      });
    }
    const page = parseInt(req.query.page) || 1;
    const size = parseInt(req.query.size) || 10;
    const offset = (page - 1) * size;
    const searchTerm = req.params.id || "";
    const searchPattern = `${searchTerm}%`;

    let query = `
    SELECT 
        u.usuario_id,
        u.nombre, 
        u.apellido, 
        u.correo, 
        u.categoria_persona_id,
        u.username, 
        u.imagen,
        u.pais_residencia,
        u.aprobado,
        u.edad, 
        u.aprobado,
        u.verificado,
        u.rol, 
        u.estado,
        i.ocupacion, 
        i.descripcion, 
        i.monto_inversion, 
        i.cantidad_maxima_inversiones,
        i.preparacion, 
        i.estudios, 
        i.vision,
        c.nombre as categoria
    FROM 
        usuarios AS u
    LEFT JOIN 
        informacion AS i ON u.usuario_id = i.cliente_id
    LEFT JOIN 
        categoria_personas AS c ON u.categoria_persona_id = c.categoria_persona_id
    WHERE u.nombre LIKE ?
    LIMIT ? OFFSET ?`;

    conexion.query(query, [searchPattern, size, offset], (err, results) => {
      if (err) {
        res.status(500).json({
          msg: "Error al buscar clientes",
        });
        return;
      }

      const countQuery = `SELECT COUNT(*) AS total FROM usuarios WHERE nombre LIKE ?`;
      conexion.query(countQuery, [searchPattern], (err, countResults) => {
        if (err) {
          res.status(500).json({
            msg: "Error al contar usuarios",
          });
          return;
        }

        const totalUsers = countResults[0].total;
        const totalPages = Math.ceil(totalUsers / size);

        const prevPage =
          page > 1 ? `/api/users?page=${page - 1}&size=${size}` : null;

        const nextPage =
          results.length === size && page < totalPages
            ? `/api/users?page=${page + 1}&size=${size}`
            : null;

        res.status(200).json({
          results,
          cant: results.length,
          total: totalUsers,
          totalPages: totalPages,
          currentPage: page,
          prev: prevPage,
          next: nextPage,
        });
      });
    });
  });
};

const approvedUser = (req, res) => {
  const handleError = (status, msg, err = null) =>
    res.status(status).json({ msg, err });

  middlewareControlAdmin(req.query.rol)(req, res, (err) => {
    if (err)
      return handleError(
        err.status || 403,
        err.message || "No tiene permisos para acceder a esta sección."
      );

    const getUserQuery = "SELECT * FROM usuarios WHERE usuario_id = ?";
    conexion.query(getUserQuery, [req.params.id], (err, results) => {
      if (err) return handleError(500, "Error en la petición", err);
      if (results.length === 0)
        return handleError(404, "Usuario no encontrado");
      const currentApprovalState = results[0].aprobado;
      const toggleApprovalQuery =
        "UPDATE usuarios SET aprobado = !aprobado WHERE usuario_id = ?";
      conexion.query(toggleApprovalQuery, [req.params.id], (err) => {
        if (err) return handleError(500, "Error al aprobar el usuario", err);
        const responseMsg =
          currentApprovalState === 0 ? "Usuario aprobado" : "Usuario rechazado";
        res.status(200).json({ msg: responseMsg });
      });
    });
  });
};

const getUsersBynameAndRol = (req, res) => {
  middlewareControlAdmin(req.query.rol)(req, res, (err) => {
    if (err) {
      return res.status(err.status || 403).json({
        msg: err.message || "No tiene permisos para acceder a esta sección.",
      });
    }

    const page = parseInt(req.query.page) || 1;
    const size = parseInt(req.query.size) || 10;
    const offset = (page - 1) * size;
    const searchTerm = req.params.nombre || "";
    const searchPattern = `${searchTerm}%`;

    let query = `
    SELECT 
        u.usuario_id,
        u.nombre, 
        u.apellido, 
        u.aprobado,
        u.correo, 
        u.categoria_persona_id,
        u.username, 
        u.pais_residencia,
        u.edad, 
        u.aprobado,
        u.verificado,
        u.rol, 
        u.estado,
        i.ocupacion, 
        i.descripcion, 
        i.monto_inversion, 
        i.cantidad_maxima_inversiones,
        i.preparacion, 
        i.estudios, 
        i.vision,
        c.nombre as categoria
    FROM 
        usuarios AS u
    LEFT JOIN 
        informacion AS i ON u.usuario_id = i.cliente_id
    LEFT JOIN 
        categoria_personas AS c ON u.categoria_persona_id = c.categoria_persona_id
    WHERE u.nombre LIKE ? AND u.rol = ?
    LIMIT ? OFFSET ?`;

    conexion.query(
      query,
      [searchPattern, req.query.rolUser, size, offset],
      (err, results) => {
        if (err) {
          res.status(500).json({
            msg: "Error al buscar clientes",
          });
          return;
        }

        const countQuery = `SELECT COUNT(*) AS total FROM usuarios u WHERE u.nombre LIKE ? AND u.rol = ?`;
        conexion.query(
          countQuery,
          [searchPattern, req.query.rolUser],
          (err, countResults) => {
            if (err) {
              res.status(500).json({
                msg: "Error al contar usuarios",
              });
              return;
            }

            const totalUsers = countResults[0].total;
            const totalPages = Math.ceil(totalUsers / size);

            const prevPage =
              page > 1 ? `/api/users?page=${page - 1}&size=${size}` : null;

            const nextPage =
              results.length === size && page < totalPages
                ? `/api/users?page=${page + 1}&size=${size}`
                : null;

            res.status(200).json({
              results,
              cant: results.length,
              total: totalUsers,
              totalPages: totalPages,
              currentPage: page,
              prev: prevPage,
              next: nextPage,
            });
          }
        );
      }
    );
  });
};

const getInfoInvestor = (req, res) => {
  let query = `
          SELECT
          u.nombre, 
          u.apellido, 
          u.correo, 
          u.categoria_persona_id,
          u.username, 
          u.pais_residencia,
          u.edad, 
          u.aprobado,
          u.verificado,
          u.rol, 
          u.estado,
          u.created_at,
          u.genero,
          i.nombre_completo, 
          i.dni, 
          i.tipo_dni, 
          i.domicilio,
          i.ciudad,
          i.situacion_laboral, 
          i.fuente_de_ingresos,
          c.nombre as categoria
          from usuarios as u
          LEFT JOIN
          informacion_inversionista AS i ON u.usuario_id = i.id_inversionista
          LEFT JOIN
          categoria_personas AS c ON u.categoria_persona_id = c.categoria_persona_id
          WHERE 
          u.usuario_id = ?
          `;
  conexion.query(query, [req.params.id], (err, results) => {
    if (err) {
      res.status(500).json({
        ok: false,
        err,
        nsg: "Error en la transacccion",
      });
      return;
    }
    if (results.length == 0) {
      res.status(500).json({
        ok: false,
        err,
        nsg: "Informacion del usuario no enconmtrada",
      });
      return;
    }
    res.status(200).json({
      results,
    });
  });
};

/**
 * Nesesita el rol de admin enviado en la query
 * Esta funsion obtiene la lista de todos los usuarios por su rol
 * Nesesita el tipo de rola  bsucar enviado mediante  el body
 */
const getUsersByRol = (req, res) => {
  middlewareControlAdmin(req.query.rol)(req, res, (err) => {
    if (err) {
      return res.status(err.status || 403).json({
        msg: err.message || "No tiene permisos para acceder a esta sección.",
      });
    }
    const page = parseInt(req.query.page) || 1;
    const size = parseInt(req.query.size) || 10;
    const offset = (page - 1) * size;
    const rol = req.params.rol;

    let query = `
      SELECT 
          u.usuario_id,
          u.nombre, 
          u.apellido, 
          u.correo, 
          u.categoria_persona_id,
          u.username, 
          u.pais_residencia,
          u.edad, 
          u.aprobado,
          u.verificado,
          u.rol, 
          u.porcentaje_registro,
          u.estado,
          u.imagen,
          i.ocupacion, 
          i.descripcion, 
          i.monto_inversion, 
          i.cantidad_maxima_inversiones,
          i.preparacion, 
          i.estudios, 
          i.vision,
          i.video,
          c.nombre as categoria
      FROM 
          usuarios AS u
      LEFT JOIN 
          informacion AS i ON u.usuario_id = i.cliente_id
      LEFT JOIN 
          categoria_personas AS c ON u.categoria_persona_id = c.categoria_persona_id
      WHERE 
          u.rol = ?
      LIMIT ? OFFSET ?`;

    // Ejecución de la consulta principal
    conexion.query(query, [rol, size, offset], (err, results) => {
      if (err) {
        return res.status(500).json({
          msg: "Error al buscar usuarios",
        });
      }

      // Consulta para contar el total de usuarios con el rol especificado
      const countQuery = `SELECT COUNT(*) AS total FROM usuarios WHERE rol = ?`;
      conexion.query(countQuery, [rol], (err, countResults) => {
        if (err) {
          return res.status(500).json({
            msg: "Error al contar usuarios",
          });
        }

        // Calcular total de páginas
        const totalUsers = countResults[0].total;
        const totalPages = Math.ceil(totalUsers / size);

        // Configurar enlaces para paginación
        const prevPage =
          page > 1
            ? `/api/users?page=${page - 1}&size=${size}&rol=${rol}`
            : null;
        const nextPage =
          page < totalPages
            ? `/api/users?page=${page + 1}&size=${size}&rol=${rol}`
            : null;

        // Enviar respuesta JSON
        res.status(200).json({
          results,
          cant: results.length,
          total: totalUsers,
          totalPages: totalPages,
          currentPage: page,
          prev: prevPage,
          next: nextPage,
        });
      });
    });
  });
};

/**
 *  Esta funsion crea un inversor, cliente/ desde la vista sign-login
 */
const postUser = async (req, res) => {
  const {
    nombre,
    apellido,
    correo,
    codigo_pais,
    numero_telefono,
    pais_residencia,
    password,
    acepta_terminos,
    categoria_persona_id,
    username,
    edad,
    registrado_por,
    rol,
    gender,
  } = req.body;
  let verificadoUser = registrado_por == "" ? 0 : 1;

  if (acepta_terminos == "0") {
    return res.status(500).json({
      msg: "Debe aceptar las condiciones y terminos",
    });
  }
  const query2 = `SELECT * FROM usuarios WHERE correo = ?`;
  conexion.query(query2, [correo], async (error, results) => {
    if (results.length > 0) {
      return res.status(500).json({
        msg: "El correo ya esta en uso",
      });
    }
    const sql =
      "INSERT INTO usuarios ( nombre, apellido, correo, codigo_pais, numero_telefono,username, pais_residencia, password,edad, acepta_terminos, categoria_persona_id, rol, cod_verificacion,verificado,registrado_por, genero) VALUES (?, ?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?,?)";
    let passwordHash = await bcrypt.hash(password, 10);
    const verificationCode = crypto.randomBytes(20).toString("hex");
    const values = [
      nombre,
      apellido,
      correo,
      codigo_pais,
      numero_telefono,
      username,
      pais_residencia,
      passwordHash,
      edad,
      acepta_terminos,
      categoria_persona_id,
      rol,
      verificationCode,
      verificadoUser,
      registrado_por,
      gender,
    ];
    conexion.query(sql, values, (error, results) => {
      if (error) {
        return res.status(500).send(error);
      } else {
        const verificationLink = `${process.env.URL_BASE}/users/verify/${results.insertId}`;
        const loginLink = `${process.env.URL_BASE}/sign-login`;
        const msgHtml =
          verificadoUser == 0
            ? `<!DOCTYPE html>
      <html lang="es">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Bienvenido</title>
          <style>
              .mail-container {
                  background-color: #ff;
                  padding: 20px;
                  border-radius: 10px;
                  max-width: 600px;
                  margin: 0 auto;
                  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
              }
              .mail-header {
                  background-color: #17223B;;
                  padding: 10px;
                  border-radius: 10px 10px 0 0;
                  text-align: center;
                  color: white;
              }
              .mail-content {
                  padding: 20px;
              }
              .verification-link {
                  background-color: #F37926;
                  color: white;
                  padding: 10px 20px;
                  text-decoration: none;
                  border-radius: 5px;
              }
              .mail-footer {
                  text-align: center;
                  font-size: 12px;
                  color: #777;
                  margin-top: 20px;
              }
          </style>
      </head>
      <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
          <div class="mail-container">
              <div class="mail-header">
                  <h1 style="margin: 0;">¡Sólo falta un paso!</h1>
              </div>
              <div class="mail-content">
                  <p>Estimado usuario,</p>
                  <p>Gracias por registrarte en nuestra plataforma. Realiza la verificación y podrás acceder a todos nuestros servicios.</p>
                  <p>A continuación te mostramos el código de verificación de tu cuenta:</p>
                  <strong>${verificationCode}</strong>
                  <p>Para verificar tu cuenta, haz click en el siguiente enlace:</p>
                  <a class="verification-link" href="${verificationLink}">Verificar cuenta</a>
              </div>
              <div class="mail-footer">
                  <p>&copy; 2024 Talento Inversiones. Todos los derechos reservados.</p>
              </div>
          </div>
      </body>
      </html>
                        `
            : `<!DOCTYPE html>
      <html lang="es">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Bienvenido</title>
          <style>
              .mail-container {
                  background-color: #ff;
                  padding: 20px;
                  border-radius: 10px;
                  max-width: 600px;
                  margin: 0 auto;
                  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
              }
              .mail-header {
                  background-color: #17223B;;
                  padding: 10px;
                  border-radius: 10px 10px 0 0;
                  text-align: center;
                  color: white;
              }
              .mail-content {
                  padding: 20px;
              }
              .verification-link {
                  background-color: #F37926;
                  color: white;
                  padding: 10px 20px;
                  text-decoration: none;
                  border-radius: 5px;
              }
              .mail-footer {
                  text-align: center;
                  font-size: 12px;
                  color: #777;
                  margin-top: 20px;
              }
          </style>
      </head>
      <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
          <div class="mail-container">
              <div class="mail-header">
                  <h1 style="margin: 0;">¡Bienvenido a Nuestra Plataforma!</h1>
              </div>
              <div class="mail-content">
                  <p>Estimado usuario,</p>
                  <p>Gracias por registrarte en nuestra plataforma. Hemos comletado tu registro.</p>
                  <p>Tus credenciales de acceso son:</p>
                  <strong>Email: ${correo}</strong><br>
                  <strong>Contraseña: ${password}</strong>
                  <p>Para iniciar sesión, haz click en el siguiente enlace:</p>
                  <a class="verification-link" href="${loginLink}">Iniciar sesión</a>
              </div>
              <div class="mail-footer">
                  <p>&copy; 2024 Talento Inversiones. Todos los derechos reservados.</p>
              </div>
          </div>
      </body>
      </html>
                        `;
        const mailOptions = {
          from: process.env.GG_EMAIL,
          to: correo,
          subject: "Verifica tu cuenta",
          text: `Por favor verifica tu cuenta haciendo clic en el siguiente enlace: ${verificationLink}`,
          html: msgHtml,
        };
        transporter.sendMail(mailOptions, (error, info) => {
          if (error)
            return res
              .status(500)
              .send("Error al enviar el correo de verificación");
          res.send(
            "Registro exitoso, revisa tu correo para verificar tu cuenta."
          );
        });
      }
    });
  });
};

/**
 * Verifica email
 */
const verifyEmail = (req, res) => {
  const userId = req.params.id;

  const query = `SELECT * FROM usuarios WHERE usuario_id = ?`;
  conexion.query(query, [userId], (err, results) => {
    if (err) {
      return res.status(500).send("Error al verificar el código");
    }

    if (results.length === 0) {
      return res.status(404).send("Usuario no encontrado");
    }

    const updateQuery = `UPDATE usuarios SET verificado = 1 WHERE usuario_id = ?`;
    conexion.query(updateQuery, [userId], (updateErr, updateResults) => {
      if (updateErr) {
        return res
          .status(500)
          .send("Error al actualizar el estado de verificación");
      }
      const htmlResponse = `
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Verificación Exitosa</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f4f4f4;
                    padding: 20px;
                }
                .container {
                    max-width: 600px;
                    margin: 0 auto;
                    background: white;
                    padding: 20px;
                    border-radius: 5px;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                }
                h1 {
                    color: #4CAF50;
                }
                p {
                    font-size: 16px;
                }
                a {
                    color: #4CAF50;
                    text-decoration: none;
                    font-weight: bold;
                }
                a:hover {
                    text-decoration: underline;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>Verificación Exitosa</h1>
                <p>¡Felicidades! Tu cuenta ha sido verificada exitosamente.</p>
                <p>Ahora puedes iniciar sesión en tu cuenta y comenzar a disfrutar de todos nuestros servicios.</p>
                <p><a href="http://localhost:5173/sign-login">Iniciar sesión</a></p>
            </div>
        </body>
        </html>
      `;

      res.send(htmlResponse);
    });
  });
};

/**
 *  Esta funsion modificael estado de  un inversor
 */
const putStateusers = async (req, res) => {
  middlewareControlAdmin(req.query.rol)(req, res, (err) => {
    if (err) {
      return res.status(err.status || 403).json({
        msg: err.message || "No tiene permisos para acceder a esta sección.",
      });
    }
    let sql = `select * from usuarios where usuario_id=${req.params.id}`;
    conexion.query(sql, (error, results) => {
      if (error) {
        res.status(500).json({
          msg: "Error al realizar la peticion",
        });
      } else {
        if (results.length == 0) {
          res.status(500).json({
            msg: `El usuario con el id ${req.params.id} no existe`,
          });
        } else {
          user = results[0];
          sql = "update usuarios set estado=!estado where usuario_id = ?";
          conexion.query(sql, [req.params.id], (error) => {
            if (error) {
              res.status(500).json({
                msg: "Error en la petición",
                error: error.message,
              });
            } else {
              res.status(201).json({
                msg: user.estado == 0 ? "Estado activo" : "Estado inactivo",
              });
            }
          });
        }
      }
    });
  });
};

/**falsta desde aqui
 *  Esta funcion registra la informacion del cliente
 */
const addInfClient = async (req, res) => {
  const {
    cliente_id,
    ocupacion,
    descripcion,
    monto_inversion,
    cantidad_maxima_inversiones,
    preparacion,
    estudios,
    vision,
    //categoria_persona_id, // Añadimos este campo al cuerpo de la solicitud
  } = req.body;

  let query = "select * from usuarios where usuario_id=?";
  conexion.query(query, [cliente_id], (err, results) => {
    if (err) {
      return res.status(500).json({ err: err.message });
    }

    if (results.length === 0) {
      return res.status(404).json({ msg: "El usuario no existe" });
    }

    query = "select * from informacion where cliente_id = ?";
    conexion.query(query, [cliente_id], (err, data) => {
      if (err) {
        return res.status(500).json({ err: err.message });
      }

      if (data.length > 0) {
        return res
          .status(400)
          .json({ msg: "El usuario ya cuenta con una informacion" });
      }

      // Actualizamos la columna categoria_persona_id en la tabla usuarios
      query = "update usuarios set categoria_persona_id = categoria_persona_id where usuario_id = ?";
      conexion.query(query, [cliente_id], (err) => {
        if (err) {
          return res.status(500).json({ err: err.message });
        }

        query =
          "insert into informacion (cliente_id, ocupacion, descripcion, monto_inversion, cantidad_maxima_inversiones, preparacion, estudios, vision) values (?,?,?,?,?,?,?,?)";
        const values = [
          cliente_id,
          ocupacion,
          descripcion,
          monto_inversion,
          cantidad_maxima_inversiones,
          preparacion,
          estudios,
          vision,
        ];

        conexion.query(query, values, (err) => {
          if (err) {
            return res.status(500).json({ err: err.message });
          }
          res
            .status(201)
            .json({
              msg: "Informacion agregada y categoria_persona_id actualizada",
            });
        });
      });
    });
  });
};

/**
 *  Esta funsion modifica un usuario de tipo cliente
 */
const putClientInfo = (req, res) => {
  const {
    ocupacion,
    descripcion,
    monto_inversion,
    cantidad_maxima_inversiones,
    preparacion,
    estudios,
    vision,
  } = req.body;
  let query = `select * from informacion where cliente_id = ${req.params.id}`;
  conexion.query(query, (err, data) => {
    if (err) {
      res.status(400).json({
        err,
      });
      return;
    }
    if (data.length == 0) {
      res.status(400).json({
        msg: "El usuario no cuenta con informacion",
      });
      return;
    }
    query =
      "update informacion set   ocupacion=?, descripcion=?, monto_inversion=?, cantidad_maxima_inversiones=?, preparacion=?, estudios=?, vision=? where cliente_id=?";
    const values = [
      ocupacion,
      descripcion,
      monto_inversion,
      cantidad_maxima_inversiones,
      preparacion,
      estudios,
      vision,
      req.params.id,
    ];
    conexion.query(query, values, (err) => {
      if (err) {
        res.status(400).json({
          err,
        });
        return;
      }
      res.status(201).json({
        msg: "Inforamcion actualizada",
      });
    });
  });
};

// const changeStateUser = (req, res) => {
//   let query = "select * from usuarios where usuario_id = ? ";
//   conexion.query(query, [req.params.id], (err, data) => {
//     if (err) {
//       res.status(404).json({
//         msg: "Error al buscar usuarios",
//       });
//       return;
//     }
//     if (data.length == 0) {
//       res.status(404).json({
//         msg: "Usuario no encontrado",
//       });
//       return;
//     }
//     query = "update usuarios set estado=!estado where usuario_id = ?";
//     let estado = data[0].estado;
//     conexion.query(query, [req.params.id], (err) => {
//       if (err) {
//         res.status(404).json({
//           msg: "Error al cambiar estado",
//         });
//         return;
//       }
//       res.status(201).json({
//         msg: estado == "1" ? "Categoria no activa" : "Categoria activa",
//       });
//     });
//   });
// };

/**
 *  Esta funsion obtiene la informacion del usaurio tipo cliente por su id
 */
const getInfoClientById = (req, res) => {
  let sql = "select * from informacion where cliente_id=?";
  conexion.query(sql, [req.params.id], (error, results) => {
    console.log(results);
    if (error) {
      res.status(500).json({
        error,
      });
      return;
    }

    res.status(500).json({
      data: results,
      cant: results.length,
    });
  });
};

/**
 *  Esta funsion crea la imagen de la tabla usuarios con el nombre de la
 * imagen encriptada  y ademas  sube la imagen a  la carpeta uploads/images
 */
const uploadimageUser = async (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0 || !req.files.image) {
    res.status(400).json({
      msg: "Sin archivos para subir",
    });
    return;
  }

  let query = "SELECT * FROM usuarios WHERE usuario_id = ?";
  conexion.query(query, [req.params.id], async (err, results) => {
    if (err) {
      res.status(500).json({
        err,
      });
      return;
    }

    if (results.length === 0) {
      return res.status(404).json({
        msg: "Usuario no encontrado",
      });
    }

    const oldImgPath = results[0].imagen;
    if (oldImgPath) {
      const fullPath = path.join(__dirname, "../uploads/images", oldImgPath);
      fs.unlink(fullPath, (err) => {
        if (err) {
          console.error("Error al eliminar la imagen anterior:", err);
        }
      });
    }

    try {
      const imgPath = await uploadFile(req.files);
      query = `UPDATE usuarios SET imagen = ? WHERE usuario_id = ?`;
      conexion.query(query, [imgPath, req.params.id], (err) => {
        if (err) {
          res.status(500).json({
            err,
          });
          return;
        }
        res.status(201).json({
          ok: "Imagen cargada",
        });
      });
    } catch (err) {
      res.status(400).json({
        err,
      });
    }
  });
};

/**
 * Con esta funcion se puede acceder a la url de la imagen
 */
const createUrlImg = (req, res) => {
  let query = "select * from usuarios where usuario_id=?";
  conexion.query(query, [req.params.id], (err, data) => {
    if (err) {
      res.status(500).json({
        err,
      });
      return;
    }
    if (data.length == 0) {
      res.status(500).json({
        err,
      });
      return;
    }
    let userImg = data[0].imagen;
    const pathImg = path.join(__dirname, "../uploads/images/", userImg);
    if (fs.existsSync(pathImg)) {
      return res.sendFile(pathImg);
    }
  });
};

/**
 * Obitene el client/inversor por su id
 */

const getUserById = (req, res) => {
  let query = `
    SELECT 
        u.usuario_id,
        u.nombre, 
        u.apellido, 
        u.correo, 
        u.categoria_persona_id,
        u.username, 
        u.pais_residencia,
        u.edad, 
        u.rol, 
        u.aprobado,
        u.estado,
        u.codigo_pais,
        u.numero_telefono,
        u.genero,
        u.estado,
        u.created_at,
        u.imagen,
        u.verificado,
        u.aprobado,
        i.ocupacion, 
        i.descripcion, 
        i.monto_inversion, 
        i.cantidad_maxima_inversiones,
        i.preparacion, 
        i.estudios, 
        i.vision,
        i.monto_inversion,
        i.cantidad_maxima_inversiones,
        c.nombre as categoria
    FROM 
        usuarios AS u
    LEFT JOIN 
        informacion AS i ON u.usuario_id = i.cliente_id
    LEFT JOIN 
        categoria_personas AS c ON u.categoria_persona_id = c.categoria_persona_id
     where u.usuario_id = ?   
    `;
  conexion.query(query, [req.params.id], (error, results) => {
    if (error || results.length == 0) {
      res.status(500).json({
        ok: "Error al buscar usuarios",
        error,
      });
      return;
    }
    res.status(200).json({
      results,
    });
  });
};

const getSolInvById = (req, res) => {
  let query = `
        SELECT
        s.*,
        COALESCE(SUM(i.monto), 0) as total_recaudado,
        (s.monto - COALESCE(SUM(i.monto), 0)) as monto_restante,
        cp.nombre as nombre_categoria,
        cp.porcentaje_interes
      FROM solicitudes_inversion s
      LEFT JOIN inversiones i ON i.solicitud_inv_id = s.id
      LEFT JOIN usuarios u ON s.cliente_id = u.usuario_id
      LEFT JOIN categoria_personas cp ON u.categoria_persona_id = cp.categoria_persona_id
      WHERE s.cliente_id = ?
        AND s.aprobado = 'Aprobado'
      GROUP BY s.id
      ORDER BY s.id DESC
      LIMIT 1
    `;
  conexion.query(query, [req.params.id], (err, results) => {
    if (err) {
      return res.status(500).send({ message: "Error en la consulta" });
    }
    results[0].fecha_fin_recaudacion = new Date(results[0].fecha_fin_recaudacion)
      .toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
    results[0].fecha_inicio_recaudacion = new Date(results[0].fecha_inicio_recaudacion)
      .toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
    results[0].fecha_inicio_pago = new Date(results[0].fecha_inicio_pago)
      .toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
    results[0].fecha_fin_pago = new Date(results[0].fecha_fin_pago)
      .toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
    results[0].total_recaudado = parseFloat(results[0].total_recaudado).toFixed(2);
    res.status(200).json({ results: results[0] })
  })
}

const handleEmail = (req, res) => {
  const correo = req.query.correo;
  const query = `SELECT * FROM usuarios WHERE correo = ?;`;

  conexion.query(query, [correo], (error, results) => {
    if (error) {
      return res.status(500).send({ message: "Error en la consulta" });
    }

    if (results.length > 0) {
      res.send({ existe: true });
    } else {
      res.send({ existe: false });
    }
  });
};
const handleTelefono = (req, res) => {
  const telefono = req.query.telefono;
  const query = `SELECT * FROM usuarios WHERE numero_telefono = ?;`;

  conexion.query(query, [telefono], (error, results) => {
    if (error) {
      return res.status(500).send({ message: "Error en la consulta" });
    }

    if (results.length > 0) {
      res.send({ existe: true });
    } else {
      res.send({ existe: false });
    }
  });
};

module.exports = {
  getUsers,
  postUser,
  putStateusers,
  getUsersByRol,
  uploadimageUser,
  addInfClient,
  getInfoClientById,
  putClientInfo,
  createUrlImg,
  verifyEmail,
  getUsersByname,
  getUserById,
  handleTelefono,
  handleEmail,
  getUsersBynameAndRol,
  approvedUser,
  getInfoInvestor,
  getSolInvById
};
