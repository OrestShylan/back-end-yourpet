const { readFile } = require("fs/promises");
const { Friends } = require("../models/friendsModel");
const path = require("path");
const { ctrlWrapper } = require("../helpers");

const ourFriends = async (req, res) => {
  const { page = 1, limit = 9 } = req.query;
  const skip = (page - 1) * limit;
  const result = await Friends.find({}, "", {
    skip,
    limit: Number(limit),
  });

  const totalHits = await Friends.count();

  const friendsPath = path.join("externalSources.js", "ourFriends.json");

  const friends = JSON.parse(await readFile(friendsPath));

  res.status(200).json({
    friends,
    result,
    page: Number(page),
    hits: Number(limit),
    totalHits,
  });
};

module.exports = {
  ourFriends: ctrlWrapper(ourFriends),
};
