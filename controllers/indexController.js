exports.homePage = (req, res) => {
    res.render("index", { title: "Home Page" });
};

exports.signUp = (req, res) => {
    res.render("sign-up", { title: "Sign Up" });
};

exports.signIn = (req, res) => {
    res.render("sign-in", { title: "Log In" });
};