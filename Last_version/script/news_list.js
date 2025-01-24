let news = {};
$(() => {
  load_list();
  $("#new_article").click(() => {
    open_editor(-1);
  });
  function load_list() {
    news = JSON.parse(localStorage.getItem("news"));
    if (!news) {
      (news = [
        // {
        //   title: "titulo",
        //   id: 1,
        //   author: "Admin",
        //   date_mod: "2024",
        //   date_create: "2024",
        //   date_publish: "2024",
        //   state: 1,
        //   content: [], //rows
        // },
        // {
        //   title: "titul2",
        //   id: 2,
        //   author: "Admin",
        //   date_mod: "2024",
        //   date_create: "2024",
        //   date_publish: "2024",
        //   state: 0,
        //   content: [], //rows
        // },
      ]),
        localStorage.setItem("news", JSON.stringify(news));
    }
    if (news.length > 0) {
      news.forEach((element, index) => {
        let img = get_image(index);
        if (img != null) {
          $("#list").append(` <div class="news-item" data-index="${index}">
              <div class="news-item-img">
              <img src="${img}" alt="" class="   " />
            </div>
              <div class="news-item-info">
                <p class="news-item-title">${element.title}</p>
                <p class="news-item-text">Created on ${new Date(
                  element.date_create
                ).toDateString()}</p>
                <p class="news-item-text">Last modified on ${new Date(
                  element.date_mod
                ).toDateString()}</p>
                <p class="news-item-text">Written by:${element.author}</p>
              </div>
            </div>`);
        } else {
          $("#list").append(` <div class="news-item" data-index="${index}">
              <div class="news-item-info">
                <p class="news-item-title">${element.title}</p>
                <p class="news-item-text">Created on ${new Date(
                  element.date_create
                ).toDateString()}</p>
                <p class="news-item-text">Last modified on ${new Date(
                  element.date_mod
                ).toDateString()}</p>
                <p class="news-item-text">Written by:${element.author}</p>
              </div>
            </div>`);
        }
      });
      $("#list").on("click", ".news-item", function () {
        const index = $(this).data("index");
        open_editor(index);
      });
    }
  }

  //send -1 to open new (handle in the other js doc)
  function open_editor(index) {
    console.log(index);
    localStorage.setItem("article_id", index);
    window.location.href = "/docs/editor.html";
  }
  function get_image(index) {
    let article = news[index];

    for (let sections of article.content) {
      for (let elements of sections) {
        for (let element of elements) {
          if (element.type === "image" && element.src) {
            return element.src;
          }
        }
      }
    }

    return null;
  }
});
