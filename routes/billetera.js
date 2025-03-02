var express = require("express");
var router = express.Router();
var connection = require("../database");

router.get("/valores", function (req, res, next) {
  var query = ` SELECT valor_token, tiempo_minimo_inversion as tiempo_inversion, comision_porcentual_ganancia AS porcentaje_inversion, comision_porcentual_retiro AS comision_retiros
                FROM ajustes
                WHERE valor_token IS NOT NULL
                ORDER BY ajuste_id DESC LIMIT 1;`;
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
        message: "Valor del token consultada correctamente",
      });
    }
  });
});

router.post("/comprarTokens", function (req, res, next) {
  const { usuario_id, tokens, monto, tipo, descripcion, estado } = req.body;

  var query = ` INSERT INTO movimientos (tipo, monto, descripcion, fecha_solicitud, fecha_desembolso, token, usuario_id, inversiones_id, solicitudes_retiro_id, estado)
                VALUES ('${tipo}', '${monto}', '${descripcion}', CURRENT_TIMESTAMP(), NULL, '${tokens}', '${usuario_id}', NULL, NULL, '${estado}');`;

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
        message: "Tokens comprados correctamente",
      });
    }
  });
});

router.get("/dolaresInversionista/:id", function (req, res, next) {
  var query = ` SELECT SUM(monto) as totalUsd
                FROM movimientos
                WHERE usuario_id =${req.params.id};`;
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
        message: "Dólares del inversionista consultada correctamente",
      });
    }
  });
});

router.get("/totalTokens/:id", function (req, res, next) {

  var query = ` 
SELECT 
    t.tipo, 
    COALESCE(SUM(m.token), 0) AS token
FROM 
    (SELECT 'Egreso' AS tipo
     UNION ALL 
     SELECT 'Ingreso' AS tipo) t
LEFT JOIN movimientos m
ON t.tipo = m.tipo AND m.usuario_id = ${req.params.id} AND m.estado = 1
GROUP BY t.tipo
ORDER BY t.tipo DESC;`;
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
        message: "Tokens del inversionista consultada correctamente",
      });
    }
  });
});

router.get("/tokensInversionistaComprados/:id", function (req, res, next) {
  var query = ` SELECT SUM(token) as totalTokensComprados
                FROM movimientos
                WHERE usuario_id =${req.params.id}
                AND tipo = 'Ingreso';`;
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
        message: "Tokens del inversionista consultada correctamente",
      });
    }
  });
});

router.get("/tokensInversionistaInvertidos/:id", function (req, res, next) {
  var query = ` SELECT SUM(token) as totalTokensInvertidos
                FROM movimientos
                WHERE usuario_id =${req.params.id}
                AND tipo = 'Egreso';`;
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
        message: "Tokens del inversionista consultada correctamente",
      });
    }
  });
});

router.post("/invertirTokens", function (req, res, next) {
  const {
    usuario_id,
    cliente_id,
    inversor_id,
    monto,
    token,
    tipo,
    descripcion,
    ganancia_estimada,
    fecha_devolucion,
    id_inv
  } = req.body;

  let checkMontoQuery = `
    SELECT 
      s.monto as monto_solicitado,
      COALESCE(SUM(i.monto), 0) as monto_invertido
    FROM solicitudes_inversion s
    LEFT JOIN inversiones i ON i.solicitud_inv_id = s.id
    WHERE s.id = ?
    GROUP BY s.id, s.monto`;

  connection.query(checkMontoQuery, [id_inv], (err, results) => {
    if (err) {
      return res.status(500).json({
        error: err,
        message: 'Error al verificar montos'
      });
    }

    const montoSolicitado = results[0].monto_solicitado;
    const montoInvertido = results[0].monto_invertido;
    const montoRestante = montoSolicitado - montoInvertido;

    if (monto > montoRestante) {
      return res.status(400).json({
        message: `El monto a invertir excede el monto restante disponible. Máximo disponible: ${montoRestante}`
      });
    }

    let getData = `SELECT 
    monto, 
    inversion_id
    FROM 
        inversiones
    WHERE 
    inversor_id = ? 
    AND solicitud_inv_id = ?;`
    connection.query(getData, [inversor_id, id_inv], (err, results) => {
      if (err) {
        return res.status(500).json({ err, msg: 'Error en la transaccion' })
      }
      const id_2 = results[0]?.inversion_id
      const monto2 = monto + parseFloat(results[0]?.monto);
      console.log('pruebaaaaaaaaaaaaa', results.length === 0, ' logintudddddddd', results.length);
      var query = (results.length === 0) ? ` INSERT INTO inversiones (cliente_id, inversor_id, monto, fecha_deposito, ganancia_estimada, fecha_devolucion,solicitud_inv_id)
                VALUES ('${cliente_id}', '${inversor_id}', '${monto}', CURRENT_TIMESTAMP(), '${ganancia_estimada}', '${fecha_devolucion}','${id_inv}');`
        :
        `
                update inversiones set monto=${monto2} where  inversor_id = ${inversor_id} and solicitud_inv_id = ${id_inv}
                `;
      connection.query(query, function (error, results, fields) {
        if (error) {
          console.log(error);
          res.status(500).send({
            error: error,
            message: "Error al realizar la petición",
          });
        } else {
          const inversion_id = results.insertId || id_2;
          var queryTokenInversionista = ` INSERT INTO movimientos (tipo, descripcion, fecha_solicitud, fecha_desembolso, token, usuario_id, inversiones_id, solicitudes_retiro_id)
                VALUES ('${tipo}', '${descripcion}', CURRENT_TIMESTAMP(), NULL, '${token}', '${usuario_id}', '${inversion_id}', NULL);`;

          connection.query(
            queryTokenInversionista,
            function (error, results, fields) {
              if (error) {
                console.log(error);
                res.status(500).send({
                  error: error,
                  message: "Error al realizar la petición",
                });
              } else {
                var queryTokenCliente = ` INSERT INTO movimientos (tipo, descripcion, fecha_solicitud, fecha_desembolso, token, usuario_id, inversiones_id, solicitudes_retiro_id)
          VALUES ('Ingreso', 'Inversión recibida', CURRENT_TIMESTAMP(), NULL, '${token}', '${cliente_id}', '${inversion_id}', NULL);`;

                connection.query(
                  queryTokenCliente,
                  function (error, results, fields) {
                    if (error) {
                      console.log(error);
                      res.status(500).send({
                        error: error,
                        message: "Error al realizar la petición",
                      });
                    }
                  }
                );
              }
            }
          );
          res.status(200).send({
            data: results.insertId,
            message: "inversion realizada",
          });
        }
      });
    })
  });
});



