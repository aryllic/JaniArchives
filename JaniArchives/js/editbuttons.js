var body, mainContent;

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

function logOut() {
    newXHR("DELETE", "http://10.0.0.8:3000/home")
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

function startEditButtons() {
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
    itemForms = document.getElementsByClassName("item-form");
    itemFormArray = [].slice.call(itemForms);

    function addButtonHidden(bool) {
        addButtonArray.forEach(btn => {
            btn.hidden = bool;            
        });
    }

    function saveButtonHidden(bool) {
        saveButtonArray.forEach(btn => {
            btn.hidden = bool;        
        });
    }

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
        btn.hidden = false;
        
        btn.addEventListener("click", function() {
            console.log(body.innerHTML);
            addButtonHidden(false);
            saveButtonHidden(false);
        });
    });

    addButtonArray.forEach(btn => {
        btn.hidden = true;
        
        btn.addEventListener("click", function() {
            mainContent.innerHTML += "<div class='item'>\n<form class='item-form'>\n<input type='text' placeholder='Item' id='itemname'>\n</form>\n</div>\n";
            startEditButtons();
        });
    });

    saveButtonArray.forEach(btn => {
        btn.hidden = true;
        
        btn.addEventListener("click", function() {
            console.log("Save");
            addButtonHidden(true);
            saveButtonHidden(true);
        });
    });

    itemFormArray.forEach(frmItem => {        
        frmItem.addEventListener("submit", function(frm) {
            frm.preventDefault();
            frmItem.parentElement.innerHTML = "\n<a href='/Branches/" + frmItem.itemname.value + "'>" + frmItem.itemname.value + "</a>";
        });
    });
};
