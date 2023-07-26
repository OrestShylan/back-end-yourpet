const express = require("express");

const ctrl = require("../../controllers/pet");

const { isValidId, authenticate, validateBody } = require("../../middleWares");

const { schemas } = require("../../models/petsModel");

const router = express.Router();

router.get("/", authenticate, ctrl.getAllPets);

router.post(
  "/",
  authenticate,
  validateBody(schemas.addPetJoiSchema),
  // uploadCloud(schemas.photoConfig),
  ctrl.addPet
);

router.delete("/:id", authenticate, isValidId, ctrl.deletePet);

module.exports = router;
