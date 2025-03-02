const connection = require("../database");

const getLogros = (req, res) => {
  connection.query("SELECT * FROM logros", (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json({ data: results, message: "Lista de logros" });
  });
};

const postLogros = (req, res) => {
  const { cliente_id, descripcion, fecha } = req.body;

  const query = `INSERT INTO logros(cliente_id, descripcion, fecha) VALUES (?, ?, ?)`;
  
  connection.query(query, [cliente_id, descripcion, fecha], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ message: "Logro registrado exitosamente", id: results.insertId });
  });
};

const putLogros = (req, res) => {
  const { descripcion } = req.body;
  const { id } = req.params;

  const query = `UPDATE logros SET descripcion = ? WHERE logro_id = ?`;

  connection.query(query, [descripcion, id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json({ message: "Logro actualizado correctamente" });
  });
};

const deleteLogros = (req, res) => {
  const { id } = req.params;

  const query = `DELETE FROM logros WHERE logro_id = ?`;

  connection.query(query, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json({ message: "Logro eliminado correctamente" });
  });
};

const patchLogros = (req, res) => {
  const { id } = req.params;

  const query = `UPDATE logros SET estado = NOT estado WHERE logro_id = ?`;

  connection.query(query, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json({ message: "Estado del logro actualizado" });
  });
};

module.exports = {
  getLogros,
  postLogros,
  putLogros,
  deleteLogros,
  patchLogros,
};
