import { getCSRFToken, filterElements } from "utils-functions";

// 1. Show search results card
const searchIcons = document.querySelectorAll(".search-button");
const searchInput = document.getElementById("search-input");
const results = document.getElementById("results");
const closeIcon = `
        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="#FFF" viewBox="0 0 256 256"><path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z"></path></svg>
`;

const showIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="#FFF" viewBox="0 0 256 256"><path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"></path></svg>`;

const setSearchIconState = (isVisible = False) => {
  if (isVisible) {
    searchIcons.forEach((icon) => {
      icon.innerHTML = closeIcon;
    });
  } else {
    searchIcons.forEach((icon) => {
      icon.innerHTML = showIcon;
    });
  }
};

searchInput?.addEventListener("focus", function (e) {
  e.preventDefault();
  results.classList.add("show-results");
  setSearchIconState(true);
});

searchIcons?.forEach((icon) => {
  icon.addEventListener("click", function (e) {
    e.preventDefault();
    results.classList.toggle("show-results");

    if (results.classList.contains("show-results")) {
      setSearchIconState(true);
    } else {
      setSearchIconState(false);
    }
  });
});

// Hide the messages
setTimeout(() => {
  document.querySelector(".bk-message")?.remove();
}, 5000);

// Confirmer la suppression avant de l'effectuer
const confirmDeletionModal = document.querySelector(".confirm-deletion");
const cancelDeletion = document.getElementById("cancel-deletion");
const forwardDeletion = document.getElementById("forward-deletion");
const ressourceName = confirmDeletionModal.querySelector(".ressource p");
const container = document.getElementById("delegate-actions-from-this-element");

let currentDeleteBtn;

container?.addEventListener("click", function (e) {
  if (
    e.target.matches(".deleter-element") ||
    e.target.matches(".deleter-element *")
  ) {
    e.preventDefault();
    const element = e.target.closest(".deleter-element");

    if (element.classList.contains("no-confirm")) {
      deletePost(element);
      return;
    }

    confirmDeletionModal.classList.add("ask-validation");
    ressourceName.innerHTML = element.getAttribute("data-ressource-name");
    currentDeleteBtn = element;
  } else if (e.target.matches(".upvote") || e.target.matches(".upvote *")) {
    const element = e.target.closest("button.upvote");
    upvotePost(element);
  }
});

forwardDeletion.addEventListener("click", function (e) {
  if (currentDeleteBtn) deletePost(currentDeleteBtn);
});

cancelDeletion.addEventListener("click", function (e) {
  e.preventDefault();
  confirmDeletionModal.classList.remove("ask-validation");
});

/**
 *
 * @param {HTMLButtonElement | HTMLAnchorElement} element
 */
function deletePost(element) {
  const url = `${document.location.origin}${element.getAttribute(
    "data-delete-url"
  )}`;

  forwardDeletion.innerHTML = "<div class='loader'></div>";

  fetch(url, {
    method: "GET",
    mode: "same-origin",
    headers: {
      XCsrfToken: document.querySelector("input[name='csrfmiddlewaretoken']")
        .value,
      "Content-Type": "application/json",
      "x-requested-with": "XMLHttpRequest",
    },
  })
    .then((r) => {
      if (r.ok) {
        let id = element.getAttribute("data-id");
        document.getElementById(id).remove();
      } else {
        alert("Echec de suppression du post");
      }
    })
    .catch((e) => {
      alert("Echec de suppression du post");
    })
    .finally(($) => {
      confirmDeletionModal.classList.remove("ask-validation");
      forwardDeletion.innerHTML = "Supprimer";
    });
}

/**
 *
 * @param {HTMLButtonElement | HTMLAnchorElement} element
 */
function upvotePost(element) {
  let iconElt = element.querySelector(".icon");
  let iconSvg = iconElt?.innerHTML;

  iconElt.innerHTML = "<div class='loader'></div>";

  const url = `${document.location.origin}${element.getAttribute(
    "data-upvote-url"
  )}`;

  fetch(url, {
    method: "GET",
    mode: "same-origin",
    headers: {
      XCsrfToken: document.querySelector("input[name='csrfmiddlewaretoken']")
        .value,
      "Content-Type": "application/json",
      "x-requested-with": "XMLHttpRequest",
    },
  })
    .then((r) => {
      if (r.ok) {
        incrementUpvotes(element);
      } else {
        let again = confirm("Une erreur est survenue ! Réessayer ?");

        if (again) {
          upvotePost(element);
        }
      }
    })
    .catch((e) => {
      alert("Une erreur est survenue ! Réessayez !");
    })
    .finally(($) => {
      iconElt.innerHTML = iconSvg;
    });
}

/**
 *
 * @param {HTMLButtonElement | HTMLAnchorElement} element
 */
function incrementUpvotes(element) {
  let counter = element.querySelector(".count-upvotes");
  let count = counter.textContent;
  let parsedCount = parseInt(count);

  if (isNaN(parsedCount)) return;

  parsedCount++;
  counter.innerHTML = parsedCount;
}

// Filtrer les posts
const searchingOnMobile = matchMedia("(max-width:600px").matches;

const filterInput = document.getElementById(
  searchingOnMobile ? "mobile-search-input" : "search-input"
);

const filterables = document.querySelectorAll(".filterable-element");

filterInput.addEventListener("input", function (e) {
  let value = e.target.value;

  filterables.forEach((filterable) => {
    filterElements({
      element: filterable,
      value: value,
      defaultState: "block",
    });
  });
});
