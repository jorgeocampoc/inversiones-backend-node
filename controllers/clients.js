const { response: res, request: req } = require('express')
const conexion = require('../database');
// const bcrypt = require('bcrypt');
// const fs = require('fs');
// const path = require('path');
// const { uploadFile } = require('../helpers/uploadImage');
// const { v4: uuidv4 } = require('uuid');
const cloudinary = require('cloudinary').v2;
// const transporter = require('../helpers/mailer');
// const crypto = require('crypto');
cloudinary.config(process.env.CLOUDINARY_URL);

// Filtra todos  clientes  ( usado en el marketplace )

const getAllClientesWithInfo = (req, res) => {
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
        u.imagen,
        u.rol, 
        i.ocupacion, 
        u.estado,
        i.descripcion, 
        i.monto_inversion, 
        i.cantidad_maxima_inversiones,
        i.preparacion, 
        i.estudios, 
        i.vision,
        c.nombre as categoria,
        s.nombre as titulo
    FROM 
        usuarios AS u
    LEFT JOIN 
        informacion AS i ON u.usuario_id = i.cliente_id
     LEFT JOIN 
        categoria_personas AS c ON u.categoria_persona_id = c.categoria_persona_id
    LEFT JOIN solicitudes_inversion as s on u.usuario_id = s.cliente_id
    WHERE 
        u.rol = "cliente" and s.aprobado = 'Aprobado' and s.estado_inversion = 'Pendiente'
        and CURRENT_DATE BETWEEN s.fecha_inicio_recaudacion AND s.fecha_fin_recaudacion;
    `;
    
    conexion.query(query, (err, results) => {
        if (err) {
            res.status(500).json({
                msg: 'Error al buscar clientes'
            });
            return;
        }
        res.status(200).json({
            results,
            cant: results.length
        });
    });
}

// Filtra clientes por su categoria ( usado en el marketplace )

const getAllClientesByCategory = async (req, res) => {
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
        u.imagen,
        u.rol, 
        i.ocupacion, 
        i.descripcion, 
        i.monto_inversion, 
        i.cantidad_maxima_inversiones,
        i.preparacion, 
        i.estudios, 
        i.vision,
        c.nombre as categoria,
        s.nombre as titulo
    FROM 
        usuarios AS u
    LEFT JOIN 
        informacion AS i ON u.usuario_id = i.cliente_id
        LEFT JOIN 
        categoria_personas AS c ON u.categoria_persona_id = c.categoria_persona_id
        LEFT JOIN 
        solicitudes_inversion as s on u.usuario_id = s.cliente_id
    WHERE 
        u.rol = "cliente" and u.categoria_persona_id = ? and s.aprobado = 'Aprobado' and s.estado_inversion = 'Pendiente'
        and CURRENT_DATE BETWEEN s.fecha_inicio_recaudacion AND s.fecha_fin_recaudacion;
    ;
    `;
    
    conexion.query(query, [req.params.id],(err, results) => {
        if (err) {
            res.status(500).json({
                msg: 'Error al buscar clientes'
            });
            return;
        }
        res.status(200).json({
            results,
            cant: results.length
        });
    });

}

/**
 * Filtra clientes por su nombre ( usado en el marketplace )
 */

