$(() => {
  $("#form").append("<p class='err hidden'></p>");
  $("#form").on("submit", (event) => {
    event.preventDefault();
    let email = $("#email").val().trim();
    let password = $("#pwd").val().trim();
    if (email != "" && password != "") {
      let index = userLogIn(email, password);

      console.log(index);
      if (index == -1) {
        $(".err").removeClass("hidden");
        $(".err").addClass("text-red-400");

        $(".err").text("Invalid email or password");
      } else {
        $(".err").removeClass("hidden");
        $(".err").addClass("text-green-500");
        $(".err").text("Login successful");
        setLoggedUser(index);
        firstLogIn();
        loginRedirect();
      }
    }
    else{
        $(".err").removeClass("hidden");
        $(".err").addClass("text-red-400");
        $(".err").text("Fields must not be empty");
    }
  });
});
