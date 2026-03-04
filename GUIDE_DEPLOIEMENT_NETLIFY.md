# 🚀 Déployer HAIR Chatbot sur Netlify avec Variables d'Environnement

## 📋 Vue d'ensemble

Ce guide explique comment configurer les variables d'environnement sur Netlify pour sécuriser ta clé API Groq.

---

## 🔐 Pourquoi Utiliser un Proxy ?

### ❌ Problème avec `config-api.js` actuel
```javascript
// ⚠️ CLÉ EXPOSÉE - N'IMPORTE QUI PEUT LA VOIR
window.CONFIG_API = {
    GROQ_API_KEY: 'gsk_IhmBeEXNjEwFaVfmW6tc...'  // Visible dans le navigateur !
};
```

**Risques :**
- N'importe qui peut voir ta clé avec "Inspecter le code"
- Quelqu'un peut voler ta clé et l'utiliser
- Quota dépassé par des tiers

### ✅ Solution : Netlify Functions Proxy
```
Utilisateur → Ton Site → Netlify Function (clé cachée) → API Groq
                     ↑
              GROQ_API_KEY (variable d'environnement)
```

**Avantages :**
- Clé API cachée côté serveur
- Impossible à voler depuis le navigateur
- Tu contrôles qui utilise l'API

---

## 📝 Étape 1 : Préparer le Projet

### Fichiers déjà créés ✅

```
hair-cosmic-web/
├── netlify/
│   └── functions/
│       └── groq-proxy.js    ✅ Créé
├── netlify.toml             ✅ Créé
├── chatbot-gemini-enhanced.js  ✅ Modifié (supporte proxy)
└── config-api.js            ⚠️ À vider pour production
```

### Modifier `config-api.js` pour la production

```javascript
// Pour production (après déploiement Netlify)
window.CONFIG_API = {
    GROQ_API_KEY: '',  // ← Laissé vide, le proxy gère tout
    GEMINI_API_KEY: ''
};
window.CONFIG_API.API_MODE = 'groq';
```

### Garder `config-api.js` avec ta clé pour le développement local

```javascript
// Pour développement local seulement
window.CONFIG_API = {
    GROQ_API_KEY: 'gsk_IhmBeEXNjEwFaVfmW6tc...',  // Ta clé ici
    GEMINI_API_KEY: 'AIzaSyA-wadl5mW611OLnaA6y8jQ0oGCGg2lePI'
};
```

---

## 🚀 Étape 2 : Déployer sur Netlify

### Option A : Via Git (Recommandé)

1. **Push ton code sur GitHub/GitLab**
   ```bash
   git add .
   git commit -m "🔒 Ajout proxy Netlify pour API Groq"
   git push origin main
   ```

2. **Connecter Netlify à ton repo**
   - Va sur https://app.netlify.com
   - Clique sur "Add new site" → "Import an existing project"
   - Choisis GitHub/GitLab
   - Sélectionne ton repo `hair-cosmic-web`

3. **Configurer le build**
   - **Build command :** Laisse vide (ou `npm run build` si tu as un build)
   - **Publish directory :** `.` (racine)
   - **Functions directory :** `netlify/functions`

4. **Cliquer sur "Deploy site"**

---

## 🔑 Étape 3 : Ajouter les Variables d'Environnement

### Dans le Dashboard Netlify

1. **Va sur ton site Netlify**
   - https://app.netlify.com/sites/[ton-site]

2. **Onglet "Site configuration"**
   - Clique sur "Site configuration" dans le menu

3. **Section "Environment variables"**
   - Menu de gauche → "Environment variables"
   - Clique sur "Add a variable"

4. **Ajouter `GROQ_API_KEY`**
   ```
   Key: GROQ_API_KEY
   Value: gsk_YOUR_NEW_KEY_HERE  ← Remplace par ta vraie clé
   ```

5. **Sauvegarder**
   - Clique sur "Save"

6. **Redéployer le site**
   - Va dans l'onglet "Deploys"
   - Clique sur "Trigger deploy" → "Deploy site"

---

## 🧪 Étape 4 : Tester le Proxy

### Test 1 : Vérifier que la function est déployée

1. Va dans l'onglet **"Functions"** sur Netlify
2. Tu devrais voir `groq-proxy` dans la liste
3. Clique dessus pour voir les logs

### Test 2 : Tester l'URL du proxy

```bash
# Remplace [ton-site] par le nom de ton site Netlify
curl -X POST https://[ton-site].netlify.app/.netlify/functions/groq-proxy \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {"role": "system", "content": "Tu es un assistant."},
      {"role": "user", "content": "Bonjour"}
    ],
    "model": "llama-3.3-70b-versatile",
    "temperature": 0.7,
    "max_tokens": 800
  }'
```

### Test 3 : Tester le chatbot

1. Ouvre https://[ton-site].netlify.app/chatbot.html
2. Ouvre la console (F12)
3. Tu devrais voir :
   ```
   🔒 [Groq] Mode PROXY activé - Clé API cachée côté serveur
   🤖 [Groq] Envoi de la requête API...
   📡 [Groq] Réponse HTTP: 200
   ✅ [Groq] Réponse reçue avec succès
   ```

---

## 🛠️ Dépannage

### Erreur : "Configuration API manquante"

**Cause :** Variable d'environnement mal configurée