const getAllClientesByFilterName =  (req, res) => {
    const searchTerm = req.params.id || '';
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
        u.edad, 
        u.rol, 
        i.ocupacion, 
        i.descripcion, 
        i.monto_inversion, 
        i.cantidad_maxima_inversiones,
        i.preparacion, 
        i.estudios, 
        i.vision,
        s.nombre as titulo
    FROM 
        usuarios AS u
    LEFT JOIN 
        informacion AS i ON u.usuario_id = i.cliente_id
    LEFT JOIN 
        solicitudes_inversion as s on u.usuario_id = s.cliente_id
    WHERE 
        u.rol = "cliente" and s.aprobado = 'Aprobado'and s.estado_inversion = 'Pendiente' and u.nombre like ?
        and CURRENT_DATE BETWEEN s.fecha_inicio_recaudacion AND s.fecha_fin_recaudacion;
    ;
    `;
    
    conexion.query(query, [searchPattern],(err, results) => {
        if (err) {
            res.status(500).json({
                msg: 'Error al buscar clientes'
            });
            return;
        }
        res.status(200).json({
            results,
            cant: results.length
        });
    });

}

const uploadimageUserCloudinary = (req, res) => {
    console.log("Archivos recibidos:", req.files);

    // Validación de archivo
    if (!req.files || Object.keys(req.files).length === 0 || !req.files.image) {
        return res.status(400).json({
            msg: 'Sin archivos para subir'
        });
    }

    // Verifica si el usuario existe
    let query = 'SELECT * FROM usuarios WHERE usuario_id = ?';
    conexion.query(query, [req.params.id], async (err, results) => {
        if (err) {
            console.error("Error de consulta SQL:", err);
            return res.status(500).json({ err });
        }

        if (results.length === 0) {
            return res.status(404).json({ msg: 'Usuario no encontrado' });
        }

        try {
            // Verificación de extensión del archivo
            console.log('aquiiiiiiiiiiiii', req.files.image);
            const extension = req.files.image.name.split('.').pop().toLowerCase();
            if (!['jpg', 'png', 'jpeg'].includes(extension)) {
                return res.status(400).json({ msg: 'Extensiones de imagen no permitidas' });
            }

            // Destrucción de imagen anterior
            await cloudinary.uploader.destroy(`clients/${req.params.id}`, (error, result) => {
                if (error) console.error("Error al eliminar imagen en Cloudinary:", error);
                else console.log("Imagen eliminada en Cloudinary:", result);
            });

            // Subida de nueva imagen
            const { tempFilePath } = req.files.image;
            const uploadResult = await cloudinary.uploader.upload(tempFilePath, {
                public_id: req.params.id,
                folder: 'clients'
            });

            // Obtiene la URL segura de Cloudinary
            const { secure_url } = uploadResult;

            // Actualización de la URL de la imagen en la base de datos
            query = 'UPDATE usuarios SET imagen = ? WHERE usuario_id = ?';
            conexion.query(query, [secure_url, req.params.id], (err) => {
                if (err) {
                    console.error("Error al actualizar imagen en la base de datos:", err);
                    return res.status(500).json({
                        msg: 'Error al guardar la URL de la imagen',
                    });
                }

                res.status(201).json({
                    msg: "Imagen actualizada con éxito",
                    url: secure_url
                });
            });
        } catch (error) {
            console.error("Error al procesar la imagen:", error);
            return res.status(500).json({
                msg: 'Error al procesar la imagen',
                error
            });
        }
    });
};


/**
 *  Esta funsion modifica los datos mas relevantes de  un inversor/cliente
 * desde la vista  perfil
 */
const putInvestors = async (req, res) => {
    const { username, correo } = req.body;
    let query = 'select * from usuarios where correo = ? and usuario_id = ?';
    conexion.query( query, [correo, req.params.id], (err, results) =>{
      if( err ){
          return res.status(err.status || 404).json({
              msg:err.message || 'Error en la peticion'
          })
      }
      if( results.length == 0 ){
          return res.status(err.status || 404).json({
              msg:err.message || 'Usuario no encontrado'
          })
      }
      
    query = 'select * from usuarios where username = ?';
    conexion.query(query, [username], (err, results)=>{
        if( err ){
            return res.status( 404).json({
                msg: 'Error en la peticion'
            })
        }
        if( results.length > 0 ){
            return res.status( 404).json({
                msg: 'El username ya esta en uso' 
            })
        }

        query =
        "update usuarios set username=? where usuario_id = ?";
      const values = [
        username,
        req.params.id,
      ];
      conexion.query(query, values, (error) => {
        if (error) {
          res.status(500).json({
            msg: "Error en la petición",
            error: error.message,
          });
        } else {
          res.status(201).json({
            msg: "Inversor actualizado",
          });
        }
      });
    })
    } )
  };
  
  const getExperiencia = (req, res) =>{
    let query = `select * from ${req.query.type}  where cliente_id = ?`;
    conexion.query(query,[req.params.id], (err, results) =>{
        if( err  ){
            res.status(500).json({
                err,
                msg:'Error al buscar la experiencia del usuario'
            })
            return;
        }
        res.status(201).json({
            results
        })
    })
  }

  const addInfinversionista = (req, res) => {
    const {
        id_inversionista,
        nombre_completo,
        dni,
        tipo_dni,
        domicilio,
        ciudad,
        situacion_laboral,
        fuente_de_ingresos,
    } = req.body;
    let query = "select * from usuarios where usuario_id=?";
    conexion.query(query, [id_inversionista], (err, results) => {
      if (err) {
        res.status(500).json({
          err,
        });
        return;
      }
  
      if (results.length == 0) {
        res.status(500).json({
          msg: "El usuario no existe",
        });
        return;
      }
      query = "select * from informacion_inversionista where id_inversionista = ?";
      conexion.query(query, [id_inversionista], (err, data) => {
        if (err) {
          res.status(500).json({
            err,
          });
          return;
        }
  
        if (data.length > 0) {
          res.status(500).json({
            msg: "El inversionista ya cuenta con una informacion",
          });
          return;
        }
        query =
          "insert into informacion_inversionista (id_inversionista, nombre_completo, dni, tipo_dni, domicilio, ciudad, situacion_laboral,fuente_de_ingresos) values (?,?,?,?,?,?,?,?)";
        const values = [
            id_inversionista,
            nombre_completo,
            dni,
            tipo_dni,
            domicilio,
            ciudad,
            situacion_laboral,
            fuente_de_ingresos,
        ];
        conexion.query(query, values, (err) => {
          if (err) {
            res.status(500).json({
              err,
            });
            return;
          }
          res.status(201).json({
            msg: "Informacion agregada",
          });
        });
      });
    });
  };

  const changeRolUser = (req,res)=>{
    const { usuario_id, rol }  = req.body;
    console.log(req.body);
    let query = 'select * from usuarios where usuario_id = ?';
    conexion.query(query,[usuario_id],(err,results) =>{
        if( err || results.length == 0 ){
            res.status(500).json({
                err,
                msg:'Erro al buscar usuario'
            })
            return;
        }
        query = 'update usuarios set rol = ? where usuario_id= ?';
        conexion.query(query,[rol,usuario_id], (err,results) => {
            if( err ){
                res.status(500).json({
                    err,
                    msg:'Error al actualizar el rol'
                })
                return;
            }
            res.status(201).json({
                msg:'Se cambio el rol'
            })
        })
    })
  }
  
  const getRol = (req, res) =>{
    console.log(req.query);
    const { id } = req.query;
    let query = 'select rol from usuarios where usuario_id = ?';
    conexion.query(query,[id], (err,results) =>{
        if( err || results.length == 0 ){
            res.status(500).json({
                err,
                msg:'Erro al buscar usuario'
            })
            return;
        }
        res.status(200).json({
            rol:results[0].rol
        })
    })
  }

  const getuserById =(req,res)=> {
    
    const { id } = req.query;
    let query = 'select * from usuarios where usuario_id = ?';
    conexion.query(query,[id], (err,results) =>{
        if( err || results.length == 0 ){
            res.status(500).json({
                err,
                msg:'Erro al buscar usuario'
            })
            return;
        }
        res.status(200).json({
            results
        })
    })
  }
module.exports = {
    getAllClientesWithInfo, 
    getAllClientesByCategory,
    getAllClientesByFilterName,
    uploadimageUserCloudinary,
    putInvestors,
    addInfinversionista,
    getExperiencia,
    changeRolUser,
    getRol,
    getuserById
}
