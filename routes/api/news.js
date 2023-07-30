const express = require("express");
const router = express.Router();

const ctrl = require("../../controllers/getNews");

router.get("/", ctrl.getNews);

module.exports = router;