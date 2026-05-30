// Procedural Canvas Sprite Generator for React Mountain Dash

class AssetGenerator {
    constructor() {
        this.sprites = {};
        this.generateAssets();
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
    }

    createCanvas(w, h) {
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = true;
        return { canvas, ctx };
    }

    createTileSprite(type) {
        const { canvas, ctx } = this.createCanvas(40, 40);
        const grad = ctx.createLinearGradient(0, 0, 0, 40);

        if (type === 'grass') {
            grad.addColorStop(0, '#10b981');
            grad.addColorStop(0.3, '#047857');
            grad.addColorStop(1, '#064e3b');
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, 40, 40);
            ctx.fillStyle = '#34d399';
            ctx.fillRect(5, 0, 5, 6);
            ctx.fillRect(15, 0, 4, 8);
            ctx.fillRect(25, 0, 6, 5);
            ctx.fillRect(32, 0, 4, 7);
        } else if (type === 'forest') {
            grad.addColorStop(0, '#78350f');
            grad.addColorStop(1, '#451a03');
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, 40, 40);
            ctx.fillStyle = '#ec4899';
            ctx.beginPath();
            ctx.arc(8, 5, 4, 0, Math.PI * 2);
            ctx.arc(24, 6, 3, 0, Math.PI * 2);
            ctx.arc(32, 4, 4, 0, Math.PI * 2);
            ctx.fill();
        } else if (type === 'cave') {
            grad.addColorStop(0, '#334155');
            grad.addColorStop(1, '#1e293b');
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, 40, 40);
            ctx.fillStyle = '#c084fc';
            ctx.beginPath();
            ctx.moveTo(10, 10); ctx.lineTo(13, 5); ctx.lineTo(16, 10); ctx.lineTo(13, 15);
            ctx.moveTo(30, 25); ctx.lineTo(33, 20); ctx.lineTo(36, 25); ctx.lineTo(33, 30);
            ctx.fill();
        } else if (type === 'temple') {
            ctx.fillStyle = '#b45309';
            ctx.fillRect(0, 0, 40, 40);
            ctx.strokeStyle = '#78350f';
            ctx.lineWidth = 2;
            ctx.strokeRect(0, 0, 40, 40);
            ctx.beginPath();
            ctx.moveTo(0, 20); ctx.lineTo(40, 20);
            ctx.moveTo(20, 0); ctx.lineTo(20, 20);
            ctx.moveTo(10, 20); ctx.lineTo(10, 40);
            ctx.moveTo(30, 20); ctx.lineTo(30, 40);
            ctx.stroke();
        } else if (type === 'snow') {
            grad.addColorStop(0, '#f8fafc');
            grad.addColorStop(0.4, '#e2e8f0');
            grad.addColorStop(1, '#94a3b8');
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, 40, 40);
        } else if (type === 'ice') {
            grad.addColorStop(0, '#bae6fd');
            grad.addColorStop(0.5, '#38bdf8');
            grad.addColorStop(1, '#0284c7');
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, 40, 40);
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(5, 35); ctx.lineTo(35, 5);
            ctx.stroke();
        } else if (type === 'spirit') {
            grad.addColorStop(0, '#818cf8');
            grad.addColorStop(1, '#312e81');
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, 40, 40);
            ctx.strokeStyle = '#fbbf24';
            ctx.lineWidth = 1.5;
            ctx.strokeRect(4, 4, 32, 32);
        } else if (type === 'dark') {
            grad.addColorStop(0, '#1e1b4b');
            grad.addColorStop(1, '#030712');
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, 40, 40);
            ctx.strokeStyle = '#ef4444';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(0, 10); ctx.lineTo(20, 25); ctx.lineTo(40, 15);
            ctx.stroke();
        }
        return canvas;
    }

    createSpikesSprite() {
        const { canvas, ctx } = this.createCanvas(40, 40);
        ctx.fillStyle = '#64748b';
        ctx.beginPath();
        ctx.moveTo(0, 40); ctx.lineTo(7, 10); ctx.lineTo(13, 40);
        ctx.moveTo(13, 40); ctx.lineTo(20, 10); ctx.lineTo(27, 40);
        ctx.moveTo(27, 40); ctx.lineTo(33, 10); ctx.lineTo(40, 40);
        ctx.fill();
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 1.5;
        ctx.stroke();
        return canvas;
    }

    createBridgeSprite() {
        const { canvas, ctx } = this.createCanvas(40, 15);
        ctx.fillStyle = '#b45309';
        ctx.fillRect(2, 2, 36, 11);
        ctx.strokeStyle = '#78350f';
        ctx.lineWidth = 2;
        ctx.strokeRect(2, 2, 36, 11);
        ctx.fillStyle = '#e2e8f0';
        ctx.fillRect(6, 0, 4, 15);
        ctx.fillRect(30, 0, 4, 15);
        return canvas;
    }

    createFlagSprite() {
        const { canvas, ctx } = this.createCanvas(40, 40);
        ctx.fillStyle = '#b45309';
        ctx.fillRect(18, 0, 4, 40);
        ctx.fillStyle = '#d9383a';
        ctx.beginPath();
        ctx.moveTo(22, 5);
        ctx.lineTo(38, 12);
        ctx.lineTo(22, 20);
        ctx.closePath();
        ctx.fill();
        return canvas;
    }

    createCoinSprite() {
        const { canvas, ctx } = this.createCanvas(30, 30);
        const grad = ctx.createRadialGradient(15, 15, 2, 15, 15, 14);
        grad.addColorStop(0, '#fffbeb');
        grad.addColorStop(0.5, '#fbbf24');
        grad.addColorStop(1, '#b45309');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(15, 15, 12, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(15, 15, 7, 0, Math.PI * 2);
        ctx.stroke();
        return canvas;
    }

    createSelRotiSprite() {
        const { canvas, ctx } = this.createCanvas(30, 30);
        ctx.fillStyle = '#d97706';
        ctx.strokeStyle = '#92400e';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(15, 15, 11, 0, Math.PI * 2);
        ctx.arc(15, 15, 4, 0, Math.PI * 2, true);
        ctx.fill();
        ctx.stroke();
        return canvas;
    }

    createItemSprite(emoji, color) {
        const { canvas, ctx } = this.createCanvas(32, 32);
        const grad = ctx.createRadialGradient(16, 16, 2, 16, 16, 15);
        grad.addColorStop(0, color + '77');
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(16, 16, 15, 0, Math.PI * 2);
        ctx.fill();
        ctx.font = '20px Outfit';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(emoji, 16, 16);
        return canvas;
    }

    createKhukuriPowerupSprite() {
        const { canvas, ctx } = this.createCanvas(32, 32);
        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 3.5;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(8, 24);
        ctx.quadraticCurveTo(14, 18, 12, 14);
        ctx.quadraticCurveTo(18, 8, 24, 8);
        ctx.stroke();
        ctx.strokeStyle = '#78350f';
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(8, 24);
        ctx.lineTo(5, 27);
        ctx.stroke();
        return canvas;
    }

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

        if (state.startsWith('walk')) {
            const step = state === 'walk1' ? 1 : -1;
            lLegAngle = 0.4 * step;
            rLegAngle = -0.4 * step;
            lArmAngle = -0.3 * step;
            rArmAngle = 0.3 * step;
        } else if (state.startsWith('run')) {
            const step = state === 'run1' ? 1 : -1;
            lLegAngle = 0.7 * step;
            rLegAngle = -0.7 * step;
            lArmAngle = -0.6 * step;
            rArmAngle = 0.6 * step;
            bodyY = 29;
            headY = 18;
        } else if (state === 'jump') {
            lLegAngle = 0.5;
            rLegAngle = -0.2;
            lArmAngle = -1.2;
            rArmAngle = -0.8;
            bodyY = 24;
            headY = 12;
        } else if (state === 'double_jump') {
            lLegAngle = 0.9;
            rLegAngle = -0.9;
            lArmAngle = -1.8;
            rArmAngle = -1.8;
            bodyY = 20;
            headY = 8;
        } else if (state === 'hurt') {
            lLegAngle = -0.3;
            rLegAngle = 0.3;
            lArmAngle = -1.5;
            rArmAngle = 1.5;
            bodyY = 32;
            headY = 20;
        } else if (state === 'victory') {
            lLegAngle = 0;
            rLegAngle = 0;
            lArmAngle = -2.3;
            rArmAngle = -2.3;
            bodyY = 27;
            headY = 15;
        } else if (state === 'slide') {
            bodyY = 44;
            headY = 36;
            lLegAngle = -1.2;
            rLegAngle = -1.2;
            lArmAngle = 1.0;
            rArmAngle = 1.0;
        }

        ctx.fillStyle = '#b45309';
        if (isSliding) {
            ctx.fillRect(8, bodyY - 6, 12, 16);
        } else {
            ctx.fillRect(8, bodyY + 2, 10, 20);
        }

        ctx.fillStyle = '#e2e8f0';
        if (isSliding) {
            ctx.fillRect(16, bodyY, 20, 12);
        } else {
            ctx.fillRect(16, bodyY, 16, 22);
        }

        ctx.fillStyle = '#d9383a';
        if (isSliding) {
            ctx.fillRect(28, bodyY - 4, 8, 5);
            ctx.fillRect(16, bodyY - 2, 12, 3);
        } else {
            ctx.fillRect(18, bodyY - 3, 14, 5);
            ctx.fillRect(12, bodyY + 2, 6, 14);
        }

        ctx.fillStyle = '#fed7aa';
        ctx.beginPath();
        ctx.arc(24, headY, 8, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#334155';
        ctx.beginPath();
        ctx.moveTo(15, headY - 5);
        ctx.lineTo(24, headY - 14);
        ctx.lineTo(33, headY - 5);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = '#fbbf24';
        ctx.fillRect(17, headY - 7, 14, 2);

        ctx.fillStyle = '#000';
        if (state === 'hurt') {
            ctx.font = '10px Outfit';
            ctx.fillText('x', 23, headY - 1);
        } else {
            ctx.fillRect(26, headY - 2, 2, 3);
        }

        ctx.strokeStyle = '#e2e8f0';
        ctx.lineWidth = 5;
        ctx.lineCap = 'round';

        ctx.save();
        ctx.translate(18, bodyY + 6);
        ctx.rotate(lArmAngle);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, 12);
        ctx.stroke();
        ctx.restore();

        ctx.save();
        ctx.translate(30, bodyY + 6);
        if (isAttacking) {
            ctx.rotate(-1.2);
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(0, 16);
            ctx.stroke();
            ctx.strokeStyle = '#cbd5e1';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(0, 16);
            ctx.quadraticCurveTo(8, 22, 12, 30);
            ctx.stroke();
        } else {
            ctx.rotate(rArmAngle);
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(0, 12);
            ctx.stroke();
        }
        ctx.restore();

        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 6;

        ctx.save();
        ctx.translate(20, bodyY + 20);
        ctx.rotate(lLegAngle);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, 12);
        ctx.stroke();
        ctx.fillStyle = '#78350f';
        ctx.fillRect(-3, 10, 8, 4);
        ctx.restore();

        ctx.save();
        ctx.translate(28, bodyY + 20);
        ctx.rotate(rLegAngle);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, 12);
        ctx.stroke();
        ctx.fillStyle = '#78350f';
        ctx.fillRect(-3, 10, 8, 4);
        ctx.restore();

        ctx.restore();
        return canvas;
    }

    createMonkeySprite(isBoss) {
        const size = isBoss ? 80 : 40;
        const { canvas, ctx } = this.createCanvas(size, size);
        ctx.fillStyle = '#78350f';
        ctx.beginPath();
        ctx.arc(size/2, size/2 + size*0.1, size*0.35, 0, Math.PI*2);
        ctx.fill();
        ctx.fillStyle = '#fed7aa';
        ctx.beginPath();
        ctx.arc(size/2, size/2, size*0.25, 0, Math.PI*2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(size/2 - size*0.28, size/2, size*0.08, 0, Math.PI*2);
        ctx.arc(size/2 + size*0.28, size/2, size*0.08, 0, Math.PI*2);
        ctx.fill();
        ctx.fillStyle = '#000';
        ctx.fillRect(size/2 - size*0.1, size/2 - size*0.06, size*0.05, size*0.08);
        ctx.fillRect(size/2 + size*0.05, size/2 - size*0.06, size*0.05, size*0.08);
        return canvas;
    }

    createYakSprite(isBoss) {
        const w = isBoss ? 90 : 48;
        const h = isBoss ? 70 : 38;
        const { canvas, ctx } = this.createCanvas(w, h);
        ctx.fillStyle = '#1e1b4b';
        ctx.fillRect(w * 0.15, h * 0.25, w * 0.7, h * 0.6);
        ctx.fillStyle = '#312e81';
        ctx.fillRect(w * 0.65, h * 0.15, w * 0.25, h * 0.35);
        ctx.strokeStyle = '#f1f5f9';
        ctx.lineWidth = isBoss ? 5 : 3;
        ctx.beginPath();
        ctx.moveTo(w * 0.75, h * 0.15);
        ctx.quadraticCurveTo(w * 0.72, h * 0.02, w * 0.65, h * 0.02);
        ctx.moveTo(w * 0.85, h * 0.15);
        ctx.quadraticCurveTo(w * 0.88, h * 0.02, w * 0.95, h * 0.02);
        ctx.stroke();
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(w * 0.25, h * 0.8, w * 0.1, h * 0.2);
        ctx.fillRect(w * 0.45, h * 0.8, w * 0.1, h * 0.2);
        ctx.fillRect(w * 0.65, h * 0.8, w * 0.1, h * 0.2);
        return canvas;
    }

    createFoxSprite() {
        const { canvas, ctx } = this.createCanvas(40, 30);
        ctx.fillStyle = '#ea580c';
        ctx.fillRect(6, 12, 28, 12);
        ctx.fillRect(26, 4, 10, 12);
        ctx.fillStyle = '#c2410c';
        ctx.fillRect(0, 14, 8, 6);
        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(16, 20, 12, 4);
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(10, 24, 3, 6);
        ctx.fillRect(20, 24, 3, 6);
        ctx.fillRect(30, 24, 3, 6);
        return canvas;
    }

    createRockSpiritSprite() {
        const { canvas, ctx } = this.createCanvas(40, 40);
        ctx.fillStyle = '#475569';
        ctx.beginPath();
        ctx.moveTo(10, 5);
        ctx.lineTo(30, 8);
        ctx.lineTo(38, 25);
        ctx.lineTo(25, 38);
        ctx.lineTo(5, 30);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#f43f5e';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(15, 15); ctx.lineTo(25, 25);
        ctx.moveTo(25, 10); ctx.lineTo(15, 30);
        ctx.stroke();
        return canvas;
    }

    createBatSprite() {
        const { canvas, ctx } = this.createCanvas(40, 30);
        ctx.fillStyle = '#1e293b';
        ctx.beginPath();
        ctx.arc(20, 15, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#06b6d4';
        ctx.beginPath();
        ctx.arc(18, 14, 1.5, 0, Math.PI * 2);
        ctx.arc(22, 14, 1.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.moveTo(14, 15);
        ctx.quadraticCurveTo(6, 6, 2, 18);
        ctx.lineTo(14, 18);
        ctx.moveTo(26, 15);
        ctx.quadraticCurveTo(34, 6, 38, 18);
        ctx.lineTo(26, 18);
        ctx.fill();
        return canvas;
    }

    createShadowMonkSprite() {
        const { canvas, ctx } = this.createCanvas(40, 60);
        ctx.fillStyle = '#312e81';
        ctx.fillRect(8, 20, 24, 40);
        ctx.fillStyle = '#1e1b4b';
        ctx.beginPath();
        ctx.arc(20, 14, 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(20, 15, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#facc15';
        ctx.fillRect(17, 14, 2, 2);
        ctx.fillRect(21, 14, 2, 2);
        return canvas;
    }

    createSnowDemonSprite() {
        const { canvas, ctx } = this.createCanvas(56, 76);
        ctx.fillStyle = '#1e3a8a';
        ctx.fillRect(12, 24, 32, 52);
        ctx.fillStyle = '#3b82f6';
        ctx.fillRect(6, 24, 44, 14);
        ctx.fillStyle = '#60a5fa';
        ctx.beginPath();
        ctx.arc(28, 16, 12, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.moveTo(20, 8); ctx.lineTo(16, 0); ctx.lineTo(24, 6);
        ctx.moveTo(36, 8); ctx.lineTo(40, 0); ctx.lineTo(32, 6);
        ctx.fill();
        return canvas;
    }

    createYetiSprite() {
        const { canvas, ctx } = this.createCanvas(120, 140);
        ctx.fillStyle = '#f8fafc';
        ctx.beginPath();
        ctx.arc(60, 80, 50, 0, Math.PI*2);
        ctx.fill();
        
        ctx.fillStyle = '#e2e8f0';
        ctx.beginPath();
        ctx.arc(60, 40, 30, 0, Math.PI*2);
        ctx.fill();

        ctx.fillStyle = '#93c5fd';
        ctx.beginPath();
        ctx.arc(60, 40, 18, 0, Math.PI*2);
        ctx.fill();

        ctx.fillStyle = '#ef4444';
        ctx.fillRect(52, 36, 5, 5);
        ctx.fillRect(63, 36, 5, 5);

        ctx.fillStyle = '#cbd5e1';
        ctx.beginPath();
        ctx.arc(20, 100, 16, 0, Math.PI*2);
        ctx.arc(100, 100, 16, 0, Math.PI*2);
        ctx.fill();

        return canvas;
    }
}

export const assets = new AssetGenerator();
export default assets;
