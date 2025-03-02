var express = require("express");
var router = express.Router();

//importamos la conexión a la base de datos

var connection = require("../database");

// get para pendientes de retiros
router.get("/pendiente", function (req, res, next) {
  const estado = req.query.estado || ''; // Obtiene el estado de la consulta si existe
  const busqueda = req.query.search || ''; 
  const pagina = parseInt(req.query.page, 10) || 1;
  const porPagina = 10;
  const salto = (pagina - 1) * porPagina;

  // Agregar filtro de estado a la consulta SQL si está presente
  let filtroEstado = estado ? `AND solicitudes_retiro.estado = '${estado}'` : '';

  const queryFilas = `
    SELECT COUNT(*) AS numFilas
    FROM solicitudes_retiro
    INNER JOIN usuarios ON solicitudes_retiro.usuario_id = usuarios.usuario_id
    WHERE concat(usuarios.nombre, ' ', usuarios.apellido) LIKE '%${busqueda}%'
    ${filtroEstado};`;

  connection.query(queryFilas, function (error, results) {
    const numFilas = results[0].numFilas;
    const numPaginas = Math.ceil(numFilas / porPagina);

    const query = `
      SELECT solicitudes_retiro.*, concat(usuarios.nombre, ' ', usuarios.apellido, ' - ', usuarios.rol) AS username
      FROM solicitudes_retiro
      INNER JOIN usuarios ON solicitudes_retiro.usuario_id = usuarios.usuario_id
      WHERE concat(usuarios.nombre, ' ', usuarios.apellido) LIKE '%${busqueda}%'
      AND solicitudes_retiro.estado= 'Pendiente'
      ${filtroEstado} 
      LIMIT ${salto}, ${porPagina};`;

    connection.query(query, function (error, results) {
      if (error) {
        res.status(500).send({ error, message: "Error al realizar la petición" });
      } else {
        res.status(200).send({
          pagination: {
            total: numFilas,
            current: pagina,
            pages: Array.from({ length: numPaginas }, (_, i) => i + 1),
            perPage: porPagina,
            previous: pagina > 1 ? pagina - 1 : null,
            next: pagina < numPaginas ? pagina + 1 : null,
          },
          data: results,
          message: "Listando clientes",
        });
      }
    });
  });
});

// get para aprobados de retiros
router.get("/aprobado", function (req, res, next) {
  const estado = req.query.estado || ''; // Obtiene el estado de la consulta si existe
  const busqueda = req.query.search || ''; 
  const pagina = parseInt(req.query.page, 10) || 1;
  const porPagina = 10;
  const salto = (pagina - 1) * porPagina;

  // Agregar filtro de estado a la consulta SQL si está presente
  let filtroEstado = estado ? `AND solicitudes_retiro.estado = '${estado}'` : '';

  const queryFilas = `
    SELECT COUNT(*) AS numFilas
    FROM solicitudes_retiro
    INNER JOIN usuarios ON solicitudes_retiro.usuario_id = usuarios.usuario_id
    WHERE concat(usuarios.nombre, ' ', usuarios.apellido) LIKE '%${busqueda}%'
    ${filtroEstado};`;

  connection.query(queryFilas, function (error, results) {
    const numFilas = results[0].numFilas;
    const numPaginas = Math.ceil(numFilas / porPagina);

    const query = `
      SELECT solicitudes_retiro.*, concat(usuarios.nombre, ' ', usuarios.apellido, ' - ', usuarios.rol) AS username
      FROM solicitudes_retiro
      INNER JOIN usuarios ON solicitudes_retiro.usuario_id = usuarios.usuario_id
      WHERE concat(usuarios.nombre, ' ', usuarios.apellido) LIKE '%${busqueda}%'
      AND solicitudes_retiro.estado= 'Aprobado'
      ${filtroEstado} 
      LIMIT ${salto}, ${porPagina};`;

    connection.query(query, function (error, results) {
      if (error) {
        res.status(500).send({ error, message: "Error al realizar la petición" });
      } else {
        res.status(200).send({
          pagination: {
            total: numFilas,
            current: pagina,
            pages: Array.from({ length: numPaginas }, (_, i) => i + 1),
            perPage: porPagina,
            previous: pagina > 1 ? pagina - 1 : null,
            next: pagina < numPaginas ? pagina + 1 : null,
          },
          data: results,
          message: "Listando clientes",
        });
      }
    });
  });
});

