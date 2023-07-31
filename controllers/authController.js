const User = require("../models/userModel");
const RequestError = require("../helpers/RequestError");
const ctrlWrapper = require("../helpers/ctrlWrapper");
const {
  register,
  login,
  logout,
  updateUserData,
} = require("../services/authService");

const registerCtrl = async (req, res) => {
  const { name, email, password } = req.body;
  const userInBase = await User.findOne({ email });

  if (userInBase) {
    throw RequestError(409, "Email in use");
  }

  const userData = await register(name, email, password);

  res.status(201).json(userData);
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

const getCurrentCtrl = async (req, res) => {
  const { _id, avatarURL, name, email, birthday, phone, city, favorite } =
    req.user;
  res.json({
    id: _id,
    avatarURL,
    name,
    email,
    birthday,
    phone,
    city,
    favorite,
  });
};

const updateUserDataCtrl = async (req, res) => {
  const { _id } = req.user;
  const { name, email, birthday, phone, city } = req.body;
  const avatarURL = req.file ? req.file.path : null;

  const updatedUser = await updateUserData(
    _id,
    avatarURL,
    name,
    email,
    birthday,
    phone,
    city
  );

  if (!updatedUser) {
    throw RequestError(401, "Not authorized");
  }

  res.json(updatedUser);
};

module.exports = {
  registerCtrl: ctrlWrapper(registerCtrl),
  loginCtrl: ctrlWrapper(loginCtrl),
  logoutCtrl: ctrlWrapper(logoutCtrl),
  getCurrentCtrl: ctrlWrapper(getCurrentCtrl),
  updateUserDataCtrl: ctrlWrapper(updateUserDataCtrl),
};
