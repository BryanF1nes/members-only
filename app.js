require("dotenv").config();
const express = require("express");
const { body, validationResult } = require("express-validator");
const pool = require("./db/pool.js");
const path = require("path");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");

const app = express();

// Routes
const indexRouter = require("./routes/indexRouter.js");

// Server Setup
app.set("view engine", "ejs");

// Passport
app.use(session({ secret: process.env.SECRET, resave: false, saveUninitialized: false }));
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "static")));

passport.use(
    new LocalStrategy(async (username, password, done) => {
        try {
            const { rows } = await pool.query("SELECT * FROM users WHERE username=$1", [username]);
            const user = rows[0];
            
            if (!user) return done(null, false, { message: "Incorrect username" });

            const match = await bcrypt.compare(password, user.password);
            if (!match) return done(null, false, { message: "Incorrect password" })

            return done(null, user);
        } catch (error) {
            return done(error);
        }
    })
);

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const { rows } = await pool.query("SELECT * FROM users WHERE id=$1", [id]);
        const user = rows[0];

        done(null, user);
    } catch (error) {
        done(error);
    }
})

app.use("/", indexRouter);
app.get("*", (req, res, next) => {
    res.status(404).render("404", { title: "Error 404" })
})

app.listen(process.env.SERVER_PORT, (req, res) => {
    console.log("Server listening on PORT: " + process.env.SERVER_PORT);
})