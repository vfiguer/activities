import { getUserData } from "./firebase.js";

$(async () => {
  // localStorage.removeItem("logged_user")
  // localStorage.setItem("logged_user", " nHQyF81bXUwxa8YUogxG ")

  if (localStorage.getItem("logged_user") != null) {
    let user = await getUserData(localStorage.getItem("logged_user"));
    if(user.edit_users){
      $(".editUsers").removeClass("hidden");
    }
    if(user.edit_news){
      $(".editNews").removeClass("hidden");
    }
    $("#login").addClass("hidden");
    $("#logout").removeClass("hidden");
    $("#logout").click(() => {
      localStorage.removeItem("logged_user");
      window.location.href = "/index.html";
    });
  }
});
