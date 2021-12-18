const express = require("express");
const router = express.Router();

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    };

    res.redirect("/login");
};

router.route("/:main/:year?/:week?/:day?")
.get(checkAuthenticated, (req, res) => {
    var main = req.params.main;
    var year = req.params.year;
    var week = req.params.week;
    var day = req.params.day;
    var path = main;
    
    if (year) {
        path += "/" + year;
    };

    if (week) {
        path += "/" + week;
    };

    if (day) {
        path += "/" + day;
    };

    res.sendFile("/JaniArchives/Branches/" + path + ".html", {'root': __dirname + "/.."});
});

module.exports = router;