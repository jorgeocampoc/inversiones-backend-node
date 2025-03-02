const { response: res, request: req, query, json } = require("express");
const conexion = require("../database");
const bcrypt = require("bcrypt");

const cloudinary = require("cloudinary").v2;
cloudinary.config(process.env.CLOUDINARY_URL);

const isClientFormInfoRegistered = (req, res) => {
  let query = "select * from usuarios where usuario_id = ?";
  const { id } = req.query;
  conexion.query(query, [id], (err, results) => {
    if (err || results.length == 0) {
      res.status(500).json({
        msg: "Error al buscar el cliente",
        err,
      });
      return;
    }

    query = "select * from informacion where cliente_id = ?";
    conexion.query(query, [id], (err, results) => {
      if (err) {
        res.status(500).json({
          msg: "Error al buscar la inforamcion del cliente",
          err: err.message,
        });
        return;
      }
      if (results.length > 0) {
        res.status(200).json({
          msg: "El usuario ya cuenta con un registro de su inforamcion",
          ok: true,
          cant: results.length,
        });
        return;
      }
      res.status(200).json({
        msg: "El usuario aun no cuenta con un registro de su inforamcion",
        ok: false,
        cant: 1,
        cant: 0,
      });
    });
  });
};

const isClientFormExperience = (req, res) => {
  let query = "select * from usuarios where usuario_id = ?";
  const { id } = req.query;
  conexion.query(query, [id], (err, results) => {
    if (err || results.length == 0) {
      res.status(500).json({
        msg: "Error al buscar el cliente",
        err,
      });
      return;
    }

    query = "select * from experiencia where cliente_id = ?";
    conexion.query(query, [id], (err, results) => {
      if (err) {
        res.status(500).json({
          msg: "Error al buscar los logros  del cliente",
          err: err.message,
        });
        return;
      }
      if (results.length > 0) {
        res.status(200).json({
          msg: "El usuario ya cuenta con un registro de su experiencia",
          ok: true,
          cant: results.length,
        });
        return;
      }
      res.status(200).json({
        msg: "El usuario aun no cuenta con un registro de su experiencia",
        ok: false,
        cant: 1,
        cant: 0,
      });
    });
  });
};
const isClientFormAchievements = (req, res) => {
  let query = "select * from usuarios where usuario_id = ?";
  const { id } = req.query;
  conexion.query(query, [id], (err, results) => {
    if (err || results.length == 0) {
      res.status(500).json({
        msg: "Error al buscar el cliente",
        err,
      });
      return;
    }

    query = "select * from logros where cliente_id = ?";
    conexion.query(query, [id], (err, results) => {
      if (err) {
        res.status(500).json({
          msg: "Error al buscar la experiencia  del cliente",
          err: err.message,
        });
        return;
      }
      if (results.length > 0) {
        res.status(200).json({
          msg: "El usuario ya cuenta con un registro de su logros",
          ok: true,
          cant: results.length,
          cant: results.length,
        });
        return;
      }
      res.status(200).json({
        msg: "El usuario aun no cuenta con un registro de su logros",
        ok: false,
        cant: 0,
      });
    });
  });
};

const isClientVideo = (req, res) => {
  // Valida si el ID está presente
  const { id } = req.query;
  if (!id) {
    return res.status(400).json({
      msg: "El parámetro 'id' es obligatorio",
      ok: false,
    });
  }

  let query = "SELECT * FROM informacion WHERE cliente_id = ?";
  
  conexion.query(query, [id], (err, results) => {
    if (err) {
      return res.status(500).json({
        msg: "Error al buscar el cliente",
        err: err.message || err,
        ok: false,
      });
    }

    if (results.length === 0) {
      return res.status(201).json({
        msg: "Cliente no encontrado",
        ok: false,
        cant: 0,
      });
    }

    const video = results[0].video;

    if (!video) {
      return res.status(200).json({
        msg: "El usuario no cuenta aún con un video",
        ok: false,
        cant: 0,
      });
    }

    // Si el usuario tiene un video
    return res.status(200).json({
      msg: "El usuario ya cuenta con un video",
      ok: true,
      cant: 1,
    });
  });
};


const isClientPhoto = (req, res) => {
  let query = "select * from usuarios where usuario_id = ?";
  const { id } = req.query;
  conexion.query(query, [id], (err, results) => {
    if (err || results.length == 0) {
      res.status(500).json({
        msg: "Error al buscar el cliente",
        err,
      });
      return;
    }
    if (results[0].imagen == "" || results[0].imagen == null) {
      res.status(200).json({
        msg: "El usuario no cuenta aun con una imagen",
        ok: false,
        cant: 0,
      });
      return;
    }
    res.status(200).json({
      msg: "El usuario ya cuenta con una imagen",
      ok: true,
      cant: 1,
    });
    return;
  });
};

