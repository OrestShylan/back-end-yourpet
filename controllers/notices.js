const { RequestError, ctrlWrapper } = require("../helpers");
const Notice = require("../models/noticesModel");

const searchByTitle = async (req, res, next) => {
  const keyword = req.query.keyword;
  const result = await Notice.find({
    title: { $regex: keyword.toLowerCase(), $options: "i" },
  });
  if (!result) {
    next(RequestError(404));
  }
  res.json(result);
};

module.exports = {
  searchByTitle: ctrlWrapper(searchByTitle),
};
