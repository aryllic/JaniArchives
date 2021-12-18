var msgForm, chatBox, ip, username;

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
                console.log(data);
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
    .then(data => SetIP(data.ip))

function getmsgs() {
    var sendData = {
        getMessages: true
    }

    newXHR("POST", "http://10.0.0.8:3000/chat", sendData)
        .then(responseData => {
            if (responseData.msgs) {
                console.log(responseData.msgs)
            };
        })
        .catch(err => {
            if (err) {
                console.log(err);
            };
        });
}

function sortmsgs() {
    for (var i = chatBox.children.length - 1; i >= 0; i--) {
        var chatBoxChild = chatBox.children[i];

        if (i < chatBox.children.length - 1) {
            chatBoxChild.style.bottom = chatBox.children[i + 1].style.bottom.split("px")[0] * 1 + chatBox.children[i + 1].clientHeight + 15 + "px";
        } else {
            chatBoxChild.style.bottom = "15px";
        };
    };
};

function startChat() {
    msgForm = document.getElementById("message-form");
    chatBox = document.getElementById("chat-box");

    setInterval(sortmsgs, 1000 / 24);

    var sendData = {
        getUser: true
    }

    newXHR("POST", "http://10.0.0.8:3000/chat", sendData)
        .then(responseData => {
            if (responseData && responseData.username) {
                username = responseData.username
                chatBox.innerHTML += "<div class='msg-ann'>" + username + " entered the chat!" + "</div>";
            } else {
                window.location.assign("/home");
            };
        })
        .catch(err => {
            if (err) {
                console.log(err);
            };
        });

        //setInterval(getmsgs, 1000);

    msgForm.addEventListener("submit", function (frm) {
        frm.preventDefault();

        var sendData = {
            message: msgForm.messagebox.value
        }

        if (msgForm.messagebox.value != "") {
            newXHR("POST", "http://10.0.0.8:3000/chat", sendData)
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

            chatBox.innerHTML += "<div class='msg-cl'>" + msgForm.messagebox.value + "</div>";
        };

        msgForm.messagebox.value = "";
    });
};
