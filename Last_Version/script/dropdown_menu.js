let menuBtn = document.getElementById("dropdown");
let dropdownMenu = document.getElementById("dropdownMenu");
let hidden = true;

menuBtn.addEventListener("click", ()=>{
    if(hidden){
        dropdownMenu.classList.add("dropdown-display");
    }
    else{
        dropdownMenu.classList.remove("dropdown-display");
    }
    hidden = !hidden;

});