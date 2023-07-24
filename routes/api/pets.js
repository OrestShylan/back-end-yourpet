const express = require("express");

const ctrl = require("../../controllers/pet");

const {
  validateBody,
  isValidId,
  authenticate,
  uploadCloud,
} = require("../../middleWares");

const { addPetJoiSchema } = require("../../models/petsModel");

const router = express.Router();

router.post(
  "/",
  authenticate,
  uploadCloud.single("pets-photo"),
  validateBody(addPetJoiSchema),
  ctrl.addPet
);

router.delete("/:id", authenticate, isValidId, ctrl.deletePet);

module.exports = router;
