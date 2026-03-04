// ============================================
// HAIR CHATBOT - Hybrid Engine (Local Rules + Gemini AI)
// Combines fast local responses with intelligent AI
// ============================================

// Local knowledge base and rules
const LOCAL_KNOWLEDGE_BASE = {
  faq: [
    {
      question: "Quels sont vos délais de livraison ?",
      keywords: ["livraison", "délai", "expédition", "recevoir", "quand"],
      answer: "En tant qu'expert en automatisation IA, je peux vous dire que HAIR propose des solutions immédiates ! 🚀 Nos services d'automatisation et de chatbots sont opérationnels en quelques jours seulement. Pour un site web intelligent, comptez 1-2 semaines selon la complexité."
    },
    {
      question: "Pouvez-vous créer un chatbot ?",
      keywords: ["chatbot", "bot", "assistant", "conversationnel", "intelligent", "whatsapp", "messenger"],
      answer: "Absolument ! 🤖 Nous créons des chatbots intelligents sur mesure (WhatsApp, site web, Messenger) qui répondent à 85% des questions automatiquement. Parfait pour libérer votre temps et améliorer le service client !\n\n🎯 **Fonctionnalités principales :**\n- Réponses 24/7 à vos clients\n- Intégration avec vos outils (CRM, email, etc.)\n- Personnalisation selon votre ton de marque\n- Suivi des conversations et analytics"
    },
    {
      question: "Quels sont vos services ?",
      keywords: ["services", "offres", "prestations", "produits", "ce que vous faites", "solutions"],
      answer: "Chez HAIR, nous proposons 6 services principaux :\n\n🤖 **Chatbots & Agents IA** - Assistants conversationnels intelligents\n⚙️ **Automatisation des Processus** - Connexion entre outils, workflows automatisés\n🌐 **Sites Web Intelligents** - Sites modernes avec IA intégrée\n🎓 **Formations en IA** - Accompagnement pour maîtriser ChatGPT, Make, Zapier\n💡 **Conseil & Accompagnement** - Audit et stratégie d'automatisation\n🎨 **Création de Contenus IA** - Génération de textes, images, vidéos avec IA"
    },
    {
      question: "Quels sont vos tarifs ?",
      keywords: ["tarifs", "prix", "coût", "combien", "budget", "facturation", "abonnement"],
      answer: "Nos tarifs sont adaptés à chaque projet :\n\n🤖 **Chatbot simple** : 500-1 500€ + abonnement 50-150€/mois\n⚙️ **Automatisation workflows** : 1 000-3 000€ selon complexité\n🌐 **Site web intelligent** : 2 000-5 000€\n🎓 **Formation** : 100-300€/personne ou forfait groupe\n\n💡 Nous offrons TOUJOURS un audit gratuit en premier pour estimer précisément vos besoins !"
    },
    {
      question: "Êtes-vous disponibles le week-end ?",
      keywords: ["weekend", "disponible", "soir", "horaire", "ouvert", "24/7", "urgence"],
      answer: "Le service client humain est disponible pendant les heures ouvrables, mais votre chatbot HAIR est disponible 24h/24 et 7j/7 ! 🚀 Il répond instantanément à toutes les questions même le week-end ou la nuit. C'est justement l'avantage de l'automatisation : votre business ne dort jamais !"
    },
    {
      question: "Comment fonctionne l'automatisation ?",
      keywords: ["automatisation", "fonctionne", "processus", "méthode", "technique", "workflow", "no-code"],
      answer: "L'automatisation consiste à connecter vos outils entre eux pour que les tâches répétitives soient effectuées automatiquement. Par exemple :\n\n🎯 Un client remplit un formulaire → Son profil est créé dans votre CRM → Un email de bienvenue est envoyé → Une tâche est créée pour votre équipe\n\nCela vous fait gagner des centaines d'heures par mois ! 💡\n\nNous utilisons des outils no-code comme Make, Zapier, ou des solutions sur mesure selon vos besoins."
    },
    {
      question: "Pouvez-vous me contacter ?",
      keywords: ["contact", "email", "téléphone", "appeler", "parler à quelqu'un", "humain", "rendez-vous"],
      answer: "Bien sûr ! Notre fondateur Franck est joignable :\n\n📧 vfranck364@gmail.com\n📱 +237 6 83 12 16 54\n\nSouhaitez-vous que je vous mette en relation directement ou préférez-vous d'abord un audit gratuit de vos besoins ?"
    },
    {
      question: "Quels sont vos domaines d'expertise ?",
      keywords: ["expertise", "domaines", "compétences", "spécialités", "technologies", "ia", "intelligence artificielle"],
      answer: "Notre expertise se concentre sur plusieurs domaines clés :\n\n🧠 **Intelligence Artificielle** - Chatbots, agents conversationnels, automatisation intelligente\n⚙️ **Automatisation** - Connexion d'outils, workflows no-code, suppression des tâches répétitives\n🌐 **Web & Digital** - Sites intelligents, intégration d'IA, optimisation UX/UI\n🎓 **Formation** - Maîtrise des outils IA (ChatGPT, Make, Zapier, etc.)\n📊 **Analyse de données** - Suivi des performances, optimisation continue"
    },
    {
      question: "Quels sont vos résultats typiques ?",
      keywords: ["résultats", "performances", "efficacité", "améliorations", "chiffres", "statistiques", "roi"],
      answer: "Voici les résultats typiques obtenus par nos clients :\n\n🎯 **85%** de réponses automatisées pour chatbots\n⏱️ **500+ heures** économisées par an\n✅ **0 erreur** de saisie avec automatisations\n📈 **ROI** en 2-3 mois généralement\n👥 **15+ clients** accompagnés avec succès\n😊 **95%** de satisfaction client\n\nCes chiffres peuvent varier selon votre secteur d'activité et la complexité de votre projet."
    },
    {
      question: "Quels sont vos clients ?",
      keywords: ["clients", "secteurs", "entreprises", "exemples", "cas", "profils"],
      answer: "Nous avons accompagné plus de 15 clients dans divers secteurs :\n\n🏢 **Entreprises locales** - Petites structures cherchant à optimiser leurs processus\n💼 **Startups tech** - Sociétés innovantes avec besoin d'automatisation\n🎓 **Centres de formation** - Établissements cherchant à améliorer leur service client\n🛍️ **E-commerces** - Boutiques en ligne voulant augmenter leurs conversions\n✂️ **Salons de coiffure** - Professionnels cherchant à simplifier leur gestion\n🏥 **Cabinets médicaux** - Structures médicales voulant automatiser les prises de rendez-vous"
    },
    {
      question: "Quelle est votre localisation ?",
      keywords: ["localisation", "adresse", "pays", "ville", "cameroun", "yaoundé", "bureau"],
      answer: "HAIR est basé à **Yaoundé, Cameroun**. \n\nNotre fondateur Franck GUEKEU est étudiant en physique à l'Université de Yaoundé 1. Nous proposons nos services à distance pour des clients nationaux et internationaux.\n\n📧 vfranck364@gmail.com\n📱 +237 6 83 12 16 54"
    },
    {
      question: "Qu'est-ce que HAIR ?",
      keywords: ["hair", "signifie", "quoi", "sigle", "nom", "entreprise", "présentation"],
      answer: "HAIR signifie **Home of Artificial Intelligent Revolution**.\n\nC'est une entreprise spécialisée dans l'automatisation intelligente et les solutions IA. Fondée par Franck GUEKEU, étudiant en physique passionné par les sciences et les technologies avancées.\n\n🎯 Notre mission : Aider les entreprises à gagner en efficacité en automatisant les tâches répétitives et en intégrant l'IA dans leurs processus."
    },
    {
      question: "Quels sont vos processus de travail ?",
      keywords: ["processus", "méthode", "étapes", "déroulement", "travail", "collaboration", "projet"],
      answer: "Notre processus de travail suit cette méthodologie éprouvée :\n\n🔍 **1. Analyse** - Compréhension de vos besoins réels et définition des objectifs\n🛠️ **2. Conception** - Création de la solution sur mesure adaptée à vos besoins\n🧪 **3. Développement** - Création et tests rigoureux de la solution\n🚀 **4. Déploiement** - Installation et suivi post-mise en production\n📈 **5. Optimisation** - Amélioration continue basée sur les résultats\n\nChaque étape est réalisée avec transparence et excellence."
    },
    {
      question: "Proposez-vous des formations ?",
      keywords: ["formations", "cours", "apprentissage", "éducation", "chatgpt", "zapier", "make", "voiceflow"],
      answer: "Oui ! Nous proposons des formations en IA pour vous rendre autonome :\n\n🎓 **Formations individuelles** - 100-300€/personne\n👥 **Formations en groupe** - Forfaits selon le nombre de participants\n🎯 **Contenu personnalisé** - Selon vos besoins spécifiques\n\n**Technologies couvertes :**\n- ChatGPT et autres outils d'IA\n- Make.com et Zapier (outils d'automatisation)\n- Voiceflow (création de chatbots vocaux)\n- Autres outils selon vos besoins\n\nObjectif : Vous rendre autonome dans l'utilisation des outils d'IA pour booster votre productivité."
    },
    {
      question: "Quels sont vos outils et technologies ?",
      keywords: ["outils", "technologies", "logiciels", "plateformes", "stack", "technique", "no-code"],
      answer: "Nous utilisons une variété d'outils selon les besoins :\n\n🤖 **Chatbots** - Voiceflow, Dialogflow, solutions personnalisées\n⚙️ **Automatisation** - Make.com, Zapier, Integromat\n🌐 **Web** - HTML, CSS, JavaScript, frameworks modernes\n🧠 **IA** - Google Gemini, ChatGPT, Claude, outils personnalisés\n📊 **Analytics** - Google Analytics, outils de suivi personnalisés\n\nNous choisissons les outils les plus adaptés à chaque projet, en privilégiant les solutions no-code/low-code pour une maintenance aisée."
    }
  ],
  products: [
    {
      id: "chatbot",
      name: "Chatbots & Agents IA",
      keywords: ["chatbot", "bot", "assistant", "conversationnel", "ia", "whatsapp", "messenger", "facebook", "telegram"],
      short_desc: "Assistants conversationnels intelligents (WhatsApp, site web, Messenger, Telegram)",
      details: "Des chatbots capables de répondre à 85% des questions automatiquement, disponibles 24h/24 et 7j/7. Intégration sur WhatsApp, site web, Messenger, Telegram, Facebook. Personnalisation selon votre ton de marque et vos besoins spécifiques.",
      features: [
        "Réponses 24/7 à vos clients",
        "Intégration avec vos outils (CRM, email, etc.)",
        "Personnalisation selon votre ton de marque",
        "Suivi des conversations et analytics",
        "Capacité d'apprentissage continu"
      ],
      price_range: "500-1 500€ + abonnement 50-150€/mois",
      url: "/chatbot.html"
    },
    {
      id: "automatisation",
      name: "Automatisation des Processus",
      keywords: ["automatisation", "processus", "workflow", "tâches répétitives", "no-code", "make", "zapier"],
      short_desc: "Connexion entre outils, workflows automatisés (no-code)",
      details: "Automatisez vos tâches répétitives en connectant vos outils entre eux via des plateformes no-code comme Make.com ou Zapier. Gain de 500+ heures par an. Nous créons des workflows intelligents qui réagissent à des événements spécifiques.",
      features: [
        "Connexion entre vos outils (CRM, email, stock, etc.)",
        "Workflows no-code faciles à modifier",
        "Notifications automatiques",
        "Synchronisation des données",
        "Gain de temps significatif"
      ],
      price_range: "1 000-3 000€ selon complexité",
      url: "/automatisation.html"
    },
    {
      id: "site-web",
      name: "Sites Web Intelligents",
      keywords: ["site", "site web", "website", "plateforme", "intelligent", "responsive", "mobile", "seo"],
      short_desc: "Sites modernes avec IA intégrée et optimisation continue",
      details: "Des sites web modernes avec intégration d'IA pour personnaliser l'expérience utilisateur, automatiser les interactions et optimiser continuellement les performances. Design responsive, SEO optimisé, chargement rapide.",
      features: [
        "Design moderne et responsive",
        "Intégration d'IA pour personnalisation",
        "Optimisation SEO",
        "Intégration avec outils d'analyse",
        "Automatisation des communications"
      ],
      price_range: "2 000-5 000€",
      url: "/sites-web.html"
    },
    {
      id: "formation",
      name: "Formations en IA",
      keywords: ["formation", "apprendre", "former", "cours", "chatgpt", "zapier", "make", "voiceflow", "autonomie"],
      short_desc: "Accompagnement pour maîtriser ChatGPT, Make, Zapier, Voiceflow et plus",
      details: "Apprenez à utiliser les outils d'IA pour automatiser vos tâches et gagner en efficacité. Formation personnalisée selon vos besoins, avec mise en pratique immédiate. Objectif : vous rendre autonome rapidement.",
      features: [
        "Formation personnalisée selon vos besoins",
        "Mise en pratique immédiate",
        "Support continu",
        "Ressources pédagogiques",
        "Atteindre l'autonomie rapidement"
      ],
      price_range: "100-300€/personne ou forfait groupe",
      url: "/formations.html"
    },
    {
      id: "conseil",
      name: "Conseil & Accompagnement",
      keywords: ["conseil", "audit", "accompagnement", "stratégie", "expertise", "business", "optimisation"],
      short_desc: "Audit gratuit et stratégie d'automatisation sur mesure",
      details: "Audit gratuit pour identifier les opportunités d'automatisation dans votre business, suivi d'une stratégie personnalisée. Nous analysons vos processus actuels pour vous proposer des solutions concrètes d'amélioration.",
      features: [
        "Audit gratuit initial",
        "Analyse de vos processus",
        "Stratégie personnalisée",
        "Plan d'implémentation",
        "Accompagnement continu"
      ],
      price_range: "Audit gratuit",
      url: "/conseil.html"
    },
    {
      id: "contenus-ia",
      name: "Création de Contenus IA",
      keywords: ["contenus", "ia", "création", "textes", "images", "videos", "branding", "sonore"],
      short_desc: "Génération de textes, images, vidéos avec IA pour une identité unique",
      details: "Création de contenus de qualité avec l'IA pour renforcer votre identité de marque. Textes, images, vidéos, branding sonore - tout est pensé pour vous démarquer de la concurrence.",
      features: [
        "Génération de textes percutants",
        "Création d'images uniques",
        "Vidéos générées par IA",
        "Branding sonore personnalisé",
        "Identité visuelle cohérente"
      ],
      price_range: "Sur devis selon projet",
      url: "/contenus-ia.html"
    }
  ],
  pages: [
    {
      name: "Services",
      keywords: ["services", "offres", "prestations", "solutions", "produits"],
      url: "/index.html#services",
      description: "Découvrez nos 6 services principaux pour transformer votre business avec l'IA : Chatbots, Automatisation, Sites Web, Formations, Conseil et Création de Contenus IA"
    },
    {
      name: "Chatbots & Agents IA",
      keywords: ["chatbot", "agents", "ia", "assistant", "conversationnel", "whatsapp", "messenger"],
      url: "/chatbot.html",
      description: "Des assistants conversationnels intelligents pour automatiser votre service client 24/7"
    },
    {
      name: "Automatisation",
      keywords: ["automatisation", "processus", "workflow", "no-code", "make", "zapier", "tâches répétitives"],
      url: "/automatisation.html",
      description: "Connectez vos outils et automatisez vos tâches répétitives pour gagner des centaines d'heures par mois"
    },
    {
      name: "Sites Web Intelligents",
      keywords: ["site", "web", "intelligent", "plateforme", "responsive", "seo", "design"],
      url: "/sites-web.html",
      description: "Des sites modernes avec IA intégrée pour une expérience utilisateur personnalisée et optimisée"
    },
    {
      name: "Formations en IA",
      keywords: ["formation", "apprendre", "cours", "ia", "chatgpt", "zapier", "make", "voiceflow", "autonomie"],
      url: "/formations.html",
      description: "Maîtrisez les outils d'IA pour gagner en efficacité et devenez autonome rapidement"
    },
    {
      name: "Conseil & Accompagnement",
      keywords: ["conseil", "audit", "accompagnement", "stratégie", "business", "optimisation"],
      url: "/conseil.html",
      description: "Audit gratuit et stratégie personnalisée pour transformer votre business avec l'IA"
    },
    {
      name: "Création de Contenus IA",
      keywords: ["contenus", "ia", "création", "textes", "images", "videos", "branding", "sonore"],
      url: "/contenus-ia.html",
      description: "Génération de textes, images, vidéos avec IA pour une identité de marque unique"
    },
    {
      name: "À Propos",
      keywords: ["à propos", "entreprise", "équipe", "histoire", "fondateur", "franck", "mission"],
      url: "/index.html#about",
      description: "Découvrez l'histoire de HAIR, notre mission et notre fondateur Franck GUEKEU"
    },
    {
      name: "Contact",
      keywords: ["contact", "nous joindre", "email", "téléphone", "rendez-vous", "discuter", "projet"],
      url: "/index.html#contact",
      description: "Contactez-nous pour discuter de votre projet et obtenir un audit gratuit"
    },
    {
      name: "Études de Cas",
      keywords: ["études", "cas", "exemples", "projets", "résultats", "témoignages", "preuves"],
      url: "/index.html#cases",
      description: "Découvrez des projets réels où nos solutions ont apporté des résultats concrets"
    },
    {
      name: "Processus",
      keywords: ["processus", "méthode", "étapes", "déroulement", "travail", "collaboration", "projet"],
      url: "/index.html#process",
      description: "Notre méthodologie éprouvée pour vous guider de la conception au déploiement"
    }
  ]
};

