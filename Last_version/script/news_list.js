import { getNews, getUserData } from "./firebase.js";
import { load_list } from "./news_list_functions.js";

$(async () => {
  if (localStorage.getItem("logged_user") != null) {
    let logged_user = await getUserData(localStorage.getItem("logged_user"));
    if (!logged_user.edit_news) {
      window.location.href = "/index.html";
    }
  } else {
    window.location.href = "/index.html";
  }

  let news = await getNews();

  await load_list(news, open_editor);

  $("#new_article").click(() => {
    open_editor(-1);
  });

  // Function to handle article editor opening
  function open_editor(index) {
    console.log(index);
    localStorage.setItem("article_id", index);
    window.location.href = "/docs/editor.html";
  }
});
