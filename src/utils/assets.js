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
            grad.addColorStop(0, '#34d399');
            grad.addColorStop(0.1, '#10b981');
            grad.addColorStop(1, '#065f46');
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, 40, 40);
            // Add lush grass blades
            ctx.fillStyle = '#059669';
            for(let i=0; i<8; i++) {
                ctx.beginPath();
                ctx.moveTo(i*5, 0); ctx.lineTo(i*5 + 2, 8); ctx.lineTo(i*5 + 4, 0);
                ctx.fill();
            }
            // Add subtle dirt texture
            ctx.fillStyle = 'rgba(0,0,0,0.1)';
            for(let i=0; i<15; i++) {
                ctx.fillRect(Math.random()*40, 10 + Math.random()*30, 2, 2);
            }
        } else if (type === 'forest') {
            grad.addColorStop(0, '#92400e');
            grad.addColorStop(1, '#451a03');
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, 40, 40);
            // Bark texture
            ctx.strokeStyle = '#78350f';
            ctx.lineWidth = 1;
            for(let i=0; i<5; i++) {
                ctx.beginPath();
                ctx.moveTo(i*8 + Math.random()*4, 0);
                ctx.lineTo(i*8 + Math.random()*4, 40);
                ctx.stroke();
            }
        } else if (type === 'cave') {
            grad.addColorStop(0, '#475569');
            grad.addColorStop(1, '#0f172a');
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, 40, 40);
            ctx.fillStyle = 'rgba(255,255,255,0.05)';
            ctx.beginPath(); ctx.arc(10, 10, 15, 0, Math.PI*2); ctx.fill();
            ctx.beginPath(); ctx.arc(30, 30, 10, 0, Math.PI*2); ctx.fill();
        } else if (type === 'temple') {
            grad.addColorStop(0, '#d97706');
            grad.addColorStop(1, '#92400e');
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, 40, 40);
            ctx.strokeStyle = '#f59e0b';
            ctx.lineWidth = 1;
            ctx.strokeRect(2, 2, 36, 36);
            ctx.beginPath();
            ctx.moveTo(0, 20); ctx.lineTo(40, 20);
            ctx.moveTo(20, 0); ctx.lineTo(20, 40);
            ctx.stroke();
            // Gold center
            ctx.fillStyle = '#fbbf24';
            ctx.beginPath(); ctx.arc(20, 20, 4, 0, Math.PI*2); ctx.fill();
        } else if (type === 'snow') {
            grad.addColorStop(0, '#ffffff');
            grad.addColorStop(0.2, '#f1f5f9');
            grad.addColorStop(1, '#cbd5e1');
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, 40, 40);
            ctx.fillStyle = 'rgba(255,255,255,0.8)';
            ctx.beginPath(); ctx.arc(10, 5, 8, 0, Math.PI*2); ctx.arc(30, 5, 10, 0, Math.PI*2); ctx.fill();
        } else if (type === 'ice') {
            grad.addColorStop(0, '#bae6fd');
            grad.addColorStop(0.5, '#38bdf8');
            grad.addColorStop(1, '#0284c7');
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, 40, 40);
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
            ctx.lineWidth = 2;
            ctx.beginPath(); ctx.moveTo(5, 35); ctx.lineTo(35, 5); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(15, 38); ctx.lineTo(38, 15); ctx.stroke();
            // Glint
            ctx.fillStyle = 'rgba(255,255,255,0.8)';
            ctx.beginPath(); ctx.arc(10, 10, 3, 0, Math.PI*2); ctx.fill();
        } else if (type === 'spirit') {
            grad.addColorStop(0, '#a855f7');
            grad.addColorStop(1, '#4c1d95');
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, 40, 40);
            ctx.strokeStyle = '#c084fc';
            ctx.lineWidth = 1.5;
            for(let i=0; i<4; i++) {
                ctx.strokeRect(i*10, i*10, 40-i*20, 40-i*20);
            }
        } else if (type === 'dark') {
            grad.addColorStop(0, '#1e1b4b');
            grad.addColorStop(1, '#020617');
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, 40, 40);
            ctx.strokeStyle = '#e11d48';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(0, 20); ctx.lineTo(20, 0); ctx.lineTo(40, 20); ctx.lineTo(20, 40); ctx.closePath();
            ctx.stroke();
        }
        return canvas;
    }

    createSpikesSprite() {
        const { canvas, ctx } = this.createCanvas(40, 40);
        const grad = ctx.createLinearGradient(0, 0, 0, 40);
        grad.addColorStop(0, '#e2e8f0');
        grad.addColorStop(1, '#475569');
        ctx.fillStyle = grad;
        ctx.beginPath();
        for (let i = 0; i < 3; i++) {
            ctx.moveTo(i*13.3, 40);
            ctx.lineTo(i*13.3 + 6.6, 5);
            ctx.lineTo((i+1)*13.3, 40);
        }
        ctx.fill();
        
        // Highlights
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (let i = 0; i < 3; i++) {
            ctx.moveTo(i*13.3 + 6.6, 5);
            ctx.lineTo(i*13.3, 40);
        }
        ctx.stroke();
        return canvas;
    }

    createBridgeSprite() {
        const { canvas, ctx } = this.createCanvas(40, 15);
        ctx.fillStyle = '#78350f';
        ctx.fillRect(0, 4, 40, 7); // Main rope
        ctx.fillStyle = '#b45309';
        ctx.fillRect(2, 0, 10, 15); // Wood plank 1
        ctx.fillRect(15, 0, 10, 15); // Wood plank 2
        ctx.fillRect(28, 0, 10, 15); // Wood plank 3
        ctx.fillStyle = 'rgba(0,0,0,0.3)';
        ctx.fillRect(12, 4, 3, 7); // Shadows
        ctx.fillRect(25, 4, 3, 7);
        return canvas;
    }

    createFlagSprite() {
        const { canvas, ctx } = this.createCanvas(40, 80);
        // Pole
        ctx.fillStyle = '#92400e';
        ctx.fillRect(18, 0, 4, 80);
        // Flag parts
        const colors = ['#0ea5e9', '#f8fafc', '#ef4444', '#10b981', '#f59e0b'];
        for(let i=0; i<5; i++) {
            ctx.fillStyle = colors[i];
            ctx.beginPath();
            ctx.moveTo(22, 5 + i*14);
            ctx.lineTo(38, 12 + i*14);
            ctx.lineTo(22, 19 + i*14);
            ctx.fill();
        }
        return canvas;
    }

    createCoinSprite() {
        const { canvas, ctx } = this.createCanvas(30, 30);
        const grad = ctx.createRadialGradient(15, 10, 2, 15, 15, 14);
        grad.addColorStop(0, '#fef08a');
        grad.addColorStop(0.5, '#f59e0b');
        grad.addColorStop(1, '#92400e');
        ctx.fillStyle = grad;
        ctx.beginPath(); ctx.arc(15, 15, 12, 0, Math.PI * 2); ctx.fill();
        
        ctx.strokeStyle = '#fef08a';
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.arc(15, 15, 9, 0, Math.PI * 2); ctx.stroke();
        
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 14px "Cinzel"';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('$', 15, 16);
        return canvas;
    }

    createSelRotiSprite() {
        const { canvas, ctx } = this.createCanvas(30, 30);
        ctx.fillStyle = '#d97706';
        ctx.shadowColor = 'rgba(0,0,0,0.4)';
        ctx.shadowBlur = 4;
        ctx.shadowOffsetY = 2;
        ctx.beginPath();
        ctx.arc(15, 15, 11, 0, Math.PI * 2);
        ctx.arc(15, 15, 4, 0, Math.PI * 2, true);
        ctx.fill();
        
        // Texture
        ctx.shadowColor = 'transparent';
        ctx.strokeStyle = '#b45309';
        ctx.lineWidth = 1.5;
        for(let i=0; i<8; i++) {
            ctx.beginPath();
            ctx.arc(15, 15, 7, i * Math.PI/4, (i+0.5) * Math.PI/4);
            ctx.stroke();
        }
        return canvas;
    }

    createItemSprite(emoji, color) {
        const { canvas, ctx } = this.createCanvas(36, 36);
        ctx.shadowColor = color;
        ctx.shadowBlur = 15;
        const grad = ctx.createRadialGradient(18, 18, 2, 18, 18, 16);
        grad.addColorStop(0, color + 'aa');
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.beginPath(); ctx.arc(18, 18, 16, 0, Math.PI * 2); ctx.fill();
        
        ctx.shadowBlur = 0;
        ctx.font = '22px Outfit';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(emoji, 18, 18);
        return canvas;
    }

    createKhukuriPowerupSprite() {
        const { canvas, ctx } = this.createCanvas(40, 40);
        ctx.shadowColor = '#f59e0b';
        ctx.shadowBlur = 10;
        
        // Blade
        ctx.fillStyle = '#e2e8f0';
        ctx.beginPath();
        ctx.moveTo(10, 30);
        ctx.quadraticCurveTo(20, 20, 16, 10);
        ctx.quadraticCurveTo(30, 10, 30, 30);
        ctx.fill();
        
        // Handle
        ctx.strokeStyle = '#78350f';
        ctx.lineWidth = 6;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(10, 30);
        ctx.lineTo(4, 36);
        ctx.stroke();
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

        let bodyY = 28;
        let headY = 16;
        let lLegAngle = 0;
        let rLegAngle = 0;
        let lArmAngle = 0;
        let rArmAngle = 0;
        let isAttacking = state === 'attack';
        let isSliding = state === 'slide';
        let isJumping = state === 'jump' || state === 'double_jump';

        // Animation Kinematics
        if (state.startsWith('walk')) {
            const step = state === 'walk1' ? 1 : -1;
            lLegAngle = 0.4 * step;
            rLegAngle = -0.4 * step;
            lArmAngle = -0.3 * step;
            rArmAngle = 0.3 * step;
            bodyY += Math.abs(step) * 1; 
        } else if (state.startsWith('run')) {
            const step = state === 'run1' ? 1 : -1;
            lLegAngle = 0.7 * step;
            rLegAngle = -0.7 * step;
            lArmAngle = -0.8 * step;
            rArmAngle = 0.8 * step;
            bodyY = 30; headY = 19;
        } else if (state === 'jump') {
            lLegAngle = 0.5; rLegAngle = -0.2;
            lArmAngle = -1.2; rArmAngle = -0.8;
            bodyY = 24; headY = 12;
        } else if (state === 'double_jump') {
            lLegAngle = 0.9; rLegAngle = -0.9;
            lArmAngle = -2.0; rArmAngle = -2.0;
            bodyY = 20; headY = 8;
        } else if (state === 'hurt') {
            lLegAngle = -0.3; rLegAngle = 0.3;
            lArmAngle = -1.5; rArmAngle = 1.5;
            bodyY = 32; headY = 20;
        } else if (state === 'victory') {
            lArmAngle = -2.5; rArmAngle = -2.5;
            bodyY = 26; headY = 14;
        } else if (state === 'slide') {
            bodyY = 44; headY = 36;
            lLegAngle = -1.2; rLegAngle = -1.2;
            lArmAngle = 1.0; rArmAngle = 1.0;
        }

        // Drop shadow for depth
        ctx.shadowColor = 'rgba(0,0,0,0.3)';
        ctx.shadowBlur = 4;
        ctx.shadowOffsetY = 2;

        // Scarf (Red Rhododendron)
        ctx.fillStyle = '#e11d48';
        if (isSliding) {
            ctx.beginPath(); ctx.moveTo(20, bodyY); ctx.lineTo(0, bodyY - 10); ctx.lineTo(4, bodyY - 14); ctx.fill();
        } else if (isJumping) {
            ctx.beginPath(); ctx.moveTo(20, bodyY); ctx.lineTo(5, bodyY + 15); ctx.lineTo(10, bodyY + 18); ctx.fill();
        } else {
            ctx.beginPath(); ctx.moveTo(20, bodyY); ctx.lineTo(8, bodyY + 10); ctx.lineTo(12, bodyY + 14); ctx.fill();
        }

        // Daura Suruwal (Body)
        const bodyGrad = ctx.createLinearGradient(0, bodyY, 0, bodyY+20);
        bodyGrad.addColorStop(0, '#f1f5f9');
        bodyGrad.addColorStop(1, '#cbd5e1');
        ctx.fillStyle = bodyGrad;
        if (isSliding) {
            ctx.beginPath(); ctx.roundRect(16, bodyY, 22, 12, 6); ctx.fill();
        } else {
            ctx.beginPath(); ctx.roundRect(14, bodyY, 18, 22, 6); ctx.fill();
        }
        
        // Belt
        ctx.fillStyle = '#b45309';
        ctx.fillRect(isSliding ? 22 : 14, isSliding ? bodyY : bodyY + 12, isSliding ? 4 : 18, isSliding ? 12 : 4);

        // Head
        ctx.fillStyle = '#fcd34d';
        ctx.beginPath(); ctx.arc(24, headY, 9, 0, Math.PI * 2); ctx.fill();
        
        // Dhaka Topi (Hat)
        const hatGrad = ctx.createLinearGradient(14, headY-15, 34, headY-5);
        hatGrad.addColorStop(0, '#1e3a8a');
        hatGrad.addColorStop(0.5, '#e11d48');
        hatGrad.addColorStop(1, '#fbbf24');
        ctx.fillStyle = hatGrad;
        ctx.beginPath();
        ctx.moveTo(14, headY - 4);
        ctx.lineTo(24, headY - 16);
        ctx.lineTo(34, headY - 4);
        ctx.closePath();
        ctx.fill();

        // Face
        ctx.shadowColor = 'transparent'; // No shadow for face details
        ctx.fillStyle = '#0f172a';
        if (state === 'hurt') {
            ctx.font = 'bold 12px Arial'; ctx.fillText('>', 25, headY+2);
        } else {
            ctx.beginPath(); ctx.arc(28, headY - 1, 2.5, 0, Math.PI*2); ctx.fill(); // Eye
            if (!isSliding && !isAttacking) {
                ctx.beginPath(); ctx.arc(29, headY + 3, 1.5, 0, Math.PI*2); ctx.fill(); // Smile
            }
        }

        // Arms & Legs
        ctx.strokeStyle = '#e2e8f0';
        ctx.lineWidth = 5;
        ctx.lineCap = 'round';

        // Left Arm (Back)
        ctx.save();
        ctx.translate(18, bodyY + 4); ctx.rotate(lArmAngle);
        ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, 14); ctx.stroke();
        ctx.restore();

        // Right Arm (Front)
        ctx.save();
        ctx.translate(28, bodyY + 4);
        if (isAttacking) {
            ctx.rotate(-1.0);
            ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, 16); ctx.stroke();
            // Khukuri Slash
            ctx.shadowColor = '#0ea5e9';
            ctx.shadowBlur = 10;
            ctx.strokeStyle = '#f8fafc';
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.arc(10, 10, 20, -Math.PI/2, Math.PI/4);
            ctx.stroke();
        } else {
            ctx.rotate(rArmAngle);
            ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, 14); ctx.stroke();
        }
        ctx.restore();

        // Legs
        ctx.strokeStyle = '#cbd5e1';
        ctx.save();
        ctx.translate(18, bodyY + 18); ctx.rotate(lLegAngle);
        ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, 12); ctx.stroke();
        ctx.fillStyle = '#451a03'; ctx.fillRect(-4, 10, 10, 5); // Boot
        ctx.restore();

        ctx.save();
        ctx.translate(28, bodyY + 18); ctx.rotate(rLegAngle);
        ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, 12); ctx.stroke();
        ctx.fillStyle = '#451a03'; ctx.fillRect(-4, 10, 10, 5);
        ctx.restore();

        ctx.restore();
        return canvas;
    }

    // PREMIUM ENEMIES
    createMonkeySprite(isBoss) {
        const size = isBoss ? 80 : 40;
        const { canvas, ctx } = this.createCanvas(size, size);
        ctx.shadowColor = 'rgba(0,0,0,0.4)';
        ctx.shadowBlur = 5;
        
        ctx.fillStyle = isBoss ? '#451a03' : '#78350f';
        ctx.beginPath(); ctx.arc(size/2, size*0.6, size*0.35, 0, Math.PI*2); ctx.fill();
        ctx.fillStyle = isBoss ? '#ef4444' : '#fed7aa'; // Boss has red face
        ctx.beginPath(); ctx.arc(size/2, size*0.4, size*0.25, 0, Math.PI*2); ctx.fill();
        
        ctx.shadowColor = 'transparent';
        ctx.fillStyle = '#000';
        ctx.beginPath(); ctx.arc(size*0.4, size*0.35, size*0.05, 0, Math.PI*2); ctx.fill();
        ctx.beginPath(); ctx.arc(size*0.6, size*0.35, size*0.05, 0, Math.PI*2); ctx.fill();
        
        if (isBoss) {
            // Fangs
            ctx.fillStyle = '#fff';
            ctx.beginPath(); ctx.moveTo(size*0.4, size*0.5); ctx.lineTo(size*0.45, size*0.6); ctx.lineTo(size*0.5, size*0.5); ctx.fill();
            ctx.beginPath(); ctx.moveTo(size*0.5, size*0.5); ctx.lineTo(size*0.55, size*0.6); ctx.lineTo(size*0.6, size*0.5); ctx.fill();
        }
        return canvas;
    }

    createYakSprite(isBoss) {
        const w = isBoss ? 100 : 54;
        const h = isBoss ? 80 : 44;
        const { canvas, ctx } = this.createCanvas(w, h);
        
        const grad = ctx.createLinearGradient(0, 0, 0, h);
        grad.addColorStop(0, '#1e1b4b');
        grad.addColorStop(1, '#0f172a');
        
        ctx.fillStyle = grad;
        ctx.beginPath(); ctx.roundRect(w*0.1, h*0.2, w*0.8, h*0.6, 8); ctx.fill();
        
        // Horns
        ctx.strokeStyle = '#e2e8f0';
        ctx.lineWidth = isBoss ? 6 : 4;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(w*0.8, h*0.2); ctx.quadraticCurveTo(w*0.7, -h*0.1, w*0.5, h*0.1);
        ctx.moveTo(w*0.9, h*0.2); ctx.quadraticCurveTo(w*1.1, -h*0.1, w*1.0, h*0.1);
        ctx.stroke();

        // Fur details
        ctx.strokeStyle = '#312e81';
        ctx.lineWidth = 2;
        for(let i=0; i<10; i++) {
            ctx.beginPath(); ctx.moveTo(w*(0.2 + Math.random()*0.6), h*0.3); ctx.lineTo(w*(0.2 + Math.random()*0.6), h*0.7); ctx.stroke();
        }

        // Legs
        ctx.fillStyle = '#020617';
        ctx.fillRect(w*0.2, h*0.8, w*0.1, h*0.2);
        ctx.fillRect(w*0.4, h*0.8, w*0.1, h*0.2);
        ctx.fillRect(w*0.7, h*0.8, w*0.1, h*0.2);
        
        // Eyes
        ctx.fillStyle = isBoss ? '#ef4444' : '#fbbf24';
        ctx.beginPath(); ctx.arc(w*0.85, h*0.4, w*0.05, 0, Math.PI*2); ctx.fill();
        return canvas;
    }

    createFoxSprite() {
        const { canvas, ctx } = this.createCanvas(40, 30);
        ctx.fillStyle = '#ea580c';
        ctx.beginPath(); ctx.roundRect(4, 12, 30, 12, 4); ctx.fill(); // Body
        ctx.beginPath(); ctx.moveTo(24, 12); ctx.lineTo(34, 4); ctx.lineTo(34, 16); ctx.fill(); // Head
        
        ctx.fillStyle = '#f8fafc';
        ctx.beginPath(); ctx.arc(10, 18, 6, 0, Math.PI*2); ctx.fill(); // Tail tip
        ctx.beginPath(); ctx.arc(32, 16, 4, 0, Math.PI*2); ctx.fill(); // Muzzle
        
        ctx.fillStyle = '#000';
        ctx.beginPath(); ctx.arc(30, 10, 1.5, 0, Math.PI*2); ctx.fill(); // Eye
        
        // Legs
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(10, 24, 3, 6); ctx.fillRect(16, 24, 3, 6);
        ctx.fillRect(26, 24, 3, 6); ctx.fillRect(32, 24, 3, 6);
        return canvas;
    }

    createRockSpiritSprite() {
        const { canvas, ctx } = this.createCanvas(44, 44);
        const grad = ctx.createRadialGradient(22, 22, 0, 22, 22, 22);
        grad.addColorStop(0, '#64748b');
        grad.addColorStop(1, '#334155');
        ctx.fillStyle = grad;
        
        // Jagged rock shape
        ctx.beginPath();
        ctx.moveTo(22, 2); ctx.lineTo(38, 14); ctx.lineTo(42, 30); 
        ctx.lineTo(28, 42); ctx.lineTo(12, 38); ctx.lineTo(2, 22); 
        ctx.closePath(); ctx.fill();
        
        // Glowing veins
        ctx.strokeStyle = '#0ea5e9';
        ctx.shadowColor = '#0ea5e9';
        ctx.shadowBlur = 10;
        ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(10, 10); ctx.lineTo(22, 22); ctx.lineTo(30, 15); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(22, 22); ctx.lineTo(25, 35); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(22, 22); ctx.lineTo(8, 30); ctx.stroke();
        
        return canvas;
    }

    createBatSprite() {
        const { canvas, ctx } = this.createCanvas(40, 30);
        ctx.fillStyle = '#1e293b';
        ctx.beginPath(); ctx.arc(20, 15, 7, 0, Math.PI * 2); ctx.fill(); // Body
        
        // Wings
        ctx.beginPath();
        ctx.moveTo(15, 15); ctx.quadraticCurveTo(5, 0, 0, 10); ctx.quadraticCurveTo(8, 25, 15, 18);
        ctx.moveTo(25, 15); ctx.quadraticCurveTo(35, 0, 40, 10); ctx.quadraticCurveTo(32, 25, 25, 18);
        ctx.fill();
        
        // Eyes
        ctx.shadowColor = '#ef4444'; ctx.shadowBlur = 5;
        ctx.fillStyle = '#ef4444';
        ctx.beginPath(); ctx.arc(17, 14, 1.5, 0, Math.PI * 2); ctx.arc(23, 14, 1.5, 0, Math.PI * 2); ctx.fill();
        return canvas;
    }

    createShadowMonkSprite() {
        const { canvas, ctx } = this.createCanvas(48, 64);
        
        // Robe
        const grad = ctx.createLinearGradient(0, 0, 0, 64);
        grad.addColorStop(0, '#4c1d95');
        grad.addColorStop(1, '#0f172a');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.moveTo(24, 10); ctx.lineTo(40, 60); ctx.lineTo(8, 60); ctx.closePath();
        ctx.fill();
        
        // Hood/Face area
        ctx.fillStyle = '#020617';
        ctx.beginPath(); ctx.arc(24, 18, 12, 0, Math.PI*2); ctx.fill();
        
        // Glowing eyes
        ctx.shadowColor = '#facc15'; ctx.shadowBlur = 10;
        ctx.fillStyle = '#facc15';
        ctx.beginPath(); ctx.arc(20, 18, 2, 0, Math.PI*2); ctx.arc(28, 18, 2, 0, Math.PI*2); ctx.fill();
        
        // Magic orb in hand
        ctx.shadowColor = '#c084fc'; ctx.shadowBlur = 15;
        ctx.fillStyle = '#c084fc';
        ctx.beginPath(); ctx.arc(10, 40, 6, 0, Math.PI*2); ctx.fill();
        
        return canvas;
    }

    createSnowDemonSprite() {
        const { canvas, ctx } = this.createCanvas(60, 80);
        // Body
        const grad = ctx.createRadialGradient(30, 40, 10, 30, 40, 35);
        grad.addColorStop(0, '#38bdf8');
        grad.addColorStop(1, '#1e3a8a');
        ctx.fillStyle = grad;
        ctx.beginPath(); ctx.roundRect(15, 20, 30, 50, 15); ctx.fill();
        
        // Ice Spikes on back
        ctx.fillStyle = '#bae6fd';
        ctx.beginPath(); ctx.moveTo(40, 30); ctx.lineTo(55, 25); ctx.lineTo(45, 40); ctx.fill();
        ctx.beginPath(); ctx.moveTo(40, 50); ctx.lineTo(55, 45); ctx.lineTo(45, 60); ctx.fill();
        
        // Head
        ctx.fillStyle = '#60a5fa';
        ctx.beginPath(); ctx.arc(25, 25, 14, 0, Math.PI*2); ctx.fill();
        
        // Face
        ctx.fillStyle = '#ef4444';
        ctx.shadowColor = '#ef4444'; ctx.shadowBlur = 8;
        ctx.beginPath(); ctx.moveTo(15, 20); ctx.lineTo(25, 25); ctx.lineTo(15, 30); ctx.fill();
        
        return canvas;
    }

    createYetiSprite() {
        const { canvas, ctx } = this.createCanvas(140, 160);
        ctx.shadowColor = 'rgba(0,0,0,0.5)'; ctx.shadowBlur = 15;
        
        // Massive body
        const grad = ctx.createRadialGradient(70, 80, 20, 70, 80, 70);
        grad.addColorStop(0, '#ffffff');
        grad.addColorStop(0.7, '#cbd5e1');
        grad.addColorStop(1, '#94a3b8');
        ctx.fillStyle = grad;
        ctx.beginPath(); ctx.arc(70, 90, 60, 0, Math.PI*2); ctx.fill();
        
        // Head
        ctx.shadowColor = 'transparent';
        ctx.fillStyle = '#e2e8f0';
        ctx.beginPath(); ctx.arc(70, 40, 35, 0, Math.PI*2); ctx.fill();
        
        // Face plate (blueish)
        ctx.fillStyle = '#38bdf8';
        ctx.beginPath(); ctx.arc(70, 40, 22, 0, Math.PI*2); ctx.fill();
        
        // Glowing Red Eyes
        ctx.shadowColor = '#ef4444'; ctx.shadowBlur = 15;
        ctx.fillStyle = '#ef4444';
        ctx.beginPath(); ctx.arc(60, 35, 6, 0, Math.PI*2); ctx.arc(80, 35, 6, 0, Math.PI*2); ctx.fill();
        
        // Roar Mouth
        ctx.shadowColor = 'transparent';
        ctx.fillStyle = '#0f172a';
        ctx.beginPath(); ctx.arc(70, 50, 10, 0, Math.PI); ctx.fill();
        ctx.fillStyle = '#fff';
        ctx.beginPath(); ctx.moveTo(60, 50); ctx.lineTo(65, 55); ctx.lineTo(70, 50); ctx.fill();
        ctx.beginPath(); ctx.moveTo(70, 50); ctx.lineTo(75, 55); ctx.lineTo(80, 50); ctx.fill();

        // Giant Arms
        ctx.fillStyle = '#cbd5e1';
        ctx.beginPath(); ctx.arc(20, 110, 25, 0, Math.PI*2); ctx.fill();
        ctx.beginPath(); ctx.arc(120, 110, 25, 0, Math.PI*2); ctx.fill();

        return canvas;
    }
}

export const assets = new AssetGenerator();
export default assets;
