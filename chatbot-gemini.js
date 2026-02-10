// ============================================
// HAIR CHATBOT - Gemini AI Backend
// API Google Gemini Integration
// ============================================

// Clé API Gemini pour HAIR Chatbot
// Clé API Gemini pour HAIR Chatbot
const GEMINI_API_KEY = 'AIzaSyDUgFpDJI97N8Ox3pEvVosMAoa8Yu05i9w';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

// System Prompt pour le Chatbot HAIR selon votre document
const SYSTEM_PROMPT = `Tu es Astro, l'assistant virtuel officiel de HAIR (Home of Artificial Intelligent Revolution). 
Tu es expert en automatisation IA et chatbots intelligents. Ton rôle est d'aider les visiteurs à découvrir comment l'IA peut transformer leur activité.

## TA MISSION
1. Accueillir chaleureusement les visiteurs
2. Comprendre leurs besoins d'automatisation avec empathie
3. Les guider vers les bonnes solutions HAIR
4. Répondre à leurs questions sur l'IA et l'automatisation
5. Transformer leur visite en action (prise de contact, rendez-vous)

## SERVICES HAIR
✅ **Chatbots & Agents IA** (500-1500€ + abo) : Assistants conversationnels intelligents (WhatsApp, site web, Messenger) qui répondent 24/7.
✅ **Automatisation des Processus** (1000-3000€) : Connexion entre outils (CRM, Email, etc.) via Make/Zapier pour supprimer les tâches répétitives.
✅ **Sites Web Intelligents** (2000-5000€) : Sites modernes avec IA intégrée pour personnaliser l'expérience visiteur.
✅ **Formations en IA** (100-300€/ pers) : Accompagnement pour maîtriser ChatGPT, Make, Zapier, Voiceflow.
✅ **Conseil & Accompagnement** (Audit Gratuit) : Stratégie de transformation digitale sur mesure.
✅ **Création de Contenus IA** (Sur devis) : Génération de textes, images, vidéos, branding sonore.

## TON STYLE
- **Chaleureux et professionnel** - Tutoiement naturel
- **Concis** - Réponses de 2-5 phrases max sauf si détails nécessaires
- **Structuré** - Utilise numéros/puces si > 2 éléments
- **Proactif** - Anticipe les besoins et propose toujours une prochaine étape
- **Humain** - Évite le jargon, utilise des emojis légers (🎯✅💡🚀)

## RÈGLES STRICTES
❌ JAMAIS inventer d'informations non présentes dans cette base
❌ JAMAIS traiter de paiements ou données sensibles
❌ JAMAIS faire de promesses fermes sans confirmation (délais exacts, prix fermes)
✅ TOUJOURS proposer de contacter Franck (fondateur HAIR) si incertitude
✅ TOUJOURS reformuler pour confirmer compréhension
✅ TOUJOURS finir par une question ouverte ou CTA

## GESTION DES DEMANDES

### Si question sur un service :
1. Qualifier le besoin (1-2 questions max)
2. Présenter le service avec avantages clés
3. Donner un exemple concret d'utilisation
4. Proposer prochaine étape (audit gratuit, rendez-vous)

### Si problème technique ou question complexe :
1. Exprimer empathie
2. Donner réponse si tu la connais
3. Proposer de mettre en relation avec Franck si besoin

### Si demande de contact/devis :
1. Confirmer le besoin
2. Collecter : prénom, email, service concerné, besoin spécifique
3. Proposer un créneau pour audit gratuit ou appel découverte

### Si incompréhension :
"Je ne suis pas certain de bien comprendre. Parles-tu de :
1. [Hypothèse A]
2. [Hypothèse B]
3. Autre chose ? (précise)"

## INFORMATIONS CLÉS HAIR
- **Nom complet** : HAIR - Home of Artificial Intelligent Revolution
- **Fondateur** : Franck GUEKEU (étudiant en physique à l'Université de Yaoundé 1)
- **Localisation** : Yaoundé, Cameroun
- **Contact** : vfranck364@gmail.com / +237 6 83 12 16 54
- **Réseaux sociaux** :
  - WhatsApp Groupe : https://chat.whatsapp.com/Dod2aN0DK5hAcCU2ZXah4y
  - WhatsApp Chaîne : https://whatsapp.com/channel/0029Vb7FYN4FHWq9ExyhWu1t
  - Facebook : https://www.facebook.com/profile.php?id=61585635032631
- **Clients** : 15+ accompagnés (salons, e-commerce, startups, centres de formation, cabinets médicaux)
- **Résultats typiques** :
  - 85% de réponses automatisées pour chatbots
  - 500+ heures économisées par an
  - 0 erreur de saisie avec automatisations
  - ROI en 2-3 mois généralement
  - 95% de satisfaction client

## PROCESSUS DE TRAVAIL
1. **Analyse** : Compréhension des besoins
2. **Conception** : Solution sur mesure
3. **Développement** : Création et tests
4. **Déploiement** : Mise en production
5. **Optimisation** : Suivi continu

---

Réponds UNIQUEMENT en tant qu'Astro. Reste dans ton rôle.
Si on te demande qui tu es : "Je suis Astro, l'assistant virtuel de HAIR, créé pour t'aider à découvrir comment l'IA peut transformer ton activité ! 🚀"`;

class GeminiChatbot {
    constructor() {
        this.conversationHistory = [];
        this.userProfile = {
            name: null,
            email: null,
            service_interest: null,
            budget: null
        };
    }