router.get("/tokensClienteRecibido/:id", function (req, res, next) {
  var query = `WITH movimientos_resumen AS (
    SELECT 
        usuario_id,
        SUM(CASE WHEN tipo = 'Ingreso' THEN token ELSE 0 END) AS tokensRecibidosCliente,
        SUM(CASE WHEN tipo = 'Egreso' THEN token ELSE 0 END) AS tokensEgresadosCliente
    FROM movimientos
    WHERE usuario_id = ${req.params.id}
    GROUP BY usuario_id
)
SELECT 
    tokensRecibidosCliente,
    tokensEgresadosCliente,
    (tokensRecibidosCliente - tokensEgresadosCliente) AS tokensTotal
FROM movimientos_resumen;`;
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
        message: "Tokens del inversionista consultada correctamente",
      });
    }
  });
});

router.get("/tokensDeudasCliente/:id", function (req, res, next) {
  var query = `
  SELECT SUM(ganancia_estimada) AS totalTokensDeudas 
  FROM inversiones
  WHERE cliente_id=${req.params.id}
  AND estado = 1
`;
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
        message: "Tokens del inversionista consultada correctamente",
      });
    }
  });
});

router.get("/tokensGananciasInversionista/:id", function (req, res, next) {
  var query = `
  SELECT SUM(ganancia_estimada) AS gananciaTokens 
  FROM inversiones
  WHERE inversor_id=${req.params.id}
  AND estado = 1
`;
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
        message: "Tokens del inversionista consultada correctamente",
      });
    }
  });
});

router.post("/solicitarRetiro", function (req, res, next) {
  const {
    tipo,
    usuario_id,
    monto_solicitud,
    tokens_cambio,
    comision_aplicar,
    monto_recibir,
    estado,
  } = req.body;

  var query = ` INSERT INTO solicitudes_retiro (tipo, usuario_id, monto_solicitud, tokens_cambio, comision_aplicar, monto_recibir, estado, fecha_solicitud)
                VALUES ('${tipo}', '${usuario_id}', '${monto_solicitud}', '${tokens_cambio}', '${comision_aplicar}', '${monto_recibir}', '${estado}', CURRENT_TIMESTAMP());`;

  connection.query(query, function (error, results, fields) {
    if (error) {
      console.log(error);
      res.status(500).send({
        error: error,
        message: "Error al realizar la petición",
      });
    } else {
      const solicitud_id = results.insertId;
      var queryMovimientoToken = ` INSERT INTO movimientos (tipo, descripcion, fecha_solicitud, fecha_desembolso, token, usuario_id, inversiones_id, solicitudes_retiro_id)
                                      VALUES ('Egreso', 'Por solicitud de retiro', CURRENT_TIMESTAMP(), NULL, '${tokens_cambio}', '${usuario_id}', NULL, '${solicitud_id}');`;

      connection.query(
        queryMovimientoToken,
        function (error, results, fields) {
          if (error) {
            console.log(error);
            res.status(500).send({
              error: error,
              message: "Error al realizar la petición",
            });
          } else {
            res.status(200).send({
              data: results,
              message: "Solicitud realizada correctamente",
            });
          }
        }
      );
    }
  });
});

module.exports = router;
