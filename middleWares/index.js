const validateBody = require("./validateBody");
const isValidId = require("./isValidId");
const validateFavorite = require("./validateFavorite");
const authenticate = require("./authMiddleware");

const noticesFilter = require("./noticesFilter");
const upload = require("./upload");

module.exports = {
  validateBody,
  isValidId,
  validateFavorite,
  authenticate,

  noticesFilter,
  upload,
};
