const User = require("../models/userModel");
const RequestError = require("../helpers/RequestError");
const ctrlWrapper = require("../helpers/ctrlWrapper");
const {
  register,
  login,
  logout,
} = require("../services/authService");

const registerCtrl = async (req, res) => {
  const { name, email, password } = req.body;
  const userInBase = await User.findOne({ email });

  if (userInBase) {
    throw RequestError(409, "Email in use");
  }

  const newUser = await register(name, email, password);

  res.status(201).json({
    user: {
      name: newUser.name,
      email: newUser.email,
    },
  });
};

const loginCtrl = async (req, res) => {
  const { email, password } = req.body;

  const userData = await login(email, password);

  if (!userData) throw RequestError(401, "Email or password is wrong");

  res.status(200).json(userData);
};

const logoutCtrl = async (req, res) => {
  const { _id } = req.user;
  await logout(_id);
  res.status(204).json();
};

module.exports = {
  registerCtrl: ctrlWrapper(registerCtrl),
  loginCtrl: ctrlWrapper(loginCtrl),
  logoutCtrl: ctrlWrapper(logoutCtrl),
};
