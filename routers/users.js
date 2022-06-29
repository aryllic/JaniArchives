const express = require("express");
const router = express.Router();
const fs = require("fs");

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    };

    res.redirect("/login");
};

function getUser(user) {
    return {
        id: user.id,
        lastOnline: user.lastOnline,
        username: user.username,
        isOwner: user.isOwner
    };
};

router.route("/:id")
.get(checkAuthenticated, (req, res) => {
    if (!req.user.isOwner) {
        res.redirect("/home");
        return
    };

    var searchId = Number(req.params.id);
    var users = JSON.parse(fs.readFileSync(__dirname + "/../users.json"));
    var searchUser = users.find(user => user.id === searchId);

    if (searchUser && !searchUser.isOwner) {
        var userInfo = getUser(searchUser);

        res.send(userInfo);
    } else {
        res.status(404).send("404: User not found!");
    };
});

module.exports = router;