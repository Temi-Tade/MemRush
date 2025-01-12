function CREATE_DIALOG(content) {
    MODALBG.style.display = "block";
    MODALBG.animate({
        opacity: ["0","1"],
    }, {
        duration: 300,
        iterations: 1
    });
    MODAL.innerHTML = content
}

function REMOVE_DIALOG() {
    setTimeout(function(){
        MODALBG.style.display = "none";
    }, 300);
    MODALBG.animate({
        opacity: ["1","0"],
    }, {
        duration: 350,
        iterations: 1
    });
}