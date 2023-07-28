const validateBody = require("./validateBody");
const isValidId = require("./isValidId");
const validateFavorite = require("./validateFavorite");
const authenticate = require("./authMiddleware");
const uploadCloud = require("./uploadCloud");
const noticesFilter = require("./noticesFilter");

module.exports = {
  validateBody,
  isValidId,
  validateFavorite,
  authenticate,
  uploadCloud,
  noticesFilter,
};
