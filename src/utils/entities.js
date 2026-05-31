// Entities Module (Player, Enemies, Projectiles, Bosses) for React Mountain Dash
import { assets } from './assets.js';
import { audio } from './audio.js';
import { PhysicsEngine } from './physics.js';

export class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 36;
        this.height = 54;
        this.vx = 0;
        this.vy = 0;
        
        this.baseSpeed = 4.2;
        this.sprintMultiplier = 1.6;
        this.gravity = 0.55;
        this.jumpForce = -10.5;
        this.friction = 0.85;
        this.iceFriction = 0.96;
        
        this.onGround = false;
        this.onIce = false;
        this.onWallLeft = false;
        this.onWallRight = false;
        this.doubleJumpsLeft = 1;
        this.maxDoubleJumps = 1;
        
        // Advanced platforming mechanics
        this.coyoteTimer = 0;
        this.jumpBufferTimer = 0;
        this.hitStopTimer = 0;
        
        this.hearts = 3;
        this.maxHearts = 3;
        this.coins = 0;
        this.score = 0;
        
        this.activePowerup = null;
        this.powerupTimer = 0;
        
        this.invulnerableTimer = 0;
        this.attackCooldown = 0;
        this.isAttacking = false;
        this.attackFrame = 0;

        this.facing = 'right';
        this.animState = 'idle';
        this.animTimer = 0;
    }

    update(controls, level) {
        // Hit-stop effect (game logic freezes briefly for impact weight)
        if (this.hitStopTimer > 0) {
            this.hitStopTimer--;
            return;
        }

        if (this.invulnerableTimer > 0) this.invulnerableTimer--;
        
        if (this.powerupTimer > 0) {
            this.powerupTimer--;
            if (this.powerupTimer <= 0) {
                this.activePowerup = null;
            }
        }

        if (this.isAttacking) {
            this.attackFrame++;
            if (this.attackFrame > 15) {
                this.isAttacking = false;
                this.attackFrame = 0;
            }
        }
        if (this.attackCooldown > 0) this.attackCooldown--;

        let moveSpeed = this.baseSpeed;
        if (controls.sprint) {
            moveSpeed *= this.sprintMultiplier;
        }
        if (this.activePowerup === 'strength') {
            moveSpeed *= 1.2;
        }

        if (controls.left) {
            this.vx -= moveSpeed * 0.15;
            this.facing = 'left';
        } else if (controls.right) {
            this.vx += moveSpeed * 0.15;
            this.facing = 'right';
        } else {
            this.vx *= this.onIce ? this.iceFriction : this.friction;
        }

        const maxV = moveSpeed;
        if (this.vx > maxV) this.vx = maxV;
        if (this.vx < -maxV) this.vx = -maxV;

        this.vy += this.gravity;

        // Variable jump height logic
        if (!controls.jump && this.vy < -4) {
            this.vy *= 0.85; // Reduce upward velocity if jump key released early
        }

        if (this.activePowerup === 'glide' && controls.jump && this.vy > 1.2) {
            this.vy = 1.2;
        }

        let isWallSliding = false;
        if ((this.onWallLeft || this.onWallRight) && !this.onGround && this.vy > 0) {
            isWallSliding = true;
            this.vy = Math.min(this.vy, 1.8); // Slower fall on walls
        }

        const wasOnGround = this.onGround;

        this.x += this.vx;
        this.y += this.vy;

        PhysicsEngine.resolveTileCollisions(this, level);

        // Coyote Time updates
        if (wasOnGround && !this.onGround && this.vy >= 0) {
            this.coyoteTimer = 6; // Frames of leeway to jump after falling off edge
        } else if (this.onGround) {
            this.coyoteTimer = 0;
        } else if (this.coyoteTimer > 0) {
            this.coyoteTimer--;
        }

        // Jump Buffering
        if (controls.jumpPressed) {
            this.jumpBufferTimer = 6; // Remember jump intent for 6 frames
            controls.jumpPressed = false;
        } else if (this.jumpBufferTimer > 0) {
            this.jumpBufferTimer--;
        }

        // Execute Jump
        if (this.jumpBufferTimer > 0) {
            if (this.onGround || this.coyoteTimer > 0) {
                this.vy = this.jumpForce;
                this.onGround = false;
                this.coyoteTimer = 0;
                this.jumpBufferTimer = 0;
                audio.playSFX('jump');
            } else if (isWallSliding) {
                this.vy = this.jumpForce * 0.95;
                this.vx = this.onWallLeft ? moveSpeed * 1.2 : -moveSpeed * 1.2;
                this.facing = this.onWallLeft ? 'right' : 'left';
                this.jumpBufferTimer = 0;
                audio.playSFX('jump');
            } else if (this.doubleJumpsLeft > 0) {
                this.vy = this.jumpForce * 0.9;
                this.doubleJumpsLeft--;
                this.jumpBufferTimer = 0;
                audio.playSFX('jump');
                this.animState = 'double_jump';
            }
        }

        if (controls.attack && this.attackCooldown === 0) {
            this.attack();
        }

        this.determineAnimationState(isWallSliding);
    }

    determineAnimationState(isWallSliding) {
        if (this.invulnerableTimer > 0 && Math.floor(Date.now() / 100) % 2 === 0) {
            this.animState = 'hurt';
            return;
        }

        if (this.isAttacking) {
            this.animState = 'attack';
            return;
        }

        if (this.onGround) {
            if (Math.abs(this.vx) > 0.8) {
                const isRunning = Math.abs(this.vx) > this.baseSpeed * 1.2;
                this.animTimer++;
                const rate = isRunning ? 5 : 8;
                const prefix = isRunning ? 'run' : 'walk';
                this.animState = Math.floor(this.animTimer / rate) % 2 === 0 ? prefix + '1' : prefix + '2';
            } else {
                this.animState = 'idle';
            }
        } else {
            if (isWallSliding) {
                this.animState = 'slide';
            } else {
                this.animState = this.doubleJumpsLeft === 0 ? 'double_jump' : 'jump';
            }
        }
    }

    attack() {
        this.isAttacking = true;
        this.attackFrame = 0;
        this.attackCooldown = 20;
        audio.playSFX('attack');
    }

    takeDamage(amount = 0.5) {
        if (this.invulnerableTimer > 0 || this.activePowerup === 'invincible') return;
        
        this.hearts -= amount;
        audio.playSFX('hurt');
        this.invulnerableTimer = 90; // 1.5 seconds of recovery invulnerability
        this.hitStopTimer = 6; // Brief freeze for impact
        
        this.vy = -5;
        this.vx = this.facing === 'right' ? -4 : 4;
        
        if (this.hearts <= 0) {
            this.hearts = 0;
        }
    }

    heal(amount = 1) {
        this.hearts = Math.min(this.hearts + amount, this.maxHearts);
        audio.playSFX('powerup');
    }

    draw(ctx, camera) {
        const renderX = Math.round(this.x - camera.x);
        const renderY = Math.round(this.y - camera.y);
        
        const frame = assets.sprites.player[this.animState][this.facing];
        if (frame) {
            // Apply a slight squish/stretch based on velocity for juice
            ctx.save();
            let scaleX = 1;
            let scaleY = 1;
            if (!this.onGround) {
                scaleY = 1 + Math.abs(this.vy) * 0.02;
                scaleX = 1 - Math.abs(this.vy) * 0.01;
            }
            ctx.translate(renderX + this.width / 2, renderY + this.height);
            ctx.scale(scaleX, scaleY);
            ctx.drawImage(frame, -(48)/2, -(64), 48, 64);
            ctx.restore();
        }

        if (this.activePowerup) {
            ctx.strokeStyle = this.activePowerup === 'invincible' ? 'rgba(251, 191, 36, 0.8)' : 'rgba(14, 165, 233, 0.8)';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(renderX + this.width / 2, renderY + this.height / 2, 32, 0, Math.PI * 2);
            ctx.stroke();
            ctx.fillStyle = this.activePowerup === 'invincible' ? 'rgba(251, 191, 36, 0.2)' : 'rgba(14, 165, 233, 0.2)';
            ctx.fill();
        }
    }
}

