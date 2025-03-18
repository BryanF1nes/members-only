const { Router } = require("express");
const indexRouter = Router();
const indexController = require("../controllers/indexController.js");

indexRouter.get("/", indexController.homePage);
indexRouter.get("/sign-up", indexController.signUp);
indexRouter.get("/sign-in", indexController.signIn);

module.exports = indexRouter;