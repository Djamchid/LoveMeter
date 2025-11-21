# 🌸 LoveMeter

**Outil de suivi de la dynamique de couple**

LoveMeter est une application web de suivi de la dynamique de couple, permettant d'enregistrer les actions et leurs impacts sur les deux partenaires. C'est un serious game neutre qui mesure des effets, pas des personnes.

## ✨ Fonctionnalités

### 1. **Dashboard**
- Vue d'ensemble des fleurs actuelles pour chaque partenaire
- Indicateur "Météo du couple" (ensoleillé, variable, orageux)
- Indicateur "Équilibre" (équilibré, légèrement déséquilibré, fortement déséquilibré)
- Historique détaillé des actions avec possibilité d'ajouter des notes
- Export/Import de l'historique en CSV

### 2. **Saisie d'Actions**
- Liste des actions disponibles avec filtrage et tri
- Enregistrement rapide d'une action en un clic
- Affichage des impacts (Δ) pour chaque partenaire
- Statistiques d'usage pour chaque action

### 3. **Paramétrage**
- Configuration des partenaires (prénom, couleur)
- Définition des fleurs initiales
- Création et modification d'actions personnalisées
- Configuration des seuils d'alerte
- Mode de tri par défaut
- Export/Import des actions en CSV

## 🏗️ Architecture

L'application suit une architecture MVC modulaire avec ES6 modules :

```
LoveMeter/
├── index.html                      # Page principale
├── css/
│   └── styles.css                  # Styles CSS
├── js/
│   ├── main.js                     # Point d'entrée
│   ├── controllers/
│   │   └── AppController.js        # Contrôleur principal
│   ├── models/
│   │   ├── Partner.js              # Modèle Partenaire
│   │   ├── Action.js               # Modèle Action
│   │   ├── HistoryEntry.js         # Modèle Entrée d'historique
│   │   └── Settings.js             # Modèle Paramètres
│   ├── views/
│   │   ├── DashboardView.js        # Vue Dashboard
│   │   ├── ActionsView.js          # Vue Saisie
│   │   └── SettingsView.js         # Vue Paramétrage
│   ├── storage/
│   │   └── StorageManager.js       # Gestion localStorage
│   └── utils/
│       └── CSVExporter.js          # Export/Import CSV
└── specifications_fonctionnelles.md # Spécifications
```

## 🚀 Utilisation

### Installation

Aucune installation requise ! Il suffit d'ouvrir le fichier `index.html` dans un navigateur web moderne.

```bash
# Cloner le dépôt
git clone <repository-url>

# Ouvrir dans le navigateur
open index.html
```

### Premiers pas

1. **Configuration initiale** :
   - Allez dans "Paramétrage"
   - Configurez les prénoms et couleurs des partenaires
   - Définissez les fleurs initiales (par défaut : 0)
   - Personnalisez les actions ou utilisez celles par défaut

2. **Enregistrer des actions** :
   - Allez dans "Saisie"
   - Cliquez sur "Enregistrer" pour une action
   - Les fleurs sont mises à jour automatiquement

3. **Consulter les résultats** :
   - Le "Dashboard" affiche l'état actuel
   - L'historique permet de suivre l'évolution
   - Ajoutez des notes pour contextualiser

## 💾 Stockage des données

- Toutes les données sont stockées en **localStorage** dans le navigateur
- **Aucune transmission vers un serveur**
- Les données persistent entre les sessions
- Export CSV disponible pour sauvegarde externe

## 🔒 Confidentialité

- **100% local** : aucune donnée n'est envoyée à un serveur
- **Aucun tracking** : pas de cookies, pas d'analytics
- **Vos données vous appartiennent** : exportez-les quand vous voulez

## 🌐 Compatibilité

Navigateurs modernes supportant :
- ES6 modules
- localStorage
- CSS Grid & Flexbox

Testé sur :
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 📝 Actions par défaut

L'application inclut 6 actions par défaut :

1. **Écoute active** (réparation) : +3/+3
2. **Critique personnelle** (escalade) : -5/-3
3. **Excuse sincère** (réparation) : +5/+5
4. **Retrait / stonewalling** (escalade) : -4/-6
5. **Compromis** (réparation) : +4/+4
6. **Généralisation** (escalade) : -3/-3

Ces actions peuvent être modifiées ou supprimées selon vos besoins.

## 🎨 Personnalisation

### Couleurs des partenaires
Changez les couleurs dans "Paramétrage" pour personnaliser l'affichage.

### Seuils d'alerte
Ajustez les seuils pour définir quand une alerte s'affiche (par défaut : -10 et -20).

### Actions personnalisées
Créez vos propres actions avec des impacts adaptés à votre situation.

## 📊 Export/Import

### Export CSV
- **Historique** : exporte toutes les entrées avec dates, actions et totaux
- **Actions** : exporte la configuration des actions

### Import CSV
- **Historique** : remplace l'historique actuel et recalcule les totaux
- **Actions** : remplace la liste d'actions

## 🛠️ Développement

### Structure du code

#### Models (Modèles)
- Encapsulent la logique métier
- Gèrent la sérialisation/désérialisation
- Valident les données

#### Views (Vues)
- Gèrent le rendu de l'interface
- Capturent les événements utilisateur
- Délèguent les actions au contrôleur

#### Controller (Contrôleur)
- Orchestre les vues et les modèles
- Gère l'état de l'application
- Persiste les données

### Ajouter une fonctionnalité

1. Modifier les modèles si nécessaire
2. Ajouter la logique dans le contrôleur
3. Mettre à jour les vues concernées
4. Tester dans le navigateur

## 🐛 Résolution de problèmes

### Les données ne sont pas sauvegardées
- Vérifiez que localStorage est activé dans votre navigateur
- Vérifiez que vous n'êtes pas en mode navigation privée

### L'import CSV échoue
- Vérifiez que le fichier CSV est bien formaté
- Utilisez un fichier exporté depuis LoveMeter comme modèle

### L'interface ne s'affiche pas correctement
- Vérifiez que vous utilisez un navigateur moderne
- Rafraîchissez la page (Ctrl+F5)
- Vérifiez la console pour d'éventuelles erreurs

## 📄 Licence

Ce projet est fourni tel quel, sans garantie. Utilisez-le librement pour votre usage personnel.

## 🤝 Contribution

Pour contribuer :
1. Forkez le projet
2. Créez une branche pour votre fonctionnalité
3. Committez vos changements
4. Poussez vers la branche
5. Ouvrez une Pull Request

## 📧 Support

Pour toute question ou suggestion, consultez les spécifications fonctionnelles dans `specifications_fonctionnelles.md`.

---

**Note** : LoveMeter est un outil neutre de mesure, pas un outil de jugement. Les valeurs négatives ne désignent pas de "coupable" mais reflètent l'impact ressenti des actions sur la dynamique du couple.
