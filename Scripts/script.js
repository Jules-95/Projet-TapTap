/*********************************************************************************
 * Logique du jeu : score, affichage, validation, changements de mode
 *********************************************************************************/

/** Affiche le score dans la zone .zoneScore */
function afficherResultat(score, nbMotsProposes) {
  const spanScore = document.querySelector(".zoneScore span");
  spanScore.innerText = `${score} / ${nbMotsProposes}`;
}

/** Affiche la proposition à recopier dans .zoneProposition */
function afficherProposition(proposition) {
  const zoneProposition = document.querySelector(".zoneProposition");
  zoneProposition.innerText = proposition;
}

/** Construit et ouvre l'email de partage via mailto */
function afficherEmail(nom, email, score) {
  const mailto = `mailto:${email}?subject=Partage du score TapTap&body=Salut, je suis ${nom} et je viens de réaliser le score ${score} sur le site TapTap !`;
  location.href = mailto;
}

/** Validation minimale du nom (>= 2 caractères) */
function validerNom(nom) {
  return nom.length >= 2;
}

/** Validation simple d'email (regex basique) */
function validerEmail(email) {
  const emailRegExp = new RegExp("[a-z0-9._-]+@[a-z0-9._-]+\\.[a-z0-9._-]+");
  return emailRegExp.test(email);
}

/** Lance le jeu : init, écouteurs et boucle principale */
function lancerJeu() {
  // Init popup
  initAddEventListenerPopup();

  // État du jeu
  let score = 0;
  let i = 0;
  let listeProposition;
  let startTime = null; // ← chrono (démarre au premier essai)

  // Sélecteurs
  const btnValiderMot = document.getElementById("btnValiderMot");
  const inputEcriture = document.getElementById("inputEcriture");
  const listeBtnRadio = document.querySelectorAll(".optionSource input");

  // ---- Gestion du mode (mots / phrases) ----
  function getModeInitial() {
    const checked = document.querySelector(".optionSource input:checked");
    return checked && checked.value === "2" ? "phrases" : "mots";
  }
  function setMode(mode) {
    listeProposition = mode === "phrases" ? listePhrases : listeMots;
  }
  let modeLocked = false;
  function lockMode() {
    if (modeLocked) return;
    modeLocked = true;
    // Désactive les radios pour éviter tout switch en cours de partie
    listeBtnRadio.forEach((r) => (r.disabled = true));
  }

  // Mode initial selon le radio coché
  setMode(getModeInitial());

  // Premier affichage
  afficherProposition(listeProposition[i]);
  afficherResultat(score, i);
  inputEcriture.focus();

  // Validation au clic
  btnValiderMot.addEventListener("click", () => {
    if (!modeLocked) lockMode();
    if (startTime === null) startTime = Date.now(); // ← démarre le chrono au premier clic

    if (inputEcriture.value === listeProposition[i]) {
      score++;
      btnValiderMot.classList.add("bonne-reponse");
    } else {
      btnValiderMot.classList.add("mauvaise-reponse");
    }

    // Effet visuel temporaire
    setTimeout(() => {
      btnValiderMot.classList.remove("bonne-reponse", "mauvaise-reponse");
    }, 500);

    // Passage au suivant
    i++;
    afficherResultat(score, i);
    inputEcriture.value = "";
    inputEcriture.focus();

    // Fin de liste ou affichage suivant
    if (listeProposition[i] === undefined) {
      // ← calcule et affiche le temps total
      const elapsedMs = startTime === null ? 0 : Date.now() - startTime;
      const totalSec = Math.floor(elapsedMs / 1000);
      const min = Math.floor(totalSec / 60);
      const sec = String(totalSec % 60).padStart(2, "0");
      afficherProposition(`Le jeu est fini !\nTemps total : ${min}m ${sec}s`);
      btnValiderMot.disabled = true;
    } else {
      afficherProposition(listeProposition[i]);
    }
  });

  // Validation avec Entrée
  inputEcriture.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      if (!modeLocked) lockMode();
      if (startTime === null) startTime = Date.now(); // ← démarre le chrono si Enter direct
      btnValiderMot.click();
    }
  });

  // Changement de mode (mots / phrases)
  for (let index = 0; index < listeBtnRadio.length; index++) {
    listeBtnRadio[index].addEventListener("change", (event) => {
      if (modeLocked) return; // une fois la partie démarrée, on ignore les changements
      const mode = event.target.value === "1" ? "mots" : "phrases";
      setMode(mode);
      // Avant démarrage, on repart proprement du début pour éviter undefined
      i = 0;
      score = 0;
      startTime = null; // ← reset chrono si on change avant d'avoir commencé
      afficherProposition(listeProposition[i]);
      afficherResultat(score, i);
    });
  }

  // Partage du score (formulaire popup)
  const form = document.querySelector("form");
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const nom = document.getElementById("nom").value;
    const email = document.getElementById("email").value;

    if (validerNom(nom) && validerEmail(email)) {
      const scoreEmail = `${score} / ${i}`;
      afficherEmail(nom, email, scoreEmail);
    } else {
      console.log("Erreur");
    }
  });
}


