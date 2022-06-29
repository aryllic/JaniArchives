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
const multer = require("multer");

var storage = multer.diskStorage(
    {
        destination: __dirname + "/JaniArchives/pic",
        filename: function(req, file, cb) {
            cb(null, Date.now().toString() + "-" + file.originalname);
        }
    }
);

const multerUpload = multer({
    storage: storage,
    limits: {
        fileSize: 5000000
    }
});

const app = express();
const port = 443;

const userFilePath = "./users.json";
const messagesFilePath = "./messages.json";

const initializePassport = require("./passport-config");
initializePassport(passport, username => {
    var users = JSON.parse(fs.readFileSync(userFilePath));
    return users.find(user => user.username === username);
}, id => {
    var users = JSON.parse(fs.readFileSync(userFilePath));
    return users.find(user => user.id === id);
});

var newPageContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Inhalsverzeichnis - JaniArchives</title>
    <link rel="shortcut icon" type="image/png" href="../../../../../pic/favicon.png">
    <link rel="stylesheet" href="../../../../../css/style.css">
    <script src="../../../../../js/editbuttons.js"></script>
</head>
<body onload="startEditButtons()">
    <header class="branch-header">
        <div class="content">
            JaniArchives
        </div>
    </header>
    <div class="main-content" id="main-content">
        <button class="edit-button" hidden>Edit</button>
        <button class="save-button" hidden>Save</button>
        <button class="add-button" hidden>Add</button>
        <button class="img-displaybutton" hidden="">Select Image</button>
        <form class="image-form" enctype="multipart/form-data">
            <input class="img-button" id="uploadimg" type="file" accept="image/*" name="image" hidden="">
            <button class="upload-button" hidden="">Upload</button>
        </form>
    </div>
    <footer id="footer" class="footer">
        <div class="content">
            <div class="sub-content">
                [[FILENAME TO REPLACE]]
            </div>
        </div>
    </footer>
