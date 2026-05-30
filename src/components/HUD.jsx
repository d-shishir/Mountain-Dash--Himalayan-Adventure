import React from 'react';

export default function HUD({ 
    hearts, 
    maxHearts, 
    coins, 
    score, 
    levelName, 
    progress, 
    activePowerup, 
    powerupTimer, 
    onPause 
}) {
    // Generate heart SVGs
    const renderHearts = () => {
        const heartElements = [];
        for (let i = 0; i < maxHearts; i++) {
            const color = i < hearts ? '#d9383a' : '#475569';
            heartElements.push(
                <svg 
                    key={i} 
                    style={{ width: '24px', height: '24px', marginRight: '3px' }} 
                    viewBox="0 0 24 24" 
                    fill={color}
                >
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
            );
        }
        return heartElements;
    };

    const powerupIcons = {
        khukuri: '⚔️',
        glide: '🦅',
        invincible: '🪷',
        strength: '🐂',
        snow_spirit: '❄️'
    };

    return (
        <div id="hud" className="hud-container">
            <div className="hud-left">
                <div className="hud-stat" id="hud-hearts">
                    {renderHearts()}
                </div>
                <div className="hud-stat">
                    <img 
                        src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23FFD700'><circle cx='12' cy='12' r='10'/><text x='12' y='16' font-size='12' font-weight='bold' text-anchor='middle' fill='%23B7791F'>$</text></svg>" 
                        className="coin-icon" 
                        alt="Coins"
                    />
                    <span>{String(coins).padStart(3, '0')}</span>
                </div>
            </div>

            <div className="hud-center">
                <div className="level-indicator">{levelName}</div>
                <div className="progress-bar-container">
                    <div className="progress-bar-fill" style={{ width: `${progress}%` }}></div>
                </div>
            </div>

            <div className="hud-right">
                {activePowerup && (
                    <div className="hud-powerup">
                        <span>{powerupIcons[activePowerup] || '✨'}</span>
                        <span>{powerupTimer}s</span>
                    </div>
                )}
                <div className="hud-stat">
                    Score: <span>{String(score).padStart(5, '0')}</span>
                </div>
                <button className="icon-btn" onClick={onPause}>⏸</button>
            </div>
        </div>
    );
}
