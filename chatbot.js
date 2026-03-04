// ============================================
// HAIR - Chatbot Astro avec Gemini AI
// Frontend Widget avec Intelligence Artificielle
// ============================================

class AstroBot {
  constructor() {
    this.isOpen = false;
    this.chatbot = new HybridChatbot(); // Use hybrid chatbot instead of just Gemini
    this.autoActivated = false;
    this.apiStatus = 'unknown'; // 'unknown', 'connected', 'error'

    // Supabase - Lead Management
    this.currentLeadId = null;
    this.sessionId = null;
    this.leadSavedNotification = false;

    this.init();
    this.testAPIConnection(); // Test API connection on init
  }

  init() {
    this.createWidget();
    this.attachEventListeners();
    this.scheduleAutoActivation();
  }

  /**
   * Teste la connexion API au démarrage
   */
  async testAPIConnection() {
    console.log('🔍 [AstroBot] Test de connexion API...');
    try {
      const response = await this.chatbot.sendMessage('Bonjour');
      if (response.success) {
        this.apiStatus = 'connected';
        this.updateStatusIndicator('connected');
        console.log('✅ [AstroBot] API connectée et fonctionnelle');
      } else {
        this.apiStatus = 'error';
        this.updateStatusIndicator('error');
        console.warn('⚠️ [AstroBot] API erreur:', response.error);
      }
    } catch (error) {
      this.apiStatus = 'error';
      this.updateStatusIndicator('error');
      console.warn('⚠️ [AstroBot] API non connectée:', error.message);
    }
  }

  /**
   * Met à jour l'indicateur de statut API dans l'UI
   */
  updateStatusIndicator(status) {
    const statusEl = document.getElementById('astro-status-indicator');
    if (!statusEl) return;

    if (status === 'connected') {
      statusEl.textContent = '🟢 En ligne';
      statusEl.style.color = 'var(--color-energy-lime)';
    } else if (status === 'error') {
      statusEl.textContent = '🟡 Mode dégradé';
      statusEl.style.color = '#FFD700'; // Gold color
    } else {
      statusEl.textContent = '🔵 Initialisation...';
      statusEl.style.color = '#4A90E2'; // Blue color
    }
  }

  /**
   * Active automatiquement le chatbot après 12 secondes
   */
  scheduleAutoActivation() {
    console.log('🤖 [AstroBot] Auto-activation programmée dans 12s...');
    setTimeout(() => {
      console.log('⏰ [AstroBot] Auto-activation déclenchée !');
      console.log('📱 Window width:', window.innerWidth);
      console.log('🔓 autoActivated:', this.autoActivated);
      console.log('🔓 isOpen:', this.isOpen);

      // Ne pas auto-ouvrir sur mobile (≤768px)
      if (window.innerWidth <= 768) {
        console.log('📱 Mobile détecté (≤768px) - Auto-ouverture désactivée');
        return;
      }

      if (!this.autoActivated && !this.isOpen) {
        console.log('✅ Ouverture automatique du chatbot...');
        this.autoActivated = true;
        this.toggleChat();

        // Message de bienvenue proactif
        this.addBotMessage(
          "👋 Salut ! Je suis Astro, l'assistant HAIR.\n\nJe peux t'aider à découvrir comment l'IA peut automatiser tes processus et te faire gagner un temps précieux !\n\n💡 Par quoi veux-tu commencer ?",
          [
            "🤖 Créer un chatbot",
            "⚙️ Automatiser des tâches",
            "🌐 Refaire mon site",
            "🎓 Me former à l'IA"
          ]
        );
      } else {
        console.log('⚠️ Auto-activation ignorée : autoActivated=', this.autoActivated, 'isOpen=', this.isOpen);
      }
    }, 12000); // 12 secondes
  }

