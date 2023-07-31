const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const RequestError = require("../helpers/RequestError");
require("dotenv").config();

const signToken = (id) =>
  jwt.sign({ id }, `${process.env.JWT_SECRET}`, {
    expiresIn: "23h",
  });

const register = async (name, email, password) => {
  const defaultAvatar =
    "https://res.cloudinary.com/do316uvkf/image/upload/v1680493837/szccttwukvqfijjovgz5.jpg";
  const newUser = await User.create({
    name,
    email,
    password,
    avatarURL: defaultAvatar,
  });

  newUser.password = undefined;

  const { token } = await login(email, password);

  return {
    token,
    user: {
      name: newUser.name,
      email: newUser.email,
      avatarURL: newUser.avatarURL,
    },
  };
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

// const updateUserData = async (req, res) => {
//   const { _id } = req.user;
//   const data = await User.findByIdAndUpdate(
//     _id,
//     { ...req.body, ...req.file },
//     { new: true }
//   );
//   if (!data) {
//     throw RequestError(404, "Not found");
//   }

//   try {
//     if (req.file) {
//       await User.findByIdAndUpdate(_id, { avatarURL: req.file.path });
//     }
//   } catch (error) {
//     throw error;
//   }

//   res.status(200).json({ message: "User profile updated successfully" });
// };
const updateUserData = async (
  _id,
  avatarURL,
  name,
  email,
  birthday,
  phone,
  city
) => {
  const updatedUser = await User.findByIdAndUpdate(
    { _id },
    { avatarURL, name, email, birthday, phone, city },
    { new: true }
  );
  return updatedUser;
};

// const updateUserData = async (req, _id, name, email, birthday, phone, city) => {
//   if (req.file) {
//     const avatarURL = req.file.path;

//     const updatedUser = await User.findByIdAndUpdate(
//       { _id },
//       { avatarURL, name, email, birthday, phone, city }
//     );
//     return updatedUser;
//   } else {
//     const updatedUser = await User.findByIdAndUpdate(
//       { _id },
//       { name, email, birthday, phone, city }
//     );
//     return updatedUser;
//   }
// };

module.exports = { register, login, logout, updateUserData };
