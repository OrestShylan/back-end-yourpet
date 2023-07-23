const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const RequestError = require("../helpers/RequestError");

// const signToken = (id) =>
//   jwt.sign({ id }, process.env.JWT_SECRET, {
//     expiresIn: process.env.JWT_EXPIRES_IN,
//   });

const JWT_SECRET = "fbldfbndlfkbmdjhfgk";
const JWT_EXPIRES_IN = "30d";

const signToken = (id) =>
  jwt.sign({ id }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });

const register = async (name, email, password) => {
  const newUser = await User.create({
    name,
    email,
    password,
  });

  newUser.password = undefined;

  return newUser;
};

const login = async (email, password) => {
  const userInBase = await User.findOne({ email }).select("+password");
  if (!userInBase) {
    throw RequestError(401, "Email or password is wrong");
  }

  const passwordIsValid = await userInBase.checkPassword(
    password,
    userInBase.password
  );
  if (!passwordIsValid) {
    throw RequestError(401, "Email or password is wrong");
  }
  userInBase.password = undefined;
  const token = signToken(userInBase.id);
  await User.findByIdAndUpdate(userInBase._id, { token });

  return {
    token,
    user: {
      name: userInBase.name,
      email: userInBase.email,
    },
  };
};

const logout = async (_id) => {
  const resultLogout = await User.findByIdAndUpdate(_id, { token: null });
  return resultLogout;
};

module.exports = { register, login, logout };
