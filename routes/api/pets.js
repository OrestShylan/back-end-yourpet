const express = require("express");

const ctrl = require("../../controllers/pet");

const { isValidId, authenticate, validateBody } = require("../../middleWares");

const { schemas } = require("../../models/petsModel");
// const uploadImage = require("../../middleWares/uploadCloud");
// const { uploadTmp } = require("../../services/uploadTmp");
// const updateImage = require("../../middleWares/updateImage");

const router = express.Router();

router.get("/", authenticate, ctrl.getAllPets);

router.post(
  "/",
  authenticate,
  // uploadImage.single("pet"),
  validateBody(schemas.addPetJoiSchema),
  ctrl.addPet
);

router.delete("/:id", authenticate, isValidId, ctrl.deletePet);

module.exports = router;