**Solution :**
1. Vérifie dans Netlify → Site configuration → Environment variables
2. Assure-toi que `GROQ_API_KEY` existe
3. Vérifie qu'il n'y a pas d'espaces dans la valeur
4. Redéploie le site

### Erreur : "404 Not Found" sur le proxy

**Cause :** Netlify Functions mal configuré

**Solution :**
1. Vérifie que `netlify.toml` existe à la racine
2. Vérifie que `netlify/functions/groq-proxy.js` existe
3. Regarde dans l'onglet "Functions" sur Netlify
4. Vérifie les logs de la function

### Erreur : "401 Unauthorized"

**Cause :** Clé API invalide

**Solution :**
1. Vérifie ta clé Groq sur https://console.groq.com/keys
2. Régénère une nouvelle clé si besoin
3. Mets à jour la variable d'environnement Netlify
4. Redéploie

---

## 📊 Architecture Finale

```
┌─────────────────────────────────────────────────────────────┐
│                    NAVIGATEUR (Public)                       │
│                                                              │
│  ┌────────────────┐                                         │
│  │  chatbot.js    │                                         │
│  └───────┬────────┘                                         │
│          │                                                  │
│          ▼                                                  │
│  ┌────────────────┐      ┌─────────────────────┐           │
│  │  GeminiEnhanced│ ───→ │  GROQ_MODE = 'proxy'│           │
│  └───────┬────────┘      └─────────────────────┘           │
│          │                                                  │
│          ▼                                                  │
│  Appel API → /.netlify/functions/groq-proxy                │
└──────────┼──────────────────────────────────────────────────┘
           │
           │ HTTPS (Requête sécurisée)
           ▼
┌─────────────────────────────────────────────────────────────┐
│              NETLIFY FUNCTIONS (Côté Serveur)                │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  groq-proxy.js                                        │  │
│  │  - Récupère GROQ_API_KEY des variables d'env         │  │
│  │  - Appelle API Groq avec la clé cachée               │  │
│  │  - Retourne la réponse au navigateur                 │  │
│  └──────────────────────────────────────────────────────┘  │
│                          │                                  │
│                          │                                  │
│                          ▼                                  │
│              process.env.GROQ_API_KEY                       │
│              (Variable d'environnement Netlify)             │
└──────────────────────────┼──────────────────────────────────┘
                           │
                           │ HTTPS (Clé API sécurisée)
                           ▼
                 ┌─────────────────────┐
                 │   API Groq          │
                 │   (Llama 3 70B)     │
                 └─────────────────────┘
```

---

## 🔒 Bonnes Pratiques de Sécurité

### 1. Jamais de clés dans le code frontend
```javascript
// ❌ MAUVAIS
const API_KEY = 'sk_...';

// ✅ BON
const response = await fetch('/.netlify/functions/groq-proxy');
```

### 2. Utiliser `.gitignore`
```gitignore
# Fichiers avec clés API
config-api.js
.env
.env.local
.env.production
```

### 3. Fichier d'exemple pour l'équipe
```
config-api.js.example  ✅ Commit dans Git
config-api.js          ❌ Dans .gitignore
```

### 4. Régénérer les clés compromises
Si ta clé a été exposée :
1. Va sur https://console.groq.com/keys
2. Révoque l'ancienne clé
3. Crée une nouvelle clé
4. Mets à jour Netlify

---

## 📈 Monitoring et Logs

### Voir les logs sur Netlify

1. **Onglet "Functions"**
   - Clique sur `groq-proxy`
   - Voir toutes les exécutions

2. **Logs en temps réel**
   - Clique sur "View logs"
   - Voir les erreurs et succès

3. **Métriques**
   - Nombre d'exécutions
   - Temps de réponse moyen
   - Taux d'erreur

---

## 💰 Coûts Netlify

### Gratuit (Starter)
- ✅ 100 000 invocations functions/mois
- ✅ 100 Go de bande passante
- ✅ Suffisant pour démarrer

### Payant (si croissance)
- Pro : $19/mois → 1M invocations
- Business : $99/mois → Illimité

**Note :** Groq API est gratuite (100k requêtes/jour), donc tu ne paieras que Netlify si tu dépasses 100k invocations/mois.

---

## 🎯 Checklist de Déploiement

- [ ] Fichiers Netlify créés (`netlify.toml`, `groq-proxy.js`)
- [ ] `chatbot-gemini-enhanced.js` modifié (GROQ_MODE = 'proxy')
- [ ] Code pushé sur GitHub/GitLab
- [ ] Site connecté sur Netlify
- [ ] Variable `GROQ_API_KEY` ajoutée dans Netlify
- [ ] Site redéployé
- [ ] Function `groq-proxy` visible dans l'onglet Functions
- [ ] Chatbot testé et fonctionnel
- [ ] Logs vérifiés (pas d'erreurs)
- [ ] `config-api.js` vidé pour production

---

## 📞 Support

- 📧 Email : vfranck364@gmail.com
- 📱 WhatsApp : +237 6 83 12 16 54
- 📚 Docs Netlify : https://docs.netlify.com/functions/overview/
- 📚 Docs Groq : https://console.groq.com/docs

---

**Dernière mise à jour :** 4 Mars 2026  
**Version :** 3.0.0 (avec Netlify Functions Proxy)
