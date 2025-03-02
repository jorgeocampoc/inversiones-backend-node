const connection = require('../database.js');

const executeQuery = (query, params) => {
    return new Promise((resolve, reject) => {
        connection.query(query, params, (err, results) => {
            if (err) reject(err);
            else resolve(results);
        });
    });
};

const checkInvestmentRequest = async (req, res) => {
    try {
        const query = `
            SELECT * FROM solicitudes_inversion 
            WHERE fecha_fin_recaudacion < CURDATE() 
                AND estado_inversion != 'Rechazado' AND estado = 1
        `;
        const results = await executeQuery(query);

        if (results.length > 0) {
            console.log('Solicitudes vencidas encontradas.');
            await Promise.all(results.map(verifyInvestmentRequest));
        }

        res.status(200).json({
            data: results,
            message: "Solicitudes vencidas procesadas",
        });
    } catch (err) {
        console.error("Error procesando solicitudes:", err);
        res.status(500).send({
            error: err.message,
            message: "Error procesando solicitudes vencidas",
        });
    }
};

const verifyInvestmentRequest = async (data) => {
    try {
        const query = `
            SELECT SUM(monto) AS total
            FROM inversiones
            WHERE solicitud_inv_id = ? AND estado = 1
        `;
        const results = await executeQuery(query, [data.id]);
        const total = results[0]?.total || 0;

        if (total == data.monto) {
            console.log("Monto suficiente. Aprobando solicitud...");
            await changeStatusInvestmentRequest(data);
        } else {
            console.log("Monto insuficiente. Revirtiendo solicitud...");
            await revertInvestmentRequest(data);
        }
    } catch (err) {
        console.error("Error verificando solicitud:", err);
    }
};

const revertInvestmentRequest = async (data) => {
    try {
        const updateQuery = `
            UPDATE solicitudes_inversion 
            SET aprobado = 'Rechazado'
            WHERE id = ?
        `;
        await executeQuery(updateQuery, [data.id]);

        const query = `
            SELECT * FROM inversiones
            WHERE solicitud_inv_id = ? AND estado = 1
        `;
        const results = await executeQuery(query, [data.id]);

        if (results.length > 0) {
            await Promise.all(results.map(revertInvestment));
        } else {
            console.log("No hay inversiones para revertir.");
        }
    } catch (err) {
        console.error("Error revirtiendo solicitud:", err);
    }
};

const revertInvestment = async (data) => {
    try {
        const updateQuery = `
            UPDATE inversiones
            SET estado = 0
            WHERE inversion_id = ?
        `;
        const insertMovimientoQuery = `
            INSERT INTO movimientos (tipo, monto, descripcion, fecha_solicitud,
                estado, usuario_id, token)
            VALUES ('ingreso', ?, 'reversion', NOW(), 1, ?, ?)
        `;
        await executeQuery(updateQuery, [data.inversion_id]);
        await executeQuery(insertMovimientoQuery, [data.monto, data.inversor_id, data.token]);

        console.log(`Inversión ${data.inversion_id} revertida.`);
    } catch (err) {
        console.error(`Error revirtiendo inversión ${data.inversion_id}:`, err);
    }
};

const changeStatusInvestmentRequest = async (data) => {
    try {
        const query = `
            UPDATE solicitudes_inversion 
            SET aprobado = 'Aprobado'
            WHERE id = ?
        `;
        await executeQuery(query, [data.id]);
        console.log("Solicitud aprobada.");
    } catch (err) {
        console.error("Error aprobando solicitud:", err);
    }
};

module.exports = {
    checkInvestmentRequest,
};