const isInversorInfo = (req, res) => {
  const { id } = req.query;
  let query = "select * from usuarios where usuario_id = ?";
  conexion.query(query, [id], (err, results) => {
    if (err) {
      res.status(500).json({
        msg: "Error al buscar usuario/Usuario no encontrado",
        err,
      });
      return;
    }
    query =
      "select id from informacion_inversionista where id_inversionista = ?";
    conexion.query(query, [id], (err, results) => {
      if (err) {
        res.status(500).json({
          msg: "Error al buscar usuario/",
          err,
        });
        return;
      }
      if (results.length == 0) {
        res.status(200).json({
          ok: false,
          cant: 0,
          msg: "El inversor no cuenta con un registro",
        });
        return;
      }
      res.status(200).json({
        ok: true,
        msg: "El inversor ya cuenta con un registro",
        cant: 1,
      });
    });
  });
};

const isInversorPhoto = (req, res) => {
  const { id } = req.query;
  let query = "select * from usuarios where usuario_id = ?";
  conexion.query(query, [id], (err, results) => {
    if (err || results.length == 0) {
      res.status(500).json({
        msg: "Error al buscar usuario/Usuario no encontrado",
        err,
      });
      return;
    }
    if (!results[0].imagen) {
      res.status(200).json({
        msg: "El usuario no cuenta con una selfie",
        ok: false,
        cant: 0,
      });
      return;
    }
    res.status(200).json({
      msg: "El usuario ya cuenta con una selfie",
      ok: true,
      cant: 1,
    });
    return;
  });
};

/**
 * Obtener destacados
 */
const getFeatured = (req, res) => {
  let sql = `SELECT 
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
    c.nombre AS categoria,
    s.nombre AS titulo,
    COUNT(*) AS total_inversiones
FROM 
    usuarios AS u
LEFT JOIN 
    informacion AS i ON u.usuario_id = i.cliente_id
LEFT JOIN 
    categoria_personas AS c ON u.categoria_persona_id = c.categoria_persona_id
LEFT JOIN 
    solicitudes_inversion AS s ON u.usuario_id = s.cliente_id
WHERE 
    u.rol = "cliente" 
    AND s.aprobado = 'Aprobado' 
    AND s.estado_inversion = 'Pendiente'
    AND CURRENT_DATE BETWEEN s.fecha_inicio_recaudacion AND s.fecha_fin_recaudacion
GROUP BY 
    u.usuario_id, u.nombre, u.apellido, u.correo, u.categoria_persona_id, 
    u.username, u.pais_residencia, u.edad, u.imagen, u.rol, 
    i.ocupacion, u.estado, i.descripcion, i.monto_inversion, 
    i.cantidad_maxima_inversiones, i.preparacion, i.estudios, i.vision, 
    c.nombre, s.nombre
ORDER BY 
    total_inversiones DESC
LIMIT 5;
`;
  conexion.query(sql, (err, results) => {
    console.log(results);
    if (err) {
      res.status(500) -
        json({
          results: [],
          err,
        });
      return;
    }
    res.status(200).json({
      results,
    });
  });
};

const uploadimageUserCloudinaryHome = async (req, res) => {
  console.log("Archivos recibidos:", req.files);

  // Validación de archivo
  if (!req.files || Object.keys(req.files).length === 0 || !req.files.image) {
    return res.status(400).json({
      msg: "Sin archivos para subir",
    });
  }
  try {
    console.log("aquiiiiiiiiiiiii", req.files.image);
    const extension = req.files.image.name.split(".").pop().toLowerCase();
    if (!["jpg", "png", "jpeg"].includes(extension)) {
      return res
        .status(400)
        .json({ msg: "Extensiones de imagen no permitidas" });
    }

    await cloudinary.uploader.destroy(
      `home/${req.params.fieldImage}`,
      (error, result) => {
        if (error)
          console.error("Error al eliminar imagen en Cloudinary:", error);
        else console.log("Imagen eliminada en Cloudinary:", result);
      }
    );

    const { tempFilePath } = req.files.image;
    const uploadResult = await cloudinary.uploader.upload(tempFilePath, {
      public_id: req.params.fieldImage,
      folder: "home",
    });

    const { secure_url } = uploadResult;
    console.log(req.params.fieldImage);
    let query = `UPDATE ajustes SET ${req.params.fieldImage} = ? WHERE ajuste_id = 6`;
    conexion.query(query, [secure_url], (err) => {
      if (err) {
        console.error("Error al actualizar imagen en la base de datos:", err);
        return res.status(500).json({
          msg: "Error al guardar la URL de la imagen",
        });
      }

      res.status(201).json({
        msg: "Imagen actualizada con éxito",
        url: secure_url,
      });
    });
  } catch (error) {
    console.error("Error al procesar la imagen:", error);
    return res.status(500).json({
      msg: "Error al procesar la imagen",
      error,
    });
  }
};

