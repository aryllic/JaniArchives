var msgForm, chatBox, ip, username, scrollHeight, chatHeight;

scrollHeight = 0;
chatHeight = 0;

function newXHR(method, url, data) {
    const promise = new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open(method, url);

        xhr.responseType = "json";
        
        if (data) {
            xhr.setRequestHeader("Content-Type", "application/json");
        };

        xhr.addEventListener("load", function() {
            if (xhr.status >= 400) {
                reject(xhr.response);
            } else {
                const data = resolve(xhr.response);
            };
        });

        xhr.send(JSON.stringify(data));
    });

    return promise;
};

function SetIP(IP) {
    if (IP != "0") {
        ip = IP;
        //chatBox.innerHTML += "<div class='msg-ann'>" + IP + " entered the chat!" + "</div>";
    } else {
        ip = "**OWNER**";
        //chatBox.innerHTML += "<div class='msg-ann'>" + "The owner entered the chat!" + "</div>";
    }
}

fetch('https://api.ipify.org/?format=json')
    .then(results => results.json())
    .then(data => SetIP(data.ip));

function sortmsgs() {
    chatHeight = -chatBox.clientHeight + 15;

    for (var i = chatBox.children.length - 1; i >= 0; i--) {
        var chatBoxChild = chatBox.children[i];

        chatHeight += chatBox.children[i].clientHeight + 15;

        if (i < chatBox.children.length - 1) {
            chatBoxChild.style.bottom = chatBox.children[i + 1].style.bottom.split("px")[0] * 1 + chatBox.children[i + 1].clientHeight + 15 + "px";
        } else {
            chatBoxChild.style.bottom = 15 - scrollHeight + "px";
        };
    };

    scrollHeight = Math.min(Math.max(scrollHeight, 0), chatHeight);
};

function getmsgs() {
    var sendData = {
        getMessages: true
    };

    newXHR("POST", "http://178.190.235.224:443/chat", sendData)
        .then(responseData => {
            if (responseData.msgs) {
                var messagearray = "";

                responseData.msgs.forEach(msg => {
                    if (msg.username == username) {
                        messagearray += "<div class='msg-cl'><div class='name'>" + msg.username + "</div>" + msg.msg + "</div>";
                    } else if (msg.username == "announcement") {
                        messagearray += "<div class='msg-ann'>" + msg.msg + "</div>";
                    } else if (msg.username != username) {
                        messagearray += "<div class='msg-s'><div class='name'>" + msg.username + "</div>" + msg.msg + "</div>";
                    };
                });

                chatBox.innerHTML = messagearray;                
                sortmsgs();
            };
        })
        .catch(err => {
            if (err) {
                console.log(err);
            };
        });
}

function startChat() {
    msgForm = document.getElementById("message-form");
    chatBox = document.getElementById("chat-box");

    var sendData = {
        getUser: true
    };

    newXHR("POST", "http://178.190.235.224:443/chat", sendData)
        .then(responseData => {
            if (responseData && responseData.username) {
                username = responseData.username;
            } else {
                window.location.assign("/home");
            };
        })
        .catch(err => {
            if (err) {
                console.log(err);
            };
        });

    setInterval(getmsgs, 500);

    setInterval(sortmsgs, 1000 / 30);

    msgForm.addEventListener("submit", function (frm) {
        frm.preventDefault();

        var sendData = {
            message: msgForm.messagebox.value
        };

        if (msgForm.messagebox.value != "") {
            newXHR("POST", "http://178.190.235.224:443/chat", sendData)
                .then(responseData => {
                    if (responseData) {
                        //console.log(responseData)
                    };
                })
                .catch(err => {
                    if (err) {
                        console.log(err);
                    };
                });
        };

        msgForm.messagebox.value = "";
    });

    chatBox.addEventListener("mousedown", function(mouse) {
        scrollStartHeight = scrollHeight;
        mouseStartHeight = mouse.screenY;

        mouseScrollUpdate = setInterval(function() {
            scrollHeight = Math.min(Math.max(scrollStartHeight + (mouseStartHeight - mouseendheight) * -1, 0), chatHeight);
        }, 1000 / 30);
    });

    document.addEventListener("mouseup", function(mouse) {
        mouseendheight = mouse.screenY;

        clearInterval(mouseScrollUpdate);
    });

    chatBox.addEventListener("mousemove", function(mouse) {
        mouseendheight = mouse.screenY;
    });
};
