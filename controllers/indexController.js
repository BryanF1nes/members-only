const passport = require("passport");
const bcrypt = require("bcryptjs");
const pool = require("../db/pool.js");
const db = require("../db/queries.js");
const { body, validationResult } = require("express-validator");

const alphaErr = "must only contain letters.";
const lengthErr = "must be between 1 and 20 characters.";
const usernameLengthErr = "must be atleast 5 characters long."

const validateUser = [
    body('first_name').trim()
        .isAlpha().withMessage(`First name ${alphaErr}`)
        .isLength({ min: 1, max: 20 }).withMessage(`First name ${lengthErr}`),
    body('last_name').trim()
        .isAlpha().withMessage(`Last name ${alphaErr}`)
        .isLength({ min: 1, max: 20 }).withMessage(`Last name ${lengthErr}`),
    body('username').trim()
        .isLength({ min: 5 }).withMessage(`Username ${usernameLengthErr}`)
        .custom(async value => {
            const username = await db.findUsername(value);
            if (username) {
                throw new Error('Username is already in-use');
            }
        }).withMessage('Username is already in-use.'),
    body('password').trim()
        .isLength({ min: 10 }).withMessage('Password must contain at least 10 characters.'),
    body('confirm_password').trim()
        .custom((value, { req }) => {
            return value === req.body.password
        }).withMessage('Passwords must match.'),
]

exports.homePage = async (req, res) => {
    const messages = await db.getMessages();
    res.render("template", { title: "Message Center", body: "index", user: req.user, messages: messages });
};

exports.signUp = [
    validateUser,
    async (req, res, next) => {
        if (req.method === "GET") {
            return res.render("template", { title: "Sign Up", body: "sign-up" });
        }

        if (req.method === "POST") {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).render("template", { title: "Sign Up", body: "sign-up", errors: errors.array() });
            }
            try {
                const hashedPassword = await bcrypt.hash(req.body.password, 10);
                
                await pool.query("INSERT INTO users (first_name, last_name, username, password, membership_status) VALUES ($1, $2, $3, $4, FALSE)", [
                    req.body.first_name,
                    req.body.last_name,
                    req.body.username,
                    hashedPassword
                ]);
                return res.redirect("/sign-in");
            } catch (error) {
                return next(error);
            }
        }
    }
];

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