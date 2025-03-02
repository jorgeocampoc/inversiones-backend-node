const { response: res, request: req } = require("express");
const conexion = require("../database");
const getExperiencia = (req, res) => {
  conexion.query("SELECT * FROM experiencia", (error, results) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    res.status(200).json({ results });
  });
};
const postExperiencia = (req, res) => {
  const {
    cliente_id,
    institucion,
    cargo,
    actividades,
    fecha_inicio,
    fecha_final,
  } = req.body;

  const query =
    "INSERT INTO experiencia (cliente_id, institucion, cargo, actividades, fecha_inicio, fecha_final) VALUES (?, ?, ?,?,?,?)";

  conexion.query(
    query,
    [cliente_id, institucion, cargo, actividades, fecha_inicio, fecha_final],
    (error, results) => {
      if (error) {
        return res.status(500).json({ error: error.message });
      }
      res
        .status(201)
        .json({ message: "Experiencia creada", id: results.insertId });
    }
  );
};
const putExperiencia = (req, res) => {
  const { institucion, cargo, actividades } = req.body;
  const queryExperiencia = "SELECT * FROM experiencia WHERE cliente_id = ? ";
  conexion.query(queryExperiencia, [req.params.id], (error, data) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    if (data.length == 0) {
      return res.status(500).json({ error: error.message });
    }
    const query =
      "UPDATE experiencia SET institucion =?, cargo =?, actividades =? WHERE cliente_id =?";

    conexion.query(
      query,
      [institucion, cargo, actividades, req.params.id],
      (error, results) => {
        if (error) {
          return res.status(500).json({ error: error.message });
        }
        res
          .status(201)
          .json({ message: "Experiencia modificada", id: results.insertId });
      }
    );
  });
};
const patchExperiencia = (req, res) => {
  const { id } = req.params;

  const query =
    "UPDATE experiencia SET estado = !estado WHERE experiencia_id = ?";

  conexion.query(query, [id], (error) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    res.status(200).json({ message: "Movimiento eliminado" });
  });
};

module.exports = {
  getExperiencia,
  postExperiencia,
  putExperiencia,
  patchExperiencia,
};
