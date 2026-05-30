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
        camera: { x: 0, y: 0 },
        width: 960,
        height: 540
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
        
        vars.projectiles = [];
        vars.particles = [];
        vars.weatherParticles = [];
        
        // Seed weather
        const weather = vars.level.weather;
        if (weather !== 'none' && weather !== 'clear') {
            for (let i = 0; i < 40; i++) {
                vars.weatherParticles.push({
                    x: Math.random() * vars.width,
                    y: Math.random() * vars.height,
                    vx: weather.includes('wind') ? -2.5 : (Math.random() * 0.5 - 0.25),
                    vy: weather === 'rain' ? 5.5 : 1.2,
                    size: weather === 'rain' ? 1.5 : Math.random() * 2.5 + 1.2,
                    color: weather === 'blossom_petals' ? '#ec4899' : (weather === 'rain' ? '#38bdf8' : '#ffffff')
                });
            }
        }

        vars.camera = { x: 0, y: 0 };
        audio.startMusic();

        return () => {
            // Cleanup on unmount/level change
            audio.stopMusic();
        };
    }, [worldId, levelNum, upgrades]);

    useEffect(() => {
        const handleLoop = () => {
            if (gameState !== 'play') return;
            
            updateGame();
            drawGame();
            
            loopRef.current = requestAnimationFrame(handleLoop);
        };

        if (gameState === 'play') {
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
        if (controls.jumpPressed) {
            controls.jumpPressed = false;
        }

        // Handle Snow Spirit projectiles
        if (vars.player.activePowerup === 'snow_spirit' && controls.attack && vars.player.attackFrame === 1) {
            const vx = vars.player.facing === 'right' ? 8 : -8;
            vars.projectiles.push(new Projectile(vars.player.x + vars.player.width/2, vars.player.y + 15, vx, 0, 'ice'));
        }

        // Projectiles Update
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
                if (plat.collapseTimer <= 0) {
                    plat.y += 12;
                }
            }
        });

        // Enemies update & combat checks
        vars.level.enemies.forEach(enemy => {
            enemy.update(vars.level, vars.player);
            
            // Player Attack
            if (vars.player.isAttacking && vars.player.attackFrame === 5) {
                const swordRange = {
                    x: vars.player.facing === 'right' ? vars.player.x + vars.player.width : vars.player.x - 30,
                    y: vars.player.y,
                    width: 30,
                    height: vars.player.height
                };
                if (PhysicsEngine.checkCollision(swordRange, enemy)) {
                    enemy.takeDamage(1);
                    vars.player.score += 100;
                    createSquishParticles(enemy.x + enemy.width/2, enemy.y + enemy.height/2, '#ef4444');
                }
            }

            // Projectiles collisions
            vars.projectiles.forEach((p, pIdx) => {
                if (PhysicsEngine.checkCollision(p, enemy)) {
                    enemy.takeDamage(1);
                    vars.projectiles.splice(pIdx, 1);
                    vars.player.score += 150;
                }
            });

            // Player collisions
            if (!enemy.isDead && PhysicsEngine.checkCollision(vars.player, enemy)) {
                if (vars.player.vy > 0.5 && vars.player.y + vars.player.height - vars.player.vy < enemy.y + 12) {
                    enemy.takeDamage(1);
                    vars.player.vy = vars.player.jumpForce * 0.75;
                    vars.player.doubleJumpsLeft = vars.player.maxDoubleJumps;
                    vars.player.score += 200;
                    audio.playSFX('jump');
                    createSquishParticles(enemy.x + enemy.width/2, enemy.y, '#fbbf24');
                } else {
                    vars.player.takeDamage();
                }
            }
        });

        // Resolve platform physics
        PhysicsEngine.handlePlatformCollisions(vars.player, vars.level.platforms);

        // Collect items
        vars.level.items.forEach((item, idx) => {
            if (PhysicsEngine.checkCollision(vars.player, item)) {
                vars.level.items.splice(idx, 1);
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
        if (vars.player.y > vars.height + 40) {
            vars.player.hearts = 0;
        }

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

        // Camera scroll follow
        const targetCamX = vars.player.x - vars.width / 2.5;
        vars.camera.x += (targetCamX - vars.camera.x) * 0.12;
        const maxCamX = (vars.level.width * vars.level.tileSize) - vars.width;
        if (vars.camera.x < 0) vars.camera.x = 0;
        if (vars.camera.x > maxCamX) vars.camera.x = maxCamX;

        // Weather particles
        vars.weatherParticles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            if (p.y > vars.height) {
                p.y = 0;
                p.x = Math.random() * vars.width;
            }
            if (p.x < 0) {
                p.x = vars.width;
                p.y = Math.random() * vars.height;
            }
        });

        // Slash particles
        vars.particles.forEach((p, idx) => {
            p.x += p.vx;
            p.y += p.vy;
            p.alpha -= 0.02;
            if (p.alpha <= 0) vars.particles.splice(idx, 1);
        });

        // Update React HUD states
        const progressPercent = Math.min(100, Math.round((vars.player.x / (vars.level.width * vars.level.tileSize)) * 100));
        onHUDUpdate({
            hearts: vars.player.hearts,
            maxHearts: vars.player.maxHearts,
            coins: vars.player.coins,
            score: vars.player.score,
            progress: progressPercent,
            activePowerup: vars.player.activePowerup,
            powerupTimer: Math.round(vars.player.powerupTimer / 60)
        });
    };

    const createSquishParticles = (x, y, color) => {
        const vars = gameVars.current;
        for (let i = 0; i < 8; i++) {
            vars.particles.push({
                x,
                y,
                vx: Math.random() * 4 - 2,
                vy: Math.random() * 4 - 3,
                color,
                alpha: 1.0
            });
        }
    };

    const drawGame = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const vars = gameVars.current;
        const level = vars.level;
        if (!level) return;

        ctx.clearRect(0, 0, vars.width, vars.height);

        // Sky
        const skyGrad = ctx.createLinearGradient(0, 0, 0, vars.height);
        skyGrad.addColorStop(0, level.skyColor[0]);
        skyGrad.addColorStop(1, level.skyColor[1]);
        ctx.fillStyle = skyGrad;
        ctx.fillRect(0, 0, vars.width, vars.height);

        // Mountains Parallax
        ctx.fillStyle = 'rgba(163, 191, 222, 0.4)';
        ctx.beginPath();
        ctx.moveTo(0, vars.height);
        ctx.lineTo(100 - vars.camera.x * 0.05, 200);
        ctx.lineTo(250 - vars.camera.x * 0.05, 340);
        ctx.lineTo(400 - vars.camera.x * 0.05, 120);
        ctx.lineTo(600 - vars.camera.x * 0.05, 380);
        ctx.lineTo(800 - vars.camera.x * 0.05, 150);
        ctx.lineTo(vars.width, vars.height);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = 'rgba(128, 159, 194, 0.5)';
        ctx.beginPath();
        ctx.moveTo(0, vars.height);
        ctx.lineTo(50 - vars.camera.x * 0.15, 300);
        ctx.lineTo(300 - vars.camera.x * 0.15, 220);
        ctx.lineTo(550 - vars.camera.x * 0.15, 350);
        ctx.lineTo(750 - vars.camera.x * 0.15, 260);
        ctx.lineTo(vars.width, vars.height);
        ctx.closePath();
        ctx.fill();

        // Level grid drawing
        const startTileX = Math.max(0, Math.floor(vars.camera.x / level.tileSize));
        const endTileX = Math.min(level.width, Math.ceil((vars.camera.x + vars.width) / level.tileSize));

        for (let y = 0; y < level.height; y++) {
            for (let x = startTileX; x < endTileX; x++) {
                const code = level.tiles[y][x];
                if (code === 1) {
                    const img = assets.sprites.tiles[level.tileType];
                    if (img) ctx.drawImage(img, x * level.tileSize - vars.camera.x, y * level.tileSize - vars.camera.y, level.tileSize, level.tileSize);
                } else if (code === 2) {
                    const img = assets.sprites.tiles.spikes;
                    if (img) ctx.drawImage(img, x * level.tileSize - vars.camera.x, y * level.tileSize - vars.camera.y, level.tileSize, level.tileSize);
                }
            }
        }

        // Platforms
        level.platforms.forEach(plat => {
            const img = assets.sprites.tiles[plat.type === 'falling' ? 'bridge' : 'ice'];
            if (img) ctx.drawImage(img, plat.x - vars.camera.x, plat.y - vars.camera.y, plat.width, plat.height);
        });

        // Exit flag
        ctx.drawImage(assets.sprites.tiles.flag, level.exitPortal.x - vars.camera.x, level.exitPortal.y - vars.camera.y, level.exitPortal.width, level.exitPortal.height);

        // Items
        level.items.forEach(item => {
            const img = assets.sprites.items[item.type] || assets.sprites.items.coin;
            if (img) ctx.drawImage(img, item.x - vars.camera.x, item.y - vars.camera.y, 30, 30);
        });

        // Enemies
        level.enemies.forEach(enemy => {
            enemy.draw(ctx, vars.camera);
        });

        // Projectiles
        vars.projectiles.forEach(p => {
            p.draw(ctx, vars.camera);
        });

        // Player Arjun
        vars.player.draw(ctx, vars.camera);

        // Particles
        vars.particles.forEach(p => {
            ctx.fillStyle = p.color;
            ctx.globalAlpha = p.alpha;
            ctx.fillRect(p.x - vars.camera.x, p.y - vars.camera.y, 4, 4);
        });
        ctx.globalAlpha = 1.0;

        // Weather
        vars.weatherParticles.forEach(p => {
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI*2);
            ctx.fill();
        });
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
