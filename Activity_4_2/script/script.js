//variables de inputs
var accesibilityPopup = document.querySelector(".accesibilityPopup");
var accesibilityBtn = document.getElementById("accesibilityBtn");
var saveAccesibility = document.getElementById("saveAccesibility");
var colorMode = document.getElementById("colorMode");
var size = document.getElementById("size");
var letterSpacing = document.getElementById("letterSpacing");
var lineSpacing = document.getElementById("lineSpacing");
var wordSpacing = document.getElementById("wordSpacing");
//donde se aplican los cambios al css y clases
var body = document.querySelector("body");
var html = document.querySelector("html");
//reinicio al formulario
size.value=100;
letterSpacing.value=0;
lineSpacing.value=0;
wordSpacing.value=0;
colorMode.value="normal";

//eventos
accesibilityPopup.style.display = "none";
accesibilityBtn.addEventListener("click", () => {
  accesibilityPopup.style.display = "flex";
});
saveAccesibility.addEventListener("click", () => {
  accesibilityPopup.style.display = "none";
});

colorMode.addEventListener("change", (e) => {
  body.classList = e.target.value;
});

size.addEventListener("change", (e) => {
  html.style.fontSize = e.target.value+"%";
});

letterSpacing.addEventListener("change", (e)=>{
  html.style.letterSpacing = e.target.value + "px";
})

wordSpacing.addEventListener("change", (e)=>{
  html.style.wordSpacing = e.target.value + "px";
})

lineSpacing.addEventListener("change", (e)=>{
  html.style.lineSpacing = e.target.value + "px";
})