// Intent detection patterns
const INTENT_PATTERNS = {
  salutation: {
    patterns: [/bonjour/i, /salut/i, /hello/i, /hey/i, /coucou/i],
    responses: [
      "Bonjour ! Je suis Astro, votre assistant HAIR. Comment puis-je vous aider aujourd'hui ?",
      "Salut ! Je suis Astro, l'assistant virtuel de HAIR. Que recherchez-vous ?"
    ]
  },
  produit_info: {
    patterns: [
      /produit/i,
      /service/i,
      /prix de/i,
      /tarif/i,
      /caractéristiques/i,
      /qu'est-ce que (.*)/i,
      /quel est (.*)/i,
      /comment fonctionne (.*)/i
    ],
    action: 'search_product', // Function to call
    followup: "Sur quel service ou produit souhaitez-vous des infos ?"
  },
  aide_navigation: {
    patterns: [
      /où (trouver|voir|trouve|regarder)/i,
      /comment (accéder|aller|trouver)/i,
      /page (.*)/i,
      /sur quelle page (.*)/i,
      /je veux voir (.*)/i
    ],
    action: 'suggest_page'
  },
  contact: {
    patterns: [/contacter/i, /email/i, /téléphone/i, /parler/i, /humain/i, /conseiller/i],
    responses: [
      "Avec plaisir ! Notre fondateur Franck est joignable directement :\n\n📧 vfranck364@gmail.com\n📱 +237 6 83 12 16 54\n\nSouhaitez-vous aussi un audit gratuit de vos besoins en automatisation ?"
    ],
    next_step: 'collect_email'
  },
  remerciement: {
    patterns: [/merci/i, /thank you/i, /thanks/i],
    responses: [
      "Avec plaisir ! 😊 Puis-je vous aider avec autre chose ?",
      "Merci à vous ! 🙏 Y a-t-il autre chose sur laquelle je peux vous aider ?"
    ]
  },
  au_revoir: {
    patterns: [/au revoir/i, /bye/i, /adieu/i, /quitte/i, /terminer/i],
    responses: [
      "Au revoir ! 🌟 N'hésitez pas à revenir si vous avez d'autres questions.",
      "À bientôt ! 💡 L'automatisation peut transformer votre business, n'hésitez pas à nous contacter pour un audit gratuit."
    ]
  }
};

