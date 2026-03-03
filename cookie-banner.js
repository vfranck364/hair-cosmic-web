/**
 * HAIR Cookie Banner
 * Gestion du consentement RGPD pour les cookies
 * Version : 1.0 - 1er mars 2026
 */

(function() {
    'use strict';

    // Configuration
    const COOKIE_CONSENT_KEY = 'hair-cookie-consent';
    const COOKIE_EXPIRY_DAYS = 180; // 6 mois

    // Vérifier si le consentement a déjà été donné
    function getConsent() {
        return localStorage.getItem(COOKIE_CONSENT_KEY);
    }

    // Sauvegarder le consentement
    function saveConsent(choice) {
        localStorage.setItem(COOKIE_CONSENT_KEY, choice);
        
        // Définir la date d'expiration
        const expiry = new Date();
        expiry.setDate(expiry.getDate() + COOKIE_EXPIRY_DAYS);
        localStorage.setItem('hair-cookie-consent-expiry', expiry.toISOString());
    }

    // Vérifier si le consentement a expiré
    function isConsentExpired() {
        const expiry = localStorage.getItem('hair-cookie-consent-expiry');
        if (!expiry) return true;
        
        return new Date() > new Date(expiry);
    }

    // Créer le bandeau de cookies
    function createCookieBanner() {
        // Ne pas afficher si consentement déjà donné et non expiré
        const consent = getConsent();
        if (consent && !isConsentExpired()) {
            applyConsent(consent);
            return;
        }

        // Créer le HTML du bandeau
        const bannerHTML = `
            <div id="hair-cookie-banner" class="hair-cookie-banner">
                <div class="hair-cookie-banner-content">
                    <div class="hair-cookie-banner-icon">🍪</div>
                    <div class="hair-cookie-banner-text">
                        <h3>Votre confidentialité nous importe</h3>
                        <p>
                            Nous utilisons des cookies pour améliorer votre expérience sur notre site. 
                            Certains sont essentiels au fonctionnement du site, d'autres nous aident à 
                            comprendre comment vous l'utilisez.
                        </p>
                        <p class="hair-cookie-banner-link">
                            <a href="cookies.html" target="_blank">En savoir plus sur notre politique de cookies</a>
                        </p>
                    </div>
                </div>
                <div class="hair-cookie-banner-buttons">
                    <button id="hair-cookie-refuse" class="hair-cookie-btn hair-cookie-btn-secondary">
                        ❌ Tout refuser
                    </button>
                    <button id="hair-cookie-customize" class="hair-cookie-btn hair-cookie-btn-outline">
                        ⚙️ Personnaliser
                    </button>
                    <button id="hair-cookie-accept" class="hair-cookie-btn hair-cookie-btn-primary">
                        ✅ Tout accepter
                    </button>
                </div>
            </div>
        `;

        // Ajouter le bandeau à la page
        document.body.insertAdjacentHTML('beforeend', bannerHTML);

        // Ajouter les styles CSS
        addStyles();

        // Attendre que le bandeau soit dans le DOM
        setTimeout(() => {
            const banner = document.getElementById('hair-cookie-banner');
            if (banner) {
                // Animer l'apparition
                requestAnimationFrame(() => {
                    banner.classList.add('hair-cookie-banner-visible');
                });

                // Attacher les événements
                document.getElementById('hair-cookie-accept').addEventListener('click', () => {
                    saveConsent('all');
                    applyConsent('all');
                    hideBanner();
                    console.log('✅ Cookies acceptés');
                });

                document.getElementById('hair-cookie-refuse').addEventListener('click', () => {
                    saveConsent('none');
                    applyConsent('none');
                    hideBanner();
                    console.log('❌ Cookies refusés');
                });

                document.getElementById('hair-cookie-customize').addEventListener('click', () => {
                    // Rediriger vers la page de personnalisation
                    window.location.href = 'cookies.html';
                });
            }
        }, 100);
    }

    // Ajouter les styles CSS
    function addStyles() {
        const styles = `
            .hair-cookie-banner {
                position: fixed;
                bottom: -100%;
                left: 0;
                right: 0;
                background: rgba(8, 16, 41, 0.98);
                backdrop-filter: blur(20px);
                border-top: 1px solid rgba(139, 92, 246, 0.3);
                box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.3);
                padding: 1.5rem;
                z-index: 9999;
                transition: bottom 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                font-family: var(--font-body, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif);
            }

            .hair-cookie-banner-visible {
                bottom: 0;
            }

            .hair-cookie-banner-content {
                max-width: 1200px;
                margin: 0 auto;
                display: flex;
                gap: 1.5rem;
                align-items: flex-start;
            }

            .hair-cookie-banner-icon {
                font-size: 3rem;
                flex-shrink: 0;
            }

            .hair-cookie-banner-text {
                flex: 1;
            }

            .hair-cookie-banner-text h3 {
                margin: 0 0 0.5rem 0;
                font-size: 1.25rem;
                font-weight: 600;
                color: var(--color-pure-white, #ffffff);
                font-family: var(--font-heading, inherit);
            }

            .hair-cookie-banner-text p {
                margin: 0 0 0.5rem 0;
                font-size: 0.95rem;
                line-height: 1.6;
                color: var(--color-text-gray, #9ca3af);
            }

            .hair-cookie-banner-link {
                margin-top: 0.75rem !important;
            }

            .hair-cookie-banner-link a {
                color: var(--color-nebula-violet, #8b5cf6);
                text-decoration: none;
                font-size: 0.9rem;
            }

            .hair-cookie-banner-link a:hover {
                text-decoration: underline;
            }

            .hair-cookie-banner-buttons {
                display: flex;
                gap: 0.75rem;
                justify-content: flex-end;
                margin-top: 1rem;
                flex-wrap: wrap;
            }

            .hair-cookie-btn {
                padding: 0.75rem 1.5rem;
                border-radius: 8px;
                font-size: 0.95rem;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s ease;
                border: none;
                font-family: inherit;
            }

            .hair-cookie-btn-primary {
                background: linear-gradient(135deg, var(--color-nebula-violet, #8b5cf6), var(--color-galactic-blue, #3b82f6));
                color: white;
            }

            .hair-cookie-btn-primary:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(139, 92, 246, 0.4);
            }

            .hair-cookie-btn-secondary {
                background: rgba(255, 255, 255, 0.1);
                color: var(--color-pure-white, #ffffff);
                border: 1px solid rgba(255, 255, 255, 0.3);
            }

            .hair-cookie-btn-secondary:hover {
                background: rgba(255, 255, 255, 0.2);
            }

            .hair-cookie-btn-outline {
                background: transparent;
                color: var(--color-nebula-violet, #8b5cf6);
                border: 1px solid var(--color-nebula-violet, #8b5cf6);
            }

            .hair-cookie-btn-outline:hover {
                background: rgba(139, 92, 246, 0.1);
            }

            /* Mobile responsive */
            @media (max-width: 768px) {
                .hair-cookie-banner {
                    padding: 1rem;
                }

                .hair-cookie-banner-content {
                    flex-direction: column;
                    gap: 1rem;
                }

                .hair-cookie-banner-icon {
                    font-size: 2rem;
                }

                .hair-cookie-banner-buttons {
                    flex-direction: column;
                    width: 100%;
                }

                .hair-cookie-btn {
                    width: 100%;
                    text-align: center;
                }
            }
        `;

        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }

    // Appliquer le consentement
    function applyConsent(choice) {
        if (choice === 'all') {
            // Activer Google Analytics si configuré
            if (window.CONFIG_API && window.CONFIG_API.GOOGLE_ANALYTICS_ID) {
                loadGoogleAnalytics(window.CONFIG_API.GOOGLE_ANALYTICS_ID);
            }
            console.log('🍪 Tous les cookies sont activés');
        } else {
            // Seul les cookies essentiels sont actifs
            console.log('🚫 Seuls les cookies essentiels sont actifs');
        }
    }

    // Charger Google Analytics
    function loadGoogleAnalytics(trackingId) {
        // Script d'initialisation de Google Analytics 4
        const script = document.createElement('script');
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${trackingId}`;
        document.head.appendChild(script);

        window.dataLayer = window.dataLayer || [];
        function gtag() { dataLayer.push(arguments); }
        gtag('js', new Date());
        gtag('config', trackingId);

        console.log('📊 Google Analytics chargé');
    }

    // Masquer le bandeau
    function hideBanner() {
        const banner = document.getElementById('hair-cookie-banner');
        if (banner) {
            banner.classList.remove('hair-cookie-banner-visible');
            setTimeout(() => {
                banner.remove();
            }, 400);
        }
    }

    // Réinitialiser le consentement (pour testing)
    function resetConsent() {
        localStorage.removeItem(COOKIE_CONSENT_KEY);
        localStorage.removeItem('hair-cookie-consent-expiry');
        console.log('🔄 Consentement réinitialisé');
    }

    // Initialiser quand le DOM est prêt
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createCookieBanner);
    } else {
        // Délai de 1 seconde pour ne pas interrompre la navigation immédiate
        setTimeout(createCookieBanner, 1000);
    }

    // Exposer la fonction de reset pour le debugging (uniquement en dev)
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        window.resetCookieConsent = resetConsent;
    }
})();
