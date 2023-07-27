const { RequestError, ctrlWrapper } = require("../helpers");
const {Notice} = require("../models/noticesModel");


const getAll = async (req, res, next) => {
  const { page = 1, limit = 20 } = req.query;
  const skip = (page - 1) * limit;

  try {
    const totalHits = await Notice.countDocuments(); 
    const result = await Notice.find({})
      .skip(skip)
      .limit(limit)
      .sort({ updateAt: -1 })
      .populate("owner");

    if (!result || result.length === 0) {
      return res.status(404).json({
        message: "Sorry, you have no pets.",
      });
    }

    res.json({ totalHits, pets: result }); 
  } catch (error) {
    console.error("Error while retrieving notices:", error);
    res.status(500).json({ message: "Server error" });
  }
};

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
  getAll: ctrlWrapper(getAll),
};
