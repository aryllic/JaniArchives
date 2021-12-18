if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
};

const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const bcrypt = require("bcrypt");
const passport = require("passport");
const flash = require("express-flash");
const session = require("express-session");

const app = express();
const port = 3000;

var users = [];

var messages = [];

const initializePassport = require("./passport-config");
initializePassport(passport, username => {
    return users.find(user => user.username === username);
}, id => {
    return users.find(user => user.id === id);
});

var newPageContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Inhalsverzeichnis - JaniArchives</title>
    <link rel="shortcut icon" type="image/png" href="../../pic/favicon.png">
    <link rel="stylesheet" href="../../css/style.css">
    <script src="../../js/editbuttons.js"></script>
</head>
<body onload="startEditButtons()">
    <header class="branch-header">
        <div class="content">
            JaniArchives
        </div>
    </header>
    <div class="main-content" id="main-content">
        <button class="edit-button">Edit</button>
        <button class="save-button">Save</button>
        <button class="add-button">Add</button>
    </div>
    <footer id="footer" class="footer">
        <div class="content">

        </div>
    </footer>
</body>
</html>`

function createFile(fileName, fileContent) {
	fs.writeFile(__dirname + "/JaniArchives/Branches/" + fileName, fileContent, err => {
		if (err) {
		  console.error(err);
		  return;
		};
	});
};

createFile("German.html", newPageContent);
createFile("Mathe.html", newPageContent);

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    };

    res.redirect("/login");
};

function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect("/home")
    };

    next();
};

app.use(flash());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.json());
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(express.static(__dirname + "/JaniArchives"));

const branchesRouter = require("./routers/branches");
app.use("/Branches", branchesRouter);

app.get('/', checkNotAuthenticated, function(req, res) {
    res.redirect("/login");
});

app.get('/login', checkNotAuthenticated, function(req, res) {
    res.sendFile(__dirname + "/JaniArchives/login.html");
});

app.get('/register', checkNotAuthenticated, function(req, res) {
    res.sendFile(__dirname + "/JaniArchives/register.html");
});

app.get('/home', checkAuthenticated, function(req, res) {
    res.sendFile(__dirname + "/JaniArchives/home.html");
});

app.post('/home', function(req, res) {
    if (req.body.getUser && req.body.getUser == true) {
        res.send({
            id: req.user.id,
            username: req.user.username
        });
    };
});

app.delete("/home", function(req, res) {
    req.logOut();
    res.send({
        success: true,
        errormsg: ""
    });
});

app.get('/chat', checkAuthenticated, function(req, res) {
    res.sendFile(__dirname + "/JaniArchives/chat.html");
});

app.post("/chat", function(req, res) {
    if (req.body.getUser && req.body.getUser == true) {
        res.send({
            id: req.user.id,
            username: req.user.username
        });
    } else if (req.body.getMessages && req.body.getMessages == true) {
        res.send({
            msgs: messages
        });
    } else if (req.body.message) {
        messages.push({
            username: req.user.username,
            msg: req.body.message
        });
    
        res.send({
            success: true,
            errormsg: ""
        });
    };
});

app.get('*', function(req, res) {
    res.status(404).send("404: Page not found!");
});

app.post("/register", checkNotAuthenticated, async(req, res) => {
    if (req.body.username && req.body.username.length > 2 && !users.find(user => user.username === req.body.username) && req.body.password && req.body.confirmpassword && req.body.password == req.body.confirmpassword) {
        try {
            const hashedPassword = await bcrypt.hash(req.body.password, 10);

            users.push({
                id: Date.now().toString(),
                username: req.body.username,
                password: hashedPassword
            });

            res.send({
                success: true,
                errormsg: ""
            });
        } catch {
            res.send({
                success: false,
                errormsg: "Internal error!"
            });
        };
    } else if (!req.body.username) {
        res.send({
            success: false,
            errormsg: "Please enter a Username!"
        });
    } else if (req.body.username.length <= 2) {
        res.send({
            success: false,
            errormsg: "Username must be longer than two characters!"
        });
    } else if (users.find(user => user.username === req.body.username)) {
        res.send({
            success: false,
            errormsg: "Username already taken!"
        });
    } else if (!req.body.password) {
        res.send({
            success: false,
            errormsg: "Please enter a Password!"
        });
    } else if (req.body.password != req.body.confirmpassword) {
        res.send({
            success: false,
            errormsg: "Passwords don't match!"
        });
    };
});

app.post("/login", checkNotAuthenticated, function(req, res, next) {
    passport.authenticate("local", (err, user, info) => {
        if (info) {
            return res.send({
                success: false,
                errormsg: info.message
            });
        };

        if (err) {
            return next(err);
        };

        if (!user) {
            return res.send({
                success: false,
                errormsg: "User not found!"
            });
        };

        req.logIn(user, function(err) {
            if (err) {
                return next(err);
            };

            return res.send({
                success: true,
                errormsg: ""
            });
        });
    })(req, res, next);
});

app.listen(port, "0.0.0.0", function(err) {
    if (err) {
        console.log(err);
    };

	console.log("Server started on port: " + port);
});
