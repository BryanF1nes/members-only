const pool = require("../db/pool.js");
const db = require("../db/queries.js");

exports.members = async (req, res) => {
    const members = await db.getMembers();
    res.render("template", { title: "Members", body: "members/members", user: req.user, members: members });
};

exports.memberMessages = async (req, res, next) => {
    const { id } = req.params;
    try {
        if (req.user) {
            const username = req.user.username;
            const messages = await db.getMessagesById(id);
            return res.render("template", { title: `${username} Messages`, body: "members/messages", user: req.user, messages: messages });
        }
        return res.redirect("/sign-in");
    } catch (error) {
        return next(error);
    }
}