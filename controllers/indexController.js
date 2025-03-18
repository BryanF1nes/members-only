exports.homePage = (req, res) => {
    res.render("template", { title: "Home Page", body: "index" });
};

exports.signUp = (req, res) => {
    res.render("template", { title: "Sign Up", body: "sign-up" });
};

exports.signIn = (req, res) => {
    if (req.method === "GET") {
        return res.render("template", { title: "Log In", body: "sign-in" });
    }

    if (req.method === "POST") {
        // do stuff
    }
};