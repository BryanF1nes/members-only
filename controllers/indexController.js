const passport = require("passport");
const pool = require("../db/pool.js");

exports.homePage = (req, res) => {
    res.render("template", { title: "Message Center", body: "index", user: req.user });
};

exports.signUp = async (req, res, next) => {
    if (req.method === "GET") {
        return res.render("template", { title: "Sign Up", body: "sign-up" });
    }

    if (req.method === "POST") {
        try {
            if (req.body.password === req.body.confirm_password) {
                await pool.query("INSERT INTO users (first_name, last_name, username, password, membership_status) VALUES ($1, $2, $3, $4, TRUE)", [
                    req.body.first_name,
                    req.body.last_name,
                    req.body.username,
                    req.body.password
                ]);
                res.redirect("/sign-in");
            }
        } catch (error) {
            return next(error);
        }
    }
};

exports.signIn = (req, res) => {
    if (req.method === "GET") {
        return res.render("template", { title: "Log In", body: "sign-in" });
    }
};

exports.logOut = (req, res, next) => {
    req.logout((error) => {
        if (error) return next(error);
        res.redirect("/");
    });
};