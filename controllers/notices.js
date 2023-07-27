const { RequestError, ctrlWrapper } = require("../helpers");
const {Notice} = require("../models/noticesModel");


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


module.exports = {
  searchByTitle: ctrlWrapper(searchByTitle),
  getNoticesByCategory: ctrlWrapper(getNoticesByCategory),
  getAll: ctrlWrapper(getAll),
};
