$(() => {
  loadUsers();
  loadLoggedUser();
  verifyDefaultUser();
  displayForm();

  if (!logged_user.is_first_login) {
    loginRedirect();
  }
  function displayForm() {
    $("#container").append(`
      <div class="form-inputs">
        <h1>Change password</h1>
        <label for="pwd">You must change the password on your first Log In</label>
        <input
          type="password"
          name="pwd"
          id="pwd"
        />
        <button class="btn" id="save">Save Password</button>
      </div>
    `);

    $(".form-inputs").append("<p class='err hidden'></p>");

    $("#save").click(function () {
      let pwd = $("#pwd").val().trim();
      $(".err").text("");

      if (pwd || pwd != "") {
        if (pwd.length < 6) {
          $(".err").removeClass("hidden");
          $(".err").addClass("text-red-400");
          $(".err").text("Password must be at least 6 characters long");
        }
        if (!validatePassword(pwd)) {
          $(".err").removeClass("hidden");
          $(".err").addClass("text-red-400");
          $(".err").append(
            "<br> Password must include an uppercase character, a lowercase character, a number, and a special character"
          );
        }

        if (validatePassword(pwd) & (pwd.length >= 6)) {
          $(".err").removeClass("hidden");
          $(".err").addClass("text-green-500");
          $(".err").text("Valid Password");
          let index = users.findIndex((obj) => obj.email === logged_user.email);
          setPassword(index, pwd);
        }
      } else {
        $(".err").removeClass("hidden");
        $(".err").addClass("text-red-400");
        $(".err").text("You must enter a password");
      }
    });
  }
});
