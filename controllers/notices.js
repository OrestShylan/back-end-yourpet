const { RequestError, ctrlWrapper } = require("../helpers");
const { Notice } = require("../models/noticesModel");

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

// const searchByTitle = async (req, res, next) => {
//   const keyword = req.query.keyword;
//   const result = await Notice.find({
//     title: { $regex: keyword.toLowerCase(), $options: "i" },
//   });
//   if (!result) {
//     next(RequestError(404));
//   }
//   res.json(result);
// };

const searchByTitle = async (req, res) => {
  const { page = 1, limit = 12, query = "" } = req.query;
  const skip = (page - 1) * limit;
  const { category = "sell" } = req.params;

  const searchWords = query.trim().split(" ");

  const regexExpressions = searchWords.map((word) => ({
    title: { $regex: new RegExp(word, "i") },
  }));
  const searchQuery = {
    $and: [
      { category },
      {
        $or: regexExpressions,
      },
    ],
    ...req.searchQuery,
  };

  const notices = await Notice.find(searchQuery, "-createdAt -updatedAt", {
    skip,
    limit: Number(limit),
  }).sort({ createdAt: -1 });

  const totalHits = await Notice.countDocuments(searchQuery);

  res.status(200).json({
    result: notices,
    hits: notices.length,
    totalHits: totalHits,
  });
};

const getNoticesByCategory = async (req, res, next) => {
  const { categoryName } = req.params;

  try {
    const foundNotices = await Notice.find({ category: categoryName });

    if (foundNotices.length === 0) {
      return res.status(404).json({
        message: "Notices for this category not found.",
      });
    }

    const totalHits = foundNotices.length;
    const notices = [...foundNotices].sort(
      (firstNotice, secondNotice) =>
        new Date(secondNotice.createdAt) - new Date(firstNotice.createdAt)
    );

    res.json({ totalHits, notices });
  } catch (error) {
    console.error("Error while retrieving notices by category:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  searchByTitle: ctrlWrapper(searchByTitle),
  getNoticesByCategory: ctrlWrapper(getNoticesByCategory),
  getAll: ctrlWrapper(getAll),
};
