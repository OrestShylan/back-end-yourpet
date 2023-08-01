const express = require("express");

const authController = require("../../controllers/authController");

const {
  registerSchema,
  loginSchema,
  dataUserSchema,
} = require("../../schemas/userSchema");
const validateBody = require("../../middleWares/validateBody");
const authenticate = require("../../middleWares/authMiddleware");
const upload = require("../../middleWares/upload");

const router = express.Router();

router.post(
  "/register",
  validateBody(registerSchema),
  authController.registerCtrl
);

router.post("/login", validateBody(loginSchema), authController.loginCtrl);

router.post("/logout", authenticate, authController.logoutCtrl);

router.get("/current", authenticate, authController.getCurrentCtrl);

router.patch(
  "/",
  authenticate,
  upload.single("avatar"),
  validateBody(dataUserSchema),
  authController.updateUserDataCtrl
);

module.exports = router;
