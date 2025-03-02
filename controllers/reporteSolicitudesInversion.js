const conexion = require('../database');

const getInversionesReversion = (req, res) => {
    const porPagina = 10;
    const pagina = parseInt(req.query.page, 10) || 1;
    const salto = (pagina - 1) * porPagina;
    const estado_inversion = 'Reversion';

    const queryFilas = `
    SELECT COUNT(DISTINCT si.id) AS numFilas
    FROM solicitudes_inversion si
    WHERE si.estado_inversion = ?
  `;

    conexion.query(queryFilas, [estado_inversion], (err, results) => {
        if (err) {
            return res.status(500).json({ msg: "Error al contar las solicitudes de inversión", err });
        }

        const numFilas = results[0].numFilas;

        if (numFilas === 0) {
            return res.status(200).json({
                data: {
                    solicitudes_inversion: [],
                    paginacion: {
                        total: 0,
                        current: pagina,
                        pages: [],
                    }
                }
            });
        }

        const numPaginas = Math.ceil(numFilas / porPagina);
        const query = `
      SELECT
        si.*,
        u_cliente.nombre AS cliente_nombre,
        u_cliente.apellido AS cliente_apellido,
        COALESCE(JSON_ARRAYAGG(
          CASE WHEN i.inversor_id IS NOT NULL
            THEN JSON_OBJECT(
              'nombre', u_inversor.nombre,
              'apellido', u_inversor.apellido,
              'inversor_id', i.inversor_id,
              'monto_invertido', i.monto,
              'fecha_deposito', i.fecha_deposito
            )
            ELSE NULL
          END
        ), '[]') AS inversores_data
      FROM solicitudes_inversion si
      LEFT JOIN usuarios u_cliente ON si.cliente_id = u_cliente.usuario_id
      LEFT JOIN inversiones i ON si.id = i.solicitud_inv_id
      LEFT JOIN usuarios u_inversor ON i.inversor_id = u_inversor.usuario_id
      WHERE si.estado_inversion = ?
      GROUP BY si.id
      LIMIT ? OFFSET ?
    `;

        conexion.query(query, [estado_inversion, porPagina, salto], (err, solicitudes) => {

            if (err) {
                return res.status(500).json({ msg: "Error al obtener las solicitudes de inversión", err });
            }

            const data = {
                solicitudes_inversion: solicitudes.map(si => ({
                    id: si.id,
                    cliente_id: si.cliente_id,
                    nombre: si.nombre,
                    descripcion: si.descripcion,
                    fecha_inicio_recaudacion: si.fecha_inicio_recaudacion,
                    fecha_fin_recaudacion: si.fecha_fin_recaudacion,
                    monto: si.monto,
                    cantidad_pagos: si.cantidad_pagos,
                    fecha_inicio_pago: si.fecha_inicio_pago,
                    fecha_fin_pago: si.fecha_fin_pago,
                    aprobado: si.aprobado,
                    estado: si.estado,
                    observaciones: si.observaciones,
                    estado_inversion: si.estado_inversion,
                    cliente: {
                        nombre: si.cliente_nombre,
                        apellido: si.cliente_apellido
                    },
                    inversores: si.inversores_data[0]?.inversor_id === null ? [] :
                        (Array.isArray(si.inversores_data) ? si.inversores_data : JSON.parse(si.inversores_data || '[]'))
                })),
                paginacion: {
                    total: numFilas,
                    current: pagina,
                    pages: Array.from({ length: numPaginas }, (_, i) => i + 1),
                    perPage: porPagina,
                    previous: pagina > 1 ? pagina - 1 : null,
                    next: pagina < numPaginas ? pagina + 1 : null
                }
            };

            res.status(200).json({ data });
        });
    });
};
const getInversionesProceso = (req, res) => {
    const porPagina = 10;
    const pagina = parseInt(req.query.page, 10) || 1;
    const salto = (pagina - 1) * porPagina;
    const estado_inversion = 'Proceso';

    const queryFilas = `
    SELECT COUNT(DISTINCT si.id) AS numFilas
    FROM solicitudes_inversion si
    WHERE si.estado_inversion = ?
  `;

    conexion.query(queryFilas, [estado_inversion], (err, results) => {
        if (err) {
            return res.status(500).json({ msg: "Error al contar las solicitudes de inversión", err });
        }

        const numFilas = results[0].numFilas;

        if (numFilas === 0) {
            return res.status(200).json({
                data: {
                    solicitudes_inversion: [],
                    paginacion: {
                        total: 0,
                        current: pagina,
                        pages: [],
                    }
                }
            });
        }

        const numPaginas = Math.ceil(numFilas / porPagina);
        const query = `
      SELECT
        si.*,
        u_cliente.nombre AS cliente_nombre,
        u_cliente.apellido AS cliente_apellido,
        COALESCE(JSON_ARRAYAGG(
          CASE WHEN i.inversor_id IS NOT NULL
            THEN JSON_OBJECT(
              'nombre', u_inversor.nombre,
              'apellido', u_inversor.apellido,
              'inversor_id', i.inversor_id,
              'monto_invertido', i.monto,
              'fecha_deposito', i.fecha_deposito
            )
            ELSE NULL
          END
        ), '[]') AS inversores_data
      FROM solicitudes_inversion si
      LEFT JOIN usuarios u_cliente ON si.cliente_id = u_cliente.usuario_id
      LEFT JOIN inversiones i ON si.id = i.solicitud_inv_id
      LEFT JOIN usuarios u_inversor ON i.inversor_id = u_inversor.usuario_id
      WHERE si.estado_inversion = ?
      GROUP BY si.id
      LIMIT ? OFFSET ?
    `;

        conexion.query(query, [estado_inversion, porPagina, salto], (err, solicitudes) => {
            if (err) {
                return res.status(500).json({ msg: "Error al obtener las solicitudes de inversión", err });
            }

            const data = {
                solicitudes_inversion: solicitudes.map(si => ({
                    id: si.id,
                    cliente_id: si.cliente_id,
                    nombre: si.nombre,
                    descripcion: si.descripcion,
                    fecha_inicio_recaudacion: si.fecha_inicio_recaudacion,
                    fecha_fin_recaudacion: si.fecha_fin_recaudacion,
                    monto: si.monto,
                    cantidad_pagos: si.cantidad_pagos,
                    fecha_inicio_pago: si.fecha_inicio_pago,
                    fecha_fin_pago: si.fecha_fin_pago,
                    aprobado: si.aprobado,
                    estado: si.estado,
                    observaciones: si.observaciones,
                    estado_inversion: si.estado_inversion,
                    cliente: {
                        nombre: si.cliente_nombre,
                        apellido: si.cliente_apellido
                    },
                    inversores: si.inversores_data[0]?.inversor_id === null ? [] :
                        (Array.isArray(si.inversores_data) ? si.inversores_data : JSON.parse(si.inversores_data || '[]'))
                })),
                paginacion: {
                    total: numFilas,
                    current: pagina,
                    pages: Array.from({ length: numPaginas }, (_, i) => i + 1),
                    perPage: porPagina,
                    previous: pagina > 1 ? pagina - 1 : null,
                    next: pagina < numPaginas ? pagina + 1 : null
                }
            };

            res.status(200).json({ data });
        });
    });
};

