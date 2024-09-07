const matches = matchMedia("((max-width: 490px))").matches;
const article = document.querySelector("article");

(function () {
  article.classList.add("article-read");
  document.querySelector("p[data-f-id='pbf']")?.remove()
})();
