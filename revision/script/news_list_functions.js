import { getArticle } from "./firebase.js";


// Make load_list exportable
export async function load_list(news, metodo) {
  
  if (news.length > 0) {
    news.forEach(async (element, index) => {
      let img = await get_image(element.id);
      if (img != null) {
        $("#list").append(` <div class="news-item" data-index="${element.id}">
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
        $("#list").append(` <div class="news-item" data-index="${element.id}">
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
      metodo(index);
    });
  }
}



export async function get_image(index) {
  let article = await getArticle(index);
  let content = JSON.parse(article.content);

  for (let sections of content) {
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

export async function load_article(article ) {
  $("#title").text(article.title);
  $("#author").text(article.author);
  $("#date").text(
    `Published: ${new Date(
      article.date_publish
    ).toDateString()} | Last edited: ${new Date(
      article.date_mod
    ).toDateString()}`
  );
  let content = JSON.parse(article.content)
  content.forEach((sections) => {
    //ROW
    console.log(sections);
    const $section = $('<div class="flex flex-row gap-11 "></div>'); // Crear un contenedor por sección
    sections.forEach((elements) => {
      const $column = $('<div class="flex flex-col mt-5"></div>');
      if (sections.length != 1) {
        $column.addClass("w-2/4 ");
      }
      //columnas
      elements.forEach((element) => {
        if (element.type === "image" && element.src) {
        

          if (sections.length != 1) {
            $column.append(
              `<img src="${element.src}" alt="Imagen" class="w-auto rounded-xl shadow-md overflow-hidden max-h-52 object-cover">`
            );
          } else {
            $column.append(
              `<img src="${element.src}" alt="Imagen" class="w-auto rounded-xl shadow-md overflow-hidden  object-cover">`
            );
          }
        } else if (element.type === "paragraph" && element.content) {
          $column.append(`<p class="article-text">${element.content}</p>`);
        }
        $section.append($column);
      });

      // Añadir la sección procesada al contenedor principal
      $("#article").append($section);
    });
  });
}