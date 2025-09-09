/*********************************************************************************
 * Popup de partage : affichage / fermeture / écouteurs
 *********************************************************************************/

/** Affiche la popup */
function afficherPopup() {
  const popupBackground = document.querySelector(".popupBackground");
  popupBackground.classList.add("active");
}

/** Cache la popup */
function cacherPopup() {
  const popupBackground = document.querySelector(".popupBackground");
  popupBackground.classList.remove("active");
}

/** Initialise les écouteurs d'événements liés à la popup */
function initAddEventListenerPopup() {
  const btnPartage = document.querySelector(".zonePartage button");
  const popupBackground = document.querySelector(".popupBackground");

  btnPartage.addEventListener("click", afficherPopup);

  // Ferme si on clique sur l'arrière-plan (pas à l'intérieur de la popup)
  popupBackground.addEventListener("click", (event) => {
    if (event.target === popupBackground) {
      cacherPopup();
    }
  });
}
