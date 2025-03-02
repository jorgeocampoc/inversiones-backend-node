var express = require("express");
var router = express.Router();

const   {
            getAllClientesWithInfo,
            getAllClientesByCategory,
            getAllClientesByFilterName,
            uploadimageUserCloudinary,
            putInvestors,
            addInfinversionista,
            getExperiencia,
            changeRolUser,
            getuserById,
            getRol
        } = require("../controllers/clients");
 
router.get("/", getAllClientesWithInfo);
router.get("/findBy/:id", getAllClientesByCategory);
router.get("/filterByName/:id", getAllClientesByFilterName);
router.post("/cloudinary/image/:id", uploadimageUserCloudinary);
router.put("/:id", putInvestors);
router.get("/getExperienceById/:id", getExperiencia);
router.post("/addInfoInversionista/", addInfinversionista);
router.put("/changeRol/user", changeRolUser);
router.get("/getRol/user", getRol);
router.get("/getUserById/user", getuserById);

module.exports = router;

