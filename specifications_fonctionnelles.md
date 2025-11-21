Je te propose un jeu de **spécifications fonctionnelles V1 de LoveMeter**, centré sur trois scénarios d’usage :

1. **Paramétrage** (configuration du couple & des actions)
2. **Saisie** (enregistrer les actions lors / après une crise)
3. **Dashboard** (consultation des indicateurs & de l’historique)

Aucune ligne de code, uniquement du fonctionnel.

---

## 0. Contexte & objectif

**LoveMeter** est un outil / serious game de suivi de la dynamique de couple.
Chaque action a un impact chiffré sur les “fleurs” de deux partenaires (P1, P2).
Les totaux peuvent être négatifs, sans jugement moral : le système mesure des effets, pas des personnes.

Les données sont **stockées localement** (localStorage du navigateur).
L’outil est conçu pour un couple ou un thérapeute, dans une logique de **journal de couple neutre**.

---

## 1. Modèle fonctionnel (vue d’ensemble)

### 1.1. Acteurs

* **Utilisateur.rice “Couple”** : un ou les deux partenaires, ou un observateur (thérapeute, médiateur), qui :

  * paramètre l’outil,
  * enregistre les actions,
  * consulte les résultats.

### 1.2. Objets métier

* **Partenaire**

  * Identité (prénom libre)
  * Couleur (personnalisable, sans connotation imposée)
  * Nombre de fleurs initiales
  * Nombre de fleurs actuelles

* **Action**

  * Nom (obligatoire)
  * Description (optionnelle)
  * Type (texte libre : “réparation”, “escalade”, etc.)
  * Tags (liste de mots-clés)
  * Δ P1 (variation entière, positive, nulle ou négative)
  * Δ P2
  * Usage total (compteur)
  * Dernier usage (timestamp)
  * Statut actif/inactif

* **Entrée d’historique**

  * Timestamp
  * Action utilisée
  * Δ P1, Δ P2
  * Totaux P1, P2 après l’action
  * Note libre (commentaire)

* **Paramètres globaux**

  * Mode de tri des actions
  * Seuils d’alerte (alert1, alert2) pour “découvert émotionnel”
  * Fleurs initiales par partenaire

---

## 2. Scénario 1 : Paramétrage

### 2.1. Objectif

Permettre à l’utilisateur de **personnaliser** LoveMeter pour refléter au mieux leur couple :

* Identité et couleur des partenaires
* Fleurs initiales
* Liste d’actions & impacts
* Paramètres de tri et d’alertes

### 2.2. Préconditions

* L’utilisateur a ouvert LoveMeter dans un navigateur compatible.
* Une configuration précédente peut exister (localStorage), sinon les valeurs par défaut sont chargées.

### 2.3. Parcours fonctionnel

**Étape 1 – Personnaliser les partenaires**

1. L’utilisateur voit deux panneaux : **Partenaire 1** & **Partenaire 2** (noms par défaut).
2. Il peut saisir un **prénom** pour chaque partenaire.

   * Règle : champ texte libre, non obligatoire, mais si vide → le système affiche un libellé par défaut (“Partenaire 1”, “Partenaire 2”).
3. Il peut sélectionner une **couleur** pour chaque partenaire via un sélecteur de couleur.
4. Les changements sont immédiatement :

   * reflétés dans l’interface (labels, pastille de couleur),
   * sauvegardés en localStorage.

**Étape 2 – Définir le nombre de fleurs initiales**

1. L’utilisateur renseigne un **nombre de fleurs initiales commun** aux deux partenaires.

   * Contrainte : entier (positif, nul ou négatif) dans une plage raisonnable (ex. -999 à 999).
2. En cliquant sur “Appliquer aux deux partenaires” :

   * Les valeurs **initiales** de P1 et P2 sont mises à jour.
   * Les **fleurs actuelles** sont réinitialisées à cette valeur.
   * L’historique est **remis à zéro** (car la chronologie des actions ne correspond plus).
3. Le tout est sauvegardé en localStorage.

**Étape 3 – Configurer la liste d’actions**

