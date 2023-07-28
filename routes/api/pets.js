const express = require("express");

const ctrl = require("../../controllers/pet");

const {
  isValidId,
  authenticate,
  validateBody,
  uploadCloud,
} = require("../../middleWares");

const { schemas } = require("../../models/petsModel");
// const uploadImage = require("../../middleWares/uploadCloud");
// const { uploadTmp } = require("../../services/uploadTmp");
// const updateImage = require("../../middleWares/updateImage");

const router = express.Router();

router.get("/", authenticate, ctrl.getAllPets);

router.post(
  "/",
  authenticate,
  uploadCloud.single("pets"),
  validateBody(schemas.addPetJoiSchema),
  ctrl.addPet
);

router.delete("/:id", authenticate, isValidId, ctrl.deletePet);

module.exports = router;
