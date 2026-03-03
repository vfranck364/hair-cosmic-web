# 🚀 GUIDE DE CONFIGURATION SUPABASE - HAIR Chatbot

## ⚡ CONFIGURATION RAPIDE (30 minutes)

---

## ÉTAPE 1 : Exécuter le Schema SQL (10 min)

### 1.1 Connexion à Supabase

```
1. Allez sur : https://supabase.com
2. Connectez-vous
3. Sélectionnez votre projet : mpiphbawxqybrehzklkr
4. Cliquez sur "SQL Editor" dans le menu gauche
```

### 1.2 Exécution du Script

```
1. Cliquez sur "New Query"
2. Ouvrez le fichier : supabase-schema.sql
3. Copiez-collez TOUT le contenu dans l'éditeur
4. Cliquez sur "Run" (ou Ctrl+Entrée)
5. Attendez la confirmation "Success"
```

### 1.3 Vérification

```
1. Allez dans "Table Editor" (menu gauche)
2. Vous devriez voir 4 tables :
   ✅ users
   ✅ leads
   ✅ conversations
   ✅ notifications
```

---

## ÉTAPE 2 : Configurer Telegram (10 min)

### 2.1 Créer un Bot Telegram

```
1. Ouvrez Telegram
2. Recherchez : @BotFather
3. Envoyez : /newbot
4. Donnez un nom : "HAIR Chatbot Notifications"
5. Donnez un username : "hair_chatbot_bot"
6. BotFather vous donne un TOKEN

📝 Notez le token :
TELEGRAM_BOT_TOKEN = 1234567890:ABCdefGHIjklMNOpqrsTUVwxyz
```

### 2.2 Trouver votre Chat ID

```
1. Recherchez : @userinfobot
2. Envoyez : /start
3. Le bot vous répond avec votre Chat ID

📝 Notez le Chat ID :
TELEGRAM_CHAT_ID = 123456789
```

### 2.3 Démarrer le Bot

```
1. Recherchez votre bot : @hair_chatbot_bot
2. Envoyez : /start
3. Le bot est maintenant actif
```

---

## ÉTAPE 3 : Configurer Resend (Email) - Optionnel (5 min)

### 3.1 Créer un Compte Resend

```
1. Allez sur : https://resend.com
2. Cliquez "Sign Up"
3. Inscrivez-vous (gratuit)
4. Gratuit : 3000 emails/mois
```

### 3.2 Créer une API Key

```
1. Dashboard → "API Keys"
2. "Create API Key"
3. Nom : "HAIR Chatbot"
4. Copiez la clé

📝 Notez la clé :
RESEND_API_KEY = re_1234567890abcdef
```

### 3.3 Configurer le Domaine (Optionnel)

Pour production, ajoutez un domaine vérifié.
Pour test, utilisez : `onboarding@resend.dev`

---

## ÉTAPE 4 : Déployer la Edge Function (10 min)

### 4.1 Installer Supabase CLI

```bash
# Terminal / Invite de commandes
npm install -g supabase
```

### 4.2 Se Connecter

```bash
supabase login
```

Une fenêtre navigateur s'ouvre → Connectez-vous.

### 4.3 Lier le Projet

```bash
supabase link --project-ref mpiphbawxqybrehzklkr
```

### 4.4 Créer la Function

```bash
# Dans le dossier hair-cosmic-web
supabase functions new send-lead-notification
```

Un dossier `supabase/functions/send-lead-notification/` est créé.

### 4.5 Copier le Code

```
1. Ouvrez : supabase-edge-function.js
2. Copiez TOUT le contenu
3. Collez dans : supabase/functions/send-lead-notification/index.ts
4. Sauvegardez
```

### 4.6 Configurer les Variables

```bash
# Dans Supabase Dashboard → Settings → Edge Functions
# Ajoutez ces variables :

TELEGRAM_BOT_TOKEN=votre_token_ici
TELEGRAM_CHAT_ID=votre_chat_id_ici
RESEND_API_KEY=votre_clé_resend_ici
```

### 4.7 Déployer

```bash
supabase functions deploy send-lead-notification
```

✅ La function est déployée !

---

## ÉTAPE 5 : Tester (5 min)

### 5.1 Test dans Supabase Dashboard

```
1. Allez dans : SQL Editor
2. Exécutez ce test :

INSERT INTO leads (email, full_name, phone, company, service_wanted, budget, volume, urgency, score)
VALUES (
  'test@test.com',
  'Test Client',
  '+237 6 83 12 16 54',
  'Test Company',
  'Chatbot IA',
  '1000€',
  '50 clients/jour',
  'Immédiatement',
  90
);

3. Vérifiez :
   - ✅ Lead créé dans Table Editor → leads
   - ✅ Notification dans Table Editor → notifications
   - ✅ Email reçu (vfranck364@gmail.com)
   - ✅ Notification Telegram reçue
```

### 5.2 Test dans le Chatbot

```
1. Ouvrez : index.html
2. Parlez au chatbot
3. Donnez vos infos complètes
4. Validez le récapitulatif
5. Vérifiez email + Telegram
```

---

