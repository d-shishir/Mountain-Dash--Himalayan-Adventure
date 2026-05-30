// Physics & Collision Resolution Module for React Mountain Dash

export class PhysicsEngine {
    static checkCollision(rect1, rect2) {
        return rect1.x < rect2.x + rect2.width &&
               rect1.x + rect1.width > rect2.x &&
               rect1.y < rect2.y + rect2.height &&
               rect1.y + rect1.height > rect2.y;
    }

    static isTileSolid(level, tileX, tileY) {
        if (tileY < 0) return false;
        if (tileY >= level.height) return true;
        if (tileX < 0 || tileX >= level.width) return true;
        return level.tiles[tileY][tileX] === 1;
    }

    static getTileType(level, tileX, tileY) {
        if (tileY < 0 || tileY >= level.height || tileX < 0 || tileX >= level.width) return 'none';
        const code = level.tiles[tileY][tileX];
        if (code === 1) return level.tileType;
        if (code === 2) return 'spikes';
        return 'none';
    }

    static resolveTileCollisions(entity, level) {
        const tileSize = level.tileSize;
        
        const startX = Math.max(0, Math.floor(entity.x / tileSize));
        const endX = Math.min(level.width, Math.ceil((entity.x + entity.width) / tileSize));
        const startY = Math.max(0, Math.floor(entity.y / tileSize));
        const endY = Math.min(level.height, Math.ceil((entity.y + entity.height) / tileSize));

        entity.onGround = false;
        entity.onWallLeft = false;
        entity.onWallRight = false;

        if (entity.x < 0) {
            entity.x = 0;
            entity.vx = 0;
        }

        for (let y = startY; y < endY; y++) {
            for (let x = startX; x < endX; x++) {
                if (this.isTileSolid(level, x, y)) {
                    const tileRect = { x: x * tileSize, y: y * tileSize, width: tileSize, height: tileSize };
                    
                    if (this.checkCollision(entity, tileRect)) {
                        const overlapX = Math.min(entity.x + entity.width - tileRect.x, tileRect.x + tileRect.width - entity.x);
                        const overlapY = Math.min(entity.y + entity.height - tileRect.y, tileRect.y + tileRect.height - entity.y);

                        if (overlapX < overlapY) {
                            if (entity.vx > 0 && (entity.x + entity.width / 2) < (tileRect.x + tileSize / 2)) {
                                entity.x -= overlapX;
                                entity.vx = 0;
                                entity.onWallRight = true;
                            } else if (entity.vx < 0 && (entity.x + entity.width / 2) > (tileRect.x + tileSize / 2)) {
                                entity.x += overlapX;
                                entity.vx = 0;
                                entity.onWallLeft = true;
                            }
                        }
                    }
                }
            }
        }

        const updatedStartX = Math.max(0, Math.floor(entity.x / tileSize));
        const updatedEndX = Math.min(level.width, Math.ceil((entity.x + entity.width) / tileSize));

        for (let y = startY; y < endY; y++) {
            for (let x = updatedStartX; x < updatedEndX; x++) {
                if (this.isTileSolid(level, x, y)) {
                    const tileRect = { x: x * tileSize, y: y * tileSize, width: tileSize, height: tileSize };
                    
                    if (this.checkCollision(entity, tileRect)) {
                        const overlapX = Math.min(entity.x + entity.width - tileRect.x, tileRect.x + tileRect.width - entity.x);
                        const overlapY = Math.min(entity.y + entity.height - tileRect.y, tileRect.y + tileRect.height - entity.y);

                        if (overlapY <= overlapX) {
                            if (entity.vy > 0) {
                                entity.y -= overlapY;
                                entity.vy = 0;
                                entity.onGround = true;
                                entity.doubleJumpsLeft = entity.maxDoubleJumps;
                                
                                const tileType = this.getTileType(level, x, y);
                                entity.onIce = (tileType === 'ice');
                            } else if (entity.vy < 0) {
                                entity.y += overlapY;
                                entity.vy = 0;
                            }
                        }
                    }
                }
            }
        }
    }

    static handlePlatformCollisions(entity, platforms) {
        platforms.forEach(platform => {
            const isFalling = entity.vy >= 0;
            const wasAbove = (entity.y + entity.height - entity.vy) <= platform.y + 2;

            if (isFalling && wasAbove && this.checkCollision(entity, platform)) {
                entity.y = platform.y - entity.height;
                entity.vy = 0;
                entity.onGround = true;
                entity.doubleJumpsLeft = entity.maxDoubleJumps;
                entity.onIce = (platform.type === 'ice');

                if (platform.vx) entity.x += platform.vx;
                if (platform.vy) entity.y += platform.vy;

                if (platform.type === 'falling' && !platform.triggered) {
                    platform.triggered = true;
                    platform.collapseTimer = 45;
                }
            }
        });
    }

    static checkRopeCollisions(entity, ropes) {
        ropes.forEach(rope => {
            if (this.checkCollision(entity, rope)) {
                if (entity.controls.up && !entity.isSwinging) {
                    entity.isSwinging = true;
                    entity.swingRope = rope;
                    entity.swingAngle = 0;
                    entity.swingSpeed = 0.08;
                }
            }
        });
    }

    static applyWindZones(entity, windZones) {
        windZones.forEach(zone => {
            if (this.checkCollision(entity, zone)) {
                entity.vx += zone.forceX;
                entity.vy += zone.forceY;
            }
        });
    }
}
export default PhysicsEngine;
