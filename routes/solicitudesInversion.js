const express = require("express");
const router = express.Router();
const {
  getSolicitudesInversion,
  getSolicitudesInversionAprobados,
  getSolicitudesInversionPendientes,
  getSolicitudesInversionRechazados,
  getSolicitudInversionById,
  createSolicitudInversion,
  updateSolicitudInversion,
  procesarSolicitudInversion,
  deleteSolicitudInversion,
  getSolicitudesInversionByUserId,
  getTotals,
  showButton,
  getInversoresDeSolicitud,
  finalizarInversion,
  revertirInversion,
  cambiarEstadoProceso,
  procesarInversionByUser,
  getSolicitudByClienteId,
  getInvByState
} = require("../controllers/solicitudesInversion");

router.get("/", getSolicitudesInversion);
router.get("/aprobados", getSolicitudesInversionAprobados);
router.get("/pendientes", getSolicitudesInversionPendientes);
router.get("/rechazados", getSolicitudesInversionRechazados);
router.get("/:id", getSolicitudInversionById);
router.post("/", createSolicitudInversion);
router.put("/:id", updateSolicitudInversion);
router.put("/procesarInversionByIUser/:id", procesarInversionByUser);
router.put("/aprobar/:id", procesarSolicitudInversion);
router.delete("/:id", deleteSolicitudInversion);
router.get("/user/:userId", getSolicitudesInversionByUserId);
router.get("/showButton/:id", showButton);
router.get("/getTotals/totals", getTotals),
router.get("/getInversoresDeSolicitud/:id", getInversoresDeSolicitud),
router.put("/finalizarInversion/:id", finalizarInversion),
router.put("/revertirInversion/:id", revertirInversion),
router.put("/cambiarEstadoProceso/:id", cambiarEstadoProceso);
router.get("/getSolicitudByClienteId/:id", getSolicitudByClienteId);
router.get("/getInvByState/hola/:id", getInvByState);


module.exports = router;