router.patch("/:id", function (req, res, next) { //eliminado lógico
  var query = `UPDATE solicitudes_retiro SET 
  estado = 'Eliminado'
  WHERE retiro_id = '${req.params.id}';`;

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
        message: "inversión eliminado correctamente",
      });
    }
  });
});

// get para rechazados de retiros
router.get("/rechazado", function (req, res, next) {
  const estado = req.query.estado || ''; // Obtiene el estado de la consulta si existe
  const busqueda = req.query.search || ''; 
  const pagina = parseInt(req.query.page, 10) || 1;
  const porPagina = 10;
  const salto = (pagina - 1) * porPagina;

  // Agregar filtro de estado a la consulta SQL si está presente
  let filtroEstado = estado ? `AND solicitudes_retiro.estado = '${estado}'` : '';

  const queryFilas = `
    SELECT COUNT(*) AS numFilas
    FROM solicitudes_retiro
    INNER JOIN usuarios ON solicitudes_retiro.usuario_id = usuarios.usuario_id
    WHERE concat(usuarios.nombre, ' ', usuarios.apellido) LIKE '%${busqueda}%'
    ${filtroEstado};`;

  connection.query(queryFilas, function (error, results) {
    const numFilas = results[0].numFilas;
    const numPaginas = Math.ceil(numFilas / porPagina);

    const query = `
      SELECT solicitudes_retiro.*, concat(usuarios.nombre, ' ', usuarios.apellido, ' - ', usuarios.rol) AS username
      FROM solicitudes_retiro
      INNER JOIN usuarios ON solicitudes_retiro.usuario_id = usuarios.usuario_id
      WHERE concat(usuarios.nombre, ' ', usuarios.apellido) LIKE '%${busqueda}%'
      AND solicitudes_retiro.estado= 'Rechazado'
      ${filtroEstado} 
      LIMIT ${salto}, ${porPagina};`;

    connection.query(query, function (error, results) {
      if (error) {
        res.status(500).send({ error, message: "Error al realizar la petición" });
      } else {
        res.status(200).send({
          pagination: {
            total: numFilas,
            current: pagina,
            pages: Array.from({ length: numPaginas }, (_, i) => i + 1),
            perPage: porPagina,
            previous: pagina > 1 ? pagina - 1 : null,
            next: pagina < numPaginas ? pagina + 1 : null,
          },
          data: results,
          message: "Listando clientes",
        });
      }
    });
  });
});

// get general
router.get("/", function (req, res, next) {
  const estado = req.query.estado || ''; // Obtiene el estado de la consulta si existe
  const busqueda = req.query.search || ''; 
  const pagina = parseInt(req.query.page, 10) || 1;
  const porPagina = 10;
  const salto = (pagina - 1) * porPagina;

  // Agregar filtro de estado a la consulta SQL si está presente
  let filtroEstado = estado ? `AND solicitudes_retiro.estado = '${estado}'` : '';

  const queryFilas = `
    SELECT COUNT(*) AS numFilas
    FROM solicitudes_retiro
    INNER JOIN usuarios ON solicitudes_retiro.usuario_id = usuarios.usuario_id
    WHERE concat(usuarios.nombre, ' ', usuarios.apellido) LIKE '%${busqueda}%'
    ${filtroEstado};`;

  connection.query(queryFilas, function (error, results) {
    const numFilas = results[0].numFilas;
    const numPaginas = Math.ceil(numFilas / porPagina);

    const query = `
      SELECT solicitudes_retiro.*, concat(usuarios.nombre, ' ', usuarios.apellido, ' - ', usuarios.rol) AS username
      FROM solicitudes_retiro
      INNER JOIN usuarios ON solicitudes_retiro.usuario_id = usuarios.usuario_id
      WHERE concat(usuarios.nombre, ' ', usuarios.apellido) LIKE '%${busqueda}%'
      ${filtroEstado} 
      LIMIT ${salto}, ${porPagina};`;

    connection.query(query, function (error, results) {
      if (error) {
        res.status(500).send({ error, message: "Error al realizar la petición" });
      } else {
        res.status(200).send({
          pagination: {
            total: numFilas,
            current: pagina,
            pages: Array.from({ length: numPaginas }, (_, i) => i + 1),
            perPage: porPagina,
            previous: pagina > 1 ? pagina - 1 : null,
            next: pagina < numPaginas ? pagina + 1 : null,
          },
          data: results,
          message: "Listando clientes",
        });
      }
    });
  });
});

