const express = require("express");

const ctrl = require("../../controllers/pet");

const {
  validateBody,
  isValidId,
  uploadCloud,
  authenticate,
} = require("../../middleWares");

const { addPetJoiSchema } = require("../../models/petsModel");

const router = express.Router();

router.get("/", authenticate, ctrl.getAllPets);

router.get("/:contactId", isValidId, ctrl.getById);

router.post("/", ctrl.addPet);

router.post("/", validateBody(schemas.addschema), ctrl.addPet);

router.delete("/:id", isValidId, ctrl.deletePet);

router.put(
  "/:contactId",
  isValidId,
  validateFavorite,
  validateBody(schemas.addschema),
  ctrl.update
);
router.patch(
  "/:contactId/favorite",
  isValidId,

  validateBody(schemas.updateFavoriteSchema),
  ctrl.updateFavorite
);

router.delete("/:id", authenticate, isValidId, ctrl.deletePet);

module.exports = router;
