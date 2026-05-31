// Premium Procedural Canvas Sprite Generator for React Mountain Dash

class AssetGenerator {
    constructor() {
        this.sprites = {};
        this.images = {};
        this.generateAssets();
        this.loadImages();
    }

    loadImages() {
        const bg1 = new Image();
        bg1.src = '/images/custom_bg.png'; // User's uploaded image
        this.images.distantMountains = bg1;

        const bg2 = new Image();
        bg2.src = '/images/bg_midground_forest.png';
        this.images.midgroundForest = bg2;
    }

    generateAssets() {
        this.sprites.tiles = {
            grass: this.createTileSprite('grass'),
            forest: this.createTileSprite('forest'),
            cave: this.createTileSprite('cave'),
            temple: this.createTileSprite('temple'),
            snow: this.createTileSprite('snow'),
            ice: this.createTileSprite('ice'),
            spirit: this.createTileSprite('spirit'),
            dark: this.createTileSprite('dark'),
            spikes: this.createSpikesSprite(),
            bridge: this.createBridgeSprite(),
            flag: this.createFlagSprite()
        };

        this.sprites.items = {
            coin: this.createCoinSprite(),
            yak_milk: this.createItemSprite('🥛', '#ffffff'),
            sel_roti: this.createSelRotiSprite(),
            apple: this.createItemSprite('🍎', '#ef4444'),
            herbs: this.createItemSprite('🌿', '#10b981'),
            khukuri: this.createKhukuriPowerupSprite(),
            feather: this.createItemSprite('🪶', '#fbbf24'),
            blessing: this.createItemSprite('🪷', '#60a5fa'),
            strength: this.createItemSprite('🐂', '#b45309'),
            snow_spirit: this.createItemSprite('❄️', '#93c5fd')
        };

        this.sprites.player = this.createPlayerSprites();

        this.sprites.enemies = {
            monkey: this.createMonkeySprite(false),
            yak: this.createYakSprite(false),
            fox: this.createFoxSprite(),
            rock_spirit: this.createRockSpiritSprite(),
            bat: this.createBatSprite(),
            monk: this.createShadowMonkSprite(),
            demon: this.createSnowDemonSprite(),
            boss_monkey: this.createMonkeySprite(true),
            boss_yak: this.createYakSprite(true),
            boss_yeti: this.createYetiSprite()
        };
        
        this.sprites.particles = {
            snow: this.createParticle('snow'),
            spark: this.createParticle('spark'),
            leaf: this.createParticle('leaf')
        };
    }

    createCanvas(w, h) {
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        return { canvas, ctx };
    }

    createParticle(type) {
        const { canvas, ctx } = this.createCanvas(12, 12);
        if (type === 'snow') {
            const g = ctx.createRadialGradient(6, 6, 0, 6, 6, 6);
            g.addColorStop(0, 'rgba(255,255,255,1)');
            g.addColorStop(1, 'rgba(255,255,255,0)');
            ctx.fillStyle = g;
            ctx.beginPath(); ctx.arc(6, 6, 6, 0, Math.PI * 2); ctx.fill();
        } else if (type === 'spark') {
            const g = ctx.createRadialGradient(6, 6, 0, 6, 6, 6);
            g.addColorStop(0, 'rgba(251,191,36,1)');
            g.addColorStop(0.5, 'rgba(245,158,11,0.5)');
            g.addColorStop(1, 'rgba(245,158,11,0)');
            ctx.fillStyle = g;
            ctx.beginPath(); ctx.arc(6, 6, 6, 0, Math.PI * 2); ctx.fill();
        } else if (type === 'leaf') {
            ctx.fillStyle = '#10b981';
            ctx.beginPath();
            ctx.moveTo(6, 0); ctx.quadraticCurveTo(12, 6, 6, 12); ctx.quadraticCurveTo(0, 6, 6, 0);
            ctx.fill();
        }
        return canvas;
    }

    // PREMIUM TILE GENERATION WITH TEXTURES
    createTileSprite(type) {
        const { canvas, ctx } = this.createCanvas(40, 40);
        const grad = ctx.createLinearGradient(0, 0, 0, 40);

        if (type === 'grass') {
            // High-fidelity emerald & forest moss transition
            grad.addColorStop(0, '#10b981'); // Bright top grass
            grad.addColorStop(0.25, '#059669'); // Vibrant green
            grad.addColorStop(0.8, '#065f46'); // Earth green
            grad.addColorStop(1, '#022c22'); // Rich deep soil
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, 40, 40);
            
            // Styled detailed grass tufts on top (anti-aliased curves)
            ctx.fillStyle = '#34d399';
            for (let i = 0; i < 8; i++) {
                const gx = i * 5 + 2;
                ctx.beginPath();
                ctx.moveTo(gx, 0);
                ctx.quadraticCurveTo(gx + 2, 8, gx + 3 + Math.random()*2, 0);
                ctx.fill();
            }
            // Small rhododendron flowers (multi-layered red/yellow details)
            ctx.fillStyle = '#f43f5e';
            ctx.beginPath();
            ctx.arc(8, 3, 2.5, 0, Math.PI * 2);
            ctx.arc(28, 4, 2.5, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#fbbf24'; // Yellow center
            ctx.beginPath();
            ctx.arc(8, 3, 0.9, 0, Math.PI * 2);
            ctx.arc(28, 4, 0.9, 0, Math.PI * 2);
            ctx.fill();
            
            // Bottom dirt particles/stones
            ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
            ctx.fillRect(5, 25, 3, 3);
            ctx.fillRect(22, 18, 2, 2);
            ctx.fillRect(30, 32, 4, 3);
        } else if (type === 'forest') {
            // Bark wood grain styling
            grad.addColorStop(0, '#854d0e'); // Golden oak bark
            grad.addColorStop(0.5, '#451a03'); // Rich bark shadows
            grad.addColorStop(1, '#1e1b4b'); // Deep roots
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, 40, 40);
            
            // Mossy overlay
            const mossGrad = ctx.createLinearGradient(0, 0, 0, 8);
            mossGrad.addColorStop(0, '#10b981');
            mossGrad.addColorStop(1, 'rgba(16, 185, 129, 0)');
            ctx.fillStyle = mossGrad;
            ctx.fillRect(0, 0, 40, 8);

            // Detailed wood fiber waves
            ctx.strokeStyle = '#a16207';
            ctx.lineWidth = 1.8;
            ctx.beginPath();
            for (let i = 0; i < 4; i++) {
                ctx.moveTo(i * 10 + 2, 0);
                ctx.bezierCurveTo(i * 10 + 7, 12, i * 10 - 3, 28, i * 10 + 4, 40);
            }
            ctx.stroke();
            
            // Natural knothole
            ctx.fillStyle = 'rgba(0,0,0,0.3)';
            ctx.beginPath(); ctx.ellipse(20, 22, 5, 7, 0.05, 0, Math.PI * 2); ctx.fill();
            ctx.strokeStyle = '#854d0e';
            ctx.lineWidth = 1;
            ctx.beginPath(); ctx.ellipse(20, 22, 7, 10, 0.05, 0, Math.PI * 2); ctx.stroke();
        } else if (type === 'cave') {
            // Rough chiseled slate/basalt stone
            grad.addColorStop(0, '#475569'); // Light slate
            grad.addColorStop(0.6, '#334155'); // Shadow slate
            grad.addColorStop(1, '#0f172a'); // Abyssal black
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, 40, 40);
            
