import React, { useState, useEffect, useRef } from 'react';
import MainMenu from './components/MainMenu';
import WorldSelector from './components/WorldSelector';
import Shop from './components/Shop';
import Settings from './components/Settings';
import HUD from './components/HUD';
import MobileControls from './components/MobileControls';
import GameCanvas from './components/GameCanvas';
import ScreenOverlay from './components/ScreenOverlay';
import { audio } from './utils/audio';

export default function App() {
    // Top-Level Game States
    const [screen, setScreen] = useState('menu'); // 'menu', 'world-select', 'shop', 'settings', 'play', 'paused', 'gameover', 'victory', 'end'
    
    // Save Game Progression
    const [progression, setProgression] = useState({
        unlockedWorld: 1,
        unlockedLevel: 1,
        coins: 0,
        score: 0,
        upgrades: {
            hearts: 3,
            jump: 1,
            speed: 1,
            khukuri: 0
        }
    });

    const [settings, setSettings] = useState({
        music: true,
        sfx: true,
        touch: true
    });

    // Level settings
    const [activeLevel, setActiveLevel] = useState({ worldId: 1, levelNum: 1 });
    
    // HUD Real-time Values
    const [hudData, setHudData] = useState({
        hearts: 3,
        maxHearts: 3,
        coins: 0,
        score: 0,
        progress: 0,
        activePowerup: null,
        powerupTimer: 0
    });

    // Victory Screen Stats
    const [victoryStats, setVictoryStats] = useState({
        coinsCollected: 0,
        levelScore: 0
    });

    // Key input controllers
    const controlsRef = useRef({
        left: false, right: false, up: false, down: false,
        jump: false, jumpPressed: false, sprint: false, attack: false
    });

    // Load save game on mount
    useEffect(() => {
        const stored = localStorage.getItem('himalayan_adventure_save_react');
        if (stored) {
            try {
                setProgression(JSON.parse(stored));
            } catch (e) {
                console.error("Failed to load save from localStorage", e);
            }
        }
    }, []);

    // Save game function
    const saveProgress = (newProg) => {
        setProgression(newProg);
        localStorage.setItem('himalayan_adventure_save_react', JSON.stringify(newProg));
    };

    // Keyboard bindings
    useEffect(() => {
        const keys = {};
        const updateControls = () => {
            const controls = controlsRef.current;
            controls.left = keys['KeyA'] || keys['ArrowLeft'];
            controls.right = keys['KeyD'] || keys['ArrowRight'];
            controls.up = keys['KeyW'] || keys['ArrowUp'];
            controls.down = keys['KeyS'] || keys['ArrowDown'];
            controls.sprint = keys['ShiftLeft'] || keys['ShiftRight'];
            
            const jumpPressed = keys['Space'];
            if (jumpPressed && !controls.jump) {
                controls.jumpPressed = true;
            }
            controls.jump = jumpPressed;
            controls.attack = keys['KeyK'] || keys['KeyJ'] || keys['Enter'];
        };

        const handleKeyDown = (e) => {
            keys[e.code] = true;
            updateControls();
        };

        const handleKeyUp = (e) => {
            keys[e.code] = false;
            updateControls();
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, []);

    // Navigate handler
    const handleNavigate = (dest) => {
        setScreen(dest);
    };

    // Start / Load specific stage
    const handleSelectStage = (worldId, levelNum) => {
        setActiveLevel({ worldId, levelNum });
        setScreen('play');
    };

    // Handle touch down controls
    const handleTouchDown = (btn) => {
        if (btn === 'jump') {
            if (!controlsRef.current.jump) {
                controlsRef.current.jumpPressed = true;
            }
            controlsRef.current.up = true;
        }
        controlsRef.current[btn] = true;
    };

    const handleTouchUp = (btn) => {
        if (btn === 'jump') {
            controlsRef.current.up = false;
        }
        controlsRef.current[btn] = false;
    };

    // Upgrade buy actions
    const handleUpgrade = (itemId, cost) => {
        const newUpgrades = { ...progression.upgrades, [itemId]: progression.upgrades[itemId] + 1 };
        const newProg = {
            ...progression,
            coins: progression.coins - cost,
            upgrades: newUpgrades
        };
        saveProgress(newProg);
    };

    // Reset save logic
    const handleResetSave = () => {
        const cleared = {
            unlockedWorld: 1,
            unlockedLevel: 1,
            coins: 0,
            score: 0,
            upgrades: {
                hearts: 3,
                jump: 1,
                speed: 1,
                khukuri: 0
            }
        };
        saveProgress(cleared);
        alert("Progress Reset!");
    };

    // Victory Triggered
    const handleVictory = (coinsCollected, levelScore) => {
        audio.stopMusic();
        audio.playSFX('victory');
        setVictoryStats({ coinsCollected, levelScore });

        const isBoss = activeLevel.levelNum === 4;
        let newWorld = progression.unlockedWorld;
        let newLevel = progression.unlockedLevel;

        if (isBoss) {
            if (activeLevel.worldId < 8) {
                newWorld = Math.max(newWorld, activeLevel.worldId + 1);
                newLevel = 1;
            } else {
                setScreen('end');
                return;
            }
        } else {
            newLevel = Math.max(newLevel, activeLevel.levelNum + 1);
        }

        const newProg = {
            ...progression,
            coins: progression.coins + coinsCollected,
            score: progression.score + levelScore,
            unlockedWorld: newWorld,
            unlockedLevel: newLevel
        };
        saveProgress(newProg);
        setScreen('victory');
    };

    // Game Over Triggered
    const handleGameOver = () => {
        audio.stopMusic();
        setScreen('gameover');
    };

    return (
        <div id="game-container">
            {/* 1. Backdrop */}
            {screen !== 'play' && screen !== 'paused' && (
                <div id="menu-background">
                    <div className="snow-bg"></div>
                    <div className="snow-bg-fast"></div>
                    <div className="fog-bg"></div>
                </div>
            )}

            {/* 2. Gameplay canvas loops */}
            {(screen === 'play' || screen === 'paused') && (
                <GameCanvas 
                    worldId={activeLevel.worldId}
                    levelNum={activeLevel.levelNum}
                    upgrades={progression.upgrades}
                    gameState={screen === 'play' ? 'play' : 'paused'}
                    controlsRef={controlsRef}
                    onHUDUpdate={setHudData}
                    onVictory={handleVictory}
                    onGameOver={handleGameOver}
                />
            )}

            {/* 3. Screen States overlay handlers */}
            {screen === 'menu' && (
                <MainMenu 
                    onPlay={() => handleSelectStage(progression.unlockedWorld, progression.unlockedLevel)}
                    onNavigate={handleNavigate}
                    hasActiveGame={false}
                />
            )}

            {screen === 'world-select' && (
                <WorldSelector 
                    unlockedWorld={progression.unlockedWorld}
                    unlockedLevel={progression.unlockedLevel}
                    onSelectStage={handleSelectStage}
                    onBack={() => handleNavigate('menu')}
                />
            )}

            {screen === 'shop' && (
                <Shop 
                    coins={progression.coins}
                    upgrades={progression.upgrades}
                    onUpgrade={handleUpgrade}
                    onBack={() => handleNavigate('menu')}
                />
            )}

            {screen === 'settings' && (
                <Settings 
                    settings={settings}
                    onUpdateSettings={setSettings}
                    onResetSave={handleResetSave}
                    onBack={() => handleNavigate('menu')}
                />
            )}

            {/* In-Game HUD overlay */}
            {(screen === 'play' || screen === 'paused') && (
                <HUD 
                    hearts={hudData.hearts}
                    maxHearts={hudData.maxHearts}
                    coins={hudData.coins}
                    score={hudData.score}
                    levelName={hudData.levelName || `World ${activeLevel.worldId}-${activeLevel.levelNum}`}
                    progress={hudData.progress}
                    activePowerup={hudData.activePowerup}
                    powerupTimer={hudData.powerupTimer}
                    onPause={() => setScreen('paused')}
                />
            )}

            {/* Mobile Controls Overlay */}
            {screen === 'play' && settings.touch && (
                <MobileControls 
                    onTouchDown={handleTouchDown}
                    onTouchUp={handleTouchUp}
                />
            )}

            {/* Game Paused Overlay */}
            {screen === 'paused' && (
                <ScreenOverlay>
                    <div className="menu-card glass-panel">
                        <h2>Game Paused</h2>
                        <div className="menu-buttons" style={{ marginTop: '20px' }}>
                            <button className="btn btn-primary" onClick={() => setScreen('play')}>Resume</button>
                            <button className="btn btn-secondary" onClick={() => handleSelectStage(activeLevel.worldId, activeLevel.levelNum)}>Restart Level</button>
                            <button className="btn btn-secondary" onClick={() => setScreen('world-select')}>Quit to Map</button>
                        </div>
                    </div>
                </ScreenOverlay>
            )}

            {/* Game Over Overlay */}
            {screen === 'gameover' && (
                <ScreenOverlay>
                    <div className="menu-card glass-panel red-alert">
                        <h1 className="scary-title">Arjun Has Fallen</h1>
                        <p>The mountain spirits have overwhelmed our hero. Do not lose hope!</p>
                        <div className="menu-buttons" style={{ marginTop: '20px' }}>
                            <button className="btn btn-primary" onClick={() => handleSelectStage(activeLevel.worldId, activeLevel.levelNum)}>Try Again</button>
                            <button className="btn btn-secondary" onClick={() => setScreen('world-select')}>Return to Map</button>
                        </div>
                    </div>
                </ScreenOverlay>
            )}

            {/* Victory Overlay */}
            {screen === 'victory' && (
                <ScreenOverlay>
                    <div className="menu-card glass-panel gold-panel">
                        <h1 className="victory-title">Victory!</h1>
                        <p>Sacred Flag Recovered!</p>
                        <div className="victory-stats">
                            <div className="stat-row">Coins Collected: <span>{victoryStats.coinsCollected}</span></div>
                            <div className="stat-row">Time Bonus: <span>1000</span></div>
                            <div className="stat-row">Total Score: <span>{victoryStats.levelScore}</span></div>
                        </div>
                        <div className="menu-buttons">
                            <button 
                                className="btn btn-primary" 
                                onClick={() => {
                                    if (activeLevel.levelNum === 4) {
                                        handleSelectStage(activeLevel.worldId + 1, 1);
                                    } else {
                                        handleSelectStage(activeLevel.worldId, activeLevel.levelNum + 1);
                                    }
                                }}
                            >
                                Continue Journey
                            </button>
                            <button className="btn btn-secondary" onClick={() => setScreen('world-select')}>World Map</button>
                        </div>
                    </div>
                </ScreenOverlay>
            )}

            {/* End Game Cutscene Screen */}
            {screen === 'end' && (
                <ScreenOverlay>
                    <div className="menu-card glass-panel full-story">
                        <h3>Sagarmatha Restored!</h3>
                        <p>With a final swipe of the Khukuri, the Shadow Yeti King dissolves into pure white snow dust.</p>
                        <p>Arjun hoists the sacred prayer flags high onto the peaks of Everest, restoring wind, warmth, and peace back to the kingdom.</p>
                        <p><strong>Congratulations, Legend! You have completed Himalayan Adventure.</strong></p>
                        <p>New Game+ and Hard difficulty slots are now fully unlocked!</p>
                        <button className="btn btn-primary" style={{ marginTop: '20px' }} onClick={() => setScreen('menu')}>
                            Return to Main Menu
                        </button>
                    </div>
                </ScreenOverlay>
            )}
        </div>
    );
}
