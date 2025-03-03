import { firstLogIn, loginRedirect, userLogIn } from "./auth.js";

$(() => {
  $("#form").append("<p class='err hidden'></p>");
  $("#form").on("submit", async (event) => {
    event.preventDefault();
    let email = $("#email").val().trim();
    let password = $("#pwd").val().trim();
    if (email != "" && password != "") {
      let index = await userLogIn(email, password);

      console.log(index);
      if (index == -1) {
        $(".err").removeClass("hidden");
        $(".err").addClass("text-red-400");

        $(".err").text("Correu electrònic o contrasenya no vàlids");
      } else {
        $(".err").removeClass("hidden");
        $(".err").addClass("text-green-500");
        $(".err").text("Inici de sessió amb èxit");
        localStorage.setItem("logged_user", index)
        await firstLogIn();
        await loginRedirect();
      }
    }
    else{
        $(".err").removeClass("hidden");
        $(".err").addClass("text-red-400");
        $(".err").text("Els camps no poden estar buits");
    }
  });
});
