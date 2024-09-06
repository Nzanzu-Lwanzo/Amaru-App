const isMobile = () => {
  return /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
};

let userAgentIsMobile = isMobile();

/**
 * Fonction qui gère le retour vers le haut de la page
 * Afficher la flèche quand on est à un niveau sur la page.
 * Par défaut, c'est lorsqu'on a atteint la moitié de la page.
 */
const backToTop = (height) => {
  //  La hauteur de la page
  const pageHeight = getComputedStyle(document.body).height;
  const refinedValue = pageHeight.split(".")[0];

  // Par défaut, la flechette apparaît quand on est à 80% de scroll de la hauteur de la page
  const defaultHeight = (60 * refinedValue) / 100;

  // Définir la valeur de hauteur avec laquelle travailler
  let toCompute = height ? height : parseInt(defaultHeight);

  const arrow = document.querySelector(".gen-arrow-to-top");
  window.addEventListener("scroll", function () {
    if (this.scrollY > toCompute) {
      arrow?.classList.add("gen-arrow-to-top-js");
    } else {
      arrow?.classList.remove("gen-arrow-to-top-js");
    }
  });
};

/**
 * Fonction qui gère l'affichage de block en accordion
 */
function toggleAccordion(e, element) {
  e.preventDefault();

  if (element?.style.maxHeight) {
    element.style.maxHeight = null;
  } else {
    element.style.maxHeight = element.scrollHeight + "px";
  }
}

/**
 * Fonction qui construit l'URL complète de la ressource
 */
const buildRessourceUrl = (path) => {
  const location = document.location.origin;
  const url = `${location}${path}`;
  const csrf_token = document.querySelector(
    "input[name='csrfmiddlewaretoken']"
  ).value;
  return { url, csrf_token };
};

/**
 * Fonction qui gère l'affichage et la disparission d'un message toast
 * après un certain délai
 */

function toggleToastMessage(element, className, { delay1, delay2 }) {
  // Montrer la toast message
  const show = new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(element?.classList.add(className));
    }, delay1);
  });

  // Cacher la toast message
  show?.then(() => {
    setTimeout(() => {
      element?.classList.remove(className);
    }, delay2);
  });
}

/**
 *
 * @param {Event} e
 * @param {Object[String]} options
 * @returns {HTMLElement}
 *
 * Fonction qui permet de cibler le bon élément sur lequel cliquer
 * lorsqu'on fait de la délégation d'évènements
 */
function getElementFromDelegation(e, { mainClass, childClass }) {
  const target = e.target;
  let element;

  if (userAgentIsMobile && target.matches(mainClass)) {
    element = target;
  } else {
    if (target.matches(mainClass)) {
      element = target;
    } else if (target.matches(childClass)) {
      element = target.parentElement;
    } else if (
      target.matches(`${mainClass} ${childClass} path`) ||
      target.matches(`${mainClass} ${childClass} circle`) ||
      target.matches(`${mainClass} ${childClass} line`) ||
      target.matches(`${mainClass} ${childClass} polygon`)
    ) {
      element = target.parentElement.parentElement;
    }
  }

  return element;
}

/**
 * Fonction qui donne le verdict après une certaine action
 */

function verdictMessage({ state, message, delay1, delay2 }) {
  let messageCard;

  if (state === true) {
    // Succès
    messageCard = successMessage;
  } else if (state === false) {
    // Erreur
    messageCard = errorMessage;
  } else if (state === undefined) {
    // Info
    messageCard = infoMessage;
  }

  messageCard.querySelector(".message_text").innerHTML = message;
  toggleToastMessage(messageCard, "message__box__js", {
    delay1: delay1 || 150,
    delay2: delay2 || 4500,
  });
}

/**
 * @param {Object} data
 * @param {HTMLElement} data.element
 * @param {String} data.value
 * @param {String} data.defaultState
 * @returns {void}
 *
 * Filtre les éléments filterables selon qu'ils commencent par value ou pas.
 * S'ils ne commencent par value, ils sont cachés.
 * Sinon, ils gardent l'état courant de leur display.
 */

function filterElements({ element, value, defaultState }) {
  let elt = element.querySelector(".filterable-content");

  if (!elt.innerText.toLowerCase().includes(value.toLocaleLowerCase())) {
    element.style.display = "none";
  } else {
    element.style.display = defaultState ?? "flex";
  }
}

/**
 * Fonction qui copie dans le presse-papier
 */
async function copyToClipboard(element, fn) {
  const link =
    buildRessourceUrl(element?.getAttribute("data-link"))?.url ||
    "no-link-copied";

  if (link) {
    await navigator.clipboard.writeText(link);
    if (fn) {
      fn(element);
    }
  }
}

function formatUsername(name) {
  if (typeof name !== "string") return;

  return name.replace("-", " ");
}

function getCSRFToken() {
  return document.querySelector("input[name='csrfmiddlewaretoken']").value;
}

/**
 * EXPORTS
 */
export {
  backToTop,
  toggleAccordion,
  buildRessourceUrl,
  toggleToastMessage,
  getElementFromDelegation,
  verdictMessage,
  filterElements,
  copyToClipboard,
  getCSRFToken,
};