router.put("/aprobar/:id", function (req, res, next) { 
  const { monto_recibir, inversion_id, retiro_id, usuario_id, tokens_cambio } = req.body;
  console.log(req.body);
  let query = `UPDATE solicitudes_retiro SET 
  estado = 'Aprobado', fecha_aprobacion = ?
  WHERE retiro_id = '${req.params.id}';`;
  let date = new Date();
  connection.query(query,[date], function (error, results) {
    if (error) {
      res.status(500).send({
        error: error,
        message: "Error al realizar la petición",
      });
      return
    } 
    query = 'insert into movimientos (tipo, monto, fecha_solicitud,inversiones_id,solicitudes_retiro_id,usuario_id,token) values (?,?,?,?,?,?,?)';
    const data = ['Egreso', monto_recibir, date, inversion_id, retiro_id, usuario_id, tokens_cambio ]
      connection.query(query,data,(err,results) =>{
        if( err ){
          res.status(500).json({
          message: "Error al crear la tabla movimientos",
          })
        }
        return
      })
      res.status(200).send({
        data: results.insertId,
        message: "Inversión aprobada correctamente",
      });
    
  });
});

router.patch("/rechazar/:id", function (req, res, next) { //rechazar la solicitud de retiro
  var query = `UPDATE solicitudes_retiro SET 
  estado = 'Rechazado'
  WHERE retiro_id = '${req.params.id}';`;

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
        message: "Inversión rechazada correctamente",
      });
    }
  });
});

router.patch("/pendiente/:id", function (req, res, next) { //pendiente la solicitud de retiro
  var query = `UPDATE solicitudes_retiro SET
  estado = 'Pendiente'
  WHERE retiro_id = '${req.params.id}';`;

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
        message: "Inversión Pendiente",
      });
    }
  });
});

router.get("/totales", function (req, res, next) {
  const queryTotales = `
    SELECT
      (SELECT COUNT(*) FROM solicitudes_retiro) AS total,
      (SELECT COUNT(*) FROM solicitudes_retiro WHERE estado = 'Pendiente') AS pendientes,
      (SELECT COUNT(*) FROM solicitudes_retiro WHERE estado = 'Aprobado') AS aprobados,
      (SELECT COUNT(*) FROM solicitudes_retiro WHERE estado = 'Rechazado') AS rechazados;
  `;

  connection.query(queryTotales, function (error, results) {
    if (error) {
      res.status(500).send({ error, message: "Error al obtener los totales" });
    } else {
      res.status(200).send(results[0]);
    }
  });
});



// get para pendientes de compra de tokens
router.get("/pendienteTokens", function (req, res, next) {
  const estado = req.query.estado || ''; // Obtiene el estado de la consulta si existe
  const busqueda = req.query.search || ''; 
  const pagina = parseInt(req.query.page, 10) || 1;
  const porPagina = 10;
  const salto = (pagina - 1) * porPagina;

  // Agregar filtro de estado a la consulta SQL si está presente
  let filtroEstado = estado ? `AND movimientos.estado = '${estado}'` : '';

  const queryFilas = `
    SELECT COUNT(*) AS numFilas
    FROM movimientos
    INNER JOIN usuarios ON movimientos.usuario_id = usuarios.usuario_id
    WHERE concat(usuarios.nombre, ' ', usuarios.apellido) LIKE '%${busqueda}%'
    ${filtroEstado}
    AND descripcion = 'Compra de tokens';`;

  connection.query(queryFilas, function (error, results) {
    const numFilas = results[0].numFilas;
    const numPaginas = Math.ceil(numFilas / porPagina);

    const query = `
      SELECT movimientos.*, concat(usuarios.nombre, ' ', usuarios.apellido, ' - ', usuarios.rol) AS username
      FROM movimientos
      INNER JOIN usuarios ON movimientos.usuario_id = usuarios.usuario_id
      WHERE concat(usuarios.nombre, ' ', usuarios.apellido) LIKE '%${busqueda}%'
      AND movimientos.estado= '0'
      AND movimientos.descripcion = 'Compra de tokens'
      ${filtroEstado} 
      LIMIT ${salto}, ${porPagina};`;

    connection.query(query, function (error, results) {
      if (error) {
        res.status(500).send({ error, message: "Error al realizar la petición" });
      } else {
        res.status(200).send({
          pagination: {
            total: numFilas,
            current: pagina,
            pages: Array.from({ length: numPaginas }, (_, i) => i + 1),
            perPage: porPagina,
            previous: pagina > 1 ? pagina - 1 : null,
            next: pagina < numPaginas ? pagina + 1 : null,
          },
          data: results,
          message: "Listando clientes",
        });
      }
    });
  });
});

