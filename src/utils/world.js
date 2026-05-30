// Level Generation, Worlds, Platform Configurations & Environmental Weather System
import { Enemy } from './entities.js';

export class WorldManager {
    constructor() {
        this.tileSize = 40;
        this.worlds = this.initWorldConfigs();
    }

    initWorldConfigs() {
        return [
            {
                id: 1,
                name: "Village Hills",
                tileType: "grass",
                skyColor: ["#bae6fd", "#e0f2fe"],
                weather: "clear",
                enemies: ["monkey"],
                bossType: "boss_monkey",
                intro: "The green valleys of Sagarmatha have lost their warmth. The monkeys patrol the terraces in anger."
            },
            {
                id: 2,
                name: "Rhododendron Forest",
                tileType: "forest",
                skyColor: ["#fbcfe8", "#fce7f3"],
                weather: "blossom_petals",
                enemies: ["monkey", "yak"],
                bossType: "boss_yak",
                intro: "Beautiful red blossoms cover the sacred forest path. Avoid the wild yaks charging through the trees."
            },
            {
                id: 3,
                name: "Mountain Caves",
                tileType: "cave",
                skyColor: ["#1e1b4b", "#0f172a"],
                weather: "sparkles",
                enemies: ["rock_spirit", "bat"],
                bossType: "boss_yeti",
                intro: "Deep caves illuminated by purple crystals. Watch out for bats and rock spirits throwing boulders!"
            },
            {
                id: 4,
                name: "Ancient Temples",
                tileType: "temple",
                skyColor: ["#ffedd5", "#ffeedd"],
                weather: "fog",
                enemies: ["monk", "rock_spirit"],
                bossType: "boss_monkey",
                intro: "Sacred stone ruins and prayer wheels. Shadow monks cast ancient magic in the thick fog."
            },
            {
                id: 5,
                name: "High Himalayas",
                tileType: "snow",
                skyColor: ["#e0f2fe", "#f1f5f9"],
                weather: "snow",
                enemies: ["fox", "bat"],
                bossType: "boss_yak",
                intro: "Thin air, freezing wind, and steep snowy cliffs. The agile snow foxes leap across icy gaps."
            },
            {
                id: 6,
                name: "Frozen Kingdom",
                tileType: "ice",
                skyColor: ["#7dd3fc", "#bae6fd"],
                weather: "snow",
                enemies: ["demon", "bat"],
                bossType: "boss_yeti",
                intro: "The ground is slick ice. Keep your footing or you will slide into the bottomless crevices."
            },
            {
                id: 7,
                name: "Spirit Realm",
                tileType: "spirit",
                skyColor: ["#e0e7ff", "#c7d2fe"],
                weather: "sparkles",
                enemies: ["monk", "demon"],
                bossType: "boss_monkey",
                intro: "Floating islands in a mystical void. The spirits are strong, but Arjun's blessing is stronger."
            },
            {
                id: 8,
                name: "Shadow Mountain",
                tileType: "dark",
                skyColor: ["#1e1e2f", "#09090e"],
                weather: "wind_blizzard",
                enemies: ["demon", "monk", "fox"],
                bossType: "boss_yeti",
                intro: "The final climb. Wind pushes you, avalanches fall, and the Shadow Yeti King awaits at the summit."
            }
        ];
    }

