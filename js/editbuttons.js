var maincontent, editbuttons, buttonarray

function starteditbuttons() {
    maincontent = document.getElementById("main-content")
    editbuttons = document.getElementsByClassName("edit-button");
    buttonarray = [].slice.call(editbuttons);

    buttonarray.forEach(btn => {
        btn.hidden = true
        
        btn.addEventListener("click", function() {
            console.log("Edit")
        });
    });
};
