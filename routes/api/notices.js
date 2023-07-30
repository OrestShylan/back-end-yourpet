const express = require("express");
const router = express.Router();

const { noticesFilter, authenticate } = require("../../middleWares");
const ctrl = require("../../controllers/notices");

router.get("/", ctrl.getAll);

router.get("/notice/:id", ctrl.getById);
router.get("/search", ctrl.searchByTitle);

router.get("/search/:category", noticesFilter, ctrl.searchByTitle);

router.get("/:categoryName", ctrl.getNoticesByCategory);
router.get("/", authenticate, ctrl.getUsersNotices);

module.exports = router;
