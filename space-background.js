// ============================================
// HAIR - Enhanced Space Background System
// Three.js Multi-Layer Spatial Background with Advanced Mouse Reactivity
// ============================================

class SpaceBackground {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.particles = [];
        this.nebulae = null;
        this.starfield = null;
        this.constellations = null;
        this.mouse = { x: 0, y: 0 };
        this.targetMouse = { x: 0, y: 0 };
        this.time = 0;
        this.sprites = {};
        this.init();
    }

    init() {
        // Check if Three.js is loaded
        if (typeof THREE === 'undefined') {
            console.warn('Three.js not loaded, falling back to CSS background');
            this.createCSSFallback();
            return;
        }

        // Check for reduced motion preference
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            this.createCSSFallback();
            return;
        }

        this.setupScene();
        this.createSprites();
        this.createNebulae();
        this.createStarfield();
        this.createConstellations();
        this.createAmbientParticles();
        this.setupEventListeners();
        this.animate();
    }

    createSprites() {
        // Create star sprite
        const starCanvas = document.createElement('canvas');
        starCanvas.width = 64;
        starCanvas.height = 64;
        const starCtx = starCanvas.getContext('2d');

        // Draw star with glow
        const starGradient = starCtx.createRadialGradient(32, 32, 0, 32, 32, 32);
        starGradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
        starGradient.addColorStop(0.2, 'rgba(255, 255, 255, 0.8)');
        starGradient.addColorStop(0.4, 'rgba(200, 220, 255, 0.4)');
        starGradient.addColorStop(1, 'rgba(100, 150, 255, 0)');
        starCtx.fillStyle = starGradient;
        starCtx.fillRect(0, 0, 64, 64);

        // Add star points
        starCtx.fillStyle = 'rgba(255, 255, 255, 1)';
        starCtx.beginPath();
        for (let i = 0; i < 4; i++) {
            const angle = (i * Math.PI / 2);
            const x = 32 + Math.cos(angle) * 20;
            const y = 32 + Math.sin(angle) * 20;
            if (i === 0) starCtx.moveTo(x, y);
            else starCtx.lineTo(x, y);
        }
        starCtx.closePath();
        starCtx.fill();

        this.sprites.star = new THREE.CanvasTexture(starCanvas);

        // Create galaxy sprite
        const galaxyCanvas = document.createElement('canvas');
        galaxyCanvas.width = 128;
        galaxyCanvas.height = 128;
        const galaxyCtx = galaxyCanvas.getContext('2d');

        // Draw spiral galaxy
        const galaxyGradient = galaxyCtx.createRadialGradient(64, 64, 0, 64, 64, 64);
        galaxyGradient.addColorStop(0, 'rgba(200, 220, 255, 0.9)');
        galaxyGradient.addColorStop(0.3, 'rgba(139, 92, 246, 0.6)');
        galaxyGradient.addColorStop(0.6, 'rgba(14, 165, 255, 0.3)');
        galaxyGradient.addColorStop(1, 'rgba(14, 165, 255, 0)');
        galaxyCtx.fillStyle = galaxyGradient;
        galaxyCtx.fillRect(0, 0, 128, 128);

        // Add spiral arms
        galaxyCtx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        galaxyCtx.lineWidth = 2;
        for (let arm = 0; arm < 3; arm++) {
            galaxyCtx.beginPath();
            for (let i = 0; i < 100; i++) {
                const angle = (arm * Math.PI * 2 / 3) + (i * 0.1);
                const radius = i * 0.5;
                const x = 64 + Math.cos(angle) * radius;
                const y = 64 + Math.sin(angle) * radius;
                if (i === 0) galaxyCtx.moveTo(x, y);
                else galaxyCtx.lineTo(x, y);
            }
            galaxyCtx.stroke();
        }

        this.sprites.galaxy = new THREE.CanvasTexture(galaxyCanvas);

        // Create nebula sprite
        const nebulaCanvas = document.createElement('canvas');
        nebulaCanvas.width = 128;
        nebulaCanvas.height = 128;
        const nebulaCtx = nebulaCanvas.getContext('2d');

        const nebulaGradient = nebulaCtx.createRadialGradient(64, 64, 0, 64, 64, 64);
        nebulaGradient.addColorStop(0, 'rgba(139, 92, 246, 0.4)');
        nebulaGradient.addColorStop(0.5, 'rgba(107, 46, 255, 0.2)');
        nebulaGradient.addColorStop(1, 'rgba(14, 165, 255, 0)');
        nebulaCtx.fillStyle = nebulaGradient;
        nebulaCtx.fillRect(0, 0, 128, 128);

        this.sprites.nebula = new THREE.CanvasTexture(nebulaCanvas);
    }

    setupScene() {
        // Scene
        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.FogExp2(0x081029, 0.0005);

        // Camera
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.z = 5;

        // Renderer
        const canvas = document.getElementById('space-canvas');
        this.renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            alpha: true,
            antialias: true
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    }

    createNebulae() {
        // Layer 1: Nebulae (large, slow-moving diffuse particles)
        const nebulaGeometry = new THREE.BufferGeometry();
        const nebulaCount = 80;
        const positions = new Float32Array(nebulaCount * 3);
        const colors = new Float32Array(nebulaCount * 3);
        const sizes = new Float32Array(nebulaCount);
        const velocities = new Float32Array(nebulaCount * 3);

        const nebulaColors = [
            new THREE.Color(0x0EA5FF), // Galactic Blue
            new THREE.Color(0x8B5CF6), // Nebula Violet
            new THREE.Color(0x6B2EFF), // Deep Violet
            new THREE.Color(0x7CFE82), // Energy Lime (subtle)
        ];

        for (let i = 0; i < nebulaCount; i++) {
            const i3 = i * 3;

            // Position - spread across larger area
            positions[i3] = (Math.random() - 0.5) * 40;
            positions[i3 + 1] = (Math.random() - 0.5) * 40;
            positions[i3 + 2] = (Math.random() - 0.5) * 20 - 10;

            // Color - weighted towards blue/violet
            const colorIndex = Math.random() < 0.7 ?
                Math.floor(Math.random() * 2) : // Blue or Violet
                Math.floor(Math.random() * nebulaColors.length);
            const color = nebulaColors[colorIndex];
            colors[i3] = color.r;
            colors[i3 + 1] = color.g;
            colors[i3 + 2] = color.b;

            // Size - larger for nebula effect
            sizes[i] = Math.random() * 5 + 2;

            // Velocity for floating effect
            velocities[i3] = (Math.random() - 0.5) * 0.002;
            velocities[i3 + 1] = (Math.random() - 0.5) * 0.002;
            velocities[i3 + 2] = (Math.random() - 0.5) * 0.001;
        }

        nebulaGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        nebulaGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        nebulaGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
        nebulaGeometry.userData.velocities = velocities;

        const nebulaMaterial = new THREE.PointsMaterial({
            size: 3,
            vertexColors: true,
            transparent: true,
            opacity: 0.15,
            blending: THREE.AdditiveBlending,
            sizeAttenuation: true,
            depthWrite: false,
            map: this.sprites.nebula
        });

        this.nebulae = new THREE.Points(nebulaGeometry, nebulaMaterial);
        this.scene.add(this.nebulae);
    }

    createStarfield() {
        // Layer 2: Starfield (medium particles with strong parallax)
        const isMobile = window.innerWidth < 768;
        const starCount = isMobile ? 200 : 800;

        const starGeometry = new THREE.BufferGeometry();
        const positions = new Float32Array(starCount * 3);
        const sizes = new Float32Array(starCount);
        const colors = new Float32Array(starCount * 3);

        for (let i = 0; i < starCount; i++) {
            const i3 = i * 3;

            // Position - distributed in 3D space
            positions[i3] = (Math.random() - 0.5) * 50;
            positions[i3 + 1] = (Math.random() - 0.5) * 50;
            positions[i3 + 2] = (Math.random() - 0.5) * 30;

            // Size variation for depth perception
            sizes[i] = Math.random() * 1.5 + 0.5;

            // Slight color variation (white to blue-white)
            const brightness = 0.8 + Math.random() * 0.2;
            colors[i3] = brightness;
            colors[i3 + 1] = brightness;
            colors[i3 + 2] = brightness + Math.random() * 0.1;
        }

        starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        starGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
        starGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const starMaterial = new THREE.PointsMaterial({
            size: 0.15,
            vertexColors: true,
            transparent: true,
            opacity: 0.9,
            sizeAttenuation: true,
            blending: THREE.AdditiveBlending,
            map: this.sprites.star
        });

        this.starfield = new THREE.Points(starGeometry, starMaterial);
        this.scene.add(this.starfield);
    }

    createConstellations() {
        // Layer 3: Constellation accent stars (bright blue points)
        const constellationGeometry = new THREE.BufferGeometry();
        const constellationCount = 30;
        const positions = new Float32Array(constellationCount * 3);
        const sizes = new Float32Array(constellationCount);

        for (let i = 0; i < constellationCount; i++) {
            const i3 = i * 3;
            positions[i3] = (Math.random() - 0.5) * 35;
            positions[i3 + 1] = (Math.random() - 0.5) * 35;
            positions[i3 + 2] = (Math.random() - 0.5) * 15;
            sizes[i] = Math.random() * 0.5 + 0.3;
        }

        constellationGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        constellationGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

        const constellationMaterial = new THREE.PointsMaterial({
            size: 0.4,
            color: 0x0EA5FF,
            transparent: true,
            opacity: 1,
            sizeAttenuation: true,
            blending: THREE.AdditiveBlending,
            map: this.sprites.star
        });

        this.constellations = new THREE.Points(constellationGeometry, constellationMaterial);
        this.scene.add(this.constellations);
    }

    createAmbientParticles() {
        // Additional floating particles for depth
        const particleGeometry = new THREE.BufferGeometry();
        const particleCount = 150;
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);

        const particleColors = [
            new THREE.Color(0x0EA5FF),
            new THREE.Color(0x8B5CF6),
            new THREE.Color(0x7CFE82)
        ];

        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            positions[i3] = (Math.random() - 0.5) * 60;
            positions[i3 + 1] = (Math.random() - 0.5) * 60;
            positions[i3 + 2] = (Math.random() - 0.5) * 40;

            const color = particleColors[Math.floor(Math.random() * particleColors.length)];
            colors[i3] = color.r;
            colors[i3 + 1] = color.g;
            colors[i3 + 2] = color.b;
        }

        particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const particleMaterial = new THREE.PointsMaterial({
            size: 0.08,
            vertexColors: true,
            transparent: true,
            opacity: 0.6,
            blending: THREE.AdditiveBlending,
            sizeAttenuation: true
        });

        const ambientParticles = new THREE.Points(particleGeometry, particleMaterial);
        this.scene.add(ambientParticles);
        this.particles.push(ambientParticles);
    }

    setupEventListeners() {
        // Enhanced mouse movement for strong parallax
        document.addEventListener('mousemove', (e) => {
            this.targetMouse.x = (e.clientX / window.innerWidth) * 2 - 1;
            this.targetMouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
        });

        // Window resize
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });

        // Pause animations when tab is inactive
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pause();
            } else {
                this.resume();
            }
        });
    }

    animate() {
        this.animationId = requestAnimationFrame(() => this.animate());

        this.time += 0.001;

        // Smooth mouse following with easing
        this.mouse.x += (this.targetMouse.x - this.mouse.x) * 0.03;
        this.mouse.y += (this.targetMouse.y - this.mouse.y) * 0.03;

        // Layer 1: Nebulae - ultra slow rotation and floating
        if (this.nebulae) {
            this.nebulae.rotation.x = this.time * 0.03;
            this.nebulae.rotation.y = this.time * 0.02;

            // Subtle mouse influence
            this.nebulae.rotation.z = this.mouse.x * 0.05;

            // Floating effect
            const positions = this.nebulae.geometry.attributes.position.array;
            const velocities = this.nebulae.geometry.userData.velocities;

            for (let i = 0; i < positions.length; i += 3) {
                positions[i] += velocities[i];
                positions[i + 1] += velocities[i + 1];
                positions[i + 2] += velocities[i + 2];

                // Boundary check and bounce
                if (Math.abs(positions[i]) > 20) velocities[i] *= -1;
                if (Math.abs(positions[i + 1]) > 20) velocities[i + 1] *= -1;
                if (Math.abs(positions[i + 2]) > 10) velocities[i + 2] *= -1;
            }
            this.nebulae.geometry.attributes.position.needsUpdate = true;
        }

        // Layer 2: Starfield - strong parallax effect
        if (this.starfield) {
            // Rotation based on mouse position
            this.starfield.rotation.y = this.mouse.x * 0.3;
            this.starfield.rotation.x = this.mouse.y * 0.3;

            // Position shift for parallax
            this.starfield.position.x = this.mouse.x * 2;
            this.starfield.position.y = this.mouse.y * 2;

            // Subtle continuous rotation
            this.starfield.rotation.z = this.time * 0.01;
        }

        // Layer 3: Constellations - medium parallax
        if (this.constellations) {
            this.constellations.rotation.y = this.mouse.x * 0.2;
            this.constellations.rotation.x = this.mouse.y * 0.2;
            this.constellations.position.x = this.mouse.x * 1.5;
            this.constellations.position.y = this.mouse.y * 1.5;

            // Pulsing effect
            const pulseFactor = Math.sin(this.time * 2) * 0.2 + 0.8;
            this.constellations.material.opacity = pulseFactor;
        }

        // Ambient particles - gentle movement
        this.particles.forEach((particleSystem, index) => {
            const speed = (index + 1) * 0.05;
            particleSystem.rotation.y = this.mouse.x * speed;
            particleSystem.rotation.x = this.mouse.y * speed;
            particleSystem.position.x = this.mouse.x * (speed * 0.5);
            particleSystem.position.y = this.mouse.y * (speed * 0.5);
        });

        // Camera movement - follows mouse with depth
        this.camera.position.x = this.mouse.x * 0.5;
        this.camera.position.y = this.mouse.y * 0.5;
        this.camera.position.z = 5 + this.mouse.x * 0.2;
        this.camera.lookAt(this.scene.position);

        this.renderer.render(this.scene, this.camera);
    }

    pause() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }

    resume() {
        this.animate();
    }

    createCSSFallback() {
        // Enhanced CSS fallback with animated gradients
        const canvas = document.getElementById('space-canvas');
        canvas.style.background = `
      radial-gradient(ellipse at 20% 30%, rgba(14, 165, 255, 0.2) 0%, transparent 50%),
      radial-gradient(ellipse at 80% 70%, rgba(139, 92, 246, 0.2) 0%, transparent 50%),
      radial-gradient(ellipse at 50% 50%, rgba(107, 46, 255, 0.15) 0%, transparent 60%),
      radial-gradient(ellipse at 30% 80%, rgba(127, 254, 130, 0.08) 0%, transparent 70%),
      #081029
    `;
        canvas.style.animation = 'nebulaPulse 30s ease-in-out infinite';
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new SpaceBackground();
    });
} else {
    new SpaceBackground();
}
