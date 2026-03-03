# 🚀 GUIDE DE DÉPLOIEMENT - CHATBOT SÉCURISÉ

## 📋 Vue d'ensemble

Votre chatbot HAIR est maintenant prêt avec :
- ✅ Clé API centralisée dans `config-api.js`
- ✅ Mode hybride activé (règles locales + AI)
- ✅ Fichier `.gitignore` configuré (clé exclue de Git)
- ✅ Option proxy Cloudflare pour sécurité maximale

---

## 🎯 OPTION 1 : Déploiement Rapide (10 minutes)

### **Pour : Développement / Test / Production rapide**

### Étape 1 : Restreindre la clé API Google (OBLIGATOIRE)

```
1. Allez sur : https://console.cloud.google.com/apis/credentials
2. Connectez-vous avec votre compte Google
3. Trouvez votre clé API dans la liste
4. Cliquez dessus
5. Dans "Restrictions d'application" :
   ✓ Cochez "HTTP referrers (sites web)"
   ✓ Ajoutez : http://localhost:*, https://votre-domaine.com/*
6. Dans "Restrictions d'API" :
   ✓ Cochez "Restreindre la clé"
   ✓ Sélectionnez uniquement "Gemini API"
7. Cliquez sur "ENREGISTRER"
```

### Étape 2 : Tester en local

```bash
# Ouvrez simplement chatbot.html dans votre navigateur
# Ou utilisez un serveur local :
python3 -m http.server 5500
# Puis allez sur : http://localhost:5500/hair-cosmic-web/chatbot.html
```

### Étape 3 : Vérifier le fonctionnement

```
1. Attendez 20 secondes (auto-activation)
2. Ou cliquez sur le bouton chat en bas à droite
3. Testez : "Bonjour" → Réponse instantanée
4. Testez : "Quels sont vos services ?" → Liste complète
5. Ouvrez la console (F12) → Vérifiez : "✅ Gemini API configured"
```

---

## 🛡️ OPTION 2 : Déploiement Sécurisé (30 minutes)

### **Pour : Production avec sécurité maximale**

### Étape 1 : Déployer le Cloudflare Worker

```
1. Créez un compte sur : https://workers.cloudflare.com/ (gratuit)

2. Allez dans "Workers & Pages" → "Create Worker"

3. Donnez un nom : hair-chatbot-proxy

4. Cliquez sur "Deploy"

5. Cliquez sur "Edit code"

6. Copiez le contenu de : cloudflare-worker.js

7. Allez dans "Settings" → "Variables"

8. Ajoutez les variables d'environnement :
   - GEMINI_API_KEY = AIzaSyA-wadl5mW611OLnaA6y8jQ0oGCGg2lePI
   - ALLOWED_ORIGINS = http://localhost:5500,https://votre-domaine.com

9. Cliquez sur "Save"

10. Notez l'URL de votre Worker :
    https://hair-chatbot-proxy.votre-subdomain.workers.dev
```

### Étape 2 : Mettre à jour le frontend

**Fichier : `chatbot.html` (et toutes les pages avec chatbot)**

Dans la section des scripts du chatbot, remplacez :
```html
<script src="chatbot-gemini.js"></script>
```

Par :
```html
<script src="chatbot-gemini-proxy.js"></script>
```

**Fichier : `chatbot-gemini-proxy.js` (ligne 5)**

Remplacez :
```javascript
const GEMINI_PROXY_URL = 'https://votre-worker.votre-subdomain.workers.dev';
```

Par l'URL de votre Worker :
```javascript
const GEMINI_PROXY_URL = 'https://hair-chatbot-proxy.franck-hair.workers.dev';
```

### Étape 3 : Tester le proxy

```
1. Ouvrez la console (F12)
2. Allez dans l'onglet "Network"
3. Posez une question au chatbot
4. Vérifiez que la requête va vers : workers.dev (pas googleapis.com)
5. Vérifiez que la réponse arrive correctement
```

---

## 🌐 OPTION 3 : Déployer le site complet

### **Sur GitHub Pages (Gratuit)**

```bash
# 1. Initialisez Git (si pas déjà fait)
cd hair-cosmic-web
git init
git add .
git commit -m "Initial commit"

# 2. Créez un repository sur GitHub
# 3. Push votre code
git remote add origin https://github.com/votre-username/hair-cosmic-web.git
git push -u origin main

# 4. Activez GitHub Pages
# Allez sur : Settings → Pages → Source : main branch → Save
```

