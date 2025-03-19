const { Router } = require("express");
const indexRouter = Router();
const indexController = require("../controllers/indexController.js");
const passport = require("passport");

indexRouter.get("/", indexController.homePage);
indexRouter.get("/sign-up", indexController.signUp);
indexRouter.get("/sign-in", indexController.signIn);
indexRouter.get("/log-out", indexController.logOut);

indexRouter.post("/sign-up", indexController.signUp);
indexRouter.post("/sign-in", passport.authenticate("local", { successRedirect: "/", failureRedirect: "/"}));

module.exports = indexRouter;