1. L’utilisateur consulte la liste d’actions par défaut.

2. Il peut :

   * Ajouter une nouvelle action :

     * renseigner : nom (obligatoire), description, type, tags, Δ P1, Δ P2.
     * enregistrez → l’action apparaît dans la liste, avec usageTotal = 0.
   * Modifier une action existante :

     * cliquer sur “Modifier” → le formulaire de saisie se remplit avec les données existantes.
     * modifier puis enregistrer → mise à jour des propriétés de l’action.
   * Désactiver une action (V2 possible) :

     * ne la supprime pas, mais elle ne figure plus dans la liste d’usage courante.

3. Règles métier :

   * Δ P1 et Δ P2 sont des **entiers**, positifs ou négatifs.
   * Pas de limite stricte, mais l’interface peut suggérer une plage (ex : -10 à +10).
   * Nom obligatoire : si vide, l’action ne peut pas être enregistrée.

**Étape 4 – Paramètres de tri et d’alerte**

1. L’utilisateur choisit un **mode de tri** par défaut pour les actions :

   * par fréquence d’usage,
   * par dernier usage,
   * par nom,
   * par impact total (Δ P1 + Δ P2).

2. Il peut définir ou modifier les **seuils d’alerte** (alert1, alert2) :

   * par exemple : alert1 = -10, alert2 = -20.
   * Ces seuils servent à qualifier visuellement un “découvert émotionnel”.

3. Ces paramètres sont persistés dans localStorage.

### 2.4. Résultat attendu

* LoveMeter est **personnalisé** au couple ou au contexte.
* Toute modification est persistée entre deux sessions de navigateur.

---

## 3. Scénario 2 : Saisie (enregistrer une action)

### 3.1. Objectif

Permettre l’enregistrement rapide d’une action (ou séquence d’actions) pendant ou après une crise / interaction, afin de suivre l’évolution des fleurs.

### 3.2. Préconditions

* La phase de paramétrage de base (au moins les valeurs par défaut) est en place.
* La liste d’actions contient au moins 1 action active.

### 3.3. Parcours fonctionnel principal

**Étape 1 – Sélection de l’action**

1. L’utilisateur ouvre LoveMeter (ou reste sur l’onglet Actions).

2. Il voit une table/listing d’actions comprenant :

   * Nom, Δ P1, Δ P2, type/tags, usage, dernier usage.

3. Il peut filtrer la liste par :

   * texte (nom, type, tags),
   * tri (fréquence, dernier usage, nom, impact total).

4. Pour enregistrer une action, l’utilisateur clique sur le bouton **“Enregistrer”** de la ligne concernée.

**Étape 2 – Application de l’action**

1. Quand l’action A est enregistrée, le système :

   * ajoute Δ P1 à P1.currentFlowers ;
   * ajoute Δ P2 à P2.currentFlowers ;
   * incrémente `usageTotal` de A ;
   * met à jour `lastUsed` de A avec le timestamp courant ;
   * crée une nouvelle entrée dans **l’historique** avec :

     * timestamp,
     * actionId,
     * Δ P1, Δ P2,
     * total1After, total2After,
     * note vide.

2. Les valeurs de fleurs peuvent devenir **négatives** (aucun blocage).

3. Le système sauvegarde immédiatement l’état dans localStorage.

**Étape 3 – Ajout de note (optionnel)**

1. Dans la section Historique, l’utilisateur peut :

   * saisir ou modifier une note textuelle associée à chaque entrée (à froid ou à chaud).
2. La modification d’une note **ne modifie pas** les deltas ni les totaux, seulement le commentaire.

### 3.4. Variantes / cas particuliers

* **Saisie en rafale** :

  * L’utilisateur peut enregistrer plusieurs actions d’affilée (au fur et à mesure d’un débriefing).
  * Les totaux de fleurs sont mis à jour après chaque action, en cascade.

* **Action modifiée ultérieurement** :

  * Si les paramètres d’une action sont modifiés après coup, cela **n’affecte pas** les entrées d’historique déjà créées (leur Δ et leurs totaux restent tels qu’enregistrés).