/**
 * Local rules engine for fast responses
 */
class LocalRulesEngine {
  constructor(knowledgeBase) {
    this.knowledgeBase = knowledgeBase;
  }

  /**
   * Detects user intent based on message patterns
   */
  detectIntent(userMessage) {
    const lowerMessage = userMessage.toLowerCase();

    for (const [intent, config] of Object.entries(INTENT_PATTERNS)) {
      for (const pattern of config.patterns) {
        if (pattern.test(lowerMessage)) {
          return { intent, config };
        }
      }
    }

    return { intent: 'unknown', config: {} };
  }

  /**
   * Searches knowledge base for relevant information
   */
  searchKnowledge(query) {
    const queryTokens = this.tokenize(query.toLowerCase());
    let bestMatches = {
      faq: [],
      products: [],
      pages: []
    };

    // Search FAQs
    this.knowledgeBase.faq.forEach(item => {
      let score = 0;
      item.keywords.forEach(keyword => {
        if (queryTokens.includes(keyword.toLowerCase())) {
          score += 1;
        }
      });

      if (score > 0) {
        bestMatches.faq.push({ ...item, score });
      }
    });

    // Search products
    this.knowledgeBase.products.forEach(item => {
      let score = 0;
      item.keywords.forEach(keyword => {
        if (queryTokens.includes(keyword.toLowerCase())) {
          score += 1;
        }
      });

      if (score > 0) {
        bestMatches.products.push({ ...item, score });
      }
    });

    // Search pages
    this.knowledgeBase.pages.forEach(item => {
      let score = 0;
      item.keywords.forEach(keyword => {
        if (queryTokens.includes(keyword.toLowerCase())) {
          score += 1;
        }
      });

      if (score > 0) {
        bestMatches.pages.push({ ...item, score });
      }
    });

    // Sort by score descending
    bestMatches.faq.sort((a, b) => b.score - a.score);
    bestMatches.products.sort((a, b) => b.score - a.score);
    bestMatches.pages.sort((a, b) => b.score - a.score);

    return bestMatches;
  }

