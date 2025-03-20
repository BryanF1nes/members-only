const passport = require("passport");
const bcrypt = require("bcryptjs");
const pool = require("../db/pool.js");
const db = require("../db/queries.js");
const { body, validationResult } = require("express-validator");
const { rateLimit } = require("express-rate-limit");

const limiter = rateLimit({
	windowMs: 30 * 1000, // 30 seconds
	limit: 1, // Limit each IP to 1 requests per `window` (here, per 30 seconds)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    message: "You can only send a message every 30 seconds",
    handler: async (req, res, next, options) => {
        const messages = await db.getMessages();
        return res.status(429).render("template", { title: "Message Center", body: "index", user: req.user, messages: messages, errors: [{ msg: "You can only send a message every 30 seconds" }] });
    }
})

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
        .isLength({ min: 10 }).withMessage('Password must contain at least 10 characters.')
        .matches(/\d/).withMessage('Password must contain at least one number.')
        .matches(/[!@#$%^&*?{}|<>]/).withMessage('Password must contain at least one special character. [!@#$%^&*?{}|<>]'),
    body('confirm_password').trim()
        .custom((value, { req }) => {
            return value === req.body.password
        }).withMessage('Passwords must match.'),
]

const validateMessage = [
    body('title').trim()
        .notEmpty().withMessage('Title cannot be empty.')
        .isLength({ min: 2, }).withMessage('Title must contain at least 2 characters.'),
    body('comment').trim()
        .notEmpty().withMessage('Message body cannot be empty.')
        .isLength({ min: 10 }).withMessage(`Message body must contain at least 10 characters.`),
]


exports.homePage = async (req, res) => {
    const messages = await db.getMessages();
    let verificationMessage = "";

    if (req.user && !req.user.membership_status) {
        verificationMessage = "You need to verify your account before posting messages.";
    }

    res.render("template", { title: "Message Center", body: "index", user: req.user, verification: verificationMessage, messages: messages });
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
                return res.status(400).render("template", { title: "Sign Up", body: "sign-up", user: req.user, errors: errors.array() });
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

exports.postMessage = [
    limiter,
    validateMessage,
    async (req, res, next) => {
    try {
        if (req.user && req.user.membership_status) {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                const messages = await db.getMessages();
                return res.status(400).render("template", {
                    title: "Message Center",
                    body: "index",
                    user: req.user,
                    messages: messages,
                    errors: errors.array()
                });
            }
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
}
];

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