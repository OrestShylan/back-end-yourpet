const express = require("express");
const friendsRouter = express.Router();
const ctrl = require("../../controllers/ourFriends");

friendsRouter.get("/", ctrl.ourFriends);

module.exports = friendsRouter;
