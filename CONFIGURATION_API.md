# Instructions pour Configurer la Clé API Gemini

## 🔑 Obtenir une Clé API Gemini Valide

1. Rendez-vous sur [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Connectez-vous avec votre compte Google
3. Cliquez sur "Get API Key" ou "Create API Key"
4. Sélectionnez votre projet ou créez-en un nouveau
5. Copiez la clé API fournie

## 📝 Mettre à Jour le Fichier

1. Ouvrez le fichier `chatbot-gemini.js`
2. Remplacez la ligne :
   ```javascript
   const GEMINI_API_KEY = 'YOUR_GEMINI_API_KEY_HERE'; // Remplacez par votre propre clé
   ```
3. Par votre clé API réelle :
   ```javascript
   const GEMINI_API_KEY = 'Votre_Clé_API_Réelle_Ici';
   ```

## ⚠️ Important

- Protégez votre clé API - ne la partagez pas publiquement
- Les clés API peuvent avoir des limites d'utilisation
- Assurez-vous que votre compte Google a les autorisations nécessaires

## 🛡️ Sécurité

Pour une utilisation en production, envisagez de :
- Héberger la clé API côté serveur plutôt que côté client
- Utiliser un proxy API pour protéger votre clé
- Mettre en place des limites de débit

## 🧪 Tester la Configuration

Une fois la clé mise à jour, vous pouvez tester le chatbot. Si vous voyez encore des messages d'erreur, vérifiez :
- Que la clé API est correctement saisie
- Que votre compte Google a accès à l'API Gemini
- Que vous n'avez pas dépassé les limites de quota