  /**
   * Tokenizes text for matching
   */
  tokenize(text) {
    return text.split(/\s+/).filter(token => token.length > 2);
  }

  /**
   * Processes a message using local rules
   */
  processMessage(userMessage) {
    // First, try to detect intent
    const { intent, config } = this.detectIntent(userMessage);

    // Handle known intents
    switch (intent) {
      case 'salutation':
        return config.responses[Math.floor(Math.random() * config.responses.length)];

      case 'remerciement':
        return config.responses[Math.floor(Math.random() * config.responses.length)];

      case 'au_revoir':
        return config.responses[Math.floor(Math.random() * config.responses.length)];

      case 'contact':
        return config.responses[0];

      case 'produit_info':
        // Search for relevant products
        const knowledge = this.searchKnowledge(userMessage);
        if (knowledge.products.length > 0) {
          const product = knowledge.products[0];
          return `${product.name}: ${product.short_desc}\n\n${product.details}\nPrix: ${product.price_range}`;
        }
        return config.followup;

      case 'aide_navigation':
        // Search for relevant pages
        const pages = this.searchKnowledge(userMessage);
        if (pages.pages.length > 0) {
          const page = pages.pages[0];
          return `Vous pouvez trouver des informations sur "${page.name}" à cette page : ${page.url}\n\n${page.description}`;
        }
        return "Je peux vous aider à naviguer sur le site. Quelle section recherchez-vous ?";

      case 'unknown':
        // Try to find relevant FAQ
        const faqs = this.searchKnowledge(userMessage);
        if (faqs.faq.length > 0) {
          return faqs.faq[0].answer;
        }
        return null; // No local match found

      default:
        return null; // No local match found
    }
  }
}

