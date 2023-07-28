const express = require("express");
const router = express.Router();

const { noticesFilter } = require("../../middleWares");
const ctrl = require("../../controllers/notices");

router.get("/", ctrl.getAll);

//router.get("/search", ctrl.searchByTitle);
router.get("/search/:category", noticesFilter, ctrl.searchByTitle);
router.get("/:categoryName", ctrl.getNoticesByCategory);

module.exports = router;
