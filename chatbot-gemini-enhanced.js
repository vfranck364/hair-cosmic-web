// ============================================
// HAIR CHATBOT - Groq API (Open Source Llama 3) via Gemini Adapter
// API Groq Integration avec injection de contenu du site
// ============================================

// Clé API Groq pour HAIR Chatbot (Récupérée dynamiquement de config-api.js)
const GROQ_API_KEY = (typeof window !== 'undefined' && window.CONFIG_API)
    ? window.CONFIG_API.GROQ_API_KEY
    : '';
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

// System Prompt pour le Chatbot HAIR selon votre document
const SYSTEM_PROMPT_ENHANCED = `Tu es Astro, l'assistant virtuel officiel de HAIR (Home of Artificial Intelligent Revolution).
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

## TARIFS (fourchettes indicatives)
- **Chatbot simple** : 500-1 500€ + abonnement 50-150€/mois
- **Automatisation workflows** : 1 000-3 000€ selon complexité
- **Site web intelligent** : 2 000-5 000€
- **Formation** : 100-300€/personne ou forfait groupe
- **Audit gratuit** : Toujours proposé en premier pour estimer précisément

## CONTENU DU SITE WEB
`;

class GeminiChatbotEnhanced {
    constructor() {
        this.conversationHistory = [];
        this.userProfile = {
            name: null,
            email: null,
            service_interest: null,
            budget: null
        };
        this.siteAnalyzer = new SiteContentAnalyzer();
    }

    /**
     * Construit le prompt système complet avec le contenu du site
     */
    async buildCompleteSystemPrompt() {
        // Récupérer les contenus pertinents du site
        let siteContent = {};
        try {
            siteContent = this.siteAnalyzer.getRelevantContent('');
        } catch (e) {
            console.warn('SiteContentAnalyzer non disponible:', e);
        }

        // Construire le contenu du site à injecter
        const siteContentString = `
INFORMATIONS SUPPLÉMENTAIRES SUR LE SITE:
- Présentation: HAIR (Home of Artificial Intelligent Revolution) est spécialisé dans l'automatisation intelligente et les solutions IA
- Fondateur: Franck GUEKEU, étudiant en physique passionné par les sciences et les technologies avancées
- Mission: Aider les entreprises à gagner en efficacité en automatisant les tâches répétitives et en intégrant l'IA dans leurs processus
- Localisation: Basé à Yaoundé, Cameroun
- Services principaux: Chatbots, Automatisation, Sites Web Intelligents, Formations, Conseil, Création de Contenus IA
- Valeurs: Excellence, transparence, innovation, résultats mesurables
- Clients: 15+ accompagnés dans divers secteurs (e-commerce, centres de formation, salons, cabinets médicaux, etc.)
- Résultats: 85% de réponses automatisées, 500+ heures économisées/an, 95% de satisfaction client

PAGES DU SITE:
- Accueil (/index.html): Présentation des services, témoignages clients, statistiques
- Chatbots (/chatbot.html): Détails sur les agents IA, avantages, exemples d'utilisation
- Automatisation (/automatisation.html): Détails sur les workflows automatisés, exemples concrets
- Sites Web (/sites-web.html): Détails sur les sites intelligents avec IA intégrée
- Formations (/formations.html): Programmes de formation pour maîtriser les outils IA
- Conseil (/conseil.html): Services d'audit et de stratégie d'automatisation
- Contenus IA (/contenus-ia.html): Services de création de contenus avec IA

CONTACT:
- Email: vfranck364@gmail.com
- Téléphone: +237 6 83 12 16 54
- Réseaux: WhatsApp, Facebook (liens dans les informations ci-dessus)
        `;

        // Combiner le prompt de base avec le contenu du site
        return SYSTEM_PROMPT_ENHANCED + siteContentString + "\n\n---\n\nRéponds UNIQUEMENT en tant qu'Astro. Reste dans ton rôle.\nSi on te demande qui tu es : \"Je suis Astro, l'assistant virtuel de HAIR, créé pour t'aider à découvrir comment l'IA peut transformer ton activité ! 🚀\"";
    }

    /**
     * Envoie un message à l'API Groq (Open Source Llama 3) et retourne la réponse
     */
    async sendMessage(userMessage) {
        try {
            // Construire le prompt système complet
            const completeSystemPrompt = await this.buildCompleteSystemPrompt();

            // Ajouter le message utilisateur à l'historique
            this.conversationHistory.push({
                role: 'user',
                parts: [{ text: userMessage }]
            });

            // Convertir l'historique au format OpenAI/Groq
            const messages = [
                { role: "system", content: completeSystemPrompt },
                ...this.conversationHistory.map(msg => ({
                    role: msg.role === 'model' ? 'assistant' : 'user',
                    content: msg.parts[0].text
                }))
            ];

            // Appel API Groq
            const response = await fetch(GROQ_API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${GROQ_API_KEY}`
                },
                body: JSON.stringify({
                    model: "llama3-70b-8192", // Modèle Llama 3 70B (puissant et rapide)
                    messages: messages,
                    temperature: 0.7,
                    max_tokens: 500,
                    top_p: 1,
                    stream: false
                })
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Groq API Error Response:', response.status, errorText);
                throw new Error(`Groq API Error: ${response.status} - ${errorText}`);
            }

            const data = await response.json();

            // Vérifier la réponse
            if (!data.choices || data.choices.length === 0) {
                throw new Error('Aucune réponse reçue de l\'API Groq');
            }

            // Extraire la réponse
            const botResponse = data.choices[0].message.content;

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
            console.error('Groq API Error:', error);

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
            'conseil': ['conseil', 'audit', 'accompagnement', 'stratégie'],
            'contenus-ia': ['contenus', 'ia', 'textes', 'images', 'videos', 'création']
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
    module.exports = GeminiChatbotEnhanced;
} else {
    window.GeminiChatbotEnhanced = GeminiChatbotEnhanced;
}