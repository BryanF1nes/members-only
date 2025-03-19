const passport = require("passport");
const bcrypt = require("bcryptjs");
const pool = require("../db/pool.js");
const db = require("../db/queries.js");

exports.homePage = async (req, res) => {
    const messages = await db.getMessages();
    res.render("template", { title: "Message Center", body: "index", user: req.user, messages: messages });
};

exports.signUp = async (req, res, next) => {
    if (req.method === "GET") {
        return res.render("template", { title: "Sign Up", body: "sign-up" });
    }

    if (req.method === "POST") {
        try {
            if (req.body.password === req.body.confirm_password) {
                const hashedPassword = await bcrypt.hash(req.body.password, 10);
                
                await pool.query("INSERT INTO users (first_name, last_name, username, password, membership_status) VALUES ($1, $2, $3, $4, FALSE)", [
                    req.body.first_name,
                    req.body.last_name,
                    req.body.username,
                    hashedPassword
                ]);
                res.redirect("/sign-in");
            }
            return res.status(400).send("Passwords do not match.")
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

exports.postMessage = async (req, res, next) => {
    try {
        if (req.user && req.user.membership_status) {
            const date = new Date();
            const user_id = req.user.id;

            await pool.query("INSERT INTO messages (title, body, timestamp, user_id) VALUES ($1, $2, $3, $4)", [
                req.body.title,
                req.body.comment,
                date,
                user_id
            ]);

            return res.redirect("/");
        }
        return res.redirect("/secrets");
    } catch (error) {
        return next(error);
    }
};

exports.secrets = (req, res) => {
    res.render("template", { title: "Secret Center", body: "secrets", user: req.user });
}

exports.postSecret = async (req, res, next) => {
    try {
        if (!req.user) {
            return res.send("You need to login first.");
        }
        if (req.body.secret === process.env.SECRET) {
            await pool.query("UPDATE users SET membership_status = TRUE WHERE id=$1", [req.user.id]);
            return res.redirect("/")
        }
        return res.status(400).send("Invalid secret.");
    } catch (error) {
        return next(error)
    }
}