export class Enemy {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.type = type;
        
        this.vx = -1.5;
        this.vy = 0;
        this.facing = 'left';
        this.hp = 1;
        
        this.setupDimensions();
        this.maxHp = this.hp;

        this.onGround = false;
        this.isDead = false;
        this.patrolDist = 120;
        this.startX = x;
        this.hitStopTimer = 0;
        this.flashTimer = 0;
    }

    setupDimensions() {
        switch(this.type) {
            case 'monkey':
                this.width = 32; this.height = 32; this.vx = -1.2; this.hp = 1; break;
            case 'yak':
                this.width = 46; this.height = 36; this.vx = -0.8; this.hp = 2; break;
            case 'fox':
                this.width = 36; this.height = 24; this.vx = -2.5; this.hp = 1; break;
            case 'rock_spirit':
                this.width = 36; this.height = 36; this.vx = 0; this.hp = 3; break;
            case 'bat':
                this.width = 32; this.height = 24; this.vx = -1.8; this.hp = 1; break;
            case 'monk':
                this.width = 36; this.height = 54; this.vx = -1.0; this.hp = 2; break;
            case 'demon':
                this.width = 48; this.height = 68; this.vx = -1.4; this.hp = 4; break;
            case 'boss_monkey':
                this.width = 72; this.height = 72; this.vx = -1.6; this.hp = 15; break;
            case 'boss_yak':
                this.width = 84; this.height = 64; this.vx = -2.2; this.hp = 20; break;
            case 'boss_yeti':
                this.width = 110; this.height = 130; this.vx = -1.0; this.hp = 35; break;
        }
    }

    update(level, player) {
        if (this.isDead) return;

        if (this.hitStopTimer > 0) {
            this.hitStopTimer--;
            return;
        }
        if (this.flashTimer > 0) this.flashTimer--;

        if (this.type !== 'bat') {
            this.vy += 0.45;
        }

        if (this.type === 'yak' || this.type === 'boss_yak') {
            const dx = player.x - this.x;
            const dy = Math.abs(player.y - this.y);
            if (dy < 60 && Math.abs(dx) < 220) {
                this.vx = dx > 0 ? 3.5 : -3.5;
            }
        }

        if (this.type === 'bat') {
            this.vy = Math.sin(Date.now() / 150) * 1.5;
        }

        this.x += this.vx;
        this.y += this.vy;

        if (this.type !== 'bat') {
            PhysicsEngine.resolveTileCollisions(this, level);
            
            if (this.onWallLeft || this.onWallRight) {
                this.vx *= -1;
            }
            if (Math.abs(this.x - this.startX) > this.patrolDist) {
                this.vx *= -1;
                this.startX = this.x;
            }
        } else {
            if (this.x < 0 || this.x > level.width * level.tileSize) {
                this.vx *= -1;
            }
        }

        this.facing = this.vx > 0 ? 'right' : 'left';
    }

    takeDamage(amount = 1) {
        this.hp -= amount;
        this.hitStopTimer = 4;
        this.flashTimer = 4;
        if (this.hp <= 0) {
            this.isDead = true;
        }
    }

    draw(ctx, camera) {
        if (this.isDead) return;

        const renderX = Math.round(this.x - camera.x);
        const renderY = Math.round(this.y - camera.y);
        
        ctx.save();
        if (this.flashTimer > 0) {
            ctx.globalCompositeOperation = 'lighter';
            ctx.filter = 'brightness(200%)';
        }

        if (this.facing === 'right') {
            ctx.translate(renderX + this.width, renderY);
            ctx.scale(-1, 1);
            ctx.drawImage(assets.sprites.enemies[this.type], 0, 0, this.width, this.height);
        } else {
            ctx.drawImage(assets.sprites.enemies[this.type], renderX, renderY, this.width, this.height);
        }
        ctx.restore();

        if (this.type.startsWith('boss_')) {
            ctx.fillStyle = 'rgba(0,0,0,0.6)';
            ctx.fillRect(renderX, renderY - 14, this.width, 6);
            ctx.fillStyle = '#e11d48';
            ctx.fillRect(renderX, renderY - 14, this.width * (this.hp / this.maxHp), 6);
        }
    }
}

export class Projectile {
    constructor(x, y, vx, vy, type) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.type = type;
        this.width = 12;
        this.height = 12;
        this.life = 120;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.life--;
    }

    draw(ctx, camera) {
        const rX = this.x - camera.x;
        const rY = this.y - camera.y;
        
        ctx.fillStyle = this.type === 'ice' ? '#bae6fd' : '#94a3b8';
        ctx.shadowColor = this.type === 'ice' ? '#0ea5e9' : '#000';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(rX + 6, rY + 6, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
    }
}
