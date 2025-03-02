const { response: res, request: req } = require("express");
const conexion = require("../database");
const { uploadVideo } = require('../helpers/uploadVideo');

const getInformacion = (req, res) => {
  conexion.query("SELECT * FROM informacion", (error, results) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    res.status(200).json({ results });
  });
};
const postInformacion = (req, res) => {
  const { cliente_id, ocupacion, descripcion, monto_inversion, cantidad_maxima_inversiones, preparacion, estudios, vision } = req.body;

  const query =
    "INSERT INTO informacion (cliente_id, ocupacion, descripcion, monto_inversion, cantidad_maxima_inversiones, preparacion, estudios, vision) VALUES (?, ?, ?,?,?,?,?,?,)";

  conexion.query(query, [cliente_id, ocupacion, descripcion, monto_inversion, cantidad_maxima_inversiones, preparacion, estudios, vision], (error, results) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    res
      .status(201)
      .json({ message: "Informacion registrada", id: results.insertId });
  });
};

const saveVideo = (req, res) => {

  if (!req.files || Object.keys(req.files).length === 0 || !req.files.video) {
    return res.status(400).json({
      msg: "Sin archivos para subir",
    });
  }

  const videoFile = req.files.video;
  const maxSize = 100 * 1024 * 1024; // 100MB en bytes

  if (videoFile.size > maxSize) {
    return res.status(400).json({
      msg: `"El archivo supera el tamaño máximo permitido de ${maxSize / 1024 / 1024}MB"`,
    });
  }

  const { cliente_id } = req.body;
  console.log('Cliente ID:', cliente_id);
  console.log('Archivos:', req.files);
  let query = 'SELECT * FROM informacion WHERE cliente_id = ?';
  conexion.query(query, [cliente_id], async (err, data) => {
    if (err) {
      console.error('Error en consulta de cliente:', err);
      return res.status(500).json({ err, msg: 'Error al buscar cliente' });
    }
    if (data.length === 0) {
      res.status(404).json({
        msg: 'Cliente no encontrado'
      });
      return;
    }
    try {
      const videoFile = req.files.video;
      const videoPath = await uploadVideo({ file: videoFile }, ['mp4', 'avi', 'mov', 'wmv'], 'videos');
      query = 'UPDATE informacion SET video = ? WHERE cliente_id = ?';
      conexion.query(query, [videoPath, cliente_id], (err) => {
        if (err) {
          console.error('Error en actualización de cliente:', err);
          return res.status(500).json({ err });
        }
        res.status(201).json({
          ok: 'Video cargado',
        });
      });
    } catch (error) {
      console.error('Error al subir video:', error);
      res.status(400).json({
        error
      });
    }
  });
};

const getClienteIdByUsuarioId = (req, res) => {
  const { usuario_id } = req.params;
  let query = `SELECT i.cliente_id
              FROM usuarios u
              JOIN informacion i ON u.usuario_id = i.cliente_id
              WHERE u.usuario_id = ?;`;
  conexion.query(query, [usuario_id], (err, data) => {
    if (err) {
      console.error('Error al buscar cliente_id:', err);
      return res.status(500).json({
        msg: 'Error al buscar cliente_id'
      });
    }
    if (data.length === 0) {
      return res.status(404).json({
        msg: 'Cliente no encontrado'
      });
    }
    res.status(200).json({
      cliente_id: data[0].cliente_id
    });
  });
};

const getInformacionByClienteId = (req, res) => {
  const { cliente_id } = req.params; // Obtener cliente_id de los parámetros de la solicitud

  let query = "SELECT * FROM informacion WHERE cliente_id = ?";

  conexion.query(query, [cliente_id], (error, results) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'Información no encontrada' });
    }
    res.status(200).json({ results });
  });
};


module.exports = {
  getInformacion,
  postInformacion,
  saveVideo,
  getClienteIdByUsuarioId,
  getInformacionByClienteId
};

