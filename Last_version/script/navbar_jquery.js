$(() => {
  // localStorage.removeItem("logged_user")
  // localStorage.setItem("logged_user", " nHQyF81bXUwxa8YUogxG ")

  if (localStorage.getItem("logged_user") != null) {
    $("#login").addClass("hidden");
    $("#logout").removeClass("hidden");
    $("#logout").click(() => {
      localStorage.removeItem("logged_user");
      window.location.href = "/index.html";
    });
  }
});
