# Chatbot HAIR - Documentation

## 🚀 Description

Le chatbot HAIR est un système conversationnel intelligent hybride qui combine des règles locales rapides avec l'IA Gemini pour fournir des réponses pertinentes aux utilisateurs.

## 🏗️ Architecture

Le système utilise une approche hybride :
- **Règles locales** : Réponses instantanées pour les questions fréquentes
- **IA Gemini** : Réponses intelligentes pour les questions complexes
- **Base de connaissances** : Informations sur les services, produits et navigation

## 📁 Structure des fichiers

- `chatbot.js` : Interface utilisateur et gestion de l'affichage
- `chatbot-gemini.js` : Intégration avec l'API Gemini
- `chatbot-hybrid.js` : Moteur hybride (règles locales + IA)
- `chatbot.css` : Styles du widget de chat
- `CONFIGURATION_API.md` : Instructions pour la configuration de l'API

## 🔧 Configuration

### 1. Clé API Gemini

Pour que le chatbot fonctionne correctement avec l'IA Gemini, vous devez :

1. Obtenir une clé API Gemini valide sur [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Remplacer la clé factice dans `chatbot-gemini.js` :
   ```javascript
   const GEMINI_API_KEY = 'YOUR_ACTUAL_API_KEY_HERE';
   ```

### 2. Intégration dans vos pages

Ajoutez ces lignes dans la section `<head>` de vos pages HTML :
```html
<link rel="stylesheet" href="chatbot.css">
```

Et ces lignes avant la balise `</body>` :
```html
<script src="chatbot-gemini.js"></script>
<script src="chatbot-hybrid.js"></script>
<script src="chatbot.js"></script>
```

## 🎯 Fonctionnalités

- Activation automatique après 20 secondes
- Messages de bienvenue personnalisés
- Navigation assistée sur le site
- Information sur les services et produits
- Collecte de prospects
- Interface conviviale avec animations

## 🛠️ Personnalisation

Vous pouvez adapter le chatbot en modifiant :

- Les réponses dans `LOCAL_KNOWLEDGE_BASE` dans `chatbot-hybrid.js`
- Le prompt système dans `chatbot-gemini.js`
- Les styles dans `chatbot.css`
- Le comportement dans `chatbot.js`

## 🧪 Tests

Un fichier `test-chatbot.html` est inclus pour tester les différentes fonctionnalités du système.

## ⚠️ Dépannage

Si le chatbot affiche des messages d'erreur :
1. Vérifiez que la clé API Gemini est correctement configurée
2. Assurez-vous que tous les fichiers JavaScript sont correctement chargés
3. Consultez la console du navigateur pour les erreurs spécifiques

## 📞 Support

Pour toute question ou assistance, contactez :
- Email : vfranck364@gmail.com
- WhatsApp : +237 6 83 12 16 54