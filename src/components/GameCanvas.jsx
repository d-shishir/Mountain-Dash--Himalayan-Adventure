import React, { useEffect, useRef } from 'react';
import { Player, Projectile } from '../utils/entities';
import { PhysicsEngine } from '../utils/physics';
import { WorldManager } from '../utils/world';
import { assets } from '../utils/assets';
import { audio } from '../utils/audio';

const worldManager = new WorldManager();

export default function GameCanvas({ 
    worldId, 
    levelNum, 
    upgrades, 
    gameState, 
    controlsRef, 
    onHUDUpdate, 
    onVictory, 
    onGameOver 
}) {
    const canvasRef = useRef(null);
    const loopRef = useRef(null);
    
    // Game variables references to prevent React re-renders on every frame
    const gameVars = useRef({
        level: null,
        player: null,
        projectiles: [],
        particles: [],
        weatherParticles: [],
        camera: { x: 0, y: 0, targetX: 0, targetY: 0 },
        width: 960,
        height: 540,
        lastTime: 0,
        accumulator: 0
    });

    useEffect(() => {
        // Initialize Level
        const vars = gameVars.current;
        vars.level = worldManager.generateLevel(worldId, levelNum);
        
        vars.player = new Player(100, 300);
        vars.player.maxHearts = upgrades.hearts;
        vars.player.hearts = vars.player.maxHearts;
        vars.player.jumpForce = -10.5 - (upgrades.jump * 0.5);
        vars.player.baseSpeed = 4.2 + (upgrades.speed * 0.3);
        if (upgrades.khukuri > 0) vars.player.hasKhukuri = true;
        
        vars.projectiles = [];
        vars.particles = [];
        vars.weatherParticles = [];
        
        // Seed weather
        const weather = vars.level.weather;
        if (weather !== 'none' && weather !== 'clear') {
            const count = weather === 'blossom_petals' ? 60 : 100;
            for (let i = 0; i < count; i++) {
                vars.weatherParticles.push({
                    x: Math.random() * vars.width,
                    y: Math.random() * vars.height,
                    vx: weather.includes('wind') ? -3.5 : (Math.random() * 1 - 0.5),
                    vy: weather === 'rain' ? 8.5 : 1.5,
                    size: weather === 'rain' ? 1.5 : Math.random() * 2 + 1,
                    type: weather === 'blossom_petals' ? 'leaf' : 'snow'
                });
            }
        }

        vars.camera = { x: 0, y: 0, targetX: 0, targetY: 0 };
        vars.lastTime = performance.now();
        vars.accumulator = 0;
        
        audio.startMusic();

        return () => {
            // Cleanup on unmount/level change
            audio.stopMusic();
        };
    }, [worldId, levelNum, upgrades]);

    useEffect(() => {
        const FPS = 60;
        const dt = 1000 / FPS;

        const handleLoop = (currentTime) => {
            if (gameState !== 'play') {
                gameVars.current.lastTime = currentTime;
                loopRef.current = requestAnimationFrame(handleLoop);
                return;
            }
            
            const vars = gameVars.current;
            let frameTime = currentTime - vars.lastTime;
            if (frameTime > 250) frameTime = 250; // Cap to prevent death spirals
            vars.lastTime = currentTime;
            vars.accumulator += frameTime;

            // Fixed time-step update
            while (vars.accumulator >= dt) {
                updateGame();
                vars.accumulator -= dt;
            }

            drawGame();
            
            loopRef.current = requestAnimationFrame(handleLoop);
        };

        if (gameState === 'play') {
            gameVars.current.lastTime = performance.now();
            loopRef.current = requestAnimationFrame(handleLoop);
        }

        return () => {
            if (loopRef.current) {
                cancelAnimationFrame(loopRef.current);
            }
        };
    }, [gameState]);

    const updateGame = () => {
        const vars = gameVars.current;
        if (!vars.player || !vars.level) return;

        const controls = controlsRef.current;
        
        // Sync inputs
        vars.player.controls = controls;
        vars.player.update(controls, vars.level);

        // Clear jump pressed tap trigger
        if (controls.jumpPressed) controls.jumpPressed = false;

        // Handle Projectiles
        if ((vars.player.activePowerup === 'snow_spirit' || vars.player.hasKhukuri) && controls.attack && vars.player.attackFrame === 1) {
            const vx = vars.player.facing === 'right' ? 8 : -8;
            vars.projectiles.push(new Projectile(vars.player.x + vars.player.width/2, vars.player.y + 15, vx, 0, vars.player.activePowerup === 'snow_spirit' ? 'ice' : 'blade'));
        }

        vars.projectiles.forEach((p, idx) => {
            p.update();
            if (p.life <= 0) vars.projectiles.splice(idx, 1);
        });

        // Moving platforms
        vars.level.platforms.forEach(plat => {
            if (plat.vx) {
                plat.x += plat.vx;
                if (Math.abs(plat.x - plat.startX) > plat.range) {
                    plat.vx *= -1;
                }
            }
            if (plat.type === 'falling' && plat.triggered) {
                plat.collapseTimer--;
                if (plat.collapseTimer <= 0) plat.y += 12;
            }
        });

        // Enemies update & combat checks
        vars.level.enemies.forEach(enemy => {
            enemy.update(vars.level, vars.player);
            
            // Player Melee Attack
            if (vars.player.isAttacking && vars.player.attackFrame === 5) {
                const swordRange = {
                    x: vars.player.facing === 'right' ? vars.player.x + vars.player.width : vars.player.x - 40,
                    y: vars.player.y - 10,
                    width: 40,
                    height: vars.player.height + 20
                };
                if (PhysicsEngine.checkCollision(swordRange, enemy)) {
                    enemy.takeDamage(1);
                    vars.player.score += 100;
                    createSquishParticles(enemy.x + enemy.width/2, enemy.y + enemy.height/2, 'spark');
                    vars.player.hitStopTimer = 3;
                }
            }

            // Projectiles collisions
            vars.projectiles.forEach((p, pIdx) => {
                if (PhysicsEngine.checkCollision(p, enemy)) {
                    enemy.takeDamage(1);
                    vars.projectiles.splice(pIdx, 1);
                    vars.player.score += 150;
                    createSquishParticles(p.x, p.y, 'spark');
                }
            });

            // Player vs Enemy Collisions
            if (!enemy.isDead && PhysicsEngine.checkCollision(vars.player, enemy)) {
                if (vars.player.vy > 0.5 && vars.player.y + vars.player.height - vars.player.vy < enemy.y + 15) {
                    enemy.takeDamage(1);
                    vars.player.vy = vars.player.jumpForce * 0.8;
                    vars.player.doubleJumpsLeft = vars.player.maxDoubleJumps;
                    vars.player.score += 200;
                    audio.playSFX('jump');
                    createSquishParticles(enemy.x + enemy.width/2, enemy.y, 'spark');
                } else {
                    const isBoss = enemy.type.startsWith('boss_');
                    vars.player.takeDamage(isBoss ? 1.0 : 0.5);
                }
            }
        });

        PhysicsEngine.handlePlatformCollisions(vars.player, vars.level.platforms);

        // Collect items
        vars.level.items.forEach((item, idx) => {
            const itemRect = { x: item.x, y: item.y, width: 32, height: 32 };
            if (PhysicsEngine.checkCollision(vars.player, itemRect)) {
                vars.level.items.splice(idx, 1);
                createSquishParticles(item.x+15, item.y+15, 'spark');
                if (item.type === 'coin') {
                    vars.player.coins++;
                    vars.player.score += 50;
                    audio.playSFX('coin');
                } else if (item.type === 'yak_milk' || item.type === 'sel_roti') {
                    vars.player.heal(1);
                } else {
                    vars.player.activePowerup = item.type;
                    vars.player.powerupTimer = 60 * 15;
                    audio.playSFX('powerup');
                }
            }
        });

        // Bounds death check
        if (vars.player.y > vars.height + 100) vars.player.hearts = 0;

        // Check Victory
        if (PhysicsEngine.checkCollision(vars.player, vars.level.exitPortal)) {
            const levelScore = vars.player.coins * 100 + 1000;
            onVictory(vars.player.coins, levelScore);
            return;
        }

        // Check GameOver
        if (vars.player.hearts <= 0) {
            onGameOver();
            return;
        }

        // Smooth Camera Lookahead
        const lookahead = vars.player.facing === 'right' ? 100 : -100;
        vars.camera.targetX = vars.player.x - vars.width / 2.5 + lookahead;
        vars.camera.x += (vars.camera.targetX - vars.camera.x) * 0.08;
        
        vars.camera.targetY = vars.player.y - vars.height / 1.8;
        vars.camera.y += (vars.camera.targetY - vars.camera.y) * 0.05;

        // Clamp Camera
        const maxCamX = (vars.level.width * vars.level.tileSize) - vars.width;
        const maxCamY = (vars.level.height * vars.level.tileSize) - vars.height + 40;
        if (vars.camera.x < 0) vars.camera.x = 0;
        if (vars.camera.x > maxCamX) vars.camera.x = maxCamX;
        if (vars.camera.y > maxCamY) vars.camera.y = maxCamY;

        // Weather particles
        vars.weatherParticles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            if (p.y > vars.height) { p.y = -10; p.x = Math.random() * vars.width; }
            if (p.x < -20) { p.x = vars.width + 20; p.y = Math.random() * vars.height; }
        });

        // Effect particles
        vars.particles.forEach((p, idx) => {
            p.x += p.vx;
            p.y += p.vy;
            p.life--;
            if (p.life <= 0) vars.particles.splice(idx, 1);
        });

        // Update React HUD states
        const progressPercent = Math.min(100, Math.max(0, Math.round((vars.player.x / (vars.level.width * vars.level.tileSize)) * 100)));
        if (Math.random() < 0.1) { // Only update UI periodically to save React renders
            onHUDUpdate({
                hearts: vars.player.hearts,
                maxHearts: vars.player.maxHearts,
                coins: vars.player.coins,
                score: vars.player.score,
                progress: progressPercent,
                activePowerup: vars.player.activePowerup,
                powerupTimer: Math.round(vars.player.powerupTimer / 60)
            });
        }
    };

    const createSquishParticles = (x, y, type) => {
        const vars = gameVars.current;
        for (let i = 0; i < 8; i++) {
            vars.particles.push({
                x,
                y,
                vx: Math.random() * 6 - 3,
                vy: Math.random() * 6 - 4,
                type: type,
                life: 20 + Math.random() * 20
            });
        }
    };

    const drawGame = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = false; // Make foreground assets extremely crisp!
        const vars = gameVars.current;
        const level = vars.level;
        if (!level) return;

        // 1. Draw Sky (Deep Gradients)
        const skyGrad = ctx.createLinearGradient(0, 0, 0, vars.height);
        skyGrad.addColorStop(0, level.skyColor[0]);
        skyGrad.addColorStop(1, level.skyColor[1]);
        ctx.fillStyle = skyGrad;
        ctx.fillRect(0, 0, vars.width, vars.height);

        // Atmospheric glowing sun / moon
        ctx.globalCompositeOperation = 'lighter';
        const sunGrad = ctx.createRadialGradient(vars.width * 0.8, vars.height * 0.3, 10, vars.width * 0.8, vars.height * 0.3, 300);
        sunGrad.addColorStop(0, 'rgba(251, 191, 36, 0.4)');
        sunGrad.addColorStop(1, 'rgba(251, 191, 36, 0)');
        ctx.fillStyle = sunGrad;
        ctx.fillRect(0, 0, vars.width, vars.height);
        ctx.globalCompositeOperation = 'source-over';

        // 2. Parallax Layers (Generated Backgrounds)
        const drawParallaxLayer = (image, speedMultiplier, yOffset, scale) => {
            if (!image || !image.complete || image.naturalWidth === 0) return;
            const scaledWidth = image.width * scale;
            const scaledHeight = image.height * scale;
            
            const totalCameraOffset = vars.camera.x * speedMultiplier;
            const tileIndexStart = Math.floor(totalCameraOffset / scaledWidth);
            const offsetX = -(totalCameraOffset % scaledWidth);
            
            let currentX = offsetX;
            let currentTileIndex = tileIndexStart;
            
            while (currentX < vars.width) {
                const isFlipped = Math.abs(currentTileIndex % 2) === 1;
                ctx.save();
                if (isFlipped) {
                    ctx.translate(Math.floor(currentX + scaledWidth), yOffset);
                    ctx.scale(-1, 1);
                    ctx.drawImage(image, 0, 0, Math.ceil(scaledWidth), Math.ceil(scaledHeight));
                } else {
                    ctx.translate(Math.floor(currentX), yOffset);
                    ctx.drawImage(image, 0, 0, Math.ceil(scaledWidth), Math.ceil(scaledHeight));
                }
                ctx.restore();
                
                currentX += scaledWidth;
                currentTileIndex++;
            }
        };

        const bgImg = assets.images.distantMountains;
        const bgImgWidth = (bgImg && bgImg.naturalWidth) ? bgImg.naturalWidth : 1024;
        const bgImgHeight = (bgImg && bgImg.naturalHeight) ? bgImg.naturalHeight : 512;
        const bgScale = Math.max(vars.width / bgImgWidth, vars.height / bgImgHeight);
        
        // Distant Mountains / Custom Village Background (Top Aligned, scaled to fit height, blurred for depth)
        ctx.save();
        ctx.imageSmoothingEnabled = true; // Smooth scaling for high-res photo background
        ctx.filter = 'blur(3px) brightness(95%)'; // Cinematic depth-of-field blur and brightness balance
        drawParallaxLayer(bgImg, 0.05, 0, bgScale);
        ctx.restore();

        // Fog overlay for depth
        ctx.fillStyle = 'rgba(255,255,255,0.05)';
        ctx.fillRect(0, 0, vars.width, vars.height);

        // 3. Level Grid Rendering
        const startTileX = Math.max(0, Math.floor(vars.camera.x / level.tileSize));
        const endTileX = Math.min(level.width, Math.ceil((vars.camera.x + vars.width) / level.tileSize));
        const startTileY = Math.max(0, Math.floor(vars.camera.y / level.tileSize));
        const endTileY = Math.min(level.height, Math.ceil((vars.camera.y + vars.height) / level.tileSize));

        for (let y = startTileY; y < endTileY; y++) {
            for (let x = startTileX; x < endTileX; x++) {
                const code = level.tiles[y][x];
                if (code === 1) {
                    const img = assets.sprites.tiles[level.tileType];
                    if (img) ctx.drawImage(img, Math.floor(x * level.tileSize - vars.camera.x), Math.floor(y * level.tileSize - vars.camera.y), level.tileSize, level.tileSize);
                } else if (code === 2) {
                    const img = assets.sprites.tiles.spikes;
                    if (img) ctx.drawImage(img, Math.floor(x * level.tileSize - vars.camera.x), Math.floor(y * level.tileSize - vars.camera.y), level.tileSize, level.tileSize);
                }
            }
        }

        // 4. Platforms
        level.platforms.forEach(plat => {
            const img = assets.sprites.tiles[plat.type === 'falling' ? 'bridge' : 'ice'];
            if (img) ctx.drawImage(img, Math.floor(plat.x - vars.camera.x), Math.floor(plat.y - vars.camera.y), plat.width, plat.height);
        });

        // 5. Portals & Items
        ctx.drawImage(assets.sprites.tiles.flag, Math.floor(level.exitPortal.x - vars.camera.x), Math.floor(level.exitPortal.y - vars.camera.y), level.exitPortal.width, level.exitPortal.height);

        level.items.forEach(item => {
            const img = assets.sprites.items[item.type] || assets.sprites.items.coin;
            const floatY = Math.sin(Date.now() / 200) * 5;
            if (img) {
                ctx.shadowColor = 'rgba(251, 191, 36, 0.8)';
                ctx.shadowBlur = 10;
                ctx.drawImage(img, Math.floor(item.x - vars.camera.x), Math.floor(item.y - vars.camera.y + floatY), 32, 32);
                ctx.shadowBlur = 0;
            }
        });

        // 6. Enemies
        level.enemies.forEach(enemy => {
            enemy.draw(ctx, vars.camera);
        });

        // 7. Player
        vars.player.draw(ctx, vars.camera);

        // 8. Projectiles & Effects
        vars.projectiles.forEach(p => {
            p.draw(ctx, vars.camera);
        });

        // Particles
        ctx.globalCompositeOperation = 'lighter';
        vars.particles.forEach(p => {
            ctx.globalAlpha = p.life / 40;
            const img = assets.sprites.particles[p.type];
            if (img) ctx.drawImage(img, Math.floor(p.x - vars.camera.x), Math.floor(p.y - vars.camera.y), 12, 12);
        });
        ctx.globalAlpha = 1.0;

        // Weather
        vars.weatherParticles.forEach(p => {
            ctx.globalAlpha = 0.6;
            const img = assets.sprites.particles[p.type];
            if (img) ctx.drawImage(img, Math.floor(p.x), Math.floor(p.y), p.size * 5, p.size * 5);
        });
        ctx.globalAlpha = 1.0;
        ctx.globalCompositeOperation = 'source-over';
        
        // Post-processing vignette
        const vig = ctx.createRadialGradient(vars.width/2, vars.height/2, vars.height*0.4, vars.width/2, vars.height/2, vars.width*0.8);
        vig.addColorStop(0, 'rgba(0,0,0,0)');
        vig.addColorStop(1, 'rgba(0,0,0,0.6)');
        ctx.fillStyle = vig;
        ctx.fillRect(0, 0, vars.width, vars.height);
    };

    return (
        <canvas 
            id="game-canvas"
            ref={canvasRef}
            width={960}
            height={540}
        />
    );
}
