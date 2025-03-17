const { Router } = require("express");
const indexRouter = Router();
const indexController = require("../controllers/indexController.js");

indexRouter.get("/", indexController.homePage);
indexRouter.get("/sign-up", indexController.signUp);

module.exports = indexRouter;