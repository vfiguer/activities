import { passwordEncrypt } from "./edit_users.js";
import {
  deleteUser,
  emailInUse,
  getUserData,
  getUsers,
  saveUser,
  saveUserData,
} from "./firebase.js";

$(async () => {
  if (localStorage.getItem("logged_user") != null) {
    let logged_user = await getUserData(localStorage.getItem("logged_user"));
    if (!logged_user.edit_users) {
      window.location.href = "/index.html";
    }
  } else {
    window.location.href = "/index.html";
  }

  manageUser();
  async function manageUser() {
    let users = await getUsers();

    $("#main").remove();
    $("#userList").remove();
    $("#formCreateInputs").remove();

    $("#container").append(
      "<div class='form-inputs items-center py-24 container content-center w-full flex flex-col mx-auto px-4 bg-primary-200 m-20 rounded-xl' id='userList'> </div>"
    );

    $("#userList").append("<h1>Manage Users</h1>");

    $.each(users, function (index, user) {
      appendUser(user.id, user);
    });

    $("#userList").append("<button class='create btn'>Create User</button>");

    $(".create").on("click", function () {
      createUser();
    });
  }

  async function createUser() {
    $("#userList").remove();
    $("#container").append("<div class='form' id='formCreate'></div>");
    $("#formCreate").append(
      "<div class='form-inputs' id='formCreateInputs'></div>"
    );
    $("#formCreateInputs").append(
      "<button id='exit' class='btn'>Exit</button>"
    );
    $("#exit").on("click", function () {
      manageUser();
    });

    $("#formCreateInputs").append("<h1>Create User</h1>");
    $("#formCreateInputs").append(
      "<label for='name'>Name</label><input type='text' id='name' class='name' name='name'/>"
    );
    $("#formCreateInputs").append(
      "<label  for='email'>Email</label><input type='email' id='email' class='email' name='email'/>"
    );
    $("#formCreateInputs").append(
      "<label for='password'>Password</label><input type='text' id='password' class='password' name='password'/>"
    );

    $("#formCreateInputs").append(
      "<div class='flex flex-row gap-4' id='checkboxContainer'></div>"
    );

    $("#checkboxContainer").append(
      "<div><input type='checkbox' name='news' id='news'/><label for='news'> Edit News</label></div>"
    );

    $("#checkboxContainer").append(
      "<div><input type='checkbox' name='users' id='users'/><label for='users'> Edit Users</label></div>"
    );

    $("#checkboxContainer").append(
      "<div><input type='checkbox' name='bones' id='bones'/><label for='bones'> Edit Bone Files</label></div>"
    );

    $("#formCreateInputs").append(
      "<button id='btn-add-user' class='btn'>Create User</button>"
    );

    $("#btn-add-user").on("click", async () => {
      let userName = $("#name").val().trim();
      let userEmail = $("#email").val().trim();
      let userPassword = $("#password").val().trim();
      let editUsers = $("#users").is(":checked");
      let editNews = $("#news").is(":checked");
      let editBones = $("#bones").is(":checked");

      if (userName && userEmail && userPassword) {
        let em = await emailInUse(userEmail);
        if (!em) {
          let res = passwordEncrypt(userPassword);
          let pwd = res[0];
          let salt = res[1];

          let newUser = {
            name: userName,
            email: userEmail,
            password: pwd,
            salt_hash: String(salt),
            edit_users: editUsers,
            edit_news: editNews,
            edit_bone_files: editBones,
            active: true,
            is_first_login: true,
            removable: true,
          };
          saveUser(newUser);

          manageUser();
        }
      }
    });
  }

  function appendUser(index, user) {
    $("#userList").append(
      `<div class='listelement hover:bg-primary-100 w-full flex flex-row p-4 justify-between transition rounded-xl'><p>${user.name} - ${user.email}</p></div>`
    );
    $(".listelement")
      .last()
      .append("<div data class='buttons flex flex-row gap-2'></div>");

    if (user.removable) {
      $(".buttons")
        .last()
        .append(`<button data class='btn delete'>Delete</button>`);
      $(".delete").last().data("index", index);
      $(".delete")
        .last()
        .click(function () {
          let secondConfirm = confirm(
            "Are you sure you want to delete this user?"
          );
          if (secondConfirm) {
            deleteUser(index);
            manageUser();
          }
        });
    }

    $(".buttons").last().append("<button class='btn edit'>Edit</button>");
    $(".edit").last().data("index", index);
    $(".edit")
      .last()
      .click(function () {
        editUser($(this).data("index"));
      });
    $("#userList")
      .last()
      .append("<div data class='permissions  hidden md:block'></div>");

    $(".permissions").last().append(`
        <ul>
        <li>Edit Users 
        ${user.edit_users ? "✓" : "X"}
        </li>
        <li>Edit News 
        ${user.edit_news ? "✓" : "X"}
        </li>
        <li>Edit Bones 
        ${user.edit_bone_files ? "✓" : "X"}
        </li>

        </ul>`);
  }

  async function editUser(index) {
    let usr = await getUserData(index);
    let i = index;
    let prevEmail = usr.email;
    $("#userList").remove();
    $("#container").append("<div class='form' id='formCreate'></div>");
    $("#formCreate").append(
      "<div class='form-inputs' id='formCreateInputs'></div>"
    );
    $("#formCreateInputs").append(
      "<button id='exit' class='btn'>Cancel</button>"
    );
    $("#exit").on("click", function () {
      manageUser();
    });

    $("#formCreateInputs").append("<h1>Edit User</h1>");
    $("#formCreateInputs").append(
      "<label for='name'>Name</label><input type='text' id='name' class='name' name='name'/>"
    );
    $("#name").val(usr.name);
    $("#formCreateInputs").append(
      "<label  for='email'>Email</label><input type='email' id='email' class='email' name='email'/>"
    );
    $("#email").val(usr.email);
    $("#formCreateInputs").append(
      "<label for='password'>Password</label><input type='text' id='password' class='password' name='password'/>"
    );
    $("#formCreateInputs").append(
      "<button id='btn-edit-user' class='btn'>Save Edit</button>"
    );

    $("#btn-edit-user").on("click", async () => {
      let userName = $("#name").val().trim();
      let userEmail = $("#email").val().trim();
      let userPassword = $("#password").val().trim();
      let editUsers = $("#users").is(":checked");
      let editNews = $("#news").is(":checked");
      let editBones = $("#bones").is(":checked");
      let pwd, salt;

      if (userName && userEmail) {
        let em = false;
        if (prevEmail != userEmail) {
          em = await emailInUse(userEmail);
        }
        if (!em) {
          if (
            userPassword == null ||
            userPassword == "" ||
            userPassword.length == 0
          ) {
            pwd = usr.password;
            salt = usr.salt_hash;
          } else {
            let res = passwordEncrypt(userPassword);
            pwd = res[0];
            salt = res[1];
          }
          let newUser = {
            name: userName,
            email: userEmail,
            password: pwd,
            salt_hash: salt,
            edit_users: editUsers,
            edit_news: editNews,
            edit_bone_files: editBones,
            active: usr.active,
            is_first_login: usr.is_first_login,
            removable: usr.removable,
          };
          saveUserData(index, newUser);
          manageUser();
        }
      }
    });
  }
});
