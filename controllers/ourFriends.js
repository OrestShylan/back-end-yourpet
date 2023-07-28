const { readFile } = require("fs/promises");
const path = require("path");
const { ctrlWrapper } = require("../helpers");

const ourFriends = async (req, res) => {
  const friendsPath = path.join("externalSources.js", "ourFriends.json");

  const friends = JSON.parse(await readFile(friendsPath));

  res.status(200).json({ friends });
};

module.exports = {
  ourFriends: ctrlWrapper(ourFriends),
};