    generateLevel(worldId, levelNum) {
        const world = this.worlds.find(w => w.id === worldId);
        
        let width = 160;
        const height = 15;
        const isBossLevel = levelNum === 4;

        if (isBossLevel) {
            width = 60;
        }

        const tiles = Array(height).fill(null).map(() => Array(width).fill(0));
        
        for (let x = 0; x < width; x++) {
            if (isBossLevel) {
                tiles[12][x] = 1;
                tiles[13][x] = 1;
                tiles[14][x] = 1;
            } else {
                let isGap = false;
                if (x > 15 && x < width - 15) {
                    isGap = (x % 24 >= 20 && x % 24 <= 22);
                }
                
                if (!isGap) {
                    let groundY = 12;
                    if (worldId === 1 && x > 40 && x < 80) groundY = 11;
                    if (worldId === 5 && x > 50 && x < 100) groundY = 13;

                    for (let y = groundY; y < height; y++) {
                        tiles[y][x] = 1;
                    }

                    if (x % 16 === 8 && x > 15 && x < width - 15) {
                        tiles[groundY - 1][x] = 1;
                        tiles[groundY - 1][x + 1] = 1;
                        tiles[groundY - 2][x + 1] = 1;
                    }
                }
            }
        }

        const platforms = [];
        const items = [];
        const enemies = [];
        const windZones = [];

        if (!isBossLevel) {
            for (let x = 10; x < width - 15; x += 5) {
                if (x % 12 === 0) {
                    const py = 8 - Math.floor(Math.sin(x) * 2);
                    tiles[py][x] = 1;
                    tiles[py][x + 1] = 1;
                    tiles[py][x + 2] = 1;

                    items.push({ x: (x + 1) * this.tileSize, y: (py - 1.5) * this.tileSize, type: 'coin' });
                }

                if (x % 20 === 15) {
                    platforms.push({
                        x: x * this.tileSize,
                        y: 7 * this.tileSize,
                        width: this.tileSize * 2.5,
                        height: 15,
                        type: 'falling',
                        triggered: false,
                        collapseTimer: 0
                    });
                }

                if (x % 30 === 25) {
                    platforms.push({
                        startX: x * this.tileSize,
                        startY: 5 * this.tileSize,
                        x: x * this.tileSize,
                        y: 5 * this.tileSize,
                        width: this.tileSize * 2,
                        height: 15,
                        vx: 1.5,
                        vy: 0,
                        range: 120,
                        type: world.tileType === 'ice' ? 'ice' : 'normal'
                    });
                }

                if (x % 24 === 20) {
                    tiles[14][x] = 2;
                    tiles[14][x + 1] = 2;
                }

                if (x === 32 || x === 75 || x === 115) {
                    const powerups = ['khukuri', 'glide', 'blessing', 'strength', 'snow_spirit', 'yak_milk', 'sel_roti'];
                    const chosen = powerups[(worldId + x) % powerups.length];
                    items.push({
                        x: x * this.tileSize,
                        y: 9 * this.tileSize,
                        type: chosen
                    });
                }

                if (x > 20 && x % 16 === 0) {
                    const eType = world.enemies[x % world.enemies.length];
                    enemies.push(new Enemy(x * this.tileSize, 10 * this.tileSize, eType));
                }
            }

            if (worldId === 5 || worldId === 8) {
                windZones.push({
                    x: 60 * this.tileSize,
                    y: 2 * this.tileSize,
                    width: 200,
                    height: 400,
                    forceX: 0.18,
                    forceY: 0
                });
            }
        } else {
            const boss = new Enemy(40 * this.tileSize, 8 * this.tileSize, world.bossType);
            enemies.push(boss);
        }

        const exitX = (width - 6) * this.tileSize;
        const exitY = 11 * this.tileSize;

        const levelObj = {
            worldId,
            levelNum,
            name: `${world.name} - ${isBossLevel ? 'Boss Arena' : levelNum}`,
            tileType: world.tileType,
            skyColor: world.skyColor,
            weather: world.weather,
            intro: world.intro,
            width,
            height,
            tileSize: this.tileSize,
            tiles,
            platforms,
            items,
            enemies,
            windZones,
            exitPortal: { x: exitX, y: exitY, width: 40, height: 40 },
            isBossLevel
        };

        levelObj.isSolid = (tileX, tileY) => {
            if (tileY < 0) return false;
            if (tileY >= levelObj.height) return true;
            if (tileX < 0 || tileX >= levelObj.width) return true;
            return levelObj.tiles[tileY][tileX] === 1;
        };

        levelObj.getTileType = (tileX, tileY) => {
            if (tileY < 0 || tileY >= levelObj.height || tileX < 0 || tileX >= levelObj.width) return 'none';
            const code = levelObj.tiles[tileY][tileX];
            if (code === 1) return levelObj.tileType;
            if (code === 2) return 'spikes';
            return 'none';
        };

        return levelObj;
    }
}
export default WorldManager;