const getInversionesPendientes = (req, res) => {
    const porPagina = 10;
    const pagina = parseInt(req.query.page, 10) || 1;
    const salto = (pagina - 1) * porPagina;
    const estado_inversion = 'Pendiente';

    const queryFilas = `
    SELECT COUNT(DISTINCT si.id) AS numFilas
    FROM solicitudes_inversion si
    WHERE si.estado_inversion = ?
  `;

    conexion.query(queryFilas, [estado_inversion], (err, results) => {
        if (err) {
            return res.status(500).json({ msg: "Error al contar las solicitudes de inversión", err });
        }

        const numFilas = results[0].numFilas;

        if (numFilas === 0) {
            return res.status(200).json({
                data: {
                    solicitudes_inversion: [],
                    paginacion: {
                        total: 0,
                        current: pagina,
                        pages: [],
                    }
                }
            });
        }

        const numPaginas = Math.ceil(numFilas / porPagina);

        const query = `
      SELECT
        si.*,
        u_cliente.nombre AS cliente_nombre,
        u_cliente.apellido AS cliente_apellido,
        COALESCE(JSON_ARRAYAGG(
          CASE WHEN i.inversor_id IS NOT NULL
            THEN JSON_OBJECT(
              'nombre', u_inversor.nombre,
              'apellido', u_inversor.apellido,
              'inversor_id', i.inversor_id,
              'monto_invertido', i.monto,
              'fecha_deposito', i.fecha_deposito
            )
            ELSE NULL
          END
        ), '[]') AS inversores_data
      FROM solicitudes_inversion si
      LEFT JOIN usuarios u_cliente ON si.cliente_id = u_cliente.usuario_id
      LEFT JOIN inversiones i ON si.id = i.solicitud_inv_id
      LEFT JOIN usuarios u_inversor ON i.inversor_id = u_inversor.usuario_id
      WHERE si.estado_inversion = ?
      GROUP BY si.id
      LIMIT ? OFFSET ?
    `;

        conexion.query(query, [estado_inversion, porPagina, salto], (err, solicitudes) => {
            if (err) {
                return res.status(500).json({ msg: "Error al obtener las solicitudes de inversión", err });
            }

            const data = {
                solicitudes_inversion: solicitudes.map(si => ({
                    id: si.id,
                    cliente_id: si.cliente_id,
                    nombre: si.nombre,
                    descripcion: si.descripcion,
                    fecha_inicio_recaudacion: si.fecha_inicio_recaudacion,
                    fecha_fin_recaudacion: si.fecha_fin_recaudacion,
                    monto: si.monto,
                    cantidad_pagos: si.cantidad_pagos,
                    fecha_inicio_pago: si.fecha_inicio_pago,
                    fecha_fin_pago: si.fecha_fin_pago,
                    aprobado: si.aprobado,
                    estado: si.estado,
                    observaciones: si.observaciones,
                    estado_inversion: si.estado_inversion,
                    cliente: {
                        nombre: si.cliente_nombre,
                        apellido: si.cliente_apellido
                    },
                    inversores: si.inversores_data[0]?.inversor_id === null ? [] :
                        (Array.isArray(si.inversores_data) ? si.inversores_data : JSON.parse(si.inversores_data || '[]'))
                })),
                paginacion: {
                    total: numFilas,
                    current: pagina,
                    pages: Array.from({ length: numPaginas }, (_, i) => i + 1),
                    perPage: porPagina,
                    previous: pagina > 1 ? pagina - 1 : null,
                    next: pagina < numPaginas ? pagina + 1 : null
                }
            };

            res.status(200).json({ data });
        });
    });
};

