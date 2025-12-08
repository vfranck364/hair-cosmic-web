// ============================================
// HAIR - Click Big Bang Animation
// Particle explosion effect on every click
// ============================================

class BigBangEffect {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.setupCanvas();
        this.setupEventListeners();
        this.animate();
    }

    setupCanvas() {
        this.canvas.id = 'bigbang-canvas';
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.zIndex = '9999';
        document.body.appendChild(this.canvas);

        this.resize();
        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    setupEventListeners() {
        document.addEventListener('click', (e) => {
            this.createBigBang(e.clientX, e.clientY);
        });
    }

    createBigBang(x, y) {
        const particleCount = 50; // Nombre de particules par explosion
        const colors = [
            '#0EA5FF', // Galactic Blue
            '#8B5CF6', // Nebula Violet
            '#6B2EFF', // Deep Violet
            '#7CFE82', // Energy Lime
            '#FFD700', // Spatial Gold
            '#FFFFFF'  // White
        ];

        for (let i = 0; i < particleCount; i++) {
            const angle = (Math.PI * 2 * i) / particleCount;
            const velocity = 2 + Math.random() * 4;
            const color = colors[Math.floor(Math.random() * colors.length)];

            this.particles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * velocity,
                vy: Math.sin(angle) * velocity,
                life: 1,
                decay: 0.01 + Math.random() * 0.02,
                size: 2 + Math.random() * 3,
                color: color,
                glow: 10 + Math.random() * 20
            });
        }

        // Ajouter des particules secondaires pour plus d'effet
        for (let i = 0; i < 20; i++) {
            const angle = Math.random() * Math.PI * 2;
            const velocity = 1 + Math.random() * 2;

            this.particles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * velocity,
                vy: Math.sin(angle) * velocity,
                life: 1,
                decay: 0.02 + Math.random() * 0.03,
                size: 1 + Math.random() * 2,
                color: '#FFFFFF',
                glow: 5 + Math.random() * 10
            });
        }

        // Créer une onde de choc
        this.createShockwave(x, y);
    }

    createShockwave(x, y) {
        this.particles.push({
            x: x,
            y: y,
            radius: 0,
            maxRadius: 100 + Math.random() * 50,
            life: 1,
            decay: 0.05,
            type: 'shockwave',
            color: '#0EA5FF'
        });
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Mettre à jour et dessiner les particules
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];

            if (p.type === 'shockwave') {
                // Animer l'onde de choc
                p.radius += 5;
                p.life -= p.decay;

                if (p.life > 0 && p.radius < p.maxRadius) {
                    this.ctx.beginPath();
                    this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                    this.ctx.strokeStyle = `rgba(14, 165, 255, ${p.life * 0.5})`;
                    this.ctx.lineWidth = 2;
                    this.ctx.shadowBlur = 20;
                    this.ctx.shadowColor = p.color;
                    this.ctx.stroke();
                    this.ctx.shadowBlur = 0;
                } else {
                    this.particles.splice(i, 1);
                }
            } else {
                // Animer les particules normales
                p.x += p.vx;
                p.y += p.vy;
                p.vy += 0.1; // Gravité
                p.life -= p.decay;

                if (p.life > 0) {
                    this.ctx.beginPath();
                    this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                    this.ctx.fillStyle = p.color;
                    this.ctx.shadowBlur = p.glow;
                    this.ctx.shadowColor = p.color;
                    this.ctx.globalAlpha = p.life;
                    this.ctx.fill();
                    this.ctx.globalAlpha = 1;
                    this.ctx.shadowBlur = 0;
                } else {
                    this.particles.splice(i, 1);
                }
            }
        }

        requestAnimationFrame(() => this.animate());
    }
}

// Initialiser l'effet Big Bang quand le DOM est prêt
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new BigBangEffect();
    });
} else {
    new BigBangEffect();
}
