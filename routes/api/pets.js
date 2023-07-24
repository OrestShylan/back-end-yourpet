const express = require("express");

const ctrl = require("../../controllers/pet");

const {
  validateBody,
  isValidId,
  validateFavorite,
} = require("../../middleWares");

const { schemas } = require("../../models/pet");

const router = express.Router();

router.get("/", ctrl.getAll);

router.get("/:petId", isValidId, ctrl.getById);

router.post("/", ctrl.addPet);

router.post("/", validateBody(schemas.addschema), ctrl.addPet);

router.delete("/:id", isValidId, ctrl.deletePet);

router.put(
  "/:petID",
  isValidId,
  validateFavorite,
  validateBody(schemas.addschema),
  ctrl.update
);
router.patch(
  "/:petId/favorite",
  isValidId,

  validateBody(schemas.updateFavoriteSchema),
  ctrl.updateFavorite
);

module.exports = router;
