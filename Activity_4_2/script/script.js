flag = false

function changeTextSize() {
    var input = document.getElementById('font-size').value;
    document.querySelector(".form").style.fontSize = input + "em";
  }

function changeSeparation() {
  var input = document.getElementById('separation').value;
  document.querySelector(".form").style.letterSpacing = input + "em";
}

function bold() {
  if(flag==false){
    document.querySelector(".form").style.fontWeight = "bolder" 
    flag =true}
    else{    
    document.querySelector(".form").removeAttribute("style")
    flag =false
}
}
  
function grayScale(){

}
function darkContrast(){

}
function lightContrast(){

}
function highSaturation(){

}
function lowSaturation(){
  
}