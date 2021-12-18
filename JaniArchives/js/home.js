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

function loadUsername() {
    var usernameLabel = document.getElementById("username-label");
    var username;

    var sendData = {
        getUser: true
    };
    
    newXHR("POST", "http://10.0.0.8:3000/home", sendData)
        .then(responseData => {
            if (responseData && responseData.username) {
                username = responseData.username;
                usernameLabel.innerText = "Logged in as: " + username;
            };
        })
        .catch(err => {
            if (err) {
                console.log(err);
            };
        });
};
