const express = require("express");
const router = express.Router();

const ctrl = require("../../controllers/notices");

router.get("/", ctrl.getAll);
router.get('/notice/:id', ctrl.getById)
router.get("/search", ctrl.searchByTitle);
router.get("/:categoryName", ctrl.getNoticesByCategory);

module.exports = router;
