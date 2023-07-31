const { ctrlWrapper, RequestError } = require("../helpers");
const { Notice } = require("../models/noticesModel");
const User = require("../models/userModel");

const addNotice = async (req, res, next) => {
  try {
    const { _id: owner } = req.user;
    const file = req.file.path;
    const { title, content } = req.body;
    const noticeData = { title, content, file, owner };
    const result = await Notice.create(noticeData);

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

    res.status(201).json(result.toObject());
  } catch (error) {
    next(error);
  }
};

const getAll = async (req, res, next) => {
  const { page = 1, limit = 12 } = req.query;
  const skip = (page - 1) * limit;

  try {
    const totalHits = await Notice.countDocuments();
    const result = await Notice.find({})
      .skip(skip)
      .limit(limit)
      .sort({ updateAt: -1 })
      .populate("owner", "email phone");

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

const deleteById = async (req, res, next) => {
  try {
    const { id: noticeId } = req.params;
    const { _id: owner } = req.user;

    const deletedNotice = await Notice.findByIdAndDelete(noticeId, {
      owner: owner,
    });

    if (!deletedNotice) {
      throw new RequestError(404, "Notice not found");
    }

    res.json({
      message: "Delete is success",
      deletedNoticeId: noticeId,
    });
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
  })
    .populate("owner", "email phone")
    .sort({ createdAt: -1 });

  const totalHits = await Notice.countDocuments(searchQuery);

  res.status(200).json({
    notices,
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
      .populate("owner", "email phone")
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

const getUsersNotices = async (req, res, next) => {
  const {
    user: { _id: userId },
    query,
  } = req;

  const { page = 1, limit = 12 } = query;
  const skip = (page - 1) * limit;

  const totalResults = await Notice.find({ owner: userId }).count();
  const notices = await Notice.find({ owner: userId }, null, {
    skip,
    limit,
    sort: {
      updatedAt: -1,
    },
  })
    .populate("owner", "email phone")
    .lean();

  if (!notices) {
    next(RequestError(404, "Not found"));
  }

  res.json({
    totalResults,
    page,
    totalPages: Math.ceil(totalResults / limit),
    results: notices,
  });
};

const getFavoriteNotices = async (req, res) => {
  const { _id: ownerId } = req.user;

  const { page = 1, limit = 12, query = "" } = req.query;
  const skip = (page - 1) * limit;

  const user = await User.findById(ownerId);
  if (!user) {
    throw new RequestError(404, `User with id: ${ownerId} is not found`);
  }

  console.log(user);

  const favoriteNotices = user.favorite;

  const searchWords = query.trim().split(" ");

  const regexExpressions = searchWords.map((word) => ({
    title: { $regex: new RegExp(word, "i") },
  }));

  const searchQuery = {
    $and: [
      { _id: { $in: favoriteNotices } },
      {
        $or: regexExpressions,
      },
    ],
    ...req.searchQuery,
  };

  const notices = await Notice.find(searchQuery, "-favorite")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate("owner", "email phone");

  const totalCount = await Notice.countDocuments(searchQuery);

  res.status(200).json({
    notices: notices,
    totalHits: totalCount,
  });
};

const addToFavorite = async (req, res) => {
  const { _id: userId } = req.user;
  const { id: noticeId } = req.params;

  const user = await User.findOne(userId);

  if (!user) {
    throw new RequestError(404, `User with id: ${userId} not found`);
  }
  const notice = await Notice.findById(noticeId);
  if (!notice) {
    throw new RequestError(404, `notice with id: ${noticeId} not found`);
  }

  const index = notice.favorite.indexOf(userId);

  if (index !== -1) {
    return res.json({
      message: `User with id ${userId} already has this notice in favorite list`,
    });
  }

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { $push: { favorite: noticeId } },
    { new: true }
  ).populate(
    "favorite",
    "title avatarURL category name location price sex comments"
  );

  updatedUser.password = undefined;

  const updatedNotice = await Notice.findByIdAndUpdate(
    noticeId,
    { $push: { favorite: userId } },
    { new: true }
  );

  console.log(updatedNotice);

  res.json({
    result: {
      updatedNotice,
    },
  });
};

const removeFromFavorite = async (req, res) => {
  const { _id: userId } = req.user;
  const { id: noticeId } = req.params;

  const user = await User.findById(userId);
  if (!user) {
    throw new RequestError(404, `User with id: ${userId} not found`);
  }

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { $pull: { favorite: { $eq: noticeId } } },
    { new: true }
  ).populate(
    "favorite",
    "title avatarURL category name location price sex comments"
  );

  updatedUser.password = undefined;
  const updatedNotice = await Notice.findByIdAndUpdate(
    noticeId,
    { $pull: { favorite: { $eq: userId } } },
    { new: true }
  );

  res.json({
    result: { updatedNotice },
  });
};

module.exports = {
  searchByTitle: ctrlWrapper(searchByTitle),
  getNoticesByCategory: ctrlWrapper(getNoticesByCategory),
  getAll: ctrlWrapper(getAll),
  getFavoriteNotices: ctrlWrapper(getFavoriteNotices),
  addToFavorite: ctrlWrapper(addToFavorite),
  removeFromFavorite: ctrlWrapper(removeFromFavorite),
  getById: ctrlWrapper(getById),
  getUsersNotices: ctrlWrapper(getUsersNotices),
  deleteById: ctrlWrapper(deleteById),
  addNotice: ctrlWrapper(addNotice),
};