            // Crack lines and rock faces
            ctx.strokeStyle = '#64748b';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(0, 10); ctx.lineTo(12, 12); ctx.lineTo(20, 0);
            ctx.moveTo(20, 0); ctx.lineTo(28, 22); ctx.lineTo(40, 15);
            ctx.moveTo(0, 25); ctx.lineTo(18, 30); ctx.lineTo(40, 24);
            ctx.stroke();
            
            // Glowing blue crystal shards
            ctx.save();
            ctx.shadowColor = '#38bdf8';
            ctx.shadowBlur = 8;
            ctx.fillStyle = '#bae6fd';
            ctx.beginPath();
            ctx.moveTo(8, 14); ctx.lineTo(13, 5); ctx.lineTo(15, 15);
            ctx.moveTo(27, 28); ctx.lineTo(31, 20); ctx.lineTo(33, 29);
            ctx.closePath();
            ctx.fill();
            ctx.restore();
        } else if (type === 'temple') {
            // Terracotta temple bricks
            grad.addColorStop(0, '#9a3412'); // Rich rust red
            grad.addColorStop(1, '#431407'); // Deep shadow
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, 40, 40);
            
            // Bevel highlights
            ctx.strokeStyle = '#c2410c';
            ctx.lineWidth = 1;
            ctx.strokeRect(1, 1, 38, 38);
            
            // Mortar lines
            ctx.strokeStyle = 'rgba(15, 23, 42, 0.6)';
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            ctx.moveTo(0, 20); ctx.lineTo(40, 20);
            ctx.moveTo(20, 0); ctx.lineTo(20, 20);
            ctx.moveTo(10, 20); ctx.lineTo(10, 40);
            ctx.moveTo(30, 20); ctx.lineTo(30, 40);
            ctx.stroke();
            
            // Golden mystic mandala emblem detail
            ctx.save();
            ctx.shadowColor = '#fbbf24';
            ctx.shadowBlur = 6;
            ctx.strokeStyle = '#fbbf24';
            ctx.lineWidth = 1.2;
            ctx.beginPath();
            ctx.arc(20, 10, 4, 0, Math.PI * 2);
            ctx.stroke();
            // Emblem rays
            for (let a = 0; a < 8; a++) {
                const angle = (a * Math.PI) / 4;
                ctx.beginPath();
                ctx.moveTo(20 + Math.cos(angle) * 4, 10 + Math.sin(angle) * 4);
                ctx.lineTo(20 + Math.cos(angle) * 7, 10 + Math.sin(angle) * 7);
                ctx.stroke();
            }
            ctx.restore();
        } else if (type === 'snow') {
            // Crisp layered alpine snow
            grad.addColorStop(0, '#f8fafc'); // Glistening white
            grad.addColorStop(0.3, '#e2e8f0'); // Midground snow shadows
            grad.addColorStop(1, '#94a3b8'); // Crevasse blue-grey
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, 40, 40);
            
            // Glistening icicles hanging from the bottom of snow block
            ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
            ctx.beginPath();
            ctx.moveTo(3, 40); ctx.lineTo(8, 40); ctx.lineTo(5, 34);
            ctx.moveTo(18, 40); ctx.lineTo(24, 40); ctx.lineTo(21, 31);
            ctx.moveTo(32, 40); ctx.lineTo(37, 40); ctx.lineTo(34, 35);
            ctx.fill();

            // Crystalline glint details
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(8, 8, 2, 2);
            ctx.fillRect(26, 14, 2, 2);
        } else if (type === 'ice') {
            // Highly polished glacial ice block
            grad.addColorStop(0, '#bae6fd'); // Glistening light blue
            grad.addColorStop(0.5, '#38bdf8'); // Translucent cyan
            grad.addColorStop(1, '#0284c7'); // Deep glacial blue
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, 40, 40);
            
            // Shimmer/shine vectors on ice top-left corner
            ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
            ctx.beginPath();
            ctx.moveTo(0, 0); ctx.lineTo(20, 0); ctx.lineTo(0, 20);
            ctx.closePath(); ctx.fill();
            
            // Internal geometric fractures
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.55)';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(4, 36); ctx.lineTo(36, 4);
            ctx.moveTo(10, 25); ctx.lineTo(25, 35);
            ctx.moveTo(24, 10); ctx.lineTo(35, 22);
            ctx.stroke();
        } else if (type === 'spirit') {
            // Ethereal floating relic stone
            grad.addColorStop(0, '#c084fc'); // Pulsing violet
            grad.addColorStop(0.5, '#7c3aed'); // Purple
            grad.addColorStop(1, '#2e1065'); // Deep night purple
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, 40, 40);
            
            // Magical glowing perimeter line
            ctx.strokeStyle = '#d8b4fe';
            ctx.lineWidth = 1.2;
            ctx.strokeRect(2, 2, 36, 36);
            
            // Sacred Sanskrit/Tibetan script motif
            ctx.save();
            ctx.shadowColor = '#e9d5ff';
            ctx.shadowBlur = 10;
            ctx.fillStyle = '#f3e8ff';
            ctx.font = 'bold 12px "Outfit", system-ui';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('ॐ', 20, 20); // Om symbol
            ctx.restore();
        } else if (type === 'dark') {
            // Hardened volcanic obsidian
            grad.addColorStop(0, '#18181b'); // Coal grey
            grad.addColorStop(0.8, '#09090b'); // Shadow obsidian
            grad.addColorStop(1, '#020202');
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, 40, 40);
            
            // Bright glowing crimson magma fissures
            ctx.save();
            ctx.shadowColor = '#ef4444';
            ctx.shadowBlur = 12;
            ctx.strokeStyle = '#f43f5e';
            ctx.lineWidth = 2.0;
            ctx.beginPath();
            ctx.moveTo(0, 15); ctx.lineTo(12, 25); ctx.lineTo(22, 10); ctx.lineTo(40, 22);
            ctx.moveTo(12, 25); ctx.lineTo(18, 40);
            ctx.stroke();
            ctx.restore();
        }
        return canvas;
    }

    createSpikesSprite() {
        const { canvas, ctx } = this.createCanvas(40, 40);
        // Slate stalagmite spike gradients
        const grad = ctx.createLinearGradient(0, 0, 0, 40);
        grad.addColorStop(0, '#f1f5f9'); // Tip light
        grad.addColorStop(0.5, '#64748b'); // Steel body
        grad.addColorStop(1, '#1e293b'); // Dark rock base
        ctx.fillStyle = grad;
        
        ctx.beginPath();
        for (let i = 0; i < 3; i++) {
            const bx = i * 13.3;
            ctx.moveTo(bx, 40);
            ctx.quadraticCurveTo(bx + 6.6, 20, bx + 6.6, 2); // Elegant chiseled curves
            ctx.quadraticCurveTo(bx + 6.6, 20, bx + 13.3, 40);
        }
        ctx.closePath();
        ctx.fill();
        
        // Specular reflections/highlights
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (let i = 0; i < 3; i++) {
            ctx.moveTo(i * 13.3 + 6.6, 2);
            ctx.lineTo(i * 13.3 + 2, 35);
        }
        ctx.stroke();
        return canvas;
    }

    createBridgeSprite() {
        // Detailed suspension bridge (running ramp) plank
        const { canvas, ctx } = this.createCanvas(40, 15);
        
        // Steel chain/rope backing
        ctx.strokeStyle = '#475569';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(0, 7); ctx.lineTo(40, 7);
        ctx.stroke();
        
        // Main support rope
        ctx.strokeStyle = '#78350f';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, 9); ctx.bezierCurveTo(10, 12, 30, 12, 40, 9);
        ctx.stroke();

        // Planks (with wood grain and metal bolts)
        const planks = [2, 15, 28];
        planks.forEach(px => {
            // Base plank
            const plankGrad = ctx.createLinearGradient(px, 0, px + 10, 0);
            plankGrad.addColorStop(0, '#d97706'); // Warm amber
            plankGrad.addColorStop(0.5, '#b45309'); // Core oak
            plankGrad.addColorStop(1, '#78350f'); // Shadow edge
            ctx.fillStyle = plankGrad;
            ctx.fillRect(px, 0, 10, 15);
            
            // Plank details (horizontal wood cuts)
            ctx.fillStyle = '#451a03';
            ctx.fillRect(px, 4, 10, 1.2);
            ctx.fillRect(px, 10, 10, 1.2);

            // Metal bolts/rivets holding plank to rope
            ctx.fillStyle = '#94a3b8';
            ctx.beginPath();
            ctx.arc(px + 2, 7, 1.2, 0, Math.PI * 2);
            ctx.arc(px + 8, 7, 1.2, 0, Math.PI * 2);
            ctx.fill();
        });
        
        return canvas;
    }

    createFlagSprite() {
        const { canvas, ctx } = this.createCanvas(40, 80);
        // Wooden Pole with wood grain styling
        const poleGrad = ctx.createLinearGradient(17, 0, 21, 0);
        poleGrad.addColorStop(0, '#b45309');
        poleGrad.addColorStop(0.5, '#78350f');
        poleGrad.addColorStop(1, '#451a03');
        ctx.fillStyle = poleGrad;
        ctx.fillRect(17, 0, 4, 80);
        
        // Golden pole ornament at the top
        ctx.fillStyle = '#fbbf24';
        ctx.beginPath(); ctx.arc(19, 3, 3, 0, Math.PI * 2); ctx.fill();
        
        // Multi-colored Tibetan prayer flags (wind-blown curves)
        const colors = ['#3b82f6', '#f8fafc', '#ef4444', '#22c55e', '#eab308']; // Blue, White, Red, Green, Yellow
        for (let i = 0; i < 5; i++) {
            ctx.fillStyle = colors[i];
            ctx.beginPath();
            ctx.moveTo(21, 6 + i * 14);
            ctx.quadraticCurveTo(34, 10 + i * 14, 38, 10 + i * 14); // Flapping outline
            ctx.quadraticCurveTo(32, 17 + i * 14, 21, 19 + i * 14);
            ctx.closePath();
            ctx.fill();
            
            // Flag shadow crease
            ctx.fillStyle = 'rgba(0, 0, 0, 0.12)';
            ctx.beginPath();
            ctx.moveTo(21, 6 + i * 14);
            ctx.quadraticCurveTo(28, 11 + i * 14, 21, 19 + i * 14);
            ctx.fill();
        }
        return canvas;
    }

    createCoinSprite() {
        const { canvas, ctx } = this.createCanvas(30, 30);
        
        // Outer glow
        ctx.shadowColor = '#eab308';
        ctx.shadowBlur = 6;
        
        // 3D coin edge
        ctx.fillStyle = '#b45309';
        ctx.beginPath(); ctx.arc(15, 16, 12, 0, Math.PI * 2); ctx.fill();
        
        // Main face gradient
        const grad = ctx.createRadialGradient(14, 12, 2, 15, 15, 11);
        grad.addColorStop(0, '#fef08a'); // Soft bright yellow
        grad.addColorStop(0.5, '#f59e0b'); // Warm amber gold
        grad.addColorStop(1, '#d97706'); // Deep gold
        ctx.fillStyle = grad;
        ctx.beginPath(); ctx.arc(15, 15, 11, 0, Math.PI * 2); ctx.fill();
        
        // Inner rim highlight
        ctx.strokeStyle = '#fef08a';
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.arc(15, 15, 8.5, 0, Math.PI * 2); ctx.stroke();
        
        // Currency symbol (Cinzel/Traditional serif style)
        ctx.shadowBlur = 0;
        ctx.fillStyle = '#78350f';
        ctx.font = 'bold 15px "Cinzel", Georgia, serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('$', 15, 15);

        // Specular shine glint
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.moveTo(8, 9); ctx.lineTo(12, 9); ctx.lineTo(9, 12); ctx.closePath(); ctx.fill();
        
        return canvas;
    }

    createSelRotiSprite() {
        // Traditional Nepali sweet ring-shaped bread
        const { canvas, ctx } = this.createCanvas(30, 30);
        
        // Shadow base
        ctx.shadowColor = 'rgba(67, 20, 7, 0.4)';
        ctx.shadowBlur = 5;
        ctx.shadowOffsetY = 2.5;

        // Crispy golden brown base
        ctx.fillStyle = '#b45309';
        ctx.beginPath();
        ctx.arc(15, 15, 12, 0, Math.PI * 2);
        ctx.arc(15, 15, 4.5, 0, Math.PI * 2, true); // Donut-like cutout
        ctx.fill();

        // Fluffy inner texture highlights
        ctx.shadowColor = 'transparent';
        const rotiGrad = ctx.createRadialGradient(15, 15, 5, 15, 15, 11);
        rotiGrad.addColorStop(0, '#f59e0b');
        rotiGrad.addColorStop(0.5, '#d97706');
        rotiGrad.addColorStop(1, '#9a3412');
        ctx.fillStyle = rotiGrad;
        ctx.beginPath();
        ctx.arc(15, 15, 11, 0, Math.PI * 2);
        ctx.arc(15, 15, 5.5, 0, Math.PI * 2, true);
        ctx.fill();

        // Sesame seeds and crispy bubbles texture
        ctx.fillStyle = '#fef08a';
        for (let i = 0; i < 12; i++) {
            const angle = (i * Math.PI) / 6 + Math.random() * 0.2;
            const dist = 8 + Math.random() * 1.5;
            const rx = 15 + Math.cos(angle) * dist;
            const ry = 15 + Math.sin(angle) * dist;
            ctx.fillRect(rx, ry, 1.5, 1.5);
        }
        return canvas;
    }

    createItemSprite(emoji, color) {
        const { canvas, ctx } = this.createCanvas(36, 36);
        
        // Ethereal ambient radial glow ring
        ctx.shadowColor = color;
        ctx.shadowBlur = 10;
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.arc(18, 18, 15, 0, Math.PI * 2); ctx.stroke();
        
        const grad = ctx.createRadialGradient(18, 18, 2, 18, 18, 15);
        grad.addColorStop(0, color + '55'); // Soft glow center
        grad.addColorStop(0.7, color + '15');
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.beginPath(); ctx.arc(18, 18, 14, 0, Math.PI * 2); ctx.fill();
        
        // Sparkle points on the boundary
        ctx.shadowBlur = 0;
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(17, 1, 2, 2);
        ctx.fillRect(17, 33, 2, 2);
        ctx.fillRect(1, 17, 2, 2);
        ctx.fillRect(33, 17, 2, 2);
        
        // Centered Emoji Vector representation
        ctx.font = '20px "Outfit", "Segoe UI Emoji", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(emoji, 18, 19.5);
        return canvas;
    }

    createKhukuriPowerupSprite() {
        const { canvas, ctx } = this.createCanvas(40, 40);
        
        // Magical energy aura glow
        ctx.shadowColor = '#0ea5e9';
        ctx.shadowBlur = 8;
        
        // Steel curved blade
        const bladeGrad = ctx.createLinearGradient(10, 30, 26, 12);
        bladeGrad.addColorStop(0, '#f8fafc');
        bladeGrad.addColorStop(0.5, '#94a3b8');
        bladeGrad.addColorStop(1, '#475569');
        ctx.fillStyle = bladeGrad;
        
        ctx.beginPath();
        ctx.moveTo(10, 30);
        ctx.quadraticCurveTo(22, 18, 16, 8);
        ctx.quadraticCurveTo(28, 12, 28, 28);
        ctx.closePath();
        ctx.fill();

        // Sharp edge highlight
        ctx.shadowBlur = 0;
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(10, 30);
        ctx.quadraticCurveTo(22, 18, 16, 8);
        ctx.stroke();
        
        // Detailed handle (traditional wood with gold spacers)
        ctx.strokeStyle = '#451a03'; // Wooden hilt
        ctx.lineWidth = 5.5;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(10, 30);
        ctx.lineTo(4, 36);
        ctx.stroke();

        // Gold collar spacer
        ctx.fillStyle = '#fbbf24';
        ctx.beginPath();
        ctx.arc(8, 32, 2.5, 0, Math.PI * 2);
        ctx.fill();
        return canvas;
    }

    // PREMIUM PLAYER GENERATION (Arjun)
    createPlayerSprites() {
        const animations = {};
        const states = ['idle', 'walk1', 'walk2', 'run1', 'run2', 'jump', 'double_jump', 'hurt', 'victory', 'attack', 'slide'];
        
        states.forEach(state => {
            animations[state] = {
                right: this.drawArjun(state, false),
                left: this.drawArjun(state, true)
            };
        });

        return animations;
    }

    drawArjun(state, flip) {
        const { canvas, ctx } = this.createCanvas(48, 64);
        
        ctx.save();
        if (flip) {
            ctx.translate(48, 0);
            ctx.scale(-1, 1);
        }

        let bodyY = 27;
        let headY = 15;
        let lLegAngle = 0;
        let rLegAngle = 0;
        let lArmAngle = 0;
        let rArmAngle = 0;
        let isAttacking = state === 'attack';
        let isSliding = state === 'slide';
        let isJumping = state === 'jump' || state === 'double_jump';

        // Animation Kinematics (advanced angles and offsets)
        if (state.startsWith('walk')) {
            const step = state === 'walk1' ? 1 : -1;
            lLegAngle = 0.5 * step;
            rLegAngle = -0.5 * step;
            lArmAngle = -0.45 * step;
            rArmAngle = 0.45 * step;
            bodyY += Math.abs(step) * 1.5; 
        } else if (state.startsWith('run')) {
            const step = state === 'run1' ? 1 : -1;
            lLegAngle = 0.85 * step;
            rLegAngle = -0.85 * step;
            lArmAngle = -1.1 * step;
            rArmAngle = 1.1 * step;
            bodyY = 29; headY = 17;
        } else if (state === 'jump') {
            lLegAngle = 0.6; rLegAngle = -0.3;
            lArmAngle = -1.5; rArmAngle = -1.0;
            bodyY = 23; headY = 11;
        } else if (state === 'double_jump') {
            lLegAngle = 1.0; rLegAngle = -1.0;
            lArmAngle = -2.3; rArmAngle = -2.3;
            bodyY = 19; headY = 7;
        } else if (state === 'hurt') {
            lLegAngle = -0.5; rLegAngle = 0.5;
            lArmAngle = -1.8; rArmAngle = 1.8;
            bodyY = 31; headY = 19;
        } else if (state === 'victory') {
            lArmAngle = -2.8; rArmAngle = -2.8;
            lLegAngle = 0.1; rLegAngle = -0.1;
            bodyY = 25; headY = 13;
        } else if (state === 'slide') {
            bodyY = 42; headY = 34;
            lLegAngle = -1.3; rLegAngle = -1.3;
            lArmAngle = 1.2; rArmAngle = 1.2;
        }

        // Draw dynamic shadow under the player
        ctx.shadowColor = 'rgba(0,0,0,0.25)';
        ctx.shadowBlur = 4;
        ctx.shadowOffsetY = 2;

        // 1. Scarf (Red Rhododendron) - Flowing behind
        ctx.fillStyle = '#f43f5e';
        ctx.beginPath();
        if (isSliding) {
            ctx.moveTo(18, bodyY + 2);
            ctx.bezierCurveTo(8, bodyY - 8, 4, bodyY - 14, -2, bodyY - 10);
            ctx.bezierCurveTo(4, bodyY - 4, 10, bodyY + 4, 18, bodyY + 4);
        } else if (isJumping) {
            ctx.moveTo(18, bodyY + 2);
            ctx.bezierCurveTo(10, bodyY + 12, 6, bodyY + 22, 2, bodyY + 20);
            ctx.bezierCurveTo(6, bodyY + 14, 12, bodyY + 8, 18, bodyY + 4);
        } else {
            ctx.moveTo(18, bodyY + 2);
            ctx.bezierCurveTo(8, bodyY + 8, 6, bodyY + 16, 2, bodyY + 14);
            ctx.bezierCurveTo(6, bodyY + 10, 10, bodyY + 6, 18, bodyY + 4);
        }
        ctx.fill();

        // 2. Body (Daura Suruwal - Traditional Cream/White Tunic)
        const tunicGrad = ctx.createLinearGradient(0, bodyY, 0, bodyY + 24);
        tunicGrad.addColorStop(0, '#fefeff');
        tunicGrad.addColorStop(1, '#e2e8f0');
        ctx.fillStyle = tunicGrad;
        
        ctx.beginPath();
        if (isSliding) {
            ctx.roundRect(14, bodyY, 24, 14, 6);
        } else {
            ctx.roundRect(13, bodyY, 20, 24, 6);
        }
        ctx.fill();

        // 3. Traditional Vest / Eastcoat (Modern Dark Charcoal / Navy)
        const vestGrad = ctx.createLinearGradient(0, bodyY, 0, bodyY + 16);
        vestGrad.addColorStop(0, '#1e293b');
        vestGrad.addColorStop(1, '#0f172a');
        ctx.fillStyle = vestGrad;
        
        if (isSliding) {
            ctx.beginPath(); ctx.roundRect(18, bodyY, 16, 14, [4, 0, 0, 4]); ctx.fill();
        } else {
            ctx.beginPath(); ctx.roundRect(13, bodyY, 20, 17, [6, 6, 2, 2]); ctx.fill();
            
            // Vest details (Lapels & trim)
            ctx.strokeStyle = '#e2e8f0';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(23, bodyY); ctx.lineTo(23, bodyY + 17);
            ctx.stroke();

            // Gold buttons
            ctx.fillStyle = '#fbbf24';
            ctx.beginPath(); ctx.arc(21, bodyY + 5, 1.5, 0, Math.PI * 2); ctx.fill();
            ctx.beginPath(); ctx.arc(21, bodyY + 11, 1.5, 0, Math.PI * 2); ctx.fill();
        }

        // 4. Patuka / Belt (Traditional Red Sash / Leather Belt)
        ctx.fillStyle = '#b91c1c';
        if (isSliding) {
            ctx.fillRect(20, bodyY + 11, 3, 3);
        } else {
            ctx.fillRect(13, bodyY + 15, 20, 3);
            ctx.fillStyle = '#fbbf24'; // Buckle
            ctx.fillRect(21, bodyY + 14, 5, 5);
        }

        // 5. Back Hair
        ctx.fillStyle = '#111827';
        ctx.beginPath();
        ctx.arc(19, headY + 1, 8, 0, Math.PI * 2);
        ctx.arc(23, headY + 3, 8, 0, Math.PI * 2);
        ctx.fill();

        // 6. Head (Skin Tone with 3D gradient)
        const skinGrad = ctx.createRadialGradient(22, headY - 2, 2, 22, headY, 10);
        skinGrad.addColorStop(0, '#ffeedd');
        skinGrad.addColorStop(1, '#fdbb84');
        ctx.fillStyle = skinGrad;
        ctx.beginPath(); ctx.arc(22, headY, 9, 0, Math.PI * 2); ctx.fill();

        // Ear detail
        ctx.fillStyle = '#fdbb84';
        ctx.beginPath(); ctx.arc(13, headY, 2.5, 0, Math.PI * 2); ctx.fill();

        // 7. Front Hair Bangs
        ctx.fillStyle = '#111827';
        ctx.beginPath();
        ctx.arc(15, headY - 1, 3, 0, Math.PI * 2); // Sideburn
        ctx.arc(18, headY - 5, 4, 0, Math.PI * 2); // Left bang
        ctx.arc(22, headY - 6, 4, 0, Math.PI * 2); // Center bang
        ctx.arc(26, headY - 5, 3.5, 0, Math.PI * 2); // Right bang
        ctx.fill();

        // 8. Dhaka Topi (Kathmandu Dhaka Topi with fine pattern detail)
        const hatGrad = ctx.createLinearGradient(12, headY - 15, 32, headY - 3);
        hatGrad.addColorStop(0, '#c2410c'); // Deep red orange
        hatGrad.addColorStop(0.5, '#dc2626'); // Vibrant red
        hatGrad.addColorStop(1, '#b91c1c'); // Dark red
        ctx.fillStyle = hatGrad;
        
        ctx.beginPath();
        ctx.moveTo(12, headY - 3);
        ctx.lineTo(22, headY - 16);
        ctx.lineTo(32, headY - 3);
        ctx.closePath();
        ctx.fill();

        // Dhaka Hat Patterns (geometric colorful vectors)
        ctx.strokeStyle = '#fef08a'; // Yellow lines
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(15, headY - 6); ctx.lineTo(22, headY - 13); ctx.lineTo(29, headY - 6);
        ctx.stroke();

        ctx.strokeStyle = '#60a5fa'; // Blue cross patterns
        ctx.beginPath();
        ctx.moveTo(18, headY - 8); ctx.lineTo(22, headY - 4);
        ctx.moveTo(26, headY - 8); ctx.lineTo(22, headY - 4);
        ctx.stroke();

        // 9. Eyes (Premium, high-fidelity vector expression)
        ctx.shadowColor = 'transparent';
        if (state === 'hurt') {
            ctx.strokeStyle = '#0f172a';
            ctx.lineWidth = 2;
            ctx.lineCap = 'round';
            ctx.beginPath();
            ctx.moveTo(24, headY - 3); ctx.lineTo(28, headY + 1);
            ctx.moveTo(24, headY + 1); ctx.lineTo(28, headY - 3);
            ctx.stroke();
        } else {
            // White iris
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.ellipse(26, headY - 1, 2.5, 3.5, 0, 0, Math.PI * 2);
            ctx.fill();
            
            // Iris (Warm Chestnut Brown)
            ctx.fillStyle = '#451a03';
            ctx.beginPath();
            ctx.arc(26.5, headY - 1, 1.8, 0, Math.PI * 2);
            ctx.fill();
            
            // Pupil (Black)
            ctx.fillStyle = '#0f172a';
            ctx.beginPath();
            ctx.arc(26.8, headY - 1, 1.0, 0, Math.PI * 2);
            ctx.fill();

            // Eye shine (Reflection)
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(25.8, headY - 1.8, 0.7, 0, Math.PI * 2);
            ctx.fill();

            // Eyebrow
            ctx.strokeStyle = '#111827';
            ctx.lineWidth = 1.2;
            ctx.beginPath();
            ctx.arc(26, headY - 4, 3, Math.PI * 1.1, Math.PI * 1.8);
            ctx.stroke();

            // Cheek blush
            ctx.fillStyle = 'rgba(244, 63, 94, 0.35)';
            ctx.beginPath(); ctx.arc(24, headY + 2.5, 2.2, 0, Math.PI * 2); ctx.fill();

            // Happy mouth
            ctx.strokeStyle = '#0f172a';
            ctx.lineWidth = 1.5;
            ctx.lineCap = 'round';
            ctx.beginPath();
            ctx.arc(27, headY + 1.5, 2.5, 0, Math.PI);
            ctx.stroke();
        }

        // 10. Limbs (Hands & Arms)
        ctx.strokeStyle = '#e2e8f0'; // White Daura sleeves
        ctx.lineWidth = 5.5;
        ctx.lineCap = 'round';

        // Left Arm (Back Layer)
        ctx.save();
        ctx.translate(16, bodyY + 5); ctx.rotate(lArmAngle);
        ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, 13); ctx.stroke();
        // Hand
        ctx.fillStyle = '#ffeedd';
        ctx.beginPath(); ctx.arc(0, 14, 2.5, 0, Math.PI * 2); ctx.fill();
        ctx.restore();

        // Right Arm (Front Layer)
        ctx.save();
        ctx.translate(26, bodyY + 5);
        if (isAttacking) {
            ctx.rotate(-1.0);
            ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, 15); ctx.stroke();
            // Hand
            ctx.fillStyle = '#ffeedd';
            ctx.beginPath(); ctx.arc(0, 16, 2.5, 0, Math.PI * 2); ctx.fill();
            
            // Steel Khukuri (Sleek vector, glowing edge)
            ctx.save();
            ctx.translate(0, 16);
            ctx.rotate(-0.4);
            ctx.shadowColor = '#38bdf8';
            ctx.shadowBlur = 8;
            
            // Blade
            const bladeGrad = ctx.createLinearGradient(0, 0, 12, -22);
            bladeGrad.addColorStop(0, '#f1f5f9');
            bladeGrad.addColorStop(0.5, '#cbd5e1');
            bladeGrad.addColorStop(1, '#64748b');
            ctx.fillStyle = bladeGrad;
            
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.quadraticCurveTo(8, -13, 3, -22);
            ctx.quadraticCurveTo(15, -15, 0, 0);
            ctx.fill();

            // Steel blade reflection line
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 1.0;
            ctx.beginPath();
            ctx.moveTo(2, -2); ctx.quadraticCurveTo(8, -12, 4, -20);
            ctx.stroke();

            // Wooden/Gold Handle
            ctx.strokeStyle = '#78350f';
            ctx.lineWidth = 3.5;
            ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-2, 6); ctx.stroke();
            // Pommel (Gold cap)
            ctx.fillStyle = '#fbbf24';
            ctx.beginPath(); ctx.arc(-2, 6, 2, 0, Math.PI * 2); ctx.fill();

            ctx.restore();
        } else {
            ctx.rotate(rArmAngle);
            ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, 13); ctx.stroke();
            // Hand
            ctx.fillStyle = '#ffeedd';
            ctx.beginPath(); ctx.arc(0, 14, 2.5, 0, Math.PI * 2); ctx.fill();
        }
        ctx.restore();

        // 11. Legs & Hiking Boots
        ctx.strokeStyle = '#e2e8f0'; // Suruwal Pants
        ctx.lineWidth = 5.0;

        // Left Leg
        ctx.save();
        ctx.translate(16, bodyY + 18); ctx.rotate(lLegAngle);
        ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, 12); ctx.stroke();
        // Hiking Boot (detailed brown boot with colored accents)
        ctx.fillStyle = '#5c2d17'; // Leather
        ctx.beginPath(); ctx.roundRect(-4, 10, 9, 6, 2); ctx.fill();
        ctx.fillStyle = '#1c1917'; // Heavy rubber sole
        ctx.fillRect(-5, 14, 11, 2);
        ctx.fillStyle = '#f97316'; // Orange laces/trim
        ctx.fillRect(-3, 9, 5, 1.5);
        ctx.restore();

        // Right Leg
        ctx.save();
        ctx.translate(24, bodyY + 18); ctx.rotate(rLegAngle);
        ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, 12); ctx.stroke();
        // Hiking Boot
        ctx.fillStyle = '#5c2d17';
        ctx.beginPath(); ctx.roundRect(-4, 10, 9, 6, 2); ctx.fill();
        ctx.fillStyle = '#1c1917';
        ctx.fillRect(-5, 14, 11, 2);
        ctx.fillStyle = '#f97316';
        ctx.fillRect(-3, 9, 5, 1.5);
        ctx.restore();

        ctx.restore();
        return canvas;
    }

    // PREMIUM ENEMIES
    createMonkeySprite(isBoss) {
        const size = isBoss ? 80 : 40;
        const { canvas, ctx } = this.createCanvas(size, size);
        
        ctx.save();
        // Drop shadow
        ctx.shadowColor = 'rgba(0,0,0,0.3)';
        ctx.shadowBlur = size * 0.12;
        ctx.shadowOffsetY = size * 0.08;

        // Monkey ears
        ctx.fillStyle = isBoss ? '#652307' : '#9a3412';
        ctx.beginPath();
        ctx.arc(size * 0.2, size * 0.45, size * 0.15, 0, Math.PI * 2);
        ctx.arc(size * 0.8, size * 0.45, size * 0.15, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#fed7aa'; // Inner ear skin
        ctx.beginPath();
        ctx.arc(size * 0.2, size * 0.45, size * 0.08, 0, Math.PI * 2);
        ctx.arc(size * 0.8, size * 0.45, size * 0.08, 0, Math.PI * 2);
        ctx.fill();

        // Round head
        const headGrad = ctx.createLinearGradient(0, size * 0.2, 0, size * 0.8);
        headGrad.addColorStop(0, isBoss ? '#451a03' : '#7c2d12');
        headGrad.addColorStop(1, isBoss ? '#1c0a00' : '#431407');
        ctx.fillStyle = headGrad;
        ctx.beginPath(); ctx.arc(size / 2, size * 0.55, size * 0.35, 0, Math.PI * 2); ctx.fill();

        // Heart-shaped face overlay
        ctx.shadowColor = 'transparent';
        ctx.fillStyle = isBoss ? '#ef4444' : '#fed7aa';
        ctx.beginPath();
        ctx.arc(size * 0.4, size * 0.48, size * 0.16, 0, Math.PI * 2);
        ctx.arc(size * 0.6, size * 0.48, size * 0.16, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(size / 2, size * 0.58, size * 0.18, 0, Math.PI * 2);
        ctx.fill();

        // Eyes (Curious monkey eyes vs Boss glowing red eyes)
        if (isBoss) {
            ctx.shadowColor = '#f43f5e';
            ctx.shadowBlur = 10;
            ctx.fillStyle = '#f43f5e';
            ctx.beginPath();
            ctx.ellipse(size * 0.4, size * 0.45, size * 0.06, size * 0.08, 0.1, 0, Math.PI * 2);
            ctx.ellipse(size * 0.6, size * 0.45, size * 0.06, size * 0.08, -0.1, 0, Math.PI * 2);
            ctx.fill();
            
            // Fangs
            ctx.shadowBlur = 0;
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.moveTo(size * 0.4, size * 0.6); ctx.lineTo(size * 0.43, size * 0.68); ctx.lineTo(size * 0.46, size * 0.6);
            ctx.moveTo(size * 0.6, size * 0.6); ctx.lineTo(size * 0.57, size * 0.68); ctx.lineTo(size * 0.54, size * 0.6);
            ctx.fill();
        } else {
            ctx.fillStyle = '#0f172a';
            ctx.beginPath();
            ctx.arc(size * 0.4, size * 0.46, size * 0.06, 0, Math.PI * 2);
            ctx.arc(size * 0.6, size * 0.46, size * 0.06, 0, Math.PI * 2);
            ctx.fill();
            // Eye reflections
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(size * 0.38, size * 0.44, size * 0.02, 0, Math.PI * 2);
            ctx.arc(size * 0.58, size * 0.44, size * 0.02, 0, Math.PI * 2);
            ctx.fill();
            // Cheek blush
            ctx.fillStyle = 'rgba(244,63,94,0.4)';
            ctx.beginPath();
            ctx.arc(size * 0.33, size * 0.56, size * 0.04, 0, Math.PI * 2);
            ctx.arc(size * 0.67, size * 0.56, size * 0.04, 0, Math.PI * 2);
            ctx.fill();
        }

        // Smiling mouth
        ctx.strokeStyle = isBoss ? '#450a0a' : '#7c2d12';
        ctx.lineWidth = size * 0.04;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.arc(size / 2, size * 0.56, size * 0.1, 0.1, Math.PI - 0.1);
        ctx.stroke();

        ctx.restore();
        return canvas;
    }

    createYakSprite(isBoss) {
        const w = isBoss ? 100 : 54;
        const h = isBoss ? 80 : 44;
        const { canvas, ctx } = this.createCanvas(w, h);
        
        ctx.save();
        // Base shadow
        ctx.shadowColor = 'rgba(0,0,0,0.35)';
        ctx.shadowBlur = 8;
        ctx.shadowOffsetY = 4;

        // Heavy woolly body (Rounded rectangle)
        const bodyGrad = ctx.createLinearGradient(0, 0, 0, h);
        bodyGrad.addColorStop(0, '#1e1b4b'); // Deep indigo wool
        bodyGrad.addColorStop(0.7, '#0f172a'); // Near black
        bodyGrad.addColorStop(1, '#020617');
        ctx.fillStyle = bodyGrad;
        ctx.beginPath(); ctx.roundRect(w * 0.08, h * 0.18, w * 0.84, h * 0.62, 12); ctx.fill();
        
        // Massive sweeping horns
        ctx.shadowColor = 'transparent';
        ctx.strokeStyle = '#f1f5f9'; // Pearl white horns
        ctx.lineWidth = isBoss ? 7 : 4;
        ctx.lineCap = 'round';
        ctx.beginPath();
        // Left horn
        ctx.moveTo(w * 0.76, h * 0.22);
        ctx.quadraticCurveTo(w * 0.62, h * 0.02, w * 0.44, h * 0.12);
        // Right horn
        ctx.moveTo(w * 0.88, h * 0.22);
        ctx.quadraticCurveTo(w * 1.02, h * 0.02, w * 1.12, h * 0.12);
        ctx.stroke();

        // Fur clumps/texture details (curved overlays)
        ctx.strokeStyle = '#312e81';
        ctx.lineWidth = 2.5;
        for (let i = 0; i < 8; i++) {
            const fx = w * (0.15 + i * 0.08);
            ctx.beginPath();
            ctx.moveTo(fx, h * 0.35);
            ctx.quadraticCurveTo(fx + w * 0.04, h * 0.6, fx + w * 0.02, h * 0.72);
            ctx.stroke();
        }

        // Heavy duty trekking pack harness (Nepali color patterns)
        ctx.fillStyle = '#dc2626'; // Red harness band
        ctx.fillRect(w * 0.42, h * 0.18, w * 0.08, h * 0.62);
        ctx.fillStyle = '#fbbf24'; // Gold details
        ctx.fillRect(w * 0.43, h * 0.28, w * 0.06, h * 0.08);

        // Strong hooved legs
        ctx.fillStyle = '#020617';
        ctx.fillRect(w * 0.18, h * 0.76, w * 0.09, h * 0.22);
        ctx.fillRect(w * 0.32, h * 0.76, w * 0.09, h * 0.22);
        ctx.fillRect(w * 0.62, h * 0.76, w * 0.09, h * 0.22);
        ctx.fillRect(w * 0.76, h * 0.76, w * 0.09, h * 0.22);
        
        // Glowing alert eyes
        ctx.save();
        ctx.shadowBlur = 10;
        ctx.shadowColor = isBoss ? '#ef4444' : '#f59e0b';
        ctx.fillStyle = isBoss ? '#ef4444' : '#fbbf24';
        ctx.beginPath(); ctx.arc(w * 0.84, h * 0.38, w * 0.045, 0, Math.PI * 2); ctx.fill();
        ctx.restore();

        ctx.restore();
        return canvas;
    }

    createFoxSprite() {
        const { canvas, ctx } = this.createCanvas(40, 30);
        ctx.save();
        ctx.shadowColor = 'rgba(0,0,0,0.2)';
        ctx.shadowBlur = 4;
        
        // Fox orange tail with white tip
        const tailGrad = ctx.createLinearGradient(0, 10, 12, 24);
        tailGrad.addColorStop(0, '#ea580c');
        tailGrad.addColorStop(1, '#c2410c');
        ctx.fillStyle = tailGrad;
        ctx.beginPath();
        ctx.ellipse(8, 18, 8, 5, -0.4, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#f8fafc'; // White tip
        ctx.beginPath();
        ctx.ellipse(3, 20, 3, 2, -0.4, 0, Math.PI * 2);
        ctx.fill();

        // Fox sleek body
        ctx.fillStyle = '#f97316';
        ctx.beginPath(); ctx.roundRect(10, 11, 22, 11, 5); ctx.fill();

        // Fluffy white chest
        ctx.fillStyle = '#f8fafc';
        ctx.beginPath(); ctx.ellipse(28, 16, 5, 6, 0.2, 0, Math.PI * 2); ctx.fill();

        // Sharp Head & Pointy Ears
        ctx.fillStyle = '#ea580c';
        ctx.beginPath();
        ctx.moveTo(25, 12); ctx.lineTo(36, 6); ctx.lineTo(34, 17);
        ctx.fill();
        // Inner ear
        ctx.fillStyle = '#fed7aa';
        ctx.beginPath();
        ctx.moveTo(27, 11); ctx.lineTo(33, 7); ctx.lineTo(31, 14);
        ctx.fill();
        
        // Clever black eye
        ctx.fillStyle = '#000000';
        ctx.beginPath(); ctx.arc(31, 10, 1.2, 0, Math.PI * 2); ctx.fill();
        
        // Sleek black socks/legs
        ctx.fillStyle = '#18181b';
        ctx.fillRect(13, 22, 2.5, 8);
        ctx.fillRect(19, 22, 2.5, 8);
        ctx.fillRect(26, 22, 2.5, 8);
        ctx.fillRect(30, 22, 2.5, 8);

        ctx.restore();
        return canvas;
    }

    createRockSpiritSprite() {
        const { canvas, ctx } = this.createCanvas(44, 44);
        ctx.save();
        
        // Obsidian/Rock body with radial shadow shading
        const grad = ctx.createRadialGradient(22, 22, 2, 22, 22, 22);
        grad.addColorStop(0, '#4b5563'); // Granite center
        grad.addColorStop(0.7, '#1f2937'); // Dark slate
        grad.addColorStop(1, '#090d16');
        ctx.fillStyle = grad;
        
        // Jagged stylized vector stone outline
        ctx.beginPath();
        ctx.moveTo(22, 2); 
        ctx.lineTo(37, 8); 
        ctx.lineTo(41, 24); 
        ctx.lineTo(34, 39); 
        ctx.lineTo(19, 42); 
        ctx.lineTo(5, 34); 
        ctx.lineTo(3, 16); 
        ctx.closePath(); 
        ctx.fill();
        
        // Internal glowing elemental magma fissures (ice / plasma energy)
        ctx.shadowColor = '#0ea5e9';
        ctx.shadowBlur = 10;
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        ctx.moveTo(12, 12); ctx.lineTo(22, 22); ctx.lineTo(32, 14);
        ctx.moveTo(22, 22); ctx.lineTo(24, 38);
        ctx.moveTo(22, 22); ctx.lineTo(6, 28);
        ctx.stroke();
        
        // Chiseled highlights
        ctx.shadowBlur = 0;
        ctx.strokeStyle = '#9ca3af';
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.restore();
        return canvas;
    }

    createBatSprite() {
        const { canvas, ctx } = this.createCanvas(40, 30);
        ctx.save();
        
        // Dark vector bat wings with joint creases
        const wingGrad = ctx.createLinearGradient(0, 5, 40, 25);
        wingGrad.addColorStop(0, '#1e1b4b');
        wingGrad.addColorStop(1, '#3b0764');
        ctx.fillStyle = wingGrad;
        
        ctx.beginPath();
        // Left wing
        ctx.moveTo(16, 14);
        ctx.bezierCurveTo(4, -3, 0, 5, 0, 11);
        ctx.bezierCurveTo(4, 18, 10, 22, 16, 17);
        // Right wing
        ctx.moveTo(24, 14);
        ctx.bezierCurveTo(36, -3, 40, 5, 40, 11);
        ctx.bezierCurveTo(36, 18, 30, 22, 24, 17);
        ctx.fill();
        
        // Bat ears
        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.moveTo(15, 9); ctx.lineTo(17, 2); ctx.lineTo(20, 10);
        ctx.moveTo(25, 9); ctx.lineTo(23, 2); ctx.lineTo(20, 10);
        ctx.fill();

        // Round head/body
        ctx.beginPath(); ctx.arc(20, 14, 6.5, 0, Math.PI * 2); ctx.fill();
        
        // Glowing vampire red eyes
        ctx.shadowColor = '#f43f5e';
        ctx.shadowBlur = 6;
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(18, 13, 1.2, 0, Math.PI * 2);
        ctx.arc(22, 13, 1.2, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
        return canvas;
    }

    createShadowMonkSprite() {
        const { canvas, ctx } = this.createCanvas(48, 64);
        ctx.save();
        
        // Deep purple flowing temple robe with dynamic gradient
        const robeGrad = ctx.createLinearGradient(0, 8, 0, 64);
        robeGrad.addColorStop(0, '#581c87'); // Mystic violet
        robeGrad.addColorStop(0.6, '#3b0764'); // Deep shadow purple
        robeGrad.addColorStop(1, '#090514');
        ctx.fillStyle = robeGrad;
        
        ctx.beginPath();
        ctx.moveTo(24, 8);
        ctx.quadraticCurveTo(38, 16, 42, 60);
        ctx.lineTo(6, 60);
        ctx.quadraticCurveTo(10, 16, 24, 8);
        ctx.closePath();
        ctx.fill();
        
        // Robe creases (fabric highlights)
        ctx.strokeStyle = '#a855f7';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(24, 10); ctx.quadraticCurveTo(28, 35, 34, 60);
        ctx.moveTo(24, 10); ctx.quadraticCurveTo(18, 35, 12, 60);
        ctx.stroke();

        // Hood shadow aperture
        ctx.fillStyle = '#020617';
        ctx.beginPath(); ctx.arc(24, 19, 9.5, 0, Math.PI * 2); ctx.fill();
        
        // Glowing yellow spiritual eyes
        ctx.shadowColor = '#eab308';
        ctx.shadowBlur = 10;
        ctx.fillStyle = '#fbbf24';
        ctx.beginPath();
        ctx.ellipse(21, 19, 1.5, 2.2, 0.1, 0, Math.PI * 2);
        ctx.ellipse(27, 19, 1.5, 2.2, -0.1, 0, Math.PI * 2);
        ctx.fill();
        
        // Sacred prayer beads (Mala necklace)
        ctx.shadowBlur = 0;
        ctx.fillStyle = '#b45309';
        for (let i = 0; i < 6; i++) {
            const bx = 16 + i * 3.2;
            ctx.beginPath(); ctx.arc(bx, 29, 1.5, 0, Math.PI * 2); ctx.fill();
        }

        // Magic plasma orb glowing in monk hand
        ctx.shadowColor = '#c084fc';
        ctx.shadowBlur = 15;
        const orbGrad = ctx.createRadialGradient(10, 42, 1, 10, 42, 7.5);
        orbGrad.addColorStop(0, '#ffffff');
        orbGrad.addColorStop(0.5, '#d8b4fe');
        orbGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = orbGrad;
        ctx.beginPath(); ctx.arc(10, 42, 7.5, 0, Math.PI * 2); ctx.fill();
        
        ctx.restore();
        return canvas;
    }

    createSnowDemonSprite() {
        const { canvas, ctx } = this.createCanvas(60, 80);
        ctx.save();
        
        // Frost demon glacial body shards
        const bodyGrad = ctx.createRadialGradient(30, 42, 4, 30, 42, 34);
        bodyGrad.addColorStop(0, '#bae6fd'); // Glistening snowcore
        bodyGrad.addColorStop(0.6, '#0ea5e9'); // Glacial ice
        bodyGrad.addColorStop(1, '#1e3a8a'); // Frozen indigo shadow
        ctx.fillStyle = bodyGrad;
        
        ctx.beginPath(); ctx.roundRect(14, 22, 32, 48, 12); ctx.fill();
        
        // Sharp crystal ice spikes on back
        ctx.fillStyle = '#e0f2fe';
        ctx.strokeStyle = '#0284c7';
        ctx.lineWidth = 1;
        ctx.beginPath();
        // Top spike
        ctx.moveTo(42, 32); ctx.lineTo(56, 26); ctx.lineTo(44, 40); ctx.closePath();
        // Bottom spike
        ctx.moveTo(42, 50); ctx.lineTo(57, 44); ctx.lineTo(44, 58); ctx.closePath();
        ctx.fill(); ctx.stroke();
        
        // Spiky frozen claws
        ctx.fillStyle = '#bae6fd';
        ctx.fillRect(8, 54, 4, 12);
        ctx.fillRect(48, 54, 4, 12);

        // Head
        ctx.fillStyle = '#38bdf8';
        ctx.beginPath(); ctx.arc(30, 24, 13, 0, Math.PI * 2); ctx.fill();
        
        // Evil glowing red visor eyes
        ctx.shadowColor = '#f43f5e';
        ctx.shadowBlur = 12;
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.moveTo(20, 22); ctx.lineTo(40, 22); ctx.lineTo(34, 27); ctx.lineTo(26, 27);
        ctx.closePath();
        ctx.fill();
        
        ctx.restore();
        return canvas;
    }

    createYetiSprite() {
        const { canvas, ctx } = this.createCanvas(140, 160);
        ctx.save();
        
        // Soft ambient backdrop shadow
        ctx.shadowColor = 'rgba(15, 23, 42, 0.4)';
        ctx.shadowBlur = 18;
        ctx.shadowOffsetY = 8;
        
        // Massive muscular body (Yeti white fur)
        const furGrad = ctx.createRadialGradient(70, 95, 15, 70, 95, 65);
        furGrad.addColorStop(0, '#ffffff'); // pure snow white
        furGrad.addColorStop(0.75, '#cbd5e1'); // Ice shadows
        furGrad.addColorStop(1, '#64748b'); // Deep slate creases
        ctx.fillStyle = furGrad;
        ctx.beginPath(); ctx.arc(70, 95, 58, 0, Math.PI * 2); ctx.fill();
        
        // Head fur bundle
        ctx.shadowColor = 'transparent';
        ctx.beginPath(); ctx.arc(70, 42, 32, 0, Math.PI * 2); ctx.fill();
        
        // Stylized blue face/chest plate (looks like Alto's Adventure beast)
        ctx.fillStyle = '#0ea5e9';
        ctx.beginPath(); ctx.arc(70, 44, 22, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#38bdf8'; // Highlight layer
        ctx.beginPath(); ctx.arc(70, 44, 15, 0, Math.PI * 2); ctx.fill();
        
        // Glowing Red Yeti Eyes (extremely scary/menacing)
        ctx.shadowColor = '#ef4444';
        ctx.shadowBlur = 16;
        ctx.fillStyle = '#f43f5e';
        ctx.beginPath();
        ctx.arc(62, 38, 5, 0, Math.PI * 2);
        ctx.arc(78, 38, 5, 0, Math.PI * 2);
        ctx.fill();
        
        // Angry curved eyebrows
        ctx.shadowBlur = 0;
        ctx.strokeStyle = '#0284c7';
        ctx.lineWidth = 3.5;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(55, 30); ctx.lineTo(67, 35);
        ctx.moveTo(85, 30); ctx.lineTo(73, 35);
        ctx.stroke();

        // Roaring fanged mouth
        ctx.fillStyle = '#0f172a';
        ctx.beginPath(); ctx.arc(70, 52, 9, 0, Math.PI); ctx.fill();
        // Razor teeth
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.moveTo(63, 52); ctx.lineTo(66, 57); ctx.lineTo(69, 52);
        ctx.moveTo(77, 52); ctx.lineTo(74, 57); ctx.lineTo(71, 52);
        ctx.fill();

        // Giant Yeti Arms
        ctx.fillStyle = '#cbd5e1';
        ctx.beginPath();
        ctx.ellipse(22, 105, 22, 34, 0.4, 0, Math.PI * 2); // Left arm
        ctx.ellipse(118, 105, 22, 34, -0.4, 0, Math.PI * 2); // Right arm
        ctx.fill();

        // Giant claws
        ctx.fillStyle = '#e2e8f0';
        ctx.fillRect(10, 126, 6, 12); ctx.fillRect(18, 128, 6, 12);
        ctx.fillRect(124, 126, 6, 12); ctx.fillRect(116, 128, 6, 12);
        ctx.restore();
        return canvas;
    }
}

export const assets = new AssetGenerator();
export default assets;
