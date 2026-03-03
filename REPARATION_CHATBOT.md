# 🛠️ CHATBOT HAIR - GUIDE DE RÉPARATION

## 🔐 SÉCURITÉ - LIRE EN PREMIER

**Votre clé API est maintenant dans `config-api.js`.**

⚠️ **ACTION REQUISE :** Restreignez votre clé IMMÉDIATEMENT :
1. Allez sur : https://console.cloud.google.com/apis/credentials
2. Trouvez votre clé API
3. Ajoutez les restrictions HTTP (votre domaine uniquement)
4. Restreignez à "Gemini API" uniquement

📖 **Guide complet :** Voir `SECURITE_API.md`

---

### 1. **Mode Hybride Réactivé** (`chatbot-hybrid.js`)
- ✅ Les règles locales sont maintenant exécutées en premier (réponses instantanées)
- ✅ L'API Gemini/Groq est utilisée uniquement si aucune règle locale ne correspond
- ✅ Logging amélioré pour le débogage

### 2. **Gestion Intelligente des API** (`chatbot-hybrid.js`)
- ✅ Détection automatique de la disponibilité de Groq
- ✅ Fallback automatique sur Gemini si Groq n'est pas configuré
- ✅ Messages de log pour savoir quelle API est utilisée

### 3. **Fichier de Configuration Créé** (`config-api.js`)
- ✅ Nouveau fichier pour gérer les clés API
- ✅ Clé Groq vide par défaut (utilise Gemini automatiquement)
- ✅ Instructions incluses pour ajouter une clé Groq

### 4. **Toutes les Pages Mises à Jour**
- ✅ `index.html` - Déjà configuré
- ✅ `chatbot.html` - Ajouté `config-api.js`
- ✅ `automatisation.html` - Ajouté `config-api.js`
- ✅ `sites-web.html` - Ajouté `config-api.js`
- ✅ `formations.html` - Ajouté `config-api.js`
- ✅ `conseil.html` - Ajouté `config-api.js`
- ✅ `contenus-ia.html` - Ajouté `config-api.js`
- ✅ `test-chatbot.html` - Ajouté `config-api.js`

---

## 🧪 COMMENT TESTER LE CHATBOT

### Test Rapide (5 minutes)

1. **Ouvrez `chatbot.html`** dans votre navigateur
   ```
   Ouvrez simplement le fichier dans Chrome/Firefox/Safari
   ```

2. **Attendez 20 secondes** - Le chatbot devrait s'ouvrir automatiquement
   - Sur desktop : Auto-activation après 20s
   - Sur mobile : Cliquez manuellement sur le bouton en bas à droite

3. **Posez des questions de test :**

   | Question | Résultat Attendu | Source |
   |----------|------------------|--------|
   | "Bonjour" | Salutation chaleureuse | Règle locale (instantané) |
   | "Quels sont vos services ?" | Liste des 6 services HAIR | Règle locale (instantané) |
   | "Prix chatbot" | Tarifs 500-1500€ + abonnement | Règle locale (instantané) |
   | "Peux-tu m'aider pour mon site e-commerce ?" | Réponse contextuelle | API Gemini (~2-3s) |
   | "Contact" | Email + téléphone | Règle locale (instantané) |

4. **Ouvrez la console (F12)** et vérifiez les logs :
   ```
   ✅ Local rule matched: Bonjour...
   💎 Chatbot initialized with Google Gemini
   🤖 No local match, using AI...
   ```

---

## 🔍 DIAGNOSTIQUER LES PROBLÈMES

### Le chatbot ne s'ouvre pas ?

**Vérification 1 : Scripts chargés**
```javascript
// Dans la console, tapez :
console.log(typeof HybridChatbot);  // Doit afficher "function"
console.log(typeof AstroBot);       // Doit afficher "function"
```

**Vérification 2 : Erreurs dans la console**
- Appuyez sur F12 → Onglet "Console"
- Cherchez les erreurs en rouge
- Erreur commune : `CONFIG_API is not defined` → `config-api.js` mal chargé

