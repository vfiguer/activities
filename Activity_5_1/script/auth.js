import { checkPassword } from "./edit_users.js";
import { getUserData, getUsersByEmail } from "./firebase.js";

async function userLogIn(email, password) {
  const userDoc = await getUsersByEmail(email);
  const userData = userDoc.data();

  console.log(userData);
  let pwd_hash = userData.password;
  let salt_hash = userData.salt_hash;

  if (checkPassword(password, pwd_hash, salt_hash)) {
    return userDoc.id;
  } else {
    return -1;
  }
}

async function firstLogIn() {
  if (localStorage.getItem("logged_user") != null) {
    let logged_user = await getUserData(localStorage.getItem("logged_user"));
    if (logged_user.is_first_login) {
      window.location.href = "/docs/change_password.html";
    }
  }
}

async function loginRedirect() {
  if (localStorage.getItem("logged_user") != null) {
    let logged_user = await getUserData(localStorage.getItem("logged_user"));
    if (logged_user.edit_users) {
      window.location.href = "/docs/edit_users.html";
    } else if (logged_user.edit_news) {
      window.location.href = "/docs/news_list.html";
    } else if (logged_user.edit_bone_files) {
      window.location.href = "/docs/voltant.html";
    } else {
      window.location.href = "/index.html";
    }
  } else {
    window.location.href = "/index.html";
  }
}

export { firstLogIn, loginRedirect, userLogIn };

