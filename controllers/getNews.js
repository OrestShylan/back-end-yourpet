const { ctrlWrapper} = require("../helpers");
const {News} = require('../models/newsModel')
const getNews = async (req, res) => {
  const { page = 1, limit = 6 } = req.query;
  const skip = (page - 1) * limit;
  const result = await News.find({}, "", {
    skip,
    limit: Number(limit),
  }).sort({ date: -1 });
  const totalHints = await News.count();

  res.status(200).json({
    result,
    page: Number(page),
    hints: Number(limit),
    totalHints,
  });
};

module.exports = {
    getNews: ctrlWrapper(getNews)
}

