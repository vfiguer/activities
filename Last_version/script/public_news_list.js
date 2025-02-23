import { getLastArticle, getNews } from "./firebase.js";
import { load_article, load_list } from "./news_list_functions.js";

let news = {};
let last;
$(async () => {
  let news = await getNews();

  let filteredNews = news.filter(article => article.state === 1);

  
  function open_article(index) {
    console.log(index);
    window.location.href = `/docs/new.html?id=${index}`;
  }

  await load_list(filteredNews, open_article);

  if(filteredNews.length>0){
    let article = await getLastArticle();
    await load_article(article);
  
  }  
});
