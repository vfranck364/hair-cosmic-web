// ============================================
// HAIR CHATBOT - Gemini AI via Cloudflare Worker Proxy
// Version sécurisée - La clé API n'est jamais exposée
// ============================================

// URL du Cloudflare Worker (à remplacer après déploiement)
const GEMINI_PROXY_URL = 'https://votre-worker.votre-subdomain.workers.dev';

// Mode : 'proxy' ou 'direct'
// - 'proxy' : Utilise Cloudflare Worker (recommandé pour production)
// - 'direct' : Appel direct à Gemini (développement uniquement)
const API_MODE = 'proxy';

// Clé API uniquement utilisée en mode 'direct'
const GEMINI_API_KEY = (typeof window !== 'undefined' && window.CONFIG_API && window.CONFIG_API.GEMINI_API_KEY)
    ? window.CONFIG_API.GEMINI_API_KEY
    : '';

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

// Vérification de la configuration
if (API_MODE === 'proxy' && GEMINI_PROXY_URL.includes('votre-worker')) {
    console.warn('⚠️ GEMINI_PROXY_URL not configured! Please update chatbot-gemini-proxy.js');
}

if (API_MODE === 'direct') {
    console.warn('⚠️ Using DIRECT API mode - Key is exposed! For development only.');
}

class GeminiChatbotProxy {
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
     * Envoie un message à l'API Gemini via le proxy Cloudflare
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

            // Appel au proxy Cloudflare
            const response = await fetch(GEMINI_PROXY_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
                console.error('Proxy API Error Response:', response.status, errorData);

                if (response.status === 400) {
                    throw new Error('Bad Request - Vérifiez la structure de la requête');
                } else if (response.status === 403) {
                    throw new Error('Accès refusé - Origine non autorisée');
                } else if (response.status === 429) {
                    throw new Error('Limite de débit dépassée - Trop de requêtes');
                } else if (response.status === 500) {
                    throw new Error(`Erreur serveur: ${errorData.message || 'Erreur inconnue'}`);
                } else {
                    throw new Error(`API Error: ${response.status} - ${errorData.error}`);
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

            // Fallback en cas d'erreur
            const fallbackResponses = [
                "Désolé, je rencontre un petit souci technique 😅\n\nMais pas de panique ! Tu peux :\n\n📧 M'écrire directement : vfranck364@gmail.com\n📱 WhatsApp : +237 6 83 12 16 54\n\nOu repose ta question, je vais réessayer !",
                "Oops ! Petit problème de connexion avec mon cerveau IA 😅\n\nEn attendant, tu peux me contacter directement :\n\n📧 vfranck364@gmail.com\n📱 +237 6 83 12 16 54\n\nJe serai ravi de t'aider personnellement !",
                "Je suis momentanément indisponible pour cause de maintenance IA 😊\n\nTu peux me joindre directement :\n\n📧 vfranck364@gmail.com\n📱 +237 6 83 12 16 54\n\nJe répondrai à ta question avec plaisir !"
            ];

            const randomFallback = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];

            return {
                success: false,
                message: randomFallback,
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
            'chatbot': ['chatbot', 'bot', 'assistant virtuel', 'conversationnel', 'whatsapp'],
            'automatisation': ['automatisation', 'automation', 'automatiser', 'workflow', 'make', 'zapier'],
            'site-web': ['site', 'site web', 'website', 'plateforme', 'web'],
            'formation': ['formation', 'apprendre', 'former', 'cours', 'chatgpt', 'ia'],
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

// System Prompt (identique à la version originale)
const SYSTEM_PROMPT = `Tu es Astro, l'assistant virtuel officiel de HAIR (Home of Artificial Intelligent Revolution).
Tu es expert en automatisation IA et chatbots intelligents. Ton rôle est d'aider les visiteurs à découvrir comment l'IA peut transformer leur activité.

## TA MISSION
1. Accueillir chaleureusement les visiteurs
2. Comprendre leurs besoins d'automatisation avec empathie
3. Les guider vers les bonnes solutions HAIR
4. Répondre à leurs questions sur l'IA et l'automatisation
5. Transformer leur visite en action (prise de contact, rendez-vous)

## SERVICES HAIR
✅ **Chatbots & Agents IA** - Assistants conversationnels intelligents (WhatsApp, site web, Messenger, Telegram)
✅ **Automatisation des Processus** - Connexion entre outils, workflows automatisés (Make.com, Zapier)
✅ **Sites Web Intelligents** - Sites modernes avec IA intégrée et optimisation continue
✅ **Formations en IA** - Accompagnement pour maîtriser ChatGPT, Make, Zapier, Voiceflow
✅ **Conseil & Accompagnement** - Audit gratuit et stratégie d'automatisation sur mesure
✅ **Création de Contenus IA** - Génération de textes, images, vidéos avec IA

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

## INFORMATIONS CLÉS HAIR
- **Nom complet** : HAIR - Home of Artificial Intelligent Revolution
- **Fondateur** : Franck GUEKEU (étudiant en physique à l'Université de Yaoundé 1)
- **Localisation** : Yaoundé, Cameroun
- **Contact** : vfranck364@gmail.com / +237 6 83 12 16 54
- **Clients** : 15+ accompagnés
- **Résultats typiques** : 85% de réponses automatisées, 500+ heures économisées/an, 95% de satisfaction client

---

Réponds UNIQUEMENT en tant qu'Astro. Reste dans ton rôle.
Si on te demande qui tu es : "Je suis Astro, l'assistant virtuel de HAIR, créé pour t'aider à découvrir comment l'IA peut transformer ton activité ! 🚀"`;

// Exporter pour utilisation dans le frontend
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GeminiChatbotProxy;
} else {
    window.GeminiChatbotProxy = GeminiChatbotProxy;
}