    /**
     * Envoie un message à l'API Gemini et retourne la réponse
     */
    async sendMessage(userMessage) {
        try {
            // Ajouter le message utilisateur à l'historique
            this.conversationHistory.push({
                role: 'user',
                parts: [{ text: userMessage }]
            });

            // Construire le corps de la requête
            const requestBody = {
                contents: [
                    // Système prompt en premier
                    {
                        role: 'user',
                        parts: [{ text: SYSTEM_PROMPT }]
                    },
                    {
                        role: 'model',
                        parts: [{ text: 'Compris ! Je suis Astro, assistant HAIR. Je vais aider les visiteurs avec chaleur et professionnalisme. 🚀' }]
                    },
                    // Puis l'historique de conversation
                    ...this.conversationHistory
                ],
                generationConfig: {
                    temperature: 0.9,
                    topK: 40,
                    topP: 0.95,
                    maxOutputTokens: 500,
                }
            };

            // Appel API avec gestion des erreurs améliorée
            const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                // Gestion spécifique des erreurs API
                const errorText = await response.text();
                console.error('Gemini API Error Response:', response.status, errorText);

                if (response.status === 400) {
                    throw new Error('Bad Request - Vérifiez la structure de la requête');
                } else if (response.status === 403) {
                    throw new Error('Accès refusé - Clé API invalide ou désactivée');
                } else if (response.status === 429) {
                    throw new Error('Limite de débit dépassée - Trop de requêtes');
                } else if (response.status === 500) {
                    throw new Error('Erreur serveur Gemini - Service temporairement indisponible');
                } else {
                    throw new Error(`API Error: ${response.status} - ${errorText}`);
                }
            }

            const data = await response.json();

            // Vérifier si la réponse contient des candidats
            if (!data.candidates || data.candidates.length === 0) {
                throw new Error('Aucun candidat de réponse reçu de l\'API Gemini');
            }

            // Extraire la réponse
            const botResponse = data.candidates[0].content.parts[0].text;

            // Ajouter la réponse à l'historique
            this.conversationHistory.push({
                role: 'model',
                parts: [{ text: botResponse }]
            });

            // Détecter et stocker informations utilisateur
            this.extractUserInfo(userMessage);

            return {
                success: true,
                message: botResponse,
                userProfile: this.userProfile
            };

        } catch (error) {
            console.error('Gemini API Error:', error);

            // Fallback en cas d'erreur - maintenant avec plus d'options
            const fallbackResponses = [
                "Désolé, je rencontre un petit souci technique 😅\n\nMais pas de panique ! Tu peux :\n\n📧 M'écrire directement : vfranck364@gmail.com\n📱 WhatsApp : +237 6 83 12 16 54\n\nOu repose ta question, je vais réessayer !",
                "Oops ! Petit problème de connexion avec mon cerveau IA 😅\n\nEn attendant, tu peux me contacter directement :\n\n📧 vfranck364@gmail.com\n📱 +237 6 83 12 16 54\n\nJe serai ravi de t'aider personnellement !",
                "Je suis momentanément indisponible pour cause de maintenance IA 😊\n\nTu peux me joindre directement :\n\n📧 vfranck364@gmail.com\n📱 +237 6 83 12 16 54\n\nJe répondrai à ta question avec plaisir !"
            ];

            // Sélectionner une réponse aléatoire pour plus de variété
            const randomFallback = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];

            // DEBUG: Ajouter l'erreur technique au message pour le débogage
            const debugMessage = `${randomFallback}\n\n🛑 ERREUR TECHNIQUE (A transmettre au support) :\n${error.message}`;

            return {
                success: false,
                message: debugMessage,
                error: error.message
            };
        }
    }

    /**
     * Extrait des informations utilisateur du message
     */
    extractUserInfo(message) {
        // Détection email
        const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/;
        const emailMatch = message.match(emailRegex);
        if (emailMatch) {
            this.userProfile.email = emailMatch[0];
        }

        // Détection prénom (simplifiée)
        if (message.toLowerCase().includes('je m\'appelle') || message.toLowerCase().includes('je suis')) {
            const nameMatch = message.match(/(?:je m'appelle|je suis)\s+([a-zA-Z]+)/i);
            if (nameMatch) {
                this.userProfile.name = nameMatch[1];
            }
        }

        // Détection services (keywords)
        const serviceKeywords = {
            'chatbot': ['chatbot', 'bot', 'assistant virtuel', 'conversationnel'],
            'automatisation': ['automatisation', 'automation', 'automatiser', 'workflow'],
            'site-web': ['site', 'site web', 'website', 'plateforme'],
            'formation': ['formation', 'apprendre', 'former', 'cours'],
            'conseil': ['conseil', 'audit', 'accompagnement', 'stratégie']
        };

        for (const [service, keywords] of Object.entries(serviceKeywords)) {
            if (keywords.some(keyword => message.toLowerCase().includes(keyword))) {
                this.userProfile.service_interest = service;
                break;
            }
        }
    }

    /**
     * Réinitialise la conversation
     */
    reset() {
        this.conversationHistory = [];
        this.userProfile = {
            name: null,
            email: null,
            service_interest: null,
            budget: null
        };
    }

    /**
     * Sauvegarde lead dans localStorage (temporaire)
     */
    saveLead() {
        if (this.userProfile.email) {
            const leads = JSON.parse(localStorage.getItem('hair_leads') || '[]');
            leads.push({
                ...this.userProfile,
                timestamp: new Date().toISOString(),
                conversation: this.conversationHistory
            });
            localStorage.setItem('hair_leads', JSON.stringify(leads));
            console.log('Lead saved:', this.userProfile);
        }
    }
}

// Exporter pour utilisation dans le frontend
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GeminiChatbot;
} else {
    window.GeminiChatbot = GeminiChatbot;
}
