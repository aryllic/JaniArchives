const fetchurl = "https://discord.com/api/webhooks/913863782437101569/l_JLCLy8QWQMTecRyf_fKOv9k785e8JiHa2g9A_UlhKT6CDj3SPhgIOXZfbam6gevi6N"
var msgform, chatbox, ip;

function SetIP(IP) {
    if (IP != "85.90.159.118") {
        ip = IP;
        chatbox.innerHTML += "<div class='msg-ann'>" + IP + " entered the chat!" + "</div>";
    } else {
        ip = "**OWNER**";
        chatbox.innerHTML += "<div class='msg-ann'>" + "The owner entered the chat!" + "</div>";
    }
}

fetch('https://api.ipify.org/?format=json')
    .then(results => results.json())
    .then(data => SetIP(data.ip))

function sortmsgs() {
    for (var i = chatbox.children.length - 1; i >= 0; i--) {
        var chatboxchild = chatbox.children[i];

        if (i < chatbox.children.length - 1) {
            chatboxchild.style.bottom = chatbox.children[i + 1].style.bottom.split("px")[0] * 1 + chatbox.children[i + 1].clientHeight + 15 + "px";
        } else {
            chatboxchild.style.bottom = "15px";
        };
    };
};

function startchat() {
    msgform = document.getElementById("message-form");
    chatbox = document.getElementById("chat-box");

    setInterval(sortmsgs, 1000 / 24);

    //setInterval(pingmths, 30000);

    msgform.addEventListener("submit", function (frm) {
        frm.preventDefault();

        if (msgform.messagebox.value != "") {
            chatbox.innerHTML += "<div class='msg-cl'>" + msgform.messagebox.value + "</div>";

            const msg = { "content": "New message from " + ip + ": " + msgform.messagebox.value }
            fetch(fetchurl + "?wait=true",
                {
                    "method": "POST",
                    "headers": { "content-type": "application/json" },
                    "body": JSON.stringify(msg)
                });
        };

        msgform.messagebox.value = "";
    });
};

/*
if (msgform.messagebox.value != "") {
    const data = {"content": msgform.messagebox.value};

    fetch(fetchurl + "?wait=true",
    {"method":"POST",
    "headers": {"content-type": "application/json"},
    "body": JSON.stringify(data)})
     .then(response => {
        return response.json();
    })
    .then(resdata => {
          chatbox.innerHTML += "<div class='msg-cl'>" + resdata.content + "</div>";
          sortmsgs();
    })
    .catch(error => console.log("ERROR: " + error));
};
*/
