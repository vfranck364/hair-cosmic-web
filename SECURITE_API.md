# 🔐 SÉCURISATION DE LA CLÉ API GEMINI

## ⚠️ AVERTISSEMENT IMPORTANT

Votre clé API est maintenant stockée dans `config-api.js`. **Ce fichier est exclu de Git** (dans .gitignore), mais il reste **visible dans le navigateur** pour quiconque visite votre site.

---

## 🛡️ SOLUTION 1 : Restreindre la clé (OBLIGATOIRE - 5 minutes)

### **C'est la protection MINIMUM requise !**

1. **Allez sur Google Cloud Console :**
   ```
   https://console.cloud.google.com/apis/credentials
   ```

2. **Connectez-vous** avec votre compte Google

3. **Trouvez votre clé API** dans la liste (elle s'appelle probablement "API Key 1" ou similaire)

4. **Cliquez dessus** pour modifier

5. **Dans "Restrictions d'application" :**
   ```
   ✓ Cochez "HTTP referrers (sites web)"
   
   Ajoutez ces URLs :
   - http://localhost:*
   - http://localhost:*/hair-cosmic-web/*
   - https://votre-domaine.com/* (remplacez par votre vrai domaine)
   - https://www.votre-domaine.com/*
   ```

6. **Dans "Restrictions d'API" :**
   ```
   ✓ Cochez "Restreindre la clé"
   ✓ Décochez tout sauf :
     - Gemini API
     - Generative Language API
   ```

7. **Cliquez sur "ENREGISTRER"**

### **Résultat :**
Même si quelqu'un copie votre clé, **elle ne fonctionnera QUE depuis vos domaines autorisés**.

---

## 🏗️ SOLUTION 2 : Backend Proxy (Recommandé pour la production)

### **Pourquoi ?**
La clé n'est **JAMAIS exposée** au navigateur. Elle reste sur un serveur sécurisé.

### **Architecture :**
```
┌─────────────┐      ┌──────────────┐      ┌──────────────┐
│  Frontend   │ ──→  │  Ton Serveur │ ──→  │  Gemini API  │
│  (public)   │      │  (clé cachée)│      │  (Google)    │
└─────────────┘      └──────────────┘      └──────────────┘
```

### **Option A : Cloudflare Workers (Gratuit & Simple)**

Je peux créer un fichier `worker.js` à déployer sur Cloudflare :

```javascript
// worker.js - À déployer sur Cloudflare Workers
const GEMINI_API_KEY = 'AIzaSyA-wadl5mW611OLnaA6y8jQ0oGCGg2lePI';

export default {
  async fetch(request) {
    // Vérifier l'origine (CORS)
    const origin = request.headers.get('Origin');
    const allowedOrigins = ['http://localhost', 'https://votre-domaine.com'];
    
    if (!allowedOrigins.includes(origin)) {
      return new Response('Unauthorized', { status: 403 });
    }

    // Forward la requête à Gemini
    const response = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=' + GEMINI_API_KEY,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: await request.text()
      }
    );

    return new Response(response.body, {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': origin
      }
    });
  }
};
```

**Déploiement :**
1. Créez un compte sur https://workers.cloudflare.com/
2. Créez un nouveau Worker
3. Copiez le code
4. Déployez (gratuit, 100k requêtes/mois)

---

### **Option B : Vercel Serverless Functions (Gratuit)**

Je peux créer `api/gemini.js` :

```javascript
// api/gemini.js - À déployer sur Vercel
export default async function handler(req, res) {
  // Vérification CORS
  res.setHeader('Access-Control-Allow-Origin', 'https://votre-domaine.com');
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    }
  );

  const data = await response.json();
  res.status(200).json(data);
}
```

**Déploiement :**
1. Créez un compte sur https://vercel.com/
2. Installez Vercel CLI : `npm i -g vercel`
3. Déployez : `vercel --prod`

---

### **Option C : Node.js + Express (Hébergement gratuit)**

Je peux créer un mini serveur à héberger sur **Render** ou **Railway** (gratuit) :

```javascript
// server.js
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: ['http://localhost:5500', 'https://votre-domaine.com']
}));
app.use(express.json());

app.post('/api/gemini', async (req, res) => {
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req.body)
      }
    );
    
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
```

---

## 📋 CHECKLIST DE SÉCURITÉ

### **Immédiat (5 minutes) :**
- [ ] Restreindre la clé dans Google Cloud Console
- [ ] Ajouter les HTTP referrers autorisés
- [ ] Restreindre aux API Gemini uniquement
- [ ] Tester que le chatbot fonctionne toujours

### **Court terme (1 semaine) :**
- [ ] Choisir une solution backend (Cloudflare/Vercel/Node)
- [ ] Déployer le proxy API
- [ ] Mettre à jour `chatbot-gemini.js` pour utiliser le proxy
- [ ] Tester en production

### **Long terme :**
- [ ] Surveiller l'usage de la clé (Google Cloud Console → Metrics)
- [ ] Rotation de la clé tous les 3-6 mois
- [ ] Mettre en place des alertes d'usage anormal

---

## 🔍 SURVEILLER L'USAGE DE LA CLÉ

1. **Allez sur :**
   ```
   https://console.cloud.google.com/apis/api/generativelanguage.googleapis.com/metrics
   ```

2. **Vérifiez :**
   - Nombre de requêtes/jour
   - Provenance des requêtes
   - Erreurs 403 (tentatives non autorisées)

3. **Configurez des alertes :**
   - Cliquez sur "Créer une alerte"
   - Définissez un seuil (ex: > 1000 requêtes/jour)
   - Recevez un email en cas de pic

---

## 🆘 EN CAS DE FUITTE DE CLÉ

Si vous pensez que votre clé a été compromise :

1. **Supprimez-la immédiatement :**
   ```
   https://console.cloud.google.com/apis/credentials
   → Cliquez sur la clé → "Supprimer"
   ```

2. **Créez une nouvelle clé :**
   ```
   → "Créer des identifiants" → "Clé API"
   ```

3. **Appliquez les restrictions IMMÉDIATEMENT** (voir ci-dessus)

4. **Mettez à jour `config-api.js`** avec la nouvelle clé

5. **Redéployez le site**

---

## 📊 COMPARAISON DES SOLUTIONS

| Solution | Sécurité | Complexité | Coût | Recommandation |
|----------|----------|------------|------|----------------|
| **Restrictions HTTP** | ⭐⭐⭐ Bonne | ⭐ Facile | Gratuit | ✅ Minimum requis |
| **Cloudflare Workers** | ⭐⭐⭐⭐⭐ Excellente | ⭐⭐ Moyenne | Gratuit (100k/mois) | ✅ Meilleur rapport |
| **Vercel Functions** | ⭐⭐⭐⭐⭐ Excellente | ⭐⭐ Moyenne | Gratuit (généreux) | ✅ Alternative |
| **Node.js Server** | ⭐⭐⭐⭐⭐ Excellente | ⭐⭐⭐ Complexe | Gratuit (Render) | ✅ Contrôle total |
| **Aucune protection** | ❌ Nulle | - | - | 🚫 À éviter |

---

## 🎯 MA RECOMMANDATION

**Pour votre cas (site vitrine avec chatbot) :**

1. **Immédiat :** Restreignez la clé dans Google Cloud Console (5 min)
2. **Production :** Déployz sur Cloudflare Workers (30 min)

Cela vous donne :
- ✅ Sécurité maximale
- ✅ Gratuit
- ✅ Rapide (Cloudflare est plus rapide que Gemini direct)
- ✅ Pas de serveur à gérer

---

**Voulez-vous que je crée le code pour Cloudflare Workers maintenant ?**
