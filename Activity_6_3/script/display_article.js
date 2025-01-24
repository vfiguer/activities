let news = {};
$(() => {
  load_list();

  const queryString = window.location.search;

  const urlParams = new URLSearchParams(queryString);

  const id = urlParams.get("id");

  console.log("Retrieved ID:", id);

  load_article();

  function load_list() {
    news = JSON.parse(localStorage.getItem("news"));
    if (!news) {
      news = [];
      localStorage.setItem("news", JSON.stringify(news));
    }
    if (news.length == 0) {
      window.location.href = `/index.html`;
    }
  }

  function load_article() {
    let article = news[id];
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
