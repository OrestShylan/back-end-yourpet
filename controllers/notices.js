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

const getNoticesByCategory = async (req, res, next) => {
  const { categoryName } = req.params;

  const foundNotices = await Notice.find({ category: categoryName });

  if (!foundNotices) {
    next(RequestError(404));
  }

  const notices = [...foundNotices].sort(
    (firstNotice, secondNotice) =>
      new Date(secondNotice.createdAt) - new Date(firstNotice.createdAt)
  );
  res.json(notices);
};

module.exports = {
  searchByTitle: ctrlWrapper(searchByTitle),
  getNoticesByCategory: ctrlWrapper(getNoticesByCategory),
};
