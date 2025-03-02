const db = require('../database'); 
const { response: res, request: req } = require("express");

// Función para obtener datos combinados
const postCombinedData = async (req, res) => {
  const {comision_porcentual_ganancia, comision_porcentual_retiro, tiempo_minimo_inversion, tiempo_maximo_inversion, valor_token, admin_id} = req.body;
  let query = `INSERT INTO ajustes (comision_porcentual_ganancia, comision_porcentual_retiro, tiempo_minimo_inversion, tiempo_maximo_inversion, valor_token, admin_id) VALUES (?, ?, ?, ?, ?, ?)`;
   db.query(query, [comision_porcentual_ganancia, comision_porcentual_retiro, tiempo_minimo_inversion, tiempo_maximo_inversion, valor_token, admin_id], (error, results) => {
    if (error) {
      console.error('Error al insertar datos:', error);
      res.status(500).json({ message: 'Error al insertar datos' });
    } else {
      res.status(201).json({ message: 'Ajuste creado', id: results.insertId });
    }
   }); 
  }
   const getCombinedData = async (req, res) => {
    let query = `SELECT * FROM ajustes`;
   
     db.query(query, (error, results) => {
      if (error) {
        console.error('Error al insertar datos:', error);
        res.status(500).json({ message: 'Error al insertar datos' });
      } else {
        res.status(201).json({ message: 'Ajuste creado', results: results[0]});
      }
     }); 
  };
const putCombinedData = ((req, res) => {
  const { id } = req.params;
  console.log(id);
  const { comision_fija_ganancia, comision_porcentual_ganancia, comision_fija_retiro, comision_porcentual_retiro, tiempo_minimo_inversion, tiempo_maximo_inversion, sancion_porcentual_retraso,valor_token } = req.body;

  const query = 'UPDATE ajustes SET comision_fija_ganancia = ?, comision_porcentual_ganancia = ?, comision_fija_retiro = ?, comision_porcentual_retiro = ?, tiempo_minimo_inversion = ?, tiempo_maximo_inversion = ?, sancion_porcentual_retraso = ?,valor_token = ? WHERE ajuste_id = ?';

  db.query(query, [comision_fija_ganancia, comision_porcentual_ganancia, comision_fija_retiro, comision_porcentual_retiro, tiempo_minimo_inversion, tiempo_maximo_inversion, sancion_porcentual_retraso, valor_token, id], (error) => {
      if (error) {
          return res.status(500).json({ error: error.message });
      }
      res.status(200).json({ message: 'Ajuste actualizado' });
  });
});

module.exports = { postCombinedData, getCombinedData, putCombinedData}