</body>
</html>`

function filterString(string) {
    var modifiedString = string;

    for (var i = 0; i < string.length; i++) {
        modifiedString = modifiedString.replace("<", "").replace(">", "").replace(":thumbsup:", "👍").replace(":valentin:", "🤓").replace(":)", "Ich stinke!");
    };

    return modifiedString;
};

function addUser(data) {
    var userFile = fs.readFileSync(userFilePath);
    var toWrite = JSON.parse(userFile);

    toWrite.push(data);

    fs.writeFileSync(userFilePath, JSON.stringify(toWrite), {"encoding": "utf8", "flags": "a"}, function (err) {
        if (err) {
            return console.log(err);
        };
    });
};

function editUser(username, keyToEdit, value) {
    var userFile = fs.readFileSync(userFilePath);
    var toWrite = JSON.parse(userFile);
    var user = toWrite.find(user => user.username === username);

    if (user && keyToEdit && value) {
        user[keyToEdit] = value;
    } else {
        console.log("Something went wrong while editing user: " + username);
    };

    fs.writeFileSync(userFilePath, JSON.stringify(toWrite), {"encoding": "utf8", "flags": "a"}, function(err) {
        if (err) {
            return console.log(err);
        };
    });
};

function getUser(user) {
    return {
        id: user.id,
        lastOnline: user.lastOnline,
        username: user.username,
        isOwner: user.isOwner
    };
};

function addMessage(data) {
    var messageFile = fs.readFileSync(messagesFilePath);
    var toWrite = JSON.parse(messageFile);

    toWrite.push(data);

    fs.writeFileSync(messagesFilePath, JSON.stringify(toWrite), {"encoding": "utf8", "flags": "a"}, function(err) {
        if (err) {
            return console.log(err);
        };
    });
};

function createFile(fileName, fileContent) {
    if (fileName != "" && fileName != ".html") {
        fs.access(__dirname + "/JaniArchives/Branches/" + fileName, function(err) {
            if (err) {
                fs.writeFileSync(__dirname + "/JaniArchives/Branches/" + fileName, fileContent, function(err) {
                    if (err) {
                      console.error(err);
                      return;
                    };
                });
            } else {
                console.log("File '" + fileName + "' already exists!");
            };
        });
    };
};

function overwriteFile(fileName, fileContent) {
    //if (!fileName == "" && !fileName == ".html") {
        fs.writeFileSync(__dirname + "/JaniArchives/" + fileName, fileContent, function (err) {
            if (err) {
                console.error(err);
                return;
            };
        });
    //};
};

function createFolder(folderName) {
    if (folderName != "") {
        fs.access(__dirname + "/JaniArchives/Branches/" + folderName, function(err) {
            if (err && !folderName == "") {
                fs.mkdirSync(__dirname + "/JaniArchives/Branches/" + folderName, function(err) {
                    if (err) {
                      console.error(err);
                      return;
                    };
                });
            } else {
                console.log("Directory '" + folderName + "' already exists!");
            };
        });
    };
};

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

function checkOwner(req, res, next) {
    if (!req.user.isOwner) {
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
const userRouter = require("./routers/users");
app.use("/users", userRouter);

app.get('/', checkNotAuthenticated, function(req, res) {
    res.redirect("/login");
});

app.get('/home', checkAuthenticated, function(req, res) {
    res.sendFile(__dirname + "/JaniArchives/home.html");
});

app.post('/home', checkAuthenticated, function(req, res) {
    if (req.body.getUser && req.body.getUser == true) {
        res.send(getUser(req.user));
    };
});

app.delete("/home", checkAuthenticated, function(req, res) {
    req.logOut();
    res.send({
        success: true,
        errormsg: ""
    });
});

app.get('/chat', checkAuthenticated, function(req, res) {
    res.sendFile(__dirname + "/JaniArchives/chat.html");
});

app.post("/chat", checkAuthenticated, function(req, res) {
    if (req.body.getUser && req.body.getUser == true) {
        addMessage({
            username: "announcement",
            msg: req.user.username + " entered the chat!"
        });

        res.send(getUser(req.user));
    } else if (req.body.getMessages && req.body.getMessages == true) {
        res.send({
            msgs: JSON.parse(fs.readFileSync(messagesFilePath))
        });
    } else if (req.body.message) {
        addMessage({
            username: req.user.username,
            msg: filterString(req.body.message.substring(0, 500))
        });
    
        res.send({
            success: true,
            errormsg: ""
        });
    };
});

app.get('/register', checkNotAuthenticated, function(req, res) {
    res.sendFile(__dirname + "/JaniArchives/register.html");
});

app.post("/register", checkNotAuthenticated, async(req, res) => {
    var users = JSON.parse(fs.readFileSync(userFilePath));

    if (req.body.username && req.body.username.length > 2 && !users.find(user => user.username === req.body.username) && req.body.password && req.body.confirmpassword && req.body.password == req.body.confirmpassword) {
        try {
            const hashedPassword = await bcrypt.hash(req.body.password, 10);

            addUser({
                id: users.length,
                lastonline: null,
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

app.get('/login', checkNotAuthenticated, function(req, res) {
    res.sendFile(__dirname + "/JaniArchives/login.html");
});

app.post("/login", checkNotAuthenticated, function(req, res, next) {
    passport.authenticate("local", (err, user, info) => {
        if (!req.body.username || !req.body.password) {
            return res.send({
                success: false,
                errormsg: "Missing credentials!"
            });
        };
        
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

            var date = new Date;
            var DateString = date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear() + "-" + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();

            editUser(user.username, "lastOnline", DateString);

            return res.send({
                success: true,
                errormsg: ""
            });
        });
    })(req, res, next);
});

app.post("/editbuttons", checkAuthenticated, checkOwner, function(req, res) {
    if (req.body.savePage && req.body.savePage == true) {
        if (req.body.url == "/home") {
            req.body.content.forEach(item => {
                createFile(item.text + ".html", newPageContent.replace("[[FILENAME TO REPLACE]]", item.text));
                createFolder(item.text);
            });

            overwriteFile("home.html", req.body.savingPageContent.replace("Logged in as: " + req.user.username, "Logged in as: "));
        } else {
            req.body.content.forEach(item => {
                createFile(req.body.url + "/" + item.text + ".html", newPageContent.replace("[[FILENAME TO REPLACE]]", req.body.url + "/" + item.text));
                createFolder(req.body.url + "/" + item.text);
            });

            overwriteFile("Branches/" + req.body.url + ".html", req.body.savingPageContent);
        };

        res.send({
            success: true,
            errormsg: ""
        });
    };
});

app.post("/uploadimg", checkAuthenticated, checkOwner, multerUpload.single("image"), function(req, res) {
    if (req.file && (req.file.mimetype == "image/png" || req.file.mimetype == "image/jpeg")) {
        res.send({
            success: true,
            errormsg: "",
            fileName: req.file.filename
        });
    } else {
        res.redirect("/home");
    };
});

app.get('*', function(req, res) {
    res.status(404).send("404: Page not found!");
});

app.listen(port, "0.0.0.0", function(err) {
    if (err) {
        console.log(err);
    };

	console.log("Server started on port: " + port);
});
