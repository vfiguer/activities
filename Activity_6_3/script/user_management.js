$(() => {
  loadUsers();
  loadLoggedUser();
  verifyDefaultUser();
  firstLogIn();
  homepage();

  function homepage() {
    if(!logged_user.edit_users){
      loginRedirect();
    }
    $("#formCreate").remove();
    $("#userList").remove();

    $("#container").append(
      "<div class='items-center gap-32 py-24 container content-center w-full flex flex-col mx-auto px-4 bg-primary-200 m-20 rounded-xl' id='main'><button class='create btn' >Create user</button><button class='manage btn'>Manage Users</button></div>"
    );
    $(".create").on("click", function () {
      createUser();
    });

    $(".manage").on("click", function () {
      manageUser();
    });
  }

  function createUser() {
    $("#main").remove();
    $("#container").append("<div class='form' id='formCreate'></div>");
    $("#formCreate").append(
      "<div class='form-inputs' id='formCreateInputs'></div>"
    );
    $("#formCreateInputs").append(
      "<button id='exit' class='btn'>Exit</button>"
    );
    $("#exit").on("click", function () {
      homepage();
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

    $("#btn-add-user").on("click", () => {
      let userName = $("#name").val().trim();
      let userEmail = $("#email").val().trim();
      let userPassword = $("#password").val().trim();
      let editUsers = $("#users").is(":checked");
      let editNews = $("#news").is(":checked");
      let editBones = $("#bones").is(":checked");

     

      if (userName && userEmail && userPassword) {
        if (!emailExists(userEmail)) {
          let res = passwordEncrypt(userPassword);
          let pwd = res[0];
          let salt = res[1];
          newUser(
            userName,
            userEmail,
            pwd,
            salt,
            editUsers,
            editNews,
            editBones
          );
        }
      }
    });
  }

  function editUser(index) {
    let usr = users[index];
    let i = index;
    $("#main").remove();
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
      "<div class='flex flex-row gap-4' id='checkboxContainer'></div>"
    );

    $("#checkboxContainer").append(
      "<div><input type='checkbox' name='news' id='news'/><label for='news'> Edit News</label></div>"
    );
    if (usr.edit_news) {
      $("#news").prop("checked", true);
    }
    $("#checkboxContainer").append(
      "<div><input type='checkbox' name='users' id='users'/><label for='users'> Edit Users</label></div>"
    );
    if (usr.edit_users) {
      $("#users").prop("checked", true);
    }
    $("#checkboxContainer").append(
      "<div><input type='checkbox' name='bones' id='bones'/><label for='bones'> Edit Bone Files</label></div>"
    );
    if (usr.edit_bone_files) {
      $("#bones").prop("checked", true);
    }
    $("#formCreateInputs").append(
      "<button id='btn-edit-user' class='btn'>Save Edit</button>"
    );

    $("#btn-edit-user").on("click", () => {
      let userName = $("#name").val().trim();
      let userEmail = $("#email").val().trim();
      let userPassword = $("#password").val().trim();
      let editUsers = $("#users").is(":checked");
      let editNews = $("#news").is(":checked");
      let editBones = $("#bones").is(":checked");
      let pwd, salt;
      

      if (userName && userEmail) {
        if (!emailExists(userEmail)) {
          if (userPassword == null || userPassword == "" || userPassword.length == 0) {
             pwd = usr.password;
             salt = usr.salt_hash;
          } else {
            let res = passwordEncrypt(userPassword);
             pwd = res[0];
             salt = res[1];
          }
          let newUser = {
            id: usr.id,
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
          users[i] = newUser;
          writeUsers();
          manageUser();
        }
      }
    });
  }
  function manageUser() {
    $("#main").remove();
    $("#userList").remove();
    $("#formCreateInputs").remove();

    $("#container").append(
      "<div class='form-inputs items-center  py-24 container content-center w-full flex flex-col mx-auto px-4 bg-primary-200 m-20 rounded-xl ' id='userList'> </div>"
    );

    $("#userList").append("<div class='w-full'><button id='exit' class='btn'>Exit</button></div>");

    $("#exit").on("click", function () {
      homepage();
    });
    $("#userList").append("<h1>Manage User</h1>");
    $.each(users, function (index, user) {
      appendUser(index, user);
    });
  }
  function appendUser(index, user) {
    $("#userList").append(`<div class='listelement hover:bg-primary-100   w-full flex flex-row p-4 justify-between transition rounded-xl'><p>${user.name} - ${user.email}</p> </div>`);
    $(".listelement").last().append(`<div data class='buttons flex flex-row gap-2'></div>`);
    if (user.removable) {
      
      $(".buttons").last().append(`<button data class='btn delete'>Delete</button>`);
      $(".delete").last().data("index", index);
      $(".delete")
        .last()
        .click(function () {
          users.splice($(this).data("index"), 1);
          writeUsers();
          manageUser();
        });
    }
    $(".buttons").last().append("<button class='btn edit'>Edit</button>");
    $(".edit").last().data("index", index);
    $(".edit")
      .last()
      .click(function () {
        editUser($(this).data("index"));
      });
  }
});
