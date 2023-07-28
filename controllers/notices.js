const { RequestError, ctrlWrapper } = require("../helpers");
const { Notice } = require("../models/noticesModel");

const addNotice = async (req, res, next) => {
  try {
    const { _id: owner } = req.user;
    const file = req.file.path;
    const { title, content } = req.body;
    const noticeData = { title, content, file, owner };
    const result = await Notice.create(noticeData);

    res.status(201).json(result.toObject());
  } catch (error) {
    next(error);
  }
};

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
  addNotice: ctrlWrapper(addNotice),
  getById: ctrlWrapper(getById),
};
