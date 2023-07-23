const express = require("express");

const authController = require("../../controllers/authController");

const { registerSchema, loginSchema } = require("../../schemas/userSchema");
const validateBody = require("../../middleWares/validateBody");
const authenticate = require("../../middleWares/authMiddleware");

const router = express.Router();

router.post(
  "/register",
  validateBody(registerSchema),
  authController.registerCtrl
);

router.post(
  "/login",
  validateBody(loginSchema),
  authController.loginCtrl
);

router.post("/logout", authenticate, authController.logoutCtrl);

module.exports = router;