// get para aprobados de compra de tokens
router.get("/aprobadoTokens", function (req, res, next) {
  const estado = req.query.estado || ''; // Obtiene el estado de la consulta si existe
  const busqueda = req.query.search || ''; 
  const pagina = parseInt(req.query.page, 10) || 1;
  const porPagina = 10;
  const salto = (pagina - 1) * porPagina;

  // Agregar filtro de estado a la consulta SQL si está presente
  let filtroEstado = estado ? `AND movimientos.estado = '${estado}'` : '';

  const queryFilas = `
    SELECT COUNT(*) AS numFilas
    FROM movimientos
    INNER JOIN usuarios ON movimientos.usuario_id = usuarios.usuario_id
    WHERE concat(usuarios.nombre, ' ', usuarios.apellido) LIKE '%${busqueda}%'
    ${filtroEstado}
    AND descripcion = 'Compra de tokens';`;

  connection.query(queryFilas, function (error, results) {
    const numFilas = results[0].numFilas;
    const numPaginas = Math.ceil(numFilas / porPagina);

    const query = `
      SELECT movimientos.*, concat(usuarios.nombre, ' ', usuarios.apellido, ' - ', usuarios.rol) AS username
      FROM movimientos
      INNER JOIN usuarios ON movimientos.usuario_id = usuarios.usuario_id
      WHERE concat(usuarios.nombre, ' ', usuarios.apellido) LIKE '%${busqueda}%'
      AND movimientos.estado= 1
      AND movimientos.descripcion = 'Compra de tokens'
      ${filtroEstado}
      AND descripcion = 'Compra de tokens'
      LIMIT ${salto}, ${porPagina};`;

    connection.query(query, function (error, results) {
      if (error) {
        res.status(500).send({ error, message: "Error al realizar la petición" });
      } else {
        res.status(200).send({
          pagination: {
            total: numFilas,
            current: pagina,
            pages: Array.from({ length: numPaginas }, (_, i) => i + 1),
            perPage: porPagina,
            previous: pagina > 1 ? pagina - 1 : null,
            next: pagina < numPaginas ? pagina + 1 : null,
          },
          data: results,
          message: "Listando clientes",
        });
      }
    });
  });
});

//eliminado lógico
router.patch("/tokens/:id", function (req, res, next) { 
  var query = `UPDATE movimientos 
  SET (descripcion, estado) =('Compra de tokens rechazada', 0)
  WHERE retiro_id = '${req.params.id}';`;

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
        message: "inversión eliminado correctamente",
      });
    }
  });
});

// get para rechazados de retiros
router.get("/rechazadoTokens", function (req, res, next) {
  const estado = req.query.estado || ''; // Obtiene el estado de la consulta si existe
  const busqueda = req.query.search || ''; 
  const pagina = parseInt(req.query.page, 10) || 1;
  const porPagina = 10;
  const salto = (pagina - 1) * porPagina;

  // Agregar filtro de estado a la consulta SQL si está presente
  let filtroEstado = estado ? `AND movimientos.estado = '${estado}'` : '';

  const queryFilas = `
    SELECT COUNT(*) AS numFilas
    FROM movimientos
    INNER JOIN usuarios ON movimientos.usuario_id = usuarios.usuario_id
    WHERE concat(usuarios.nombre, ' ', usuarios.apellido) LIKE '%${busqueda}%'
    ${filtroEstado}
    AND descripcion = 'Compra de tokens rechazada';`;

  connection.query(queryFilas, function (error, results) {
    const numFilas = results[0].numFilas;
    const numPaginas = Math.ceil(numFilas / porPagina);

    const query = `
      SELECT movimientos.*, concat(usuarios.nombre, ' ', usuarios.apellido, ' - ', usuarios.rol) AS username
      FROM movimientos
      INNER JOIN usuarios ON movimientos.usuario_id = usuarios.usuario_id
      WHERE concat(usuarios.nombre, ' ', usuarios.apellido) LIKE '%${busqueda}%'
      AND movimientos.estado= 0
      AND movimientos.descripcion = 'Compra de tokens rechazada'
      ${filtroEstado} 
      LIMIT ${salto}, ${porPagina};`;

    connection.query(query, function (error, results) {
      if (error) {
        res.status(500).send({ error, message: "Error al realizar la petición" });
      } else {
        res.status(200).send({
          pagination: {
            total: numFilas,
            current: pagina,
            pages: Array.from({ length: numPaginas }, (_, i) => i + 1),
            perPage: porPagina,
            previous: pagina > 1 ? pagina - 1 : null,
            next: pagina < numPaginas ? pagina + 1 : null,
          },
          data: results,
          message: "Listando clientes",
        });
      }
    });
  });
});

