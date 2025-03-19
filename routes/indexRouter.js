const { Router } = require("express");
const indexRouter = Router();
const indexController = require("../controllers/indexController.js");
const passport = require("passport");

indexRouter.get("/", indexController.homePage);
indexRouter.get("/sign-up", indexController.signUp);
indexRouter.get("/sign-in", indexController.signIn);
indexRouter.get("/log-out", indexController.logOut);
indexRouter.get("/secrets", indexController.secrets);

indexRouter.post("/sign-up", indexController.signUp);
indexRouter.post("/sign-in", passport.authenticate("local", { successRedirect: "/", failureRedirect: "/sign-in"}));
indexRouter.post("/post-message", indexController.postMessage);
indexRouter.post("/secrets", indexController.postSecret);

module.exports = indexRouter;