const getAllImageHome = (req, res) => {
  let query = "select image1,image2,image3 from ajustes where ajuste_id = 6";
  conexion.query(query, (err, results) => {
    if (err) {
      res.status(500).json({
        err,
        msg: "Error al obtener las imagenes",
      });
      return;
    }
    res.status(200).json({
      results,
    });
  });
};

const putTextHome = (req, res) => {
  let query = `update ajustes set textHome = ? where ajuste_id = 6`;
  conexion.query(query, [req.params.text], (err, results) => {
    if (err) {
      res.status(500).json({
        err,
        msg: "error al guardar el texto",
      });
      return;
    }
    res.status(201).json({
      ok: "texto editado",
    });
  });
};
const getTextHome = (req, res) => {
  let query = "select textHome from ajustes where ajuste_id = 6";
  conexion.query(query, (err, results) => {
    if (err) {
      res.status(500).json({
        err,
        msg: "error al buscar el texto",
      });
      return;
    }
    res.status(200).json({
      text: results[0].textHome,
    });
  });
};
const getImagePartners = (req, res) => {
  let query = "select partners from ajustes where ajuste_id = 6";
  conexion.query(query, (err, results) => {
    if (err) {
      res.status(500).json({
        err,
        msg: "error al buscar el texto",
      });
      return;
    }
    res.status(200).json({
      results,
    });
  });
};

const getTextProposito = (req, res) => {
  let query =
    "select propositoText,proposito_imagen from ajustes where ajuste_id = 6";
  conexion.query(query, (err, results) => {
    if (err) {
      res.status(500).json({
        err,
        msg: "error al buscar el texto",
      });
      return;
    }
    res.status(200).json({
      results,
    });
  });
};

const putTextPurpose = (req, res) => {
  let query = `update ajustes set propositoText = ? where ajuste_id = 6`;
  conexion.query(query, [req.params.text], (err, results) => {
    if (err) {
      res.status(500).json({
        err,
        msg: "error al guardar el texto",
      });
      return;
    }
    res.status(201).json({
      ok: "texto editado",
    });
  });
};

const savePercentajerUser = (req, res) =>{
  let query = 'update usuarios set porcentaje_registro = ? where usuario_id = ?'
  conexion.query(query, [req.query.porcentaje,req.params.id], (err, results) =>{
    if (err) {
      res.status(500).json({
        err,
        msg: "error al guardar el texto",
      });
      return;
    }
    res.status(201).json({
      ok: "Porcentaje actualzadoi",
    });
  })
}

const getTotalInfoUsers = (req, res) =>{
  let query = 'select aprobado, estado from usuarios'
  conexion.query(query, (err, results) =>{
    if (err) {
      res.status(500).json({
        err,
        msg: "error al guardar el texto",
      });
      return;
    }
    res.status(201).json({
      results
    });
  })
}

const getVideoSettings = ( req, res ) =>{
  let query = 'select video from ajustes';
  conexion.query(query, (err, results) =>{
      if(err){
        res.status(500).json({
          err
        })
        return
      }
      res.status(200).json({
        video:results[0].video
      })
  })
} 

const putVideoSetting = (req, res) =>{
  const { id, url } = req.query;
  console.log(req.query);
  let query = 'update ajustes set video = ? where ajuste_id = ?';
  conexion.query(query,[ url,id],(err, results) =>{
    if(err){
      res.status(500).json({
        err
      })
      return
    }
    res.status(201).json({
      msg: 'video actualizado'
    })
  })
  
}

const changeNameSystem = (req, res) =>{
  let query= 'update ajustes set nombre =? where ajuste_id = 6';
  conexion.query(query,[ req.query.nombre    ],(err) =>{
    if(err){
      res.status(500).json({
        err
      })
      return
    }
    res.status(201).json({
      msg: 'Nombre del sistema actualizado'
    })
  })
}

const getNameSystem = (req, res)=>{
  let query = 'select nombre  from ajustes where ajuste_id = 6';
  conexion.query(query,(err, results) =>{
    if(err){
      res.status(500).json({
        err
      })
      return
    }
    res.status(201).json({
      nombre:results[0].nombre
    })
  })
}
const getLogoSystem = (req, res)=>{
  let query = 'select logo  from ajustes where ajuste_id = 6';
  conexion.query(query,(err, results) =>{
    if(err){
      res.status(500).json({
        err
      })
      return
    }
    res.status(201).json({
      logo:results[0].logo
    })
  })
}

module.exports = {
  isClientFormInfoRegistered,
  isClientFormAchievements,
  isClientFormExperience,
  isClientVideo,
  isClientPhoto,
  isInversorInfo,
  isInversorPhoto,
  getFeatured,
  uploadimageUserCloudinaryHome,
  getAllImageHome,
  putTextHome,
  getTextHome,
  getImagePartners,
  getTextProposito,
  putTextPurpose,
  savePercentajerUser,
  getTotalInfoUsers,
  getVideoSettings,
  putVideoSetting,
  changeNameSystem,
  getNameSystem,
  getLogoSystem
};
