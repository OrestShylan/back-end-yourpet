const express = require("express");

const ctrl = require("../../controllers/pet");

const {
  isValidId,
  authenticate,
  validateBody,
  upload,
} = require("../../middleWares");

const { schemas } = require("../../models/petsModel");

const router = express.Router();

router.get("/", authenticate, ctrl.getAllPets);

router.post(
  "/",
  authenticate,
  upload.single("avatarURL"),
  validateBody(schemas.addPetJoiSchema),
  ctrl.addPet
);

router.delete("/:id", authenticate, isValidId, ctrl.deletePet);

module.exports = router;
