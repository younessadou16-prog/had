/**
 * cake.js
 * Handles the PNG cake, dynamic candles, and blowing interaction.
 * ENHANCED: Responsive candles with professional animated flames.
 */

class CakeScene {
    constructor() {
        this.container = document.getElementById('candlesContainer');
        this.btn = document.getElementById('blowCandlesBtn');
        this.overlay = document.getElementById('cakeDarkOverlay');
        this.ageTextEl = document.getElementById('dynamicAge');
        this.hasBlown = false;
        this.candleScale = 1;

        this.initAge();
        this.bindEvents();
        this.setupResponsiveScale();
    }

    initAge() {
        const age = Utils.calculateAge('2008-01-05');
        this.ageTextEl.innerText = Utils.getOrdinalSuffix(age);

        // Cap visual candles to max 25 to avoid overcrowding
        const numCandles = Math.min(age, 25);
        this.generateCandles(numCandles);
    }

    /**
     * Returns scale factor based on current cake container width.
     */
    getCakeScale() {
        const cakeContainer = document.querySelector('.realistic-cake-container');
        if (!cakeContainer) return 1;
        const w = cakeContainer.offsetWidth;
        return w / 400; // 400 is the design reference width
    }

    /**
     * Generates candles positioned on top of the cake PNG.
     * Positions are expressed as percentages of the container so they
     * scale automatically with CSS.
     */
    generateCandles(count) {
        if (!this.container) return;
        this.container.innerHTML = '';

        // The cake top surface in the PNG is roughly at 25-35% from the top,
        // centered horizontally. We use percentage-based positioning so the
        // candles scale automatically with the CSS-resized container.
        const centerXPct = 50;     // % from left
        const centerYPct = 28;     // % from top (cake top surface)
        const radiusXPct = 20;     // % horizontal radius of ellipse
        const radiusYPct = 6;      // % vertical radius (foreshortening)

        for (let i = 0; i < count; i++) {
            const angle = (i / count) * Math.PI * 2;
            const jitterX = (Math.random() - 0.5) * 3;
            const jitterY = (Math.random() - 0.5) * 1.5;

            const xPct = centerXPct + Math.cos(angle) * radiusXPct + jitterX;
            const yPct = centerYPct + Math.sin(angle) * radiusYPct + jitterY;

            const wrapper = document.createElement('div');
            wrapper.className = 'candle-wrapper-el';
            wrapper.style.cssText = `
                position: absolute;
                left: ${xPct}%;
                top: ${yPct}%;
                transform: translate(-50%, -100%);
                z-index: ${Math.floor(yPct + 50)};
            `;

            const body = document.createElement('div');
            body.className = 'candle-body';

            const flame = document.createElement('div');
            flame.className = 'flame';

            const glowCast = document.createElement('div');
            glowCast.className = 'candle-glow-cast';

            const smoke = document.createElement('div');
            smoke.className = 'smoke-puff';

            wrapper.appendChild(body);
            wrapper.appendChild(flame);
            wrapper.appendChild(glowCast);
            wrapper.appendChild(smoke);
            this.container.appendChild(wrapper);

            // Stagger animation phase so flames don't all flicker in sync
            const phaseDelay = (Math.random() * 0.15).toFixed(3);
            flame.style.animationDelay = `-${phaseDelay}s`;
        }

        this.scaleCandles();
    }

    /**
     * Adjusts candle body height + flame size to match current cake size.
     */
    scaleCandles() {
        const scale = this.getCakeScale();
        const bodies = this.container.querySelectorAll('.candle-body');
        const flames = this.container.querySelectorAll('.flame');
        const glows  = this.container.querySelectorAll('.candle-glow-cast');

        const baseHeight = 38 * scale;
        const baseWidth  = 7 * scale;
        const flameH     = 16 * scale;
        const flameW     = 10 * scale;

        bodies.forEach(b => {
            b.style.width  = `${Math.max(4, baseWidth)}px`;
            b.style.height = `${Math.max(22, baseHeight)}px`;
        });
        flames.forEach(f => {
            f.style.width  = `${Math.max(6, flameW)}px`;
            f.style.height = `${Math.max(10, flameH)}px`;
        });
        glows.forEach(g => {
            g.style.width  = `${Math.max(14, 20 * scale)}px`;
        });
    }

    setupResponsiveScale() {
        const ro = new ResizeObserver(() => {
            this.scaleCandles();
        });
        const cakeContainer = document.querySelector('.realistic-cake-container');
        if (cakeContainer) ro.observe(cakeContainer);
        window.addEventListener('resize', () => this.scaleCandles());
    }

    bindEvents() {
        if (this.btn) {
            this.btn.addEventListener('click', () => this.blowCandles());
            // Touch support
            this.btn.addEventListener('touchend', (e) => {
                e.preventDefault();
                this.blowCandles();
            });
        }
    }

    blowCandles() {
        if (this.hasBlown) return;
        this.hasBlown = true;

        const flames = document.querySelectorAll('.flame');
        const totalTime = 1000 + (flames.length * 90);

        // 1. Lean flames (wind effect)
        flames.forEach(flame => {
            flame.style.animationPlayState = 'paused';
            flame.style.transform = 'translateX(-50%) skewX(20deg) scaleY(0.6)';
            flame.style.transition = 'transform 0.3s ease';
        });

        // 2. Darken room
        if (this.overlay) {
            this.overlay.style.backgroundColor = 'rgba(0,0,0,0.75)';
        }

        // 3. Pause music
        window.dispatchEvent(new Event('pauseMusicEvent'));

        // 4. Extinguish one by one with smoke
        flames.forEach((flame, index) => {
            setTimeout(() => {
                flame.classList.add('extinguished');
                flame.style.transform = '';
                flame.style.transition = '';
            }, 800 + (index * 90));
        });

        // 5. Lights on + fireworks
        setTimeout(() => {
            if (this.overlay) this.overlay.style.backgroundColor = 'rgba(0,0,0,0)';
            if (this.btn) this.btn.innerHTML = '<span class="btn-text">Happy Birthday! 🎉</span>';
            window.dispatchEvent(new Event('startFireworksEvent'));
            window.dispatchEvent(new Event('resumeMusicEvent'));
        }, totalTime + 1400);
    }
}

window.CakeScene = CakeScene;
