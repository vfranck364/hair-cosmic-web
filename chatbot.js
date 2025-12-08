// ============================================
// HAIR - Chatbot Astro
// Interactive AI Assistant Widget
// ============================================

class AstroBot {
    constructor() {
        this.isOpen = false;
        this.conversationHistory = [];
        this.userEmail = null;
        this.init();
    }

    init() {
        this.createWidget();
        this.attachEventListeners();
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
              <div class="astro-status">Assistant HAIR</div>
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

        if (this.isOpen) {
            widget.classList.add('open');
            button.classList.add('hidden');

            // Send welcome message if first time
            if (this.conversationHistory.length === 0) {
                this.addBotMessage(
                    "👋 Salut ! Je suis Astro, l'assistant HAIR.\n\nJe vais t'aider à identifier les automatisations qui libéreront ton équipe.\n\nQuelle est ta plus grosse perte de temps actuellement ?",
                    [
                        "Saisie manuelle",
                        "Emails répétitifs",
                        "Reporting",
                        "Coordination équipe"
                    ]
                );
            }
        } else {
            widget.classList.remove('open');
            button.classList.remove('hidden');
        }
    }

    sendMessage() {
        const input = document.getElementById('astro-input');
        const message = input.value.trim();

        if (!message) return;

        this.addUserMessage(message);
        input.value = '';

        // Simulate bot response
        this.showTypingIndicator();
        setTimeout(() => {
            this.hideTypingIndicator();
            this.handleBotResponse(message);
        }, 1500);
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
        this.conversationHistory.push({ role: 'user', content: text });
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
        this.conversationHistory.push({ role: 'bot', content: text });

        // Add quick replies if provided
        if (quickReplies.length > 0) {
            this.showQuickReplies(quickReplies);
        }
    }

    showQuickReplies(replies) {
        const container = document.getElementById('astro-quick-replies');
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

    handleQuickReply(reply) {
        this.addUserMessage(reply);
        document.getElementById('astro-quick-replies').innerHTML = '';

        this.showTypingIndicator();
        setTimeout(() => {
            this.hideTypingIndicator();
            this.handleBotResponse(reply);
        }, 1500);
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

    handleBotResponse(userMessage) {
        const lowerMessage = userMessage.toLowerCase();

        // Simple intent detection
        if (lowerMessage.includes('saisie') || lowerMessage.includes('manuel')) {
            this.addBotMessage(
                "🎯 Je vois. La saisie manuelle, c'est un classique.\n\nCombien d'heures par semaine ton équipe passe-t-elle sur de la saisie de données ?",
                ["1-5h", "5-10h", "10-20h", "20h+"]
            );
        } else if (lowerMessage.includes('email')) {
            this.addBotMessage(
                "📧 Les emails répétitifs... Je comprends.\n\nOn peut automatiser les réponses types, les follow-ups, et même la qualification.\n\nTu utilises quel outil email principal ?",
                ["Gmail", "Outlook", "Autre"]
            );
        } else if (lowerMessage.includes('reporting') || lowerMessage.includes('rapport')) {
            this.addBotMessage(
                "📊 Le reporting manuel, ça prend du temps !\n\nOn peut créer des dashboards automatiques qui se mettent à jour en temps réel.\n\nD'où viennent tes données actuellement ?",
                ["CRM", "Excel/Sheets", "Analytics", "Plusieurs sources"]
            );
        } else if (lowerMessage.includes('coordination') || lowerMessage.includes('équipe')) {
            this.addBotMessage(
                "👥 La coordination d'équipe peut être optimisée.\n\nOn peut automatiser les notifications, les assignations, et les suivis.\n\nQuel outil utilises-tu pour gérer ton équipe ?",
                ["Slack", "Teams", "Asana/Trello", "Autre"]
            );
        } else if (lowerMessage.match(/\d+h/)) {
            // User mentioned hours
            this.addBotMessage(
                "💡 Ok, donc environ " + lowerMessage + " par semaine.\n\nSi on automatise 80% de ça, tu gagnes un temps considérable.\n\nJe te propose un audit gratuit de 30 min pour cartographier tes workflows et identifier les quick wins.\n\nJ'ai un créneau demain à 14h ou vendredi à 10h. Ça te va ?",
                ["Demain 14h", "Vendredi 10h", "Autre créneau"]
            );
        } else if (lowerMessage.includes('demain') || lowerMessage.includes('vendredi')) {
            this.addBotMessage(
                "🚀 Parfait ! Pour confirmer ton audit, j'ai besoin de ton email.\n\nTu recevras :\n✓ Confirmation avec lien visio\n✓ Checklist pré-audit (5 min)\n✓ Mes coordonnées directes\n\n📧 Ton email ?"
            );
        } else if (lowerMessage.includes('@')) {
            // Email detected
            this.userEmail = userMessage;
            this.addBotMessage(
                "🎉 Mission acceptée !\n\nTu vas recevoir un email dans 2 minutes avec toutes les infos.\n\nEn attendant, si tu as des questions, je reste là. Sinon à très bientôt ! 🌟"
            );
        } else if (lowerMessage.includes('prix') || lowerMessage.includes('coût') || lowerMessage.includes('combien')) {
            this.addBotMessage(
                "💰 Bonne question ! Ça dépend de la complexité.\n\nPour te donner une idée :\n\n• Simple automation (1-2 workflows) : 2000-4000€\n• Pack workflows (3-5 automations) : 5000-8000€\n• Solution complète : 10 000-20 000€\n\nMais chaque projet est différent. On fait toujours un audit gratuit d'abord pour estimer précisément le gain et le coût.\n\nTu veux qu'on regarde ton cas en 30 min ?",
                ["Oui, je book", "Pas maintenant"]
            );
        } else {
            // Default response
            this.addBotMessage(
                "🤔 Je comprends.\n\nPour mieux t'aider, dis-moi :\n\nQuel est ton principal défi d'automatisation ?",
                ["Gagner du temps", "Réduire les erreurs", "Améliorer le suivi", "Autre"]
            );
        }
    }

    formatBotMessage(text) {
        // Convert line breaks to <br>
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

// Initialize Astro bot when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new AstroBot();
    });
} else {
    new AstroBot();
}
