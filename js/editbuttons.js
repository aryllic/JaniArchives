var body, maincontent;

function starteditbuttons() {
    body = document.getElementsByTagName("body")[0];
    maincontent = document.getElementById("main-content");
    items = document.getElementsByClassName("item");
    itemarray = [].slice.call(items);
    editbuttons = document.getElementsByClassName("edit-button");
    editbuttonarray = [].slice.call(editbuttons);
    addbuttons = document.getElementsByClassName("add-button");
    addbuttonarray = [].slice.call(addbuttons);
    savebuttons = document.getElementsByClassName("save-button");
    savebuttonarray = [].slice.call(savebuttons);
    itemforms = document.getElementsByClassName("item-form");
    itemformarray = [].slice.call(itemforms);

    itemarray.forEach(item => {
        item.addEventListener("mousedown", function() {
            item.holding = true;
            console.log(item.holding);
        });

        item.addEventListener("mouseup", function() {
            item.holding = false;
            console.log(item.holding);
        });
    });

    editbuttonarray.forEach(btn => {
        btn.hidden = false;
        
        btn.addEventListener("click", function() {
            console.log(body.innerHTML);
        });
    });

    addbuttonarray.forEach(btn => {
        btn.hidden = false;
        
        btn.addEventListener("click", function() {
            maincontent.innerHTML += "<div class='item'>\n<form class='item-form'>\n<input type='text' placeholder='Item' id='itemname'>\n</form>\n</div>\n";
            starteditbuttons();
        });
    });

    savebuttonarray.forEach(btn => {
        btn.hidden = true;
        
        btn.addEventListener("click", function() {
            console.log("Save");
        });
    });

    itemformarray.forEach(frmitem => {
        
        frmitem.addEventListener("submit", function(frm) {
            frm.preventDefault();
            frmitem.parentElement.innerHTML = "\n<a href=''>" + frmitem.itemname.value + "</a>";
        });
    });
};
