var express = require("express");
var router = express.Router();
var connection = require("../database");

router.get("/usuariosCantidad", function (req, res, next) {
  var query = ` SELECT rol, COUNT(*) AS cantidad FROM usuarios GROUP BY rol;`;
  connection.query(query, function (error, results, fields) {
    if (error) {
      console.log(error);
      res.status(500).send({
        error: error,
        message: "Error al realizar la petición",
      });
    } else {
      res.status(200).send({
        data: results,
        message: "Cantidad de usuarios consultados correctamente",
      });
    }
  });
});

router.get("/solicitudesCantidad", function (req, res, next) {
  var query = ` SELECT estado, COUNT(*) AS cantidad FROM solicitudes_retiro GROUP BY estado;`;
  connection.query(query, function (error, results, fields) {
    if (error) {
      console.log(error);
      res.status(500).send({
        error: error,
        message: "Error al realizar la petición",
      });
    } else {
      res.status(200).send({
        data: results,
        message: "Cantidad de inversiones consultados correctamente",
      });
    }
  });
});

router.get("/tokensInvertidos", function (req, res, next) {
  var query = `
    SELECT SUM(token) AS tokens_invertidos 
    FROM movimientos
    WHERE descripcion = 'Tokens invertidos';
  `;
  
  connection.query(query, function (error, results, fields) {
    if (error) {
      console.log(error);
      res.status(500).send({
        error: error,
        message: "Error al realizar la petición",
      });
    } else {
      if (results.length > 0) {
        res.status(200).send(results[0]); 
      } else {
        res.status(404).send({
          message: "No se encontraron resultados",
        });
      }
    }
  });
});

router.get("/sumaComisiones", function (req, res, next) {
  var query = `SELECT estado,SUM(comision_aplicar) AS total_comisiones FROM solicitudes_retiro GROUP BY estado;`;
  connection.query(query, function (error, results, fields) {
    if (error) {
      console.log(error);
      res.status(500).send({
        error: error,
        message: "Error al realizar la petición",
      });
    } else {
      res.status(200).send({
        data: results,
        message: "Cantidad de inversiones consultados correctamente",
      });
    }
  });
});

router.get("/totalCompras/:id", function (req, res, next) {
  var anho = new Date().getFullYear();

  var queryCompraTokens = `
                SELECT SUM(token) as tokens_comprados, MONTH(fecha_solicitud) AS mes
                FROM movimientos
                WHERE YEAR(fecha_solicitud) = ${anho} 
                AND descripcion = 'Compra de tokens'
                AND usuario_id = ${req.params.id}
                GROUP BY MONTH(fecha_solicitud);
                `;

  connection.query(queryCompraTokens, function (error, results, fields) {
    if (error) {
      console.log(error);
      return res.status(500).send({
        error: error,
        message: "Error al realizar la petición",
      });
    } else {
      console.log(results);
      res.status(200).send({
        data: results,
        message: "Total compras por mes",
      });
    }
  });
});

router.get("/totalInversiones/:id", function (req, res, next) {
  var anho = new Date().getFullYear();

  var queryInversionToken = `
                SELECT SUM(token) as tokens_invertidos, MONTH(fecha_solicitud) AS mes
                FROM movimientos
                WHERE YEAR(fecha_solicitud) = ${anho} 
                AND descripcion = 'Tokens invertidos'
                AND usuario_id = ${req.params.id}
                GROUP BY MONTH(fecha_solicitud);
  `;

  connection.query(queryInversionToken, function (error, results, fields) {
    if (error) {
      console.log(error);
      return res.status(500).send({
        error: error,
        message: "Error al realizar la petición",
      });
    } else {
      console.log(results);
      res.status(200).send({
        data: results,
        message: "Total inversiones por mes",
      });
    }
  });
});

router.get("/totalInversionesRecibidas/:id", function (req, res, next) {
  var anho = new Date().getFullYear();

  var queryInversionToken = `
                SELECT SUM(token) as tokens_invertidos, MONTH(fecha_solicitud) AS mes
                FROM movimientos
                WHERE YEAR(fecha_solicitud) = ${anho} 
                AND descripcion = 'Inversión recibida'
                AND usuario_id = ${req.params.id}
                GROUP BY MONTH(fecha_solicitud);
  `;

  connection.query(queryInversionToken, function (error, results, fields) {
    if (error) {
      console.log(error);
      return res.status(500).send({
        error: error,
        message: "Error al realizar la petición",
      });
    } else {
      console.log(results);
      res.status(200).send({
        data: results,
        message: "Total inversiones por mes",
      });
    }
  });
});

router.get("/gananciasEstimadas/:id", function (req, res, next) {
  var anho = new Date().getFullYear();

  var query = `                              
SELECT (ganancia_estimada - monto) AS ganancia_tokens, MONTH(fecha_devolucion) AS mes
FROM inversiones
WHERE inversor_id = ${req.params.id}
AND YEAR(fecha_devolucion) = ${anho}
GROUP BY MONTH(fecha_devolucion);
`;

  connection.query(query, function (error, results, fields) {
    if (error) {
      console.log(error);
      return res.status(500).send({
        error: error,
        message: "Error al realizar la petición",
      });
    } else {
      console.log(results);
      res.status(200).send({
        data: results,
        message: "Ganacias por mes",
      });
    }
  });
});

router.get("/gananciasAprobadas", function (req, res, next) {
  var anho = new Date().getFullYear();

  var query = `                              
SELECT 
    estado, 
    MONTH(fecha_solicitud) AS mes, 
    SUM(comision_aplicar) AS total_comisiones
FROM 
    solicitudes_retiro
WHERE 
    YEAR(fecha_solicitud) = 2024
AND estado = 'Aprobado'
GROUP BY MONTH(fecha_solicitud);
`;

  connection.query(query, function (error, results, fields) {
    if (error) {
      console.log(error);
      return res.status(500).send({
        error: error,
        message: "Error al realizar la petición",
      });
    } else {
      console.log(results);
      res.status(200).send({
        data: results,
        message: "Ganacias por mes",
      });
    }
  });
});

router.get("/inversionesCantidad", function (req, res, next) {
  var query = `
  SELECT 
    CASE 
        WHEN estado = 0 THEN 'Saldado' 
        WHEN estado = 1 THEN 'Pendiente' 
        ELSE 'Otro Estado' -- Opcional: para manejar otros posibles valores
    END AS estado_descripcion, 
    COUNT(*) AS cantidad 
FROM inversiones 
GROUP BY estado_descripcion;`;
  connection.query(query, function (error, results, fields) {
    if (error) {
      console.log(error);
      res.status(500).send({
        error: error,
        message: "Error al realizar la petición",
      });
    } else {
      res.status(200).send({
        data: results,
        message: "Cantidad de inversiones consultados correctamente",
      });
    }
  });
});

module.exports = router;
