var express = require("express");
var router = express.Router();

const {
  isClientFormInfoRegistered,
  isClientFormAchievements,
  isClientFormExperience,
  isClientVideo,
  isClientPhoto,
  isInversorInfo,
  isInversorPhoto,
  getFeatured,
  uploadimageUserCloudinaryHome,
  getAllImageHome,
  putTextHome,
  getTextHome,
  getImagePartners,
  getTextProposito,
  savePercentajerUser,
  putTextPurpose,
  getTotalInfoUsers,
  getVideoSettings,
  putVideoSetting,
  changeNameSystem,
  getNameSystem,
  getLogoSystem
} = require("../controllers/utilities");

router.get("/informacion", isClientFormInfoRegistered);
router.get("/logros", isClientFormAchievements);
router.get("/experiencia", isClientFormExperience);
router.get("/video", isClientVideo);
router.get("/imagen", isClientPhoto);
router.get("/informacionInversionista", isInversorInfo);
router.get("/isInversorPhoto", isInversorPhoto);
router.get("/getFeatured", getFeatured);
router.post("/uploadimageUserCloudinaryHome/:fieldImage", uploadimageUserCloudinaryHome);
router.get("/getAllImageHome/", getAllImageHome);
router.patch("/putTextHome/:text", putTextHome);
router.patch("/putTextPurpose/:text", putTextPurpose);
router.get("/getTextHome/", getTextHome);
router.get("/getImagePartners/", getImagePartners);
router.get("/getTextProposito/", getTextProposito);
router.patch("/savePercentajerUser/:id", savePercentajerUser);
router.get("/total", getTotalInfoUsers);
router.get("/getVideoSettings", getVideoSettings);
router.put("/putVideoSetting", putVideoSetting);
router.put("/changeNameSystem", changeNameSystem);
router.get("/getNameSystem", getNameSystem);
router.get("/getLogoSystem", getLogoSystem);

module.exports = router;
