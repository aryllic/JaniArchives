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

function startRegister() {
    var registerForm = document.getElementById("register-form");
    var errormsg = document.getElementById("errormsg");

    registerForm.addEventListener("submit", function (formv) {
        formv.preventDefault();

        var sendData = {
            username: registerForm.username.value,
            password: registerForm.password.value,
            confirmpassword: registerForm.confirmpassword.value
        };

        newXHR("POST", "http://10.0.0.8:3000/register", sendData)
            .then(responseData => {
                if (responseData && responseData.success == false) {
                    errormsg.innerText = responseData.errormsg;
                    errormsg.hidden = false;
                } else {
                    window.location.assign("/login");
                };
            })
            .catch(err => {
                if (err) {
                    console.log(err);
                };
            });
    });
};