const getInversionesFinalizado = (req, res) => {
    const porPagina = 10;
    const pagina = parseInt(req.query.page, 10) || 1;
    const salto = (pagina - 1) * porPagina;
    const estado_inversion = 'Finalizado';

    const queryFilas = `
    SELECT COUNT(DISTINCT si.id) AS numFilas
    FROM solicitudes_inversion si
    WHERE si.estado_inversion = ?
  `;

    conexion.query(queryFilas, [estado_inversion], (err, results) => {
        if (err) {
            return res.status(500).json({ msg: "Error al contar las solicitudes de inversión", err });
        }

        const numFilas = results[0].numFilas;

        if (numFilas === 0) {
            return res.status(200).json({
                data: {
                    solicitudes_inversion: [],
                    paginacion: {
                        total: 0,
                        current: pagina,
                        pages: [],
                    }
                }
            });
        }

        const numPaginas = Math.ceil(numFilas / porPagina);
        const query = `
      SELECT
        si.*,
        u_cliente.nombre AS cliente_nombre,
        u_cliente.apellido AS cliente_apellido,
        COALESCE(JSON_ARRAYAGG(
          CASE WHEN i.inversor_id IS NOT NULL
            THEN JSON_OBJECT(
              'nombre', u_inversor.nombre,
              'apellido', u_inversor.apellido,
              'inversor_id', i.inversor_id,
              'monto_invertido', i.monto,
              'fecha_deposito', i.fecha_deposito
            )
            ELSE NULL
          END
        ), '[]') AS inversores_data
      FROM solicitudes_inversion si
      LEFT JOIN usuarios u_cliente ON si.cliente_id = u_cliente.usuario_id
      LEFT JOIN inversiones i ON si.id = i.solicitud_inv_id
      LEFT JOIN usuarios u_inversor ON i.inversor_id = u_inversor.usuario_id
      WHERE si.estado_inversion = ?
      GROUP BY si.id
      LIMIT ? OFFSET ?
    `;

        conexion.query(query, [estado_inversion, porPagina, salto], (err, solicitudes) => {
            if (err) {
                return res.status(500).json({ msg: "Error al obtener las solicitudes de inversión", err });
            }

            const data = {
                solicitudes_inversion: solicitudes.map(si => ({
                    id: si.id,
                    cliente_id: si.cliente_id,
                    nombre: si.nombre,
                    descripcion: si.descripcion,
                    fecha_inicio_recaudacion: si.fecha_inicio_recaudacion,
                    fecha_fin_recaudacion: si.fecha_fin_recaudacion,
                    monto: si.monto,
                    cantidad_pagos: si.cantidad_pagos,
                    fecha_inicio_pago: si.fecha_inicio_pago,
                    fecha_fin_pago: si.fecha_fin_pago,
                    aprobado: si.aprobado,
                    estado: si.estado,
                    observaciones: si.observaciones,
                    estado_inversion: si.estado_inversion,
                    cliente: {
                        nombre: si.cliente_nombre,
                        apellido: si.cliente_apellido
                    },
                    inversores: si.inversores_data[0]?.inversor_id === null ? [] :
                        (Array.isArray(si.inversores_data) ? si.inversores_data : JSON.parse(si.inversores_data || '[]'))
                })),
                paginacion: {
                    total: numFilas,
                    current: pagina,
                    pages: Array.from({ length: numPaginas }, (_, i) => i + 1),
                    perPage: porPagina,
                    previous: pagina > 1 ? pagina - 1 : null,
                    next: pagina < numPaginas ? pagina + 1 : null
                }
            };

            res.status(200).json({ data });
        });
    });
};

module.exports = {
    getInversionesReversion,
    getInversionesPendientes,
    getInversionesProceso,
    getInversionesFinalizado
};