  createWidget() {
    const widgetHTML = `
      <!-- Chat Button -->
      <div id="astro-chat-button" class="astro-chat-button">
        <div class="astro-avatar">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
            <circle cx="9" cy="10" r="1.5" fill="currentColor"/>
            <circle cx="15" cy="10" r="1.5" fill="currentColor"/>
            <path d="M8 14C8 14 9.5 16 12 16C14.5 16 16 14 16 14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </div>
        <div class="astro-pulse"></div>
      </div>

      <!-- Chat Widget -->
      <div id="astro-chat-widget" class="astro-chat-widget">
        <div class="astro-chat-header">
          <div class="astro-header-info">
            <div class="astro-avatar-small">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                <circle cx="9" cy="10" r="1.5" fill="currentColor"/>
                <circle cx="15" cy="10" r="1.5" fill="currentColor"/>
                <path d="M8 14C8 14 9.5 16 12 16C14.5 16 16 14 16 14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </div>
            <div>
              <div class="astro-name">Astro</div>
              <div class="astro-status" id="astro-status-indicator">🟢 En ligne</div>
            </div>
          </div>
          <button class="astro-close" id="astro-close-btn">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </button>
        </div>

        <div class="astro-chat-messages" id="astro-messages">
          <!-- Messages will be inserted here -->
        </div>

        <div class="astro-quick-replies" id="astro-quick-replies">
          <!-- Quick replies will be inserted here -->
        </div>

        <div class="astro-chat-input">
          <input 
            type="text" 
            id="astro-input" 
            placeholder="Écris ton message..."
            autocomplete="off"
          />
          <button id="astro-send-btn">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>

        <div class="astro-footer">
          <span style="font-size: 0.75rem; color: var(--color-text-gray);">
            Propulsé par Llama 3 (Groq)
          </span>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', widgetHTML);
  }

  attachEventListeners() {
    const button = document.getElementById('astro-chat-button');
    const closeBtn = document.getElementById('astro-close-btn');
    const sendBtn = document.getElementById('astro-send-btn');
    const input = document.getElementById('astro-input');

    button.addEventListener('click', () => this.toggleChat());
    closeBtn.addEventListener('click', () => this.toggleChat());
    sendBtn.addEventListener('click', () => this.sendMessage());
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.sendMessage();
    });
  }

  toggleChat() {
    this.isOpen = !this.isOpen;
    const widget = document.getElementById('astro-chat-widget');
    const button = document.getElementById('astro-chat-button');

    console.log('🚪 [AstroBot] toggleChat() appelé - isOpen:', this.isOpen);

    if (this.isOpen) {
      widget.classList.add('open');
      button.classList.add('hidden');
      console.log('✅ Chatbot ouvert');

      // Message de bienvenue manuel si pas auto-activé ET première ouverture
      if (this.chatbot.conversationHistory.length === 0 && !this.autoActivated) {
        console.log('💬 Ajout message de bienvenue manuel');
        this.addBotMessage(
          "👋 Salut ! Je suis Astro, ton assistant HAIR.\n\nComment puis-je t'aider aujourd'hui ?",
          [
            "🤖 Créer un chatbot",
            "⚙️ Automatiser des tâches",
            "🌐 Créer un site web",
            "  💰 Tarifs et devis"
          ]
        );
      } else {
        console.log('ℹ️ Pas de message de bienvenue (conversation existante ou auto-activé)');
      }
    } else {
      widget.classList.remove('open');
      button.classList.remove('hidden');
      console.log('❌ Chatbot fermé');
    }
  }

  async sendMessage() {
    const input = document.getElementById('astro-input');
    const message = input.value.trim();

    if (!message) return;

    this.addUserMessage(message);
    input.value = '';

    // Afficher l'indicateur de frappe
    this.showTypingIndicator();

    try {
      // Appel au chatbot hybride (local rules + Gemini AI)
      const response = await this.chatbot.sendMessage(message);

      this.hideTypingIndicator();

      if (response.success) {
        this.addBotMessage(response.message);

        // Sauvegarder la conversation dans Supabase
        await this.saveConversationToSupabase(message, response.message);

        // Détecter et notifier les demandes importantes
        await this.trackImportantRequests(message, response.message);

        // Sauvegarder le lead si email détecté
        if (this.chatbot.getUserProfile().email) {
          await this.saveLeadToSupabase();
        }
      } else {
        this.addBotMessage(response.message);
      }
    } catch (error) {
      this.hideTypingIndicator();
      console.error('Chatbot error:', error);
      this.addBotMessage(
        "Oups, un petit souci technique 😅\n\nMais tu peux toujours me contacter directement :\n\n📧 vfranck364@gmail.com\n📱 +237 6 83 12 16 54"
      );
    }
  }

  /**
   * Détecter et tracker les demandes importantes (tarifs, services, contact)
   */
  async trackImportantRequests(userMessage, botMessage) {
    const lowerMessage = userMessage.toLowerCase();
    
    // Mots-clés pour demandes importantes
    const importantKeywords = {
      'pricing_request': ['prix', 'tarif', 'coût', 'combien', 'budget', 'devis', 'facturation'],
      'service_details': ['détails', 'fonctionne', 'étapes', 'processus', 'comment'],
      'contact_request': ['contact', 'contacter', 'email', 'téléphone', 'rendez-vous', 'appel']
    };

    for (const [type, keywords] of Object.entries(importantKeywords)) {
      if (keywords.some(keyword => lowerMessage.includes(keyword))) {
        await this.sendImportantInfoNotification(type, botMessage);
        break;
      }
    }
  }

  /**
   * Sauvegarder la conversation dans Supabase
   */
  async saveConversationToSupabase(userMessage, botMessage) {
    try {
      if (typeof window.HAIRSupabase !== 'undefined') {
        await window.HAIRSupabase.saveConversation({
          lead_id: this.currentLeadId || null,
          message_user: userMessage,
          message_bot: botMessage,
          session_id: this.sessionId || this.generateSessionId()
        });
      }
    } catch (error) {
      console.warn('⚠️ Erreur sauvegarde conversation:', error);
      // Non bloquant - continuer même si sauvegarde échoue
    }
  }

  /**
   * Sauvegarder le lead dans Supabase (après collecte infos complètes)
   */
  async saveLeadToSupabase() {
    try {
      const userProfile = this.chatbot.getUserProfile();

      if (!userProfile.email) return;

      // Vérifier si Supabase est disponible
      if (typeof window.HAIRSupabase === 'undefined') {
        console.warn('⚠️ Supabase not loaded yet');
        return;
      }

      // Préparer les données du lead
      const leadData = {
        email: userProfile.email,
        full_name: userProfile.name || null,
        phone: userProfile.phone || null,
        company: userProfile.company || null,
        service_wanted: userProfile.service_interest || 'Non spécifié',
        budget: userProfile.budget || 'Non spécifié',
        volume: 'Non spécifié',
        urgency: 'Non spécifié',
        conversation: this.chatbot.conversationHistory || []
      };

      // Sauvegarder dans Supabase
      const result = await window.HAIRSupabase.saveLead(leadData);

      if (result.success) {
        console.log('✅ Lead sauvegardé dans Supabase:', result.data);
        this.currentLeadId = result.data[0]?.id;

        // Message de confirmation (une seule fois)
        if (!this.leadSavedNotification) {
          this.leadSavedNotification = true;
          console.log('🎉 Lead envoyé à Franck !');
          // Notification envoyée automatiquement via Supabase Edge Function
          // Email + Telegram seront envoyés à Franck
        }
      } else {
        console.error('❌ Erreur sauvegarde lead:', result.error);
      }
    } catch (error) {
      console.error('❌ Erreur sauvegarde lead:', error);
      // Non bloquant - continuer même si sauvegarde échoue
    }
  }

  /**
   * Envoyer une notification pour information importante (tarifs, détails service)
   */
  async sendImportantInfoNotification(infoType, content) {
    try {
      if (typeof window.HAIRSupabase === 'undefined') return;

      // Enregistrer l'information importante dans Supabase
      const notificationData = {
        type: infoType, // 'pricing_request', 'service_details', 'contact_request'
        content: content,
        timestamp: new Date().toISOString(),
        user_profile: this.chatbot.getUserProfile()
      };

      // Sauvegarder dans une table 'notifications' ou 'interactions'
      const { data, error } = await window.HAIRSupabase.supabase
        .from('chat_interactions')
        .insert([notificationData]);

      if (error) {
        console.warn('⚠️ Notification non envoyée:', error);
      } else {
        console.log('📬 Notification importante envoyée:', infoType);
        // Déclencher les notifications Email + Telegram
        await window.HAIRSupabase.triggerNotifications({
          full_name: notificationData.user_profile?.name || 'Visiteur',
          email: notificationData.user_profile?.email || 'Non fourni',
          service_wanted: infoType,
          message: content.substring(0, 200) + '...'
        });
      }
    } catch (error) {
      console.error('❌ Erreur notification info importante:', error);
      // Non bloquant
    }
  }

  /**
   * Générer un ID de session unique
   */
  generateSessionId() {
    this.sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    return this.sessionId;
  }

  addUserMessage(text) {
    const messagesContainer = document.getElementById('astro-messages');
    const messageHTML = `
      <div class="astro-message user-message">
        <div class="message-bubble">${this.escapeHtml(text)}</div>
      </div>
    `;
    messagesContainer.insertAdjacentHTML('beforeend', messageHTML);
    this.scrollToBottom();
  }

  addBotMessage(text, quickReplies = []) {
    const messagesContainer = document.getElementById('astro-messages');
    const messageHTML = `
      <div class="astro-message bot-message">
        <div class="message-bubble">${this.formatBotMessage(text)}</div>
      </div>
    `;
    messagesContainer.insertAdjacentHTML('beforeend', messageHTML);
    this.scrollToBottom();

    // Ajouter quick replies si fournis
    if (quickReplies.length > 0) {
      this.showQuickReplies(quickReplies);
    } else {
      this.hideQuickReplies(); // Cacher les quick replies s'il n'y en a pas
    }
  }

  showQuickReplies(replies) {
    const container = document.getElementById('astro-quick-replies');

    // Si pas de replies, cacher le container
    if (!replies || replies.length === 0) {
      container.innerHTML = '';
      container.style.display = 'none';
      return;
    }

    // Afficher le container et clear previous
    container.style.display = 'flex';
    container.innerHTML = '';

    replies.forEach(reply => {
      const button = document.createElement('button');
      button.className = 'quick-reply-btn';
      button.textContent = reply;
      button.addEventListener('click', () => {
        this.handleQuickReply(reply);
      });
      container.appendChild(button);
    });
  }

  hideQuickReplies() {
    const container = document.getElementById('astro-quick-replies');
    container.innerHTML = '';
    container.style.display = 'none';
  }

  async handleQuickReply(reply) {
    this.addUserMessage(reply);
    this.hideQuickReplies(); // Cacher les boutons après le clic

    this.showTypingIndicator();

    try {
      const response = await this.chatbot.sendMessage(reply);
      this.hideTypingIndicator();

      if (response.success) {
        this.addBotMessage(response.message);
      } else {
        this.addBotMessage(response.message);
      }
    } catch (error) {
      this.hideTypingIndicator();
      this.addBotMessage("Désolé, petit problème technique. Réessaye ou contacte-nous directement !");
    }
  }

  showTypingIndicator() {
    const messagesContainer = document.getElementById('astro-messages');
    const typingHTML = `
      <div class="astro-message bot-message typing-indicator" id="typing-indicator">
        <div class="message-bubble">
          <div class="typing-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>
    `;
    messagesContainer.insertAdjacentHTML('beforeend', typingHTML);
    this.scrollToBottom();
  }

  hideTypingIndicator() {
    const indicator = document.getElementById('typing-indicator');
    if (indicator) indicator.remove();
  }

  formatBotMessage(text) {
    // Convertir line breaks en <br>
    return text.replace(/\n/g, '<br>');
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  scrollToBottom() {
    const messagesContainer = document.getElementById('astro-messages');
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }
}

// Initialiser le bot quand le DOM est prêt
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    // Attendre que les scripts nécessaires soient chargés
    if (typeof HybridChatbot !== 'undefined') {
      new AstroBot();
    } else {
      console.error('HybridChatbot not loaded. Make sure chatbot-hybrid.js is included first.');
    }
  });
} else {
  if (typeof HybridChatbot !== 'undefined') {
    new AstroBot();
  }
}
