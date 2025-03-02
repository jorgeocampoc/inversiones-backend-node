const express = require('express');
const router = express.Router();
const conexion = require('../database');

// Crear movimiento
router.post('/', (req, res) => {
    const { tipo, monto, descripcion} = req.body;

    const query = 'INSERT INTO movimientos (tipo, monto, descripcion) VALUES (?, ?, ?)';
    
    conexion.query(query, [tipo, monto, descripcion ], (error, results) => {
        if (error) {
            return res.status(500).json({ error: error.message });
        }
        res.status(201).json({ message: 'Movimiento creado', id: results.insertId });
    });
});

// Leer movimientos
router.get('/', (req, res) => {
    conexion.query('SELECT * FROM movimientos', (error, results) => {
        if (error) {
            return res.status(500).json({ error: error.message });
        }
        res.status(200).json({results});
    });
});

// Actualizar movimiento
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { tipo, monto, descripcion, fecha_solicitud, fecha_desembolso } = req.body;

    const query = 'UPDATE movimientos SET tipo = ?, monto = ?, descripcion = ?, fecha_solicitud = ?, fecha_desembolso = ? WHERE movimiento_id = ?';

    conexion.query(query, [tipo, monto, descripcion, fecha_solicitud, fecha_desembolso, id], (error) => {
        if (error) {
            return res.status(500).json({ error: error.message });
        }
        res.status(200).json({ message: 'Movimiento actualizado' });
    });
});

// Eliminar movimiento
router.patch('/:id', (req, res) => {
    const { id } = req.params;

    const query = 'UPDATE movimientos SET estado = !estado WHERE movimiento_id = ?';
    
    conexion.query(query, [id], (error) => {
        if (error) {
            return res.status(500).json({ error: error.message });
        }
        res.status(200).json({ message: 'Movimiento eliminado' });
    });
});

router.get('/estado/:valor', (req, res) => {
    const { valor } = req.params;

    if (!['0', '1'].includes(valor)) {
        return res.status(400).send('Valor inválido para estado');
    }

    conexion.query('SELECT * FROM movimientos WHERE estado = ?', [valor], (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
});


module.exports = router;
