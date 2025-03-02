const conexion = require("../database");

const getPlanPagosByIdSolicitud = (req, res) => {
  let query = 'select porcentaje_interes from categoria_personas where categoria_persona_id = ?'
  conexion.query(query,[req.query.catId],(err,results)=>{

    if (err) {
      return res
        .status(500)
        .json({ msg: "Error al realizar la transaccion", err });
    }
    const comision_porcentual_ganancia = results[0].porcentaje_interes

    let query = `select * from plan_pagos where solicitud_inv_id = ${req.params.id}`;
    conexion.query(query, (err, results) => {
      if (err) {
        return res
          .status(500)
          .json({ msg: "Error al realizar la transaccion", err });
      }
      const pagados = results.filter(
        (pago) => pago.estado_pago == "Pagado"
      ).length;
      const sigPago =
        results.findIndex((pago) => pago.estado_pago == "Pendiente") + 1 ||
        "Sin pagos Disponibles";
        const cantidadPagada = results
        .filter((pago) => pago.estado_pago == "Pagado")
        .reduce((suma, pago) => suma + parseFloat(pago.monto_pago), 0);
      const porcentaje = ((pagados / results.length) * 100).toFixed(2);
      res.status(200).json({
        results,
        pagados,
        sigPago,
        porcentaje,
        cantidadPagada,
        comision_porcentual_ganancia
      });
    });
  })
};

const pagarCuota = (req, res) => {
  const {
    totalPagos,
    pago,
    inversores,
    comision_porcentual,
    numPago,
  } = req.body;
  const gananciaPagina = (comision_porcentual / 100) * pago.monto_pago;
  const currentDate = new Date();
  //fecha_solicitud = fecha de deposito o creacion
  let query = `SELECT 
    SUM(CASE WHEN tipo = 'Ingreso' THEN CAST(token AS DECIMAL) ELSE 0 END) - 
    SUM(CASE WHEN tipo = 'Egreso' THEN CAST(token AS DECIMAL) ELSE 0 END) AS saldo_total
     FROM movimientos 
     WHERE usuario_id = ?;`;
  conexion.query(query, [pago.cliente_id], (err, results) => {
    if (err) {
      return res.status(500).json({ err });
    }
    if (parseFloat(results[0].saldo_total) < parseFloat(pago.monto_pago)) {
     console.log(parseFloat(results[0].saldo_total), parseFloat(pago.monto_pago));
     return res.status(400).json({ msg: "Fondos insuficientes" });
 }
    query = `insert into movimientos (tipo,descripcion,fecha_solicitud,usuario_id,token) values ('Ingreso','Ganancia web',?,?,?)`;
    conexion.query(
      query,
      [currentDate, 150, gananciaPagina],
      (err, results) => {
        if (err) {
          return res
            .status(500)
            .json({ msg: "Error al realizar la transaccion", err });
        }
        query = `update plan_pagos set estado_pago='Pagado', fecha_pagada=? where solicitud_inv_id =? and cliente_id =? and num_pago = ?`;
        conexion.query(
          query,
          [currentDate, pago.solicitud_inv_id, pago.cliente_id, numPago],
          (err, results) => {
            if (err) {
              return res
                .status(500)
                .json({ msg: "Error al actualizar el plan de pago", err });
            }
            inversores.forEach((inv,i) => {
              query = `SELECT monto FROM inversiones WHERE solicitud_inv_id = ? AND inversor_id = ?`
              console.log(pago.solicitud_inv_id,inv.inversor_id);
              conexion.query(query,[pago.solicitud_inv_id,inv.inversor_id],(err,results)=>{
                if (err) {
                  return res
                    .status(500)
                    .json({ msg: "Error al actualizar el plan de pago", err });
                }
                console.log(results);
                let montoApagar = ((parseFloat(results[0].monto*(comision_porcentual/100)))+results[0].monto)/totalPagos;
                console.log(montoApagar);
                query = `insert into movimientos (tipo,descripcion,usuario_id,token) values ('Ingreso','Tokens invertidos',?,?)`;
              conexion.query(
                query,
                [inv.inversor_id, montoApagar],
                (err, results) => {
                  if (err) {
                    console.error("Error al generar los movimientos", err);
                    return;
                  }
                }
              );
              })
            });
            query = `insert into movimientos (tipo,descripcion,usuario_id,token) values ('Egreso','Pago cuota',?,?)`;
            conexion.query(
              query,
              [pago.cliente_id, pago.monto_pago],
              (err, results) => {
                if (err) {
                  console.error("Error al generar los movimientos", err);
                  return;
                }
                if (totalPagos == numPago) {
                  query = `update solicitudes_inversion set estado_inversion = 'Finalizado' where id =?`;
                  conexion.query(
                    query,
                    [pago.solicitud_inv_id],
                    (err, results) => {
                      if (err) {
                        console.error("Error al generar los movimientos", err);
                        return;
                      }
                      return res
                        .status(200)
                        .json({ msg: "Transaccion finalizada" });
                    }
                  );
                } else {
                  return res
                    .status(200)
                    .json({ msg: "Transaccion finalizadp" });
                }
              }
            );
          }
        );
      }
    );
  });
};

module.exports = {
  getPlanPagosByIdSolicitud,
  pagarCuota,
};