**⚠️ Important :** `config-api.js` est dans `.gitignore`, donc il ne sera PAS pushé.

**Solution :**
- Créez un fichier `config-api.dist.js` (sans la clé) pour le repo
- Après déploiement, créez `config-api.js` manuellement sur le serveur
- OU utilisez Cloudflare Worker (la clé n'est pas dans le frontend)

---

### **Sur Vercel (Recommandé - Gratuit)**

```bash
# 1. Installez Vercel CLI
npm install -g vercel

# 2. Connectez-vous
vercel login

# 3. Déployez
cd hair-cosmic-web
vercel --prod

# 4. Suivez les instructions
# Votre site sera disponible sur : https://hair-cosmic-web.vercel.app
```

**Avantage Vercel :**
- ✅ Gratuit
- ✅ HTTPS automatique
- ✅ Déploiement continu depuis Git
- ✅ Variables d'environnement sécurisées

---

## 📊 CHECKLIST DE DÉPLOIEMENT

### **Avant déploiement :**
- [ ] Clé API restreinte dans Google Cloud Console
- [ ] `config-api.js` testé en local
- [ ] Chatbot fonctionne (tests effectués)
- [ ] `.gitignore` inclut `config-api.js`

### **Pendant le déploiement :**
- [ ] Fichiers HTML mis à jour avec `config-api.js`
- [ ] Cloudflare Worker déployé (si option sécurisée)
- [ ] URL du Worker configurée dans `chatbot-gemini-proxy.js`

### **Après déploiement :**
- [ ] Tester le chatbot en production
- [ ] Vérifier la console (pas d'erreurs)
- [ ] Vérifier que la clé n'est pas visible (si proxy utilisé)
- [ ] Ajouter le domaine aux restrictions Google Cloud

---

## 🔐 QUELLE OPTION CHOISIR ?

| Besoin | Option recommandée | Temps | Sécurité |
|--------|-------------------|-------|----------|
| **Test / Dev** | Option 1 (Direct) | 10 min | ⭐⭐⭐ Moyenne |
| **Production (vitrine)** | Option 1 + Restrictions | 10 min | ⭐⭐⭐⭐ Bonne |
| **Production (sécurité max)** | Option 2 (Proxy) | 30 min | ⭐⭐⭐⭐⭐ Excellente |
| **Entreprise / Clients** | Option 2 (Proxy) | 30 min | ⭐⭐⭐⭐⭐ Excellente |

---

## 🆘 PROBLÈMES COURANTS

### **Erreur : "API key not valid"**

**Cause :** Clé API incorrecte ou non restreinte correctement

**Solution :**
```
1. Vérifiez config-api.js : GEMINI_API_KEY est correcte
2. Vérifiez Google Cloud Console : Clé activée
3. Vérifiez les restrictions : Votre domaine est autorisé
```

### **Erreur : "403 Forbidden"**

**Cause :** Restrictions HTTP trop strictes

**Solution :**
```
1. Allez sur Google Cloud Console
2. Ajoutez votre domaine exact (avec https://)
3. Ajoutez http://localhost:* pour le dev
```

### **Le chatbot ne s'ouvre pas**

**Cause :** Scripts mal chargés

**Solution :**
```
1. Ouvrez la console (F12)
2. Cherchez les erreurs
3. Vérifiez que config-api.js est chargé AVANT chatbot-gemini.js
```

### **Erreurs CORS avec Cloudflare Worker**

**Cause :** Origins non configurés

**Solution :**
```
1. Dans Cloudflare Dashboard → Worker → Settings → Variables
2. Ajoutez : ALLOWED_ORIGINS = https://votre-domaine.com
3. Redéployez le Worker
```

---

## 📞 SUPPORT

Si vous rencontrez des problèmes :

1. **Vérifiez les logs :**
   - Console navigateur (F12)
   - Cloudflare Worker Logs (si utilisé)
   - Google Cloud Console → APIs → Metrics

2. **Testez l'API directement :**
   ```
   https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=VOTRE_CLE
   ```

3. **Contactez Franck :**
   - 📧 vfranck364@gmail.com
   - 📱 +237 6 83 12 16 54

---

## 📚 RESSOURCES

- **Documentation Gemini :** https://ai.google.dev/docs
- **Cloudflare Workers :** https://developers.cloudflare.com/workers/
- **Google Cloud Console :** https://console.cloud.google.com/
- **Vercel Deployment :** https://vercel.com/docs

---

**Dernière mise à jour :** 1 mars 2026
**Statut :** ✅ Prêt pour déploiement
