# 🌸 **LoveMeter — Spécifications Fonctionnelles V1.3 (Fusion complète)**

### *« Fleurs en plus, blessures en moins. »*

---

# 0. **Concept général**

LoveMeter est un outil/jeu sérieux qui mesure **l’impact des actions affectives** entre deux partenaires (couple, proches, duo thérapeutique…).
Chaque personne possède un stock de **fleurs émotionnelles**, qui peut être positif, neutre ou négatif.

L’outil :

* ne juge pas,
* ne désigne pas de coupable,
* n’analyse que l’impact **des gestes** et non la valeur **des personnes**.

Tout est stocké **localement** (navigateur).

---

# 1. **Structure générale du modèle**

## 1.1 Partenaires

Chaque membre du duo possède :

* `prenom`
* `couleur` (couleur émotionnelle personnalisée)
* `fleursInitiales` (entier)
* `fleursActuelles` (entier pouvant être négatif)
* `emojiFleur` = 🌸 (si ≥ 0) ou 🥀 (si < 0), teinté de sa couleur

## 1.2 Actions

Une action est définie par :

* `id`
* `nom`
* `description` (optionnel)
* `type` (texte libre : réparation / escalade / etc.)
* `tags` (liste)
* `impactActeur` (Δ sur celui qui agit)
* `impactPartenaire` (Δ sur l’autre)
* `usageTotal`
* `dernierUsage` (timestamp normalisé)
* `active` (booléen)

➡️ Fin de toute logique genrée (plus de “P1 femme / P2 homme”).

## 1.3 Historique

Chaque entrée contient :

* `timestamp` (format strict `aaaa-mm-jj hh:mm:ss`)
* `actorId`
* `targetId`
* `deltaActor`
* `deltaPartner`
* `totalActorAfter`
* `totalPartnerAfter`
* `note` (champ texte)

Toutes les valeurs historiques sont **figées** : modifier une action n’affecte pas l’historique.

---

# 2. **Page Mode d’emploi (obligatoire)**

Une page dédiée explique en termes simples :

## 2.1 Pourquoi LoveMeter

* mesurer les gestes, pas juger les personnes
* rendre visibles les dynamiques
* outil de dialogue et de débriefing

## 2.2 Notion de Δ (delta)

* Δ = variation du stock de fleurs
* chaque action a deux effets :

  * **sur celui qui agit**
  * **sur celui qui reçoit**

## 2.3 Exemples

* “Dire merci” → +3 / +3
* “Crier” → -2 / -4

## 2.4 Émojis de fleurs

* 🌸 = fleur vive (score ≥ 0)
* 🥀 = fleur fanée (score < 0)

Individuellement, on regarde **l’état de la fleur**, pas une météo.

## 2.5 Ambiance globale

Explique la météo basée sur la **somme** des deux scores (voir section 4).

---

# 3. **Ergonomie de saisie**

### 3.1 Chaque action a **deux boutons directs**

Pour éviter des fenêtres intrusives :

| Action | Effet Acteur | Effet Partenaire | Bouton P1 | Bouton P2 |
| ------ | ------------ | ---------------- | --------- | --------- |

* Bouton « **Agit : [Nom P1]** »
* Bouton « **Agit : [Nom P2]** »

### 3.2 Enregistrement

Un seul clic :

1. applique l’impact à l’acteur et au partenaire
2. met à jour les fleurs
3. enregistre une ligne d’historique
4. met à jour usage + timestamp
5. sauvegarde localStorage

**Plus de pop-ups.**
Grande fluidité même en usage “à chaud”.

---

# 4. **Ambiance du couple (météo globale)**

L’ambiance globale n’est **plus** basée sur 4 cas ++/--/+-/-+.

Elle se fonde désormais sur la **somme des fleurs des deux partenaires** :

[
S = F_1 + F_2
]
[
A = |S|
]

## 4.1 Grille finale (seuils définitifs)

### Si **S ≥ 0** (ambiance plutôt positive)

| A = |S| | Ambiance | Emoji |
|-----|-------------|--------|
| **0 → 5** | Neutre / stable | ⛅ |
| **6 → 14** | Éclaircies | 🌤️ |
| **15 → 29** | Beau temps | 🌞 |
| **≥ 30** | Grand soleil | 🌞✨ |

### Si **S < 0** (ambiance plutôt difficile)

| A = |S| | Ambiance | Emoji |
|-----|-------------|--------|
| **0 → 5** | Neutre / légère tension | 🌫️ |
| **6 → 14** | Averses émotionnelles | 🌧️ |
| **15 → 29** | Gros temps | 🌧️⛈️ |
| **≥ 30** | Tempête émotionnelle | ⛈️ |

## 4.2 Représentation dans le dashboard

* Une **carte ambiance** au centre :

  * phrase + emoji
* Couleurs de fond ajustées à l’intensité
* Explications très simples (type météo du jour)

---

# 5. **Représentation individuelle**

Pour chaque partenaire :

* **fleursActuelles**
* **émoji** :

  * 🌸 = score ≥ 0
  * 🥀 = score < 0
* Couleur personnalisée (définit fond / contour / highlight)

Exemples :

```
Alice : 12 🌸
Mehdi : -3 🥀
```

---

# 6. **Horodatage — règle normalisée**

Tous les timestamps doivent être au format :

```
aaaa-mm-jj hh:mm:ss
```

Exemples :

* 2025-02-11 09:23:54
* 2024-11-02 17:05:00

**Applications :**

* historique
* dernier usage d’une action
* export CSV
* import CSV

---

# 7. **Export / Import CSV**

## 7.1 Actions CSV

Champs :

1. id
2. nom
3. description
4. impactActeur
5. impactPartenaire
6. type
7. tags
8. usageTotal
9. dernierUsage
10. active

## 7.2 Historique CSV

Champs :

1. timestamp
2. actionId
3. actorId
4. targetId
5. deltaActor
6. deltaPartner
7. totalActorAfter
8. totalPartnerAfter
9. note

---

# 8. **Terminologie UI**

* “Effet acteur” / “Effet partenaire”
* “Agit : Alice” / “Agit : Mehdi”
* “Ambiance du couple”
* “Fleur vive / fleur fanée”

Plus jamais :

* P1 = femme
* P2 = homme
* δP1 / δP2
* équilibre/ déséquilibre émotionnel (remplacé par ambiance)

---

# 9. **Synthèse visuelle**

## Indiv :

* 🌸 ou 🥀, coloré selon la personne

## Global :

* ⛅ / 🌤️ / 🌞 / 🌞✨
* 🌫️ / 🌧️ / 🌧️⛈️ / ⛈️

Selon somme ( S ) et amplitude ( A ).

---

# 🎉 **LoveMeter V1.3 est maintenant spécifié proprement.**