## 📊 VÉRIFICATION FINALE

### Checklist

- [ ] ✅ Tables créées (users, leads, conversations, notifications)
- [ ] ✅ Telegram Bot créé et token noté
- [ ] ✅ Chat ID Telegram trouvé
- [ ] ✅ Resend API Key créée (optionnel)
- [ ] ✅ Supabase CLI installé
- [ ] ✅ Edge Function déployée
- [ ] ✅ Variables d'environnement configurées
- [ ] ✅ Test SQL réussi
- [ ] ✅ Test chatbot réussi
- [ ] ✅ Email reçu
- [ ] ✅ Notification Telegram reçue

---

## 🔧 INTÉGRATION DANS LE CHATBOT

### Modifier chatbot.html

Ajoutez avant `</body>` :

```html
<!-- Supabase Client -->
<script type="module" src="supabase-client.js"></script>
```

### Modifier chatbot.js

Dans la fonction de validation du lead, ajoutez :

```javascript
// Après validation du récapitulatif
async function handleLeadValidation(leadData) {
    // 1. Sauvegarder dans Supabase
    const result = await window.HAIRSupabase.saveLead(leadData)
    
    if (result.success) {
        // 2. Message de confirmation
        addBotMessage(
            `🎉 Parfait ${leadData.full_name} !\n\n` +
            `Votre demande a été envoyée à Franck.\n\n` +
            `📧 Il vous contactera sous 24h sur : ${leadData.email}\n` +
            `📱 Ou au : ${leadData.phone}\n\n` +
            `✨ Un email et une notification Telegram ont été envoyés !`
        )
        
        // 3. Sauvegarder conversation
        await window.HAIRSupabase.saveConversation({
            lead_id: result.data[0].id,
            conversation: leadData.conversation
        })
    } else {
        // Gestion erreur
        addBotMessage(
            "Oups, un petit souci technique 😅\n\n" +
            "Mais pas de panique ! Vous pouvez :\n\n" +
            "📧 Contacter Franck : vfranck364@gmail.com\n" +
            "📱 WhatsApp : +237 6 83 12 16 54"
        )
    }
}
```

---

## 🎯 UTILISATION QUOTIDIENNE

### Dashboard Supabase

```
1. Allez sur : https://supabase.com
2. Projet : mpiphbawxqybrehzklkr
3. Table Editor → leads
4. Vous voyez tous les leads en temps réel
```

### Filtres Utiles

```
- status = 'nouveau' → Leads à contacter
- score >= 70 → Leads prioritaires
- created_at >= today → Leads du jour
```

### Export CSV

```
1. Table Editor → leads
2. Cliquez "..." (en haut à droite)
3. "Export to CSV"
4. Ouvrez dans Excel/Google Sheets
```

---

## 📱 NOTIFICATIONS REÇUES

### Email (Exemple)

```
Objet : 🔔 NOUVEAU LEAD HAIR - Marie Dupont - Chatbot WhatsApp

👤 INFORMATIONS CLIENT
Nom : Marie Dupont
Email : marie@gmail.com
Téléphone : +237 677 12 34 56
Entreprise : Salon Beauty

💼 DEMANDE
Service : Chatbot WhatsApp
Budget : 1000€
Volume : 20 RDV/jour
Urgence : Cette semaine

📊 SCORE : 85/100 ✅ Lead qualifié

👉 Action : Contacter sous 24h
```

### Telegram (Exemple)

```
🔔 NOUVEAU LEAD HAIR

👤 Nom : Marie Dupont
📧 Email : marie@gmail.com
📱 Téléphone : +237 677 12 34 56
🏢 Entreprise : Salon Beauty

💼 DEMANDE
🤖 Service : Chatbot WhatsApp
💰 Budget : 1000€
📊 Volume : 20 RDV/jour
⚡ Urgence : Cette semaine

📊 Score : 85/100
✅ Lead qualifié, à contacter rapidement

👉 Action : Contactez sous 24h !
```

---

## ⚠️ DÉPANNAGE

### Problème : "Function not found"

```
Solution :
1. Vérifiez : supabase functions list
2. Redéployez : supabase functions deploy send-lead-notification
```

### Problème : "Telegram notification failed"

```
Solution :
1. Vérifiez TELEGRAM_BOT_TOKEN dans Supabase Dashboard
2. Vérifiez TELEGRAM_CHAT_ID
3. Vérifiez que vous avez démarré le bot (/start)
```

### Problème : "Email not received"

```
Solution :
1. Vérifiez RESEND_API_KEY
2. Vérifiez spam folder
3. Testez avec : onboarding@resend.dev
```

### Problème : "RLS policy error"

```
Solution :
1. Vérifiez que RLS est activé dans Database → Policies
2. Vérifiez les policies créées dans le schema SQL
```

---

## 📞 SUPPORT

**Documentation Supabase :**
- https://supabase.com/docs

**Documentation Edge Functions :**
- https://supabase.com/docs/guides/functions

**Contact :**
- vfranck364@gmail.com

---

**Temps total estimé : 30 minutes** ⏱️

**Dernière mise à jour :** 1er mars 2026
