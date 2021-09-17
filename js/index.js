var loaded = false

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
