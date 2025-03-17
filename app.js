require("dotenv").config();
const express = require("express");
const { body, validationResult } = require("express-validator");
const path = require("path");

const app = express();

// Routes
const indexRouter = require("./routes/indexRouter.js");

// Server Setup
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "static")));

app.use("/", indexRouter);

app.listen(process.env.SERVER_PORT, (req, res) => {
    console.log("Server listening on PORT: " + process.env.SERVER_PORT);
})