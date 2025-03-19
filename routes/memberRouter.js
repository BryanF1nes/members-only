const { Router } = require("express");
const memberRouter = Router();
const memberController = require("../controllers/memberController.js");

memberRouter.get("/", memberController.members);
memberRouter.get("/messages/:id", memberController.memberMessages);

module.exports = memberRouter;