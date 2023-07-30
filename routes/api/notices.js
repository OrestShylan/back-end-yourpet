const express = require("express");
const router = express.Router();

const {
  noticesFilter,
  authenticate,
  validateBody,
} = require("../../middleWares");
const ctrl = require("../../controllers/notices");

router.get("/", ctrl.getAll);

router.get("/notice/:id", ctrl.getById);
//router.get("/search", ctrl.searchByTitle);
router.get("/:category", noticesFilter, ctrl.searchByTitle);
router.post("/favorite/:id", authenticate, ctrl.addToFavorite);
router.delete("/favorite/:id", authenticate, ctrl.removeFromFavorite);

router.get("/notice/:id", authenticate, ctrl.getById);

router.delete("/:id", authenticate, ctrl.deleteById);

router.post("/owner", authenticate, validateBody, ctrl.addNotice);

router.get("/:categoryName", ctrl.getNoticesByCategory);
router.get("/", authenticate, noticesFilter, ctrl.getUsersNotices);



module.exports = router;
