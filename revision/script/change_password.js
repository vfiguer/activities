import { loginRedirect } from "./auth.js";
import {
  passwordEncrypt,
  validatePassword,
} from "./edit_users.js";
import { getUserData, saveUserData } from "./firebase.js";

$(async () => {
  displayForm();
  let id = localStorage.getItem("logged_user");
  if (localStorage.getItem("logged_user") == null) {
    await loginRedirect();
  }

  let logged_user = await getUserData(id);
  console.log(logged_user);
  if (!logged_user.is_first_login) {
    console.log("hola");
    await loginRedirect();
  }

  async function setPassword(index, password) {
    let res = passwordEncrypt(password);
    let pwd = res[0];
    let salt = res[1];
    let newUser = {
      ...logged_user,
      password: pwd,
      salt_hash: String(salt),
      is_first_login: false,
    };
    await saveUserData(index, newUser);
  }

  function displayForm() {
    $("#container").append(`
      <div class="form-inputs">
        <h1>Canviar Contrasenya</h1>
        <label for="pwd">Heu de canviar la contrasenya en el primer inici de sessió</label>
        <input
          type="password"
          name="pwd"
          id="pwd"
        />
        <label for="pwd2">Repiteix la contrasenya</label>
         <input
          type="password"
          name="pwd2"
          id="pwd2"
        />
        <button class="btn" id="save">Desar</button>
      </div>
    `);

    $(".form-inputs").append("<p class='err hidden'></p>");

    $("#save").click(async function () {
      let pwd = $("#pwd").val().trim();
      let pwd2 = $("#pwd2").val().trim();

      $(".err").text("");

      if (pwd || pwd != "") {
        if (pwd == pwd2) {
          if (pwd.length < 12) {
            $(".err").removeClass("hidden");
            $(".err").addClass("text-red-400");
            $(".err").text(
              "La contrasenya ha de tenir com a mínim 12 caràcters"
            );
          }
          if (!validatePassword(pwd)) {
            $(".err").removeClass("hidden");
            $(".err").addClass("text-red-400");
            $(".err").append(
              "<br> La contrasenya ha d'incloure un caràcter en majúscules, un caràcter en minúscula, un nombre i un caràcter especial"
            );
          }

          if (validatePassword(pwd) & (pwd.length >= 12)) {
            $(".err").removeClass("hidden");
            $(".err").addClass("text-green-500");
            $(".err").text("Contrasenya valida");
            await setPassword(id, pwd);
            await loginRedirect();
          }
        } else {
          $(".err").removeClass("hidden");
          $(".err").addClass("text-red-400");
          $(".err").text("Les contrasenyas no son les mateixes");
        }
      } else {
        $(".err").removeClass("hidden");
        $(".err").addClass("text-red-400");
        $(".err").text("Heu d'introduir una contrasenya");
      }
    });
  }
});