// get general
router.get("/tokens", function (req, res, next) {
  const estado = req.query.estado || ''; // Obtiene el estado de la consulta si existe
  const busqueda = req.query.search || ''; 
  const pagina = parseInt(req.query.page, 10) || 1;
  const porPagina = 10;
  const salto = (pagina - 1) * porPagina;

  // Agregar filtro de estado a la consulta SQL si está presente
  let filtroEstado = estado ? `AND movimientos.estado = '${estado}'` : '';

  const queryFilas = `
    SELECT COUNT(*) AS numFilas
    FROM movimientos
    INNER JOIN usuarios ON movimientos.usuario_id = usuarios.usuario_id
    WHERE concat(usuarios.nombre, ' ', usuarios.apellido) LIKE '%${busqueda}%'
    ${filtroEstado}
    AND movimientos.descripcion = 'Compra de tokens'
    ;`;

  connection.query(queryFilas, function (error, results) {
    const numFilas = results[0].numFilas;
    const numPaginas = Math.ceil(numFilas / porPagina);

    const query = `
      SELECT movimientos.*, concat(usuarios.nombre, ' ', usuarios.apellido, ' - ', usuarios.rol) AS username
      FROM movimientos
      INNER JOIN usuarios ON movimientos.usuario_id = usuarios.usuario_id
      WHERE concat(usuarios.nombre, ' ', usuarios.apellido) LIKE '%${busqueda}%'
      ${filtroEstado} 
      AND movimientos.descripcion = 'Compra de tokens'
      ORDER BY movimientos.fecha_solicitud DESC
      LIMIT ${salto}, ${porPagina};`;

    connection.query(query, function (error, results) {
      if (error) {
        res.status(500).send({ error, message: "Error al realizar la petición" });
      } else {
        res.status(200).send({
          pagination: {
            total: numFilas,
            current: pagina,
            pages: Array.from({ length: numPaginas }, (_, i) => i + 1),
            perPage: porPagina,
            previous: pagina > 1 ? pagina - 1 : null,
            next: pagina < numPaginas ? pagina + 1 : null,
          },
          data: results,
          message: "Listando clientes",
        });
      }
    });
  });
});

//Aprobación de compra de tokens
router.put("/aprobarTokens/:id", function (req, res, next) {
  let query = `
  UPDATE movimientos
  SET 
    estado = 1,
    fecha_desembolso = CURRENT_TIMESTAMP()
  WHERE movimiento_id = '${req.params.id}';`;
  let date = new Date();
  
  connection.query(query, function (error, results) {
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
        message: "Tokens aprobados correctamente",
      });
    }
});
});

//Rechazo de compra de tokens
router.patch("/rechazarTokens/:id", function (req, res, next) { //rechazar la solicitud de retiro
  var query = `
  UPDATE movimientos 
  SET
    estado = 0,
    descripcion = 'Compra de tokens rechazada'
  WHERE movimiento_id = '${req.params.id}';`;

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
        message: "Inversión rechazada correctamente",
      });
    }
  });
});

router.patch("/pendienteTokens/:id", function (req, res, next) { //pendiente la solicitud de retiro
  var query = `UPDATE movimientos
  SET (estado, descripcion) = (0, 'Compra de tokens')
  WHERE movimiento_id = '${req.params.id}'  ;`;

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
        message: "compra Pendiente",
      });
    }
  });
});

//Obtener todas las compras de tokens
router.get("/totalesTokens", function (req, res, next) {
  const queryTotales = `
    SELECT
      (SELECT COUNT(*) FROM movimientos) AS total,
      (SELECT COUNT(*) FROM movimientos WHERE estado = 0 AND descripcion = 'Compra de tokens') AS pendientes,
      (SELECT COUNT(*) FROM movimientos WHERE estado = 1 AND descripcion = 'Compra de tokens') AS aprobados,
      (SELECT COUNT(*) FROM movimientos WHERE estado = 0 AND descripcion = 'Compra de tokens rechazada') AS rechazados;
  `;

  connection.query(queryTotales, function (error, results) {
    if (error) {
      res.status(500).send({ error, message: "Error al obtener los totales" });
    } else {
      res.status(200).send(results[0]);
    }
  });
});

module.exports = router;
