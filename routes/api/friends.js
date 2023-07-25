const express = require("express");
const friendsRouter = express.Router();
const { ourFriends } = require("../../controllers/ourFriends");

friendsRouter.get("/", ourFriends);

module.exports = friendsRouter;
