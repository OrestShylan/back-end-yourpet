const express = require("express");
const router = express.Router();

const {
  noticesFilter,
  authenticate,
  validateBody,
} = require("../../middleWares");
const ctrl = require("../../controllers/notices");
const noticeSchema = require('../../schemas/noticeSchema')

router.get("/", ctrl.getAll);

router.get("/notice/:id", ctrl.getById);
router.get("/search", ctrl.searchByTitle);
router.get("/:category", noticesFilter, ctrl.searchByTitle);

router.get("/notice/:id", authenticate, ctrl.getById);

router.delete("/:id", authenticate, ctrl.deleteById);


router.post('/owner', authenticate, validateBody(noticeSchema), ctrl.addNotice)



router.get("/search", ctrl.searchByTitle);

router.get("/:categoryName", ctrl.getNoticesByCategory);
router.get("/", authenticate, noticesFilter, ctrl.getUsersNotices);

router.post("/favorite/:id", authenticate, ctrl.addToFavorite);

module.exports = router;