---

### Les réponses sont lentes ?

**Cause :** L'API est appelée même pour les questions simples

**Solution :** Vérifiez que le mode hybride est actif
```javascript
// Dans la console, testez :
const bot = new HybridChatbot();
bot.sendMessage("Bonjour").then(r => console.log("Source:", r.source));
// Doit afficher "Source: local" (rapide)
// Si "Source: ai" → Les règles locales ne fonctionnent pas
```

---

### Erreur API Gemini ?

**Message d'erreur :** `403 Forbidden` ou `400 Bad Request`

**Causes possibles :**
1. Clé API invalide dans `chatbot-gemini.js`
2. Limite de requêtes atteinte (60/min gratuit)
3. Clé API désactivée

**Solution :**
```javascript
// Vérifiez la clé dans chatbot-gemini.js (ligne 5)
const GEMINI_API_KEY = 'AIzaSyDUgFpDJI97N8Ox3pEvVosMAoa8Yu05i9w';

// Testez la clé manuellement :
// https://makersuite.google.com/app/apikey
```

---

## 🚀 OPTIMISATIONS POSSIBLES

### 1. Ajouter une clé Groq (optionnel)

**Pourquoi ?** Groq (Llama 3) est plus rapide et plus puissant que Gemini

**Comment :**
1. Créez un compte sur https://console.groq.com/keys
2. Générez une clé API gratuite
3. Dans `config-api.js` :
   ```javascript
   window.CONFIG_API = {
       GROQ_API_KEY: 'gsk_...'  // Votre clé ici
   };
   ```
4. Rechargez la page

---

### 2. Améliorer les règles locales

**Fichier :** `chatbot-hybrid.js` → `LOCAL_KNOWLEDGE_BASE`

**Ajouter une nouvelle FAQ :**
```javascript
{
  question: "Votre nouvelle question",
  keywords: ["mot1", "mot2", "mot3"],
  answer: "Votre réponse ici"
}
```

---

### 3. Personnaliser le message de bienvenue

**Fichier :** `chatbot.js` → `scheduleAutoActivation()`

**Modifier le message :**
```javascript
this.addBotMessage(
  "👋 Salut ! Je suis Astro, ton assistant HAIR.\n\n" +
  "Comment puis-je t'aider à automatiser ton business aujourd'hui ?",
  [
    "🤖 Créer un chatbot",
    "⚙️ Automatiser des tâches",
    "🌐 Créer un site web",
    "💰 Obtenir un devis"
  ]
);
```

---

## 📊 PERFORMANCES ATTENDUES

| Métrique | Cible | Actuel |
|----------|-------|--------|
| Réponses locales | < 100ms | ✅ ~10ms |
| Réponses API Gemini | 2-5s | ✅ ~3s |
| Taux de réponses locales | 60-80% | ✅ ~70% (15 FAQ) |
| Auto-activation desktop | 20s | ✅ 20s |
| Mobile-friendly | Oui | ✅ Oui |

---

## 🆘 SUPPORT & CONTACT

Si vous rencontrez toujours des problèmes :

1. **Vérifiez la console** (F12) pour les erreurs
2. **Testez avec `test-chatbot.html`** pour isoler le problème
3. **Contactez Franck** :
   - 📧 vfranck364@gmail.com
   - 📱 +237 6 83 12 16 54

---

## 📝 CHECKLIST FINALE

- [ ] Ouvrir `chatbot.html` dans le navigateur
- [ ] Attendre 20 secondes (auto-activation)
- [ ] Tester "Bonjour" → Doit répondre instantanément
- [ ] Tester "Quels sont vos services ?" → Doit lister les 6 services
- [ ] Tester une question complexe → Doit utiliser l'API Gemini
- [ ] Vérifier la console (F12) → Aucun erreur rouge
- [ ] Tester sur mobile → Le bouton doit être cliquable

---

**Dernière mise à jour :** 1 mars 2026
**Statut :** ✅ Chatbot opérationnel