/**
 * Hybrid chatbot that combines local rules with Gemini API
 */
class HybridChatbot {
  constructor() {
    this.localEngine = new LocalRulesEngine(LOCAL_KNOWLEDGE_BASE);
    console.log('🧠 [HybridChatbot] Moteur de règles locales initialisé avec', LOCAL_KNOWLEDGE_BASE.faq.length, 'FAQs,', LOCAL_KNOWLEDGE_BASE.products.length, 'produits,', LOCAL_KNOWLEDGE_BASE.pages.length, 'pages');

    // Use GeminiChatbotEnhanced for better responses with full site context
    // Falls back to GeminiChatbot if not available
    if (typeof GeminiChatbotEnhanced !== 'undefined') {
      this.geminiChatbot = new GeminiChatbotEnhanced();
      console.log('🚀 Chatbot initialized with Gemini Enhanced (full site context)');
    } else if (typeof GeminiChatbot !== 'undefined') {
      this.geminiChatbot = new GeminiChatbot();
      console.log('💎 Chatbot initialized with Google Gemini');
    } else {
      console.error('❌ No chatbot backend available!');
    }

    this.conversationHistory = [];
  }

  /**
   * Handles user message - Try AI API first, fallback to local rules
   */
  async sendMessage(userMessage) {
    // FIRST: Try AI API for intelligent response
    console.log('🤖 [HybridChatbot] Envoi à l\'IA pour analyse:', userMessage.substring(0, 50) + '...');
    
    try {
      const geminiResponse = await this.geminiChatbot.sendMessage(userMessage);
      console.log('✅ [HybridChatbot] Réponse IA reçue avec succès');
      return {
        ...geminiResponse,
        source: geminiResponse.success ? 'ai' : 'ai-error'
      };
    } catch (error) {
      console.warn('⚠️ [HybridChatbot] IA échoué, fallback vers règles locales:', error.message);
      
      // FALLBACK: Try local rules engine
      try {
        const localResponse = this.localEngine.processMessage(userMessage);
        
        if (localResponse) {
          console.log('✅ [HybridChatbot] Réponse locale trouvée');
          return {
            success: true,
            message: localResponse,
            source: 'local-rules'
          };
        } else {
          console.log('⚠️ [HybridChatbot] Aucune réponse locale trouvée');
        }
      } catch (localError) {
        console.error('❌ [HybridChatbot] Erreur moteur local:', localError);
      }

      // ULTIMATE FALLBACK: Generic error message with contact info
      const fallbackResponses = [
        "Désolé, je rencontre un petit souci technique 😅\n\nMais pas de panique ! Je peux quand même vous aider :\n\n📧 Contacter directement Franck : vfranck364@gmail.com\n📱 WhatsApp : +237 6 83 12 16 54\n\nOu posez-moi une autre question, je ferai de mon mieux !",
        "Oops ! Problème de connexion avec mon cerveau IA 😅\n\nEn attendant, voici comment me contacter directement :\n\n📧 vfranck364@gmail.com\n📱 +237 6 83 12 16 54\n\nJe répondrai à votre question avec plaisir !",
        "Je suis momentanément indisponible pour cause de maintenance IA 😊\n\nEn attendant, vous pouvez me joindre directement :\n\n📧 vfranck364@gmail.com\n📱 +237 6 83 12 16 54\n\nJe répondrai à votre question avec plaisir !"
      ];

      const randomFallback = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];

      return {
        success: false,
        message: randomFallback,
        error: error.message,
        source: 'fallback'
      };
    }
  }

  /**
   * Resets the conversation
   */
  reset() {
    this.conversationHistory = [];
    this.geminiChatbot.reset();
  }

  /**
   * Gets user profile data
   */
  getUserProfile() {
    return this.geminiChatbot.userProfile;
  }

  /**
   * Saves lead information
   */
  saveLead() {
    this.geminiChatbot.saveLead();
  }
}

// Export for use in frontend
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { HybridChatbot, LocalRulesEngine };
} else {
  window.HybridChatbot = HybridChatbot;
  window.LocalRulesEngine = LocalRulesEngine;
}