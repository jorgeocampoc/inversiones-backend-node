const conexion = require("../database");

const getInversionesReversion = (req, res) => {
    // Parámetros de paginación
    const porPagina = 10; // Número de resultados por página
    const pagina = parseInt(req.query.page, 10) || 1; // Página actual
    const salto = (pagina - 1) * porPagina; // Calcular el número de resultados a saltar

    // Consulta para contar el número total de clientes únicos
    const queryFilas = `
        SELECT COUNT(DISTINCT si.cliente_id) AS numFilas
        FROM solicitudes_inversion si
        WHERE si.estado_inversion = 'Reversion'
    `;

    conexion.query(queryFilas, (err, results) => {
        if (err) {
            return res.status(500).json({ msg: "Error al contar los clientes únicos", err });
        }

        const numFilas = results[0].numFilas;
        const numPaginas = Math.ceil(numFilas / porPagina);

        // Consulta para obtener los IDs de los clientes únicos con paginación
        const queryClientes = `
            SELECT DISTINCT si.cliente_id, u_cliente.nombre AS cliente_nombre, u_cliente.apellido AS cliente_apellido
            FROM solicitudes_inversion si
            JOIN usuarios u_cliente ON si.cliente_id = u_cliente.usuario_id
            WHERE si.estado_inversion = 'Reversion'
            ORDER BY si.cliente_id
            LIMIT ${salto}, ${porPagina}
        `;

        conexion.query(queryClientes, (err, clientes) => {
            if (err) {
                return res.status(500).json({ msg: "Error al obtener los clientes", err });
            }

            if (clientes.length === 0) {
                const paginacion = {
                    total: 0,
                    current: pagina,
                    pages: [],
                    perPage: porPagina,
                    previous: null,
                    next: null,
                };
                return res.status(200).json({ inversionesPorCliente: {}, paginacion });
            }

            // Extraer los IDs y nombres de los clientes obtenidos
            const clienteIds = clientes.map(cliente => cliente.cliente_id);
            const clienteNombreApellido = clientes.reduce((acc, cliente) => {
                acc[cliente.cliente_id] = `${cliente.cliente_nombre} ${cliente.cliente_apellido}`;
                return acc;
            }, {});

            const clienteIdString = clienteIds.join(',');

            // Consulta principal con los IDs de los clientes únicos obtenidos
            const query = `
                SELECT i.inversion_id, i.monto, i.fecha_deposito, 
                       u_cliente.usuario_id, u_cliente.nombre AS cliente_nombre, u_cliente.apellido AS cliente_apellido, 
                       u_inversor.nombre AS inversor_nombre, u_inversor.apellido AS inversor_apellido
                FROM inversiones i
                JOIN solicitudes_inversion si ON i.cliente_id = si.cliente_id
                JOIN usuarios u_cliente ON i.cliente_id = u_cliente.usuario_id
                JOIN usuarios u_inversor ON i.inversor_id = u_inversor.usuario_id
                WHERE si.estado_inversion = 'Reversion' AND si.cliente_id IN (${clienteIdString})
                ORDER BY si.cliente_id;
            `;

            conexion.query(query, (err, results) => {
                if (err) {
                    return res.status(500).json({ msg: "Error al obtener las inversiones reversion", err });
                }

                // Reestructurar el resultado para agrupar por cliente_id
                const inversionesPorCliente = clienteIds.reduce((acc, cliente_id) => {
                    const cliente_inversiones = results.filter(inversion => inversion.usuario_id === cliente_id);
                    const cliente_key = clienteNombreApellido[cliente_id];

                    acc[cliente_key] = cliente_inversiones.length > 0
                        ? cliente_inversiones.map(inversion => ({
                            inversion_id: inversion.inversion_id,
                            monto: inversion.monto,
                            fecha_deposito: inversion.fecha_deposito,
                            inversor_nombre: inversion.inversor_nombre,
                            inversor_apellido: inversion.inversor_apellido,
                        }))
                        : [];

                    return acc;
                }, {});

                const paginas = Array.from({ length: numPaginas }, (_, i) => i + 1);

                const paginacion = {
                    total: numFilas,
                    current: pagina,
                    pages: paginas,
                    perPage: porPagina,
                    previous: pagina > 1 ? pagina - 1 : null,
                    next: pagina < numPaginas ? pagina + 1 : null,
                };

                res.status(200).json({ inversionesPorCliente, paginacion });
            });
        });
    });
};

module.exports = {
    getInversionesReversion,
};

