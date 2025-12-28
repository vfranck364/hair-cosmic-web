// ============================================
// HAIR - Animations & Interactions
// GSAP ScrollTrigger & Micro-interactions
// ============================================

class HairAnimations {
    constructor() {
        this.init();
    }

    init() {
        // Wait for GSAP and ScrollTrigger to load
        if (typeof gsap === 'undefined') {
            console.warn('GSAP not loaded, skipping advanced animations');
            this.initBasicAnimations();
            return;
        }

        this.initScrollAnimations();
        this.initHeroAnimations();
        this.initMicroInteractions();
        this.initHeaderScroll();
        this.initMobileMenu();
    }

    initBasicAnimations() {
        // Fallback animations without GSAP
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        document.querySelectorAll('.service-card, .case-card, .timeline-planet').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'all 0.6s ease';
            observer.observe(el);
        });
    }

    initScrollAnimations() {
        // Register ScrollTrigger plugin
        gsap.registerPlugin(ScrollTrigger);

        // Service cards reveal
        gsap.utils.toArray('.service-card').forEach((card, index) => {
            gsap.from(card, {
                scrollTrigger: {
                    trigger: card,
                    start: 'top 80%',
                    end: 'top 50%',
                    toggleActions: 'play none none reverse'
                },
                opacity: 0,
                y: 50,
                duration: 0.8,
                delay: index * 0.1,
                ease: 'power3.out'
            });
        });

        // Case studies scan line effect
        gsap.utils.toArray('.case-card').forEach((card, index) => {
            gsap.from(card, {
                scrollTrigger: {
                    trigger: card,
                    start: 'top 80%',
                    toggleActions: 'play none none reverse'
                },
                opacity: 0,
                x: index % 2 === 0 ? -50 : 50,
                duration: 1,
                ease: 'power2.out'
            });
        });

        // Timeline planets
        gsap.utils.toArray('.timeline-planet').forEach((planet, index) => {
            gsap.from(planet, {
                scrollTrigger: {
                    trigger: planet,
                    start: 'top 80%',
                    toggleActions: 'play none none reverse'
                },
                scale: 0,
                rotation: 360,
                duration: 1,
                delay: index * 0.15,
                ease: 'back.out(1.7)'
            });
        });

        // Section titles
        gsap.utils.toArray('section h2').forEach(title => {
            gsap.from(title, {
                scrollTrigger: {
                    trigger: title,
                    start: 'top 85%',
                    toggleActions: 'play none none reverse'
                },
                opacity: 0,
                y: 30,
                duration: 0.8,
                ease: 'power2.out'
            });
        });

        // Parallax effect for sections
        gsap.utils.toArray('section').forEach(section => {
            gsap.to(section, {
                scrollTrigger: {
                    trigger: section,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: 1
                },
                y: (i, target) => -50,
                ease: 'none'
            });
        });
    }

    initHeroAnimations() {
        // Hero title letter-by-letter reveal
        const heroTitle = document.querySelector('.hero-title');
        if (heroTitle && typeof gsap !== 'undefined') {
            const text = heroTitle.textContent.trim();
            heroTitle.innerHTML = text.split(' ').map(word => {
                return `<span class="word" style="display: inline-block; white-space: nowrap;">${word.split('').map(char => `<span class="letter" style="display: inline-block; opacity: 0;">${char}</span>`).join('')
                    }</span>`;
            }).join(' ');

            gsap.to('.letter', {
                opacity: 1,
                duration: 0.05,
                stagger: 0.03,
                ease: 'power1.inOut',
                delay: 0.3
            });
        }

        // CTA pulse animation
        const ctaPrimary = document.querySelectorAll('.btn-primary');
        ctaPrimary.forEach(btn => {
            if (typeof gsap !== 'undefined') {
                gsap.to(btn, {
                    boxShadow: '0 0 60px rgba(14, 165, 255, 0.8)',
                    duration: 1.5,
                    repeat: -1,
                    yoyo: true,
                    ease: 'sine.inOut'
                });
            }
        });
    }

    initMicroInteractions() {
        // Service card hover effects
        document.querySelectorAll('.service-card').forEach(card => {
            card.addEventListener('mouseenter', (e) => {
                if (typeof gsap !== 'undefined') {
                    gsap.to(card, {
                        scale: 1.05,
                        duration: 0.3,
                        ease: 'power2.out'
                    });
                }
            });

            card.addEventListener('mouseleave', (e) => {
                if (typeof gsap !== 'undefined') {
                    gsap.to(card, {
                        scale: 1,
                        duration: 0.3,
                        ease: 'power2.out'
                    });
                }
            });
        });

        // Timeline planet click animation
        document.querySelectorAll('.timeline-planet').forEach(planet => {
            planet.addEventListener('click', (e) => {
                if (typeof gsap !== 'undefined') {
                    gsap.timeline()
                        .to(planet, {
                            scale: 1.3,
                            rotation: '+=360',
                            duration: 0.5,
                            ease: 'back.out(2)'
                        })
                        .to(planet, {
                            scale: 1,
                            duration: 0.3,
                            ease: 'power2.inOut'
                        });
                }
            });
        });

        // Portrait parallax effect
        const portraitWrapper = document.querySelector('.portrait-wrapper');
        if (portraitWrapper) {
            portraitWrapper.addEventListener('mousemove', (e) => {
                const rect = portraitWrapper.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width - 0.5;
                const y = (e.clientY - rect.top) / rect.height - 0.5;

                const portraitImage = portraitWrapper.querySelector('.portrait-image');
                if (portraitImage && typeof gsap !== 'undefined') {
                    gsap.to(portraitImage, {
                        rotateY: x * 20,
                        rotateX: -y * 20,
                        duration: 0.5,
                        ease: 'power2.out'
                    });
                }
            });

            portraitWrapper.addEventListener('mouseleave', () => {
                const portraitImage = portraitWrapper.querySelector('.portrait-image');
                if (portraitImage && typeof gsap !== 'undefined') {
                    gsap.to(portraitImage, {
                        rotateY: 0,
                        rotateX: 0,
                        duration: 0.5,
                        ease: 'power2.out'
                    });
                }
            });
        }

        // Button ripple effect
        document.querySelectorAll('.btn').forEach(btn => {
            btn.addEventListener('click', function (e) {
                const ripple = document.createElement('span');
                const rect = this.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;

                ripple.style.width = ripple.style.height = size + 'px';
                ripple.style.left = x + 'px';
                ripple.style.top = y + 'px';
                ripple.classList.add('ripple');

                this.appendChild(ripple);

                setTimeout(() => ripple.remove(), 600);
            });
        });
    }

    initHeaderScroll() {
        const header = document.querySelector('header');
        let lastScroll = 0;

        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;

            if (currentScroll > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }

            lastScroll = currentScroll;
        });
    }

    initMobileMenu() {
        const menuBtn = document.querySelector('.mobile-menu-btn');
        const navMenu = document.querySelector('.nav-menu');
        const backBtn = document.querySelector('.btn-back');
        const navLinks = document.querySelectorAll('.nav-menu a');

        if (!menuBtn || !navMenu) return;

        const closeMenu = () => {
            navMenu.classList.remove('active');
            menuBtn.classList.remove('active');
            document.body.style.overflow = '';
        };

        menuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            navMenu.classList.toggle('active');
            menuBtn.classList.toggle('active');

            if (navMenu.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });

        if (backBtn) {
            backBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                closeMenu();
            });
        }

        // Close when clicking outside
        document.addEventListener('click', (e) => {
            if (navMenu.classList.contains('active') &&
                !navMenu.contains(e.target) &&
                !menuBtn.contains(e.target)) {
                closeMenu();
            }
        });

        // Close menu when a link is clicked
        navLinks.forEach(link => {
            link.addEventListener('click', closeMenu);
        });
    }
}

// Smooth scroll for navigation links
document.addEventListener('DOMContentLoaded', () => {
    // Initialize animations
    new HairAnimations();

    // Smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});
