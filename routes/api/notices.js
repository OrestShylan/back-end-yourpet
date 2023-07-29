const express = require("express");
const router = express.Router();

const { noticesFilter, authenticate, validateBody } = require("../../middleWares");
const ctrl = require("../../controllers/notices");


router.get("/", ctrl.getAll);

router.get("/:category", noticesFilter, ctrl.searchByTitle);

router.get('/notice/:id', authenticate, ctrl.getById)

router.delete("/:id", authenticate, ctrl.deleteById);

router.post('/owner', authenticate, validateBody, ctrl.addNotice)

router.get("/search", ctrl.searchByTitle);

router.get("/:categoryName", ctrl.getNoticesByCategory);

router.post("/favorite/:id", authenticate, ctrl.addToFavorite);

module.exports = router;
