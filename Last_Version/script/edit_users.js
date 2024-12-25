//import CryptoJS from "crypto-js";

let users;
let logged_user;
const regexPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).+$/;
const regexEmail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
const usersdefault = {
  id: 1,
  name: "admin",
  email: "desenvolupador@iesjoanramis.org",
  password: "Ramis.20",
  salt_hash: "",
  edit_users: true,
  edit_news: true,
  edit_bone_files: true,
  active: true,
  is_first_login: true,
  removable: false,
};

function passwordEncrypt(password) {
  var salt = generateSalt();
  const saltedPassword = password + salt;
  const hash = CryptoJS.SHA256(saltedPassword).toString();
  // saveToFile(hash, salt);
  return [hash, salt];
}

function checkPassword(inputPassword, storedHash, salt) {
  const saltedInputPassword = inputPassword + salt;
  const hash = CryptoJS.SHA256(saltedInputPassword).toString();

  return hash == storedHash;
}

function generateSalt() {
  let generateSalt = (rounds) => {
    if (rounds >= 15) {
      throw new Error(`${rounds} is greater than 15,Must be less that 15`);
    }
    if (typeof rounds !== "number") {
      throw new Error("rounds param must be a number");
    }
    if (rounds == null) {
      rounds = 12;
    }
    return crypto
      .randomBytes(Math.ceil(rounds / 2))
      .toString("hex")
      .slice(0, rounds);
  };
}

function newUser(
  name,
  email,
  password_hash,
  salt_hash,
  edit_users,
  edit_news,
  edit_bone_files
) {
  let newUser = {
    id: users.length + 1,
    name: name,
    email: email,
    password: password_hash,
    salt_hash: salt_hash,
    edit_users: edit_users,
    edit_news: edit_news,
    edit_bone_files: edit_bone_files,
    active: true,
    is_first_login: true,
    removable: true,
  };

  users.push(newUser);
  writeUsers();
}

function loadUsers() {
  users = JSON.parse(localStorage.getItem("users"));
  if (users === "[]" || users === null || users === undefined) {
    users = [];
    verifyDefaultUser();
  }
}

function verifyDefaultUser() {
  let hasdefault = users.some(
    (obj) => obj.email === usersdefault.email
  );
  if (!hasdefault) {
    let pwd = "Ramis.20";
    let res = passwordEncrypt(pwd);
    const newUser = {
      ...usersdefault, 
      password: res[0],
      salt_hash: res[1], 
    };
    users.push(newUser);
    writeUsers();
  }
}

function writeUsers() {
  localStorage.setItem("users", JSON.stringify(users));
}

function loadLoggedUser() {
  logged_user = JSON.parse(localStorage.getItem("logged_user"));
  if (logged_user === null || logged_user === undefined) {
    logged_user = {};
    writeLoggedUser();
  }
}

function writeLoggedUser() {
  localStorage.setItem("logged_user", JSON.stringify(logged_user));
}

function logOut() {
  logged_user = {};
  writeLoggedUser();
  window.location.reload();
}

function userLogIn(email, password) {
  for (let index = 0; index < users.length; index++) {
    const user = users[index];
    if (email == user.email) {
      let pwd_hash = user.password;
      let salt_hash = user.salt_hash;
      console.log(checkPassword(password, pwd_hash, salt_hash));
      if (checkPassword(password, pwd_hash, salt_hash)) {
        return index; 
      }
    }
  }
  return -1; 
}

function emailExists(email) {
  users.forEach((user) => {
    if (email == user.email) {
      return true;
    }
  });
  return false;
}

function setLoggedUser(index) {
  logged_user = users[index];
  writeLoggedUser();
}

function firstLogIn() {
  if (logged_user.is_first_login) {
    window.location.replace("/docs/change_password.html");
  }
}

function loginRedirect() {
  if (logged_user.edit_users) {
    window.location.replace("/docs/edit_users.html");
  } else if (logged_user.edit_news) {
    window.location.replace("/docs/news.html");
  } else if (logged_user.edit_bone_files) {
    window.location.replace("/docs/voltant.html");
  } else {
    window.location.replace("/index.html");
  }
}

function setPassword(index, password) {
  let res = passwordEncrypt(password);
  let pwd = res[0];
  let salt = res[1];
  let newUser = {
    id: logged_user.id,
    name: logged_user.name,
    email: logged_user.email,
    password: pwd,
    salt_hash: salt,
    edit_users: logged_user.edit_users,
    edit_news: logged_user.edit_news,
    edit_bone_files: logged_user.edit_bone_files,
    active: logged_user.active,
    is_first_login: false,
    removable: logged_user.removable,
  };

  logged_user = newUser;
  writeLoggedUser();
  users[index] = newUser;
  writeUsers();

  loginRedirect();
}



function validateEmail(email) {
  return regexEmail.test(email);
}

function validatePassword(password) {
  return regexPassword.test(password);
}