### 3.5. Résultat attendu

* Chaque action saisie met à jour :

  * les compteurs de fleurs,
  * les statistiques d’usage de l’action,
  * l’historique détaillé.
* La saisie est fluide, utilisable en situation de débriefing réel.

---

## 4. Scénario 3 : Dashboard (consultation & compréhension)

### 4.1. Objectif

Permettre de **visualiser rapidement l’état du couple** (fleurs actuelles, météo, équilibre) et de **parcourir l’historique** pour comprendre les dynamiques.

### 4.2. Préconditions

* Au moins une action a été saisie (sinon le dashboard reflète simplement l’état initial).

### 4.3. Composants du dashboard

**A. Vue Partenaires**

* Pour chaque partenaire, le dashboard affiche :

  * prénom,
  * couleur,
  * nombre de fleurs actuelles (valeur entière, possiblement négative).
* Règles d’affichage :

  * si la valeur est en dessous de `alert1` → style “alerte” modérée ;
  * si en dessous de `alert2` → style “alerte forte” (ex : badge ou couleur de texte).

**B. Indicateur “Météo du couple”**

* Calcul (exemple fonctionnel) :

  * moyenne M = (P1.currentFlowers + P2.currentFlowers) / 2
  * si M > 20 → “Météo du couple : ensoleillé”
  * si M < -5 → “Météo du couple : orageux”
  * sinon → “Météo du couple : variable”

* L’indicateur est présenté sous forme de badge (couleur verte, orange, rouge selon le cas).

**C. Indicateur “Équilibre”**

* Calcul :

  * diff = |P1.currentFlowers - P2.currentFlowers|
  * si diff ≤ 5 → “Équilibre : globalement équilibré”
  * si diff > 15 → “Équilibre : fortement déséquilibré”
  * sinon → “Équilibre : légèrement déséquilibré”

* Affiché sous forme de badge.

**D. Historique**

* Tableau chronologique des entrées :

  * date/heure,
  * nom de l’action,
  * Δ P1, Δ P2 (avec couleur + / -),
  * totaux après l’action,
  * note modifiable.

* L’utilisateur doit pouvoir :

  * visualiser facilement la **chronologie** de la crise / période,
  * repérer les enchaînements d’actions “escalade” / “réparation”.

### 4.4. Export / Import pour analyse externe

* Depuis le dashboard ou la section CSV, l’utilisateur peut :

**Exporter les actions (CSV)** :

* Pour partager une “grille d’actions” ou la reprendre ailleurs.

**Exporter l’historique (CSV)** :

* Pour analyser les données dans un tableur, un outil stat, etc.

**Importer un historique (CSV)** :

* Option avancée : recharger un historique (par exemple transféré d’un autre navigateur).
* Fonctionnellement :

  * le nouvel historique remplace l’ancien,
  * les totaux de fleurs sont recalculés à partir de la dernière ligne de ce nouvel historique.

### 4.5. Résultat attendu

* Le dashboard doit permettre de répondre rapidement à des questions comme :

  * **“Où en est-on aujourd’hui ?”** (niveau de fleurs, météo, équilibre)
  * **“Quelles actions sont les plus fréquentes ? Les plus coûteuses ?”**
  * **“Qu’est-ce qui a aidé à réparer les dernières crises ?”**

Sans jugement de valeur, uniquement via **indicateurs visuels** et **données**.

---

## 5. Règles transversales

1. **Neutralité**

   * Aucun message ne désigne explicitement un “coupable” ou une “victime par défaut”.
   * On parle d’**actions** et de leurs **effets ressentis**.

2. **Confidentialité**

   * Toutes les données sont stockées en **localStorage** dans le navigateur.
   * Aucune transmission automatique vers un serveur.
   * L’export CSV est une action volontaire de l’utilisateur.

3. **Résilience**

   * En cas de corruption de données en localStorage, l’application doit retomber sur une configuration par défaut (sans crash).

4. **Non-linéarité**

   * La modification d’une action **n’affecte pas rétroactivement** l’historique.
   * Les valeurs historiques sont figées à l’instant de la saisie.

