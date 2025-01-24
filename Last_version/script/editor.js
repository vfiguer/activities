let article_id;

$(function () {
  if (logged_user.edit_news != true) {
    window.location.replace("/index.html");
  }
  // Hacer los elementos de la toolbox arrastrables
  $(".tool").draggable({
    helper: "clone",
    revert: "invalid",
  });

  function delete_article() {
    let articles = JSON.parse(localStorage.getItem("news"));
    if (article_id != -1) {
      articles.splice(article_id, 1);
      localStorage.setItem("news", JSON.stringify(articles));
      localStorage.setItem("article_id", -1);
      window.location.replace("/docs/news_list.html");
    }
  }

  function initializeDroppable() {
    $(".column").droppable({
      accept: ".tool",
      drop: function (event, ui) {
        const type = ui.draggable.data("type");
        if ($(this).children().length >= 2 && $(this).hasClass("half")) {
          alert("Solo se permiten dos elementos por columna.");
          return;
        }
        if ($(this).children().length >= 1 && !$(this).hasClass("half")) {
          alert("Solo se permite un elemento en esta columna.");
          return;
        }

        let newElement;
        if (type === "paragraph") {
          newElement = $(
            `<div class="element">
              <p class="editable" onclick="editParagraph(this)">Escribe aquí tu texto...</p>
            </div>`
          );
        } else if (type === "image") {
          newElement = $(
            `<div class="element">
              <input type="file" accept="image/*" onchange="loadImage(event)" />
              <img src="" alt="Imagen" style="display: none;">
            </div>`
          );
        }

        $(this).append(newElement);
        makeElementsDraggable();
      },
    });
  }

  function makeElementsDraggable() {
    $(".element").draggable({
      helper: "original",
      revert: "invalid",
    });
  }

  $("#add-row").on("click", function () {
    const columnCount = $("#column-choice").val();
    let newRow = '<div class="row">';

    if (columnCount === "1") {
      newRow += `<div class="column"></div>`;
    } else {
      newRow += `
        <div class="column half"></div>
        <div class="column half"></div>`;
    }

    newRow += `
      <button class="delete-row-btn">Eliminar fila</button>
      </div>`;
    $("#builder .row-container").append(newRow);

    initializeDroppable();
    initializeDeleteButtons();
  });

  function initializeDeleteButtons() {
    $(".delete-row-btn")
      .off("click")
      .on("click", function () {
        $(this).closest(".row").remove();
      });
  }

  // Guardar configuración
  $("#save-config").on("click", function () {
    save_article(-1);
  });

  // Cargar configuración
  $("#load-config").on("click", function () {
    load_article();
  });
  $("#publish").on("click", function () {
    save_article(1);
  });
  $("#delist").on("click", function () {
    save_article(0);
  });
  $("#remove").on("click", function () {
    delete_article();
  });

  function save_article(new_status) {
    const rows = [];
    $(".row").each(function () {
      const row = [];
      $(this)
        .find(".column")
        .each(function () {
          const column = [];
          $(this)
            .children(".element")
            .each(function () {
              if ($(this).find("p").length) {
                column.push({
                  type: "paragraph",
                  content: $(this).find("p").text(),
                });
              } else if ($(this).find("img").length) {
                column.push({
                  type: "image",
                  src: $(this).find("img").attr("src"),
                });
              }
            });
          row.push(column);
        });
      rows.push(row);
    });

    let articles = JSON.parse(localStorage.getItem("news"));
    if (article_id == -1) {
      let new_article = {
        title: $("#title").val(),
        id: articles.length + 1,
        author: logged_user.name,
        date_mod: new Date().getTime(),
        date_create: new Date().getTime(),
        date_publish: "none",
        state: 0,
        content: rows,
      };
      articles.push(new_article);
      article_id = articles.length - 1;
      localStorage.setItem("article_id", article_id);
    } else {
      if (new_status == -1) {
        new_status = articles[article_id].state;
      }
      let date_pub;
      if (new_status == 1) {
        date_pub = new Date().getTime();
      } else {
        date_pub = articles[article_id].date_publish;
      }
      let edited_article = {
        title: $("#title").val(),
        id: article_id,
        author: articles[article_id].author,
        date_mod: new Date().getTime(),
        date_create: articles[article_id].date_create,
        date_publish: date_pub,
        state: new_status,
        content: rows,
      };
      articles[article_id] = edited_article;
    }

    localStorage.setItem("news", JSON.stringify(articles));

    // const config = JSON.stringify(rows);
    // localStorage.setItem("postBuilderConfig", config);
    alert("Configuración guardada en el navegador.");
    // console.log(rows);
  }
  function load_article() {
    article_id = localStorage.getItem("article_id");
    if (!article_id) {
      article_id = -1;
    }
    console.log(article_id);
    let rows;
    if (article_id >= 0) {
      let article_to_edit = JSON.parse(localStorage.getItem("news"))[
        article_id
      ];
      rows = article_to_edit.content;
      $("#title").val(article_to_edit.title);
    } else {
      rows = [];
    }

    // const config = localStorage.getItem("postBuilderConfig");
    // if (!config) {
    //   alert("No hay configuración guardada.");
    //   return;
    // }

    $(".row-container").empty(); // Limpiar todo antes de cargar
    rows.forEach((row) => {
      let newRow = '<div class="row">';
      row.forEach((column) => {
        newRow +=
          column.length > 1
            ? `<div class="column half">`
            : `<div class="column">`;
        column.forEach((element) => {
          if (element.type === "paragraph") {
            newRow += `
              <div class="element">
                <p class="editable" onclick="editParagraph(this)">${element.content}</p>
              </div>`;
          } else if (element.type === "image") {
            newRow += `
              <div class="element">
                <img src="${element.src}" alt="Imagen">
              </div>`;
          }
        });
        newRow += `</div>`;
      });
      newRow += `<button class="delete-row-btn">Eliminar fila</button></div>`;
      $(".row-container").append(newRow);
    });

    initializeDroppable();
    initializeDeleteButtons();
  }

  initializeDroppable();

  load_article();
});

function loadImage(event) {
  const input = event.target;
  const reader = new FileReader();
  reader.onload = function () {
    const img = $(input).siblings("img");
    img.attr("src", reader.result);
    img.show();
    $(input).hide();
  };
  reader.readAsDataURL(input.files[0]);
}

function editParagraph(paragraph) {
  const $p = $(paragraph);
  const currentText = $p.text();
  const input = $(`<input type="text" value="${currentText}" />`);

  input.on("blur", function () {
    const newText = $(this).val();
    $p.text(newText);
    $p.show();
    $(this).remove();
  });

  $p.hide();
  $p.after(input);
  input.focus();
}
