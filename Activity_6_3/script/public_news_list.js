let news = {};
let last;
$(() => {
  load_list();
  load_article();
  function load_list() {
    news = JSON.parse(localStorage.getItem("news"));
    if (!news) {
      (news = []), localStorage.setItem("news", JSON.stringify(news));
    }
    news.sort();
    if (news.length > 0) {
      news.forEach((element, index) => {
         last = index;
        let img = get_image(index);
        if (element.state == 1) {
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
        }
      });
      $("#list").on("click", ".news-item", function () {
        const index = $(this).data("index");
        open_article(index);
      });
    }
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

  function open_article(index) {
    console.log(index);
    window.location.href = `/docs/new.html?id=${index}`;
  }

  function load_article() {
    let article = news[last];
    $("#title").text(article.title);
    $("#author").text(article.author);
    $("#date").text(`Published: ${new Date(article.date_publish).toDateString()} | Last edited: ${new Date(article.date_mod).toDateString()}`);
    

    article.content.forEach((sections) => {
      //ROW
      console.log(sections);
      const $section = $('<div class="flex flex-row gap-11"></div>'); // Crear un contenedor por sección
      sections.forEach((elements) => {
        const $column = $('<div class="flex flex-col w-2/4 "></div>'); // Crear un contenedor por sección

        //columnas
        elements.forEach((element) => {
          if (element.type === "image" && element.src) {
            $column.append(`<img src="${element.src}" alt="Imagen" class="w-auto rounded-xl shadow-md overflow-hidden max-h-52 object-cover">`);
          } else if (element.type === "paragraph" && element.content) {
            $column.append(
              `<p class="article-text">${element.content}</p>`
            );
          }
          $section.append($column);
        });

        // Añadir la sección procesada al contenedor principal
        $("#article").append($section);
      });
    });
  }
});
