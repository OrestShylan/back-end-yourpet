const { ctrlWrapper, RequestError } = require("../helpers");
const { Notice } = require("../models/noticesModel");

// const addNotice = async (req, res, next) => {
// console.log('hi');
//   try {
//     const { _id: owner } = req.user;
//     const file = req.file.path;
//     const { title, content } = req.body;
//     const noticeData = { title, content, file, owner };
//     const result = await Notice.create(noticeData);

//     res.status(201).json(result.toObject());
//   } catch (error) {
//     next(error);
//   }
// };

const getAll = async (req, res, next) => {
  const { page = 1, limit = 12 } = req.query;
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

const getById = async (req, res, next) => {
  try {
    const { id: noticeId } = req.params;

    const result = await Notice.findById(noticeId, "-updatedAt").populate(
      "owner",
      "name email phone"
    );

    if (!result) {
      throw new RequestError(404, "Not found");
    }

    res.json(result);
  } catch (error) {
    next(error);
  }
};

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
  const { page = 1, limit = 12 } = req.query;
  const skip = (page - 1) * limit;

  try {
    const totalHits = await Notice.countDocuments({ category: categoryName });
    const foundNotices = await Notice.find({ category: categoryName })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    if (foundNotices.length === 0) {
      return res.status(404).json({
        message: "Notices for this category not found.",
      });
    }

    const notices = foundNotices;

    res.json({ totalHits, notices });
  } catch (error) {
    console.error("Error while retrieving notices by category:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getUsersNotices = async (req, res) => {
  const owner = req.user._id;

  const { page = 1, limit = 12, query = "" } = req.query;
  const skip = (page - 1) * limit;

  const searchWords = query.trim().split(" ");

  // const regexExpressions = searchWords.map((word) => ({
  //   titleOfAdd: { $regex: new RegExp(word, "i") },
  // }));

  const searchQuery = {
    owner,
    titleOfAdd: { $in: searchWords },
    ...req.searchQuery,
  };

  const notices = await Notice.find(searchQuery, "-createdAt -updateAt", {
    skip,
    limit: Number(limit),
  })
    .sort({ createdAt: -1 })
    .populate("owner", "username email phone");

  if (!notices || notices.length === 0) {
    throw new RequestError(404, "Nothing find for your request");
  }

  const totalCount = await Notice.countDocuments(searchQuery);

  res.status(200).json({
    result: notices,
    hits: notices.length,
    totalHits: totalCount,
  });
};
module.exports = {
  searchByTitle: ctrlWrapper(searchByTitle),
  getNoticesByCategory: ctrlWrapper(getNoticesByCategory),
  getAll: ctrlWrapper(getAll),
  getById: ctrlWrapper(getById),
  getUsersNotices: ctrlWrapper(getUsersNotices),
};
