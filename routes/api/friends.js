const express = require("express");
const friendsRouter = express.Router();
const ctrl = require("../../controllers/ourFriends");
// const { validateBody } = require("../../middleWares");
// const { Friends } = require("../../models/friendsModel");

friendsRouter.get("/", ctrl.ourFriends);

module.exports = friendsRouter;

// validateBody(Friends),