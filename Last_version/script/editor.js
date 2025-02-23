import {
  deleteArticle,
  getArticle,
  getUserData,
  saveArticle,
  saveArticleData,
} from "./firebase.js";

let article_id;

$(async function () {

  if (localStorage.getItem("logged_user") != null) {
    let logged_user = await getUserData(localStorage.getItem("logged_user"));
    if (!logged_user.edit_news) {
      window.location.href = "/index.html";
    }
  } else {
    window.location.href = "/index.html";
  }


  // Hacer los elementos de la toolbox arrastrables
  $(".tool").draggable({
    helper: "clone",
    revert: "invalid",
  });

  async function delete_article() {
    if (article_id != -1) {
      let secondConfirm = confirm(
        "Are you sure you want to delete this user?"
      );
      if(secondConfirm){
        await deleteArticle(localStorage.getItem("article_id"));
        localStorage.setItem("article_id", -1);
        window.location.href = "/docs/news_list.html";
      }
  
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
              <p class="editable">Escribe aquí tu texto...</p>
            </div>`
          );
        } else if (type === "image") {
          newElement = $(
            `<div class="element">
              <input type="file" accept="image/*"  />
              <img src="" alt="Imagen" style="display: none;">
            </div>`
          );
        }

        $(this).append(newElement);

        $(".column").on("click", ".editable", function () {
          editPara(this); 
        });

        $(".column").on("change", "input[type='file']", function (event) {
          loadImage(event); 
        });
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

  async function save_article(new_status) {
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

    let user = await getUserData(localStorage.getItem("logged_user"));
    if (article_id == -1) {
      let new_article = {
        title: $("#title").val(),
        author: user.name,
        date_mod: new Date().getTime(),
        date_create: new Date().getTime(),
        date_publish: "none",
        state: 0,
        content: JSON.stringify(rows),
      };
      let id = await saveArticle(new_article);
      localStorage.setItem("article_id", id);
    } else {
      let article = await getArticle(localStorage.getItem("article_id"));
      if (new_status == -1) {
        new_status = article.state;
      }
      let date_pub;
      if (new_status == 1) {
        date_pub = new Date().getTime();
      } else {
        date_pub = article.date_publish;
      }
      let edited_article = {
        ...article,
        title: $("#title").val(),
        date_mod: new Date().getTime(),
        date_publish: date_pub,
        state: new_status,
        content: JSON.stringify(rows),
      };
      saveArticleData(localStorage.getItem("article_id"), edited_article);
    }

    // const config = JSON.stringify(rows);
    // localStorage.setItem("postBuilderConfig", config);
    alert("Article saved.");
    // console.log(rows);
  }

  async function load_article() {
    article_id = localStorage.getItem("article_id");

    if (!article_id) {
      article_id = -1;
    }
    console.log(article_id);
    let rows;
    if (article_id != -1) {
      let article_to_edit = await getArticle(article_id);
      rows = JSON.parse(article_to_edit.content);
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
                <p class="editable" >${element.content}</p>
              </div>`;
              
          } else if (element.type === "image") {
            newRow += `
              <div class="element">
                <img src="${element.src}" alt="Imagen">
              </div>`;
          }
        });
        $(".row-container").on("click", ".editable", function() {
          editPara(this);  
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

function editPara(paragraph) {
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
