var body, mainContent

var sendItemArray = []

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

function uploadImage(url, data) {
    const promise = new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.open("POST", url);

        xhr.responseType = "json";

        xhr.addEventListener("load", function() {
            if (xhr.status >= 400) {
                reject(xhr.response);
            } else {
                const data = resolve(xhr.response);
            };
        });

        xhr.send(data);
    });

    return promise;
};

function logOut() {
    newXHR("DELETE", "http://178.190.235.224:443/home")
            .then(responseData => {
                if (responseData && responseData.success == false) {
                    console.log(responseData.errormsg);
                } else {
                    window.location.assign("/login");
                };
            })
            .catch(err => {
                if (err) {
                    console.log(err);
                };
            });
};

async function startEditButtons() {
    body = document.getElementsByTagName("body")[0];
    mainContent = document.getElementById("main-content");
    items = document.getElementsByClassName("item");
    itemArray = [].slice.call(items);
    editButtons = document.getElementsByClassName("edit-button");
    editButtonArray = [].slice.call(editButtons);
    addButtons = document.getElementsByClassName("add-button");
    addButtonArray = [].slice.call(addButtons);
    saveButtons = document.getElementsByClassName("save-button");
    saveButtonArray = [].slice.call(saveButtons);
    imgButtons = document.getElementsByClassName("img-displaybutton");
    imgButtonArray = [].slice.call(imgButtons);
    uploadButtons = document.getElementsByClassName("upload-button");
    uploadButtonArray = [].slice.call(uploadButtons);
    itemForms = document.getElementsByClassName("item-form");
    itemFormArray = [].slice.call(itemForms);
    imageForms = document.getElementsByClassName("image-form");
    imageFormArray = [].slice.call(imageForms);

    function addButtonHidden(bool) {
        addButtonArray.forEach(btn => {
            btn.hidden = bool;            
        });
    };

    function imgButtonHidden(bool) {
        imgButtonArray.forEach(btn => {
            btn.hidden = bool;            
        });
    };

    function uploadButtonHidden(bool) {
        uploadButtonArray.forEach(btn => {
            btn.hidden = bool;            
        });
    };

    function saveButtonHidden(bool) {
        saveButtonArray.forEach(btn => {
            btn.hidden = bool;        
        });
    };

    itemArray.forEach(item => {
        item.addEventListener("mousedown", function() {
            item.holding = true;
            console.log(item.holding);
        });

        item.addEventListener("mouseup", function() {
            item.holding = false;
            console.log(item.holding);
        });
    });

    editButtonArray.forEach(btn => {
        var sendData = {
            getUser: true
        };
        
        newXHR("POST", "http://178.190.235.224:443/home", sendData)
            .then(responseData => {
                if (responseData) {
                    btn.hidden = (responseData.isOwner != true);
                };
            })
            .catch(err => {
                if (err) {
                    console.log(err);
                };
            });
        
        btn.addEventListener("click", function() {
            addButtonHidden(false);
            saveButtonHidden(false);
            imgButtonHidden(false);
            uploadButtonHidden(false);
        });
    });

    addButtonArray.forEach(btn => {
        btn.hidden = true;
        
        btn.addEventListener("click", function() {
            mainContent.innerHTML += "<div class='item'>\n<form class='item-form'>\n<input type='text' placeholder='Item' id='itemname'>\n</form>\n</div>\n";
            startEditButtons();
        });
    });

    imgButtonArray.forEach(btn => {
        btn.hidden = true;

        setInterval(function() {
            if (document.getElementById("uploadimg").files[0]) {
                btn.style.background = "#3ea2ffb7"
            } else {
                btn.style.background = "#efefef"
            };
        }, 1000 / 24);

        btn.addEventListener("click", function() {
            document.getElementById("uploadimg").click();
        });
    });

    uploadButtonArray.forEach(btn => {
        btn.hidden = true;
    });

    saveButtonArray.forEach(btn => {
        btn.hidden = true;
        
        btn.addEventListener("click", function() {
            addButtonHidden(true);
            saveButtonHidden(true);
            imgButtonHidden(true);
            uploadButtonHidden(true);

            itemArray.forEach(item => {
                item.text = item.innerText;
                item.html = item.innerHTML;
            });

            var pageUrl = window.location.href.replace("http://178.190.235.224:443", "");
            var shortUrl = pageUrl;
            
            if (pageUrl.substring(0, 10) == "/Branches/") {
                shortUrl = pageUrl.substring(0, pageUrl.length - 1).replace("/Branches/", "");
            };

            var sendData = {
                savePage: true,
                url: shortUrl,
                content: itemArray,
                savingPageContent: "<!DOCTYPE html>\n" + document.documentElement.outerHTML
            };

            newXHR("POST", "http://178.190.235.224:443/editbuttons", sendData)
            .then(responseData => {
                if (responseData) {
                    //console.log(responseData);
                };
            })
            .catch(err => {
                if (err) {
                    console.log(err);
                };
            });
        });
    });

    itemFormArray.forEach(frmItem => {        
        frmItem.addEventListener("submit", function(frm) {
            frm.preventDefault();

            var pageUrl = window.location.href.replace("http://178.190.235.224:443", "");
            var shortUrl = pageUrl;

            if (pageUrl.substring(0, 10) == "/Branches/") {
                shortUrl = pageUrl.replace("/Branches/", "");
                frmItem.parentElement.innerHTML = "\n<a href='/Branches/" + shortUrl + frmItem.itemname.value + "'>" + frmItem.itemname.value + "</a>\n";
            } else {
                frmItem.parentElement.innerHTML = "\n<a href='/Branches/" + frmItem.itemname.value + "'>" + frmItem.itemname.value + "</a>";
            };
        });
    });

    imageFormArray.forEach(frmItem => {        
        frmItem.addEventListener("submit", function(frm) {
            if (document.getElementById("uploadimg").files[0]) {
                frm.preventDefault();

                const formData = new FormData();
                formData.append("image", document.getElementById("uploadimg").files[0]);
    
                uploadImage("http://178.190.235.224:443/uploadimg", formData)
                .then(responseData => {
                    if (responseData) {
                        if (responseData && responseData.success == true) {
                            mainContent.innerHTML += "<div class='item'>\n<img id='img-item' src='../../../../../pic/" + responseData.fileName + "'>\n</div>\n";
                            startEditButtons();
                        };
                    };
                })
                .catch(err => {
                    if (err) {
                        console.log(err);
                    };
                });
            };
        });
    });
};
