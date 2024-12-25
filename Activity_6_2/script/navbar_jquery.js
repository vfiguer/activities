$(() => {
  loadUsers();
  loadLoggedUser();
  verifyDefaultUser();
  firstLogIn();
  if (!(JSON.stringify(logged_user) == "{}") ) {
    $("#login").addClass("hidden");
    $("#logout").removeClass("hidden");
    $("#logout").click(()=>{
        logOut();
    })
  }
});
