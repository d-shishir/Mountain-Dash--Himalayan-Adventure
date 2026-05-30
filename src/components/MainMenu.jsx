import React from 'react';
import ScreenOverlay from './ScreenOverlay';

export default function MainMenu({ onPlay, onNavigate, onResumeGame, hasActiveGame }) {
    return (
        <ScreenOverlay>
            <div className="menu-card glass-panel">
                <div className="nepali-border"></div>
                <h1 className="game-title">Mountain Dash</h1>
                <h2 className="game-subtitle">Himalayan Adventure</h2>
                <div className="story-teaser">
                    The dark mountain spirits have stolen the sacred prayer flags protecting Sagarmatha. Unsheathe your khukuri, guide Arjun across Nepal's peaks, and defeat the Shadow Yeti King!
                </div>
                <div className="menu-buttons">
                    {hasActiveGame ? (
                        <button className="btn btn-primary btn-large" onClick={onResumeGame}>Resume Adventure</button>
                    ) : (
                        <button className="btn btn-primary btn-large" onClick={onPlay}>Adventure Start</button>
                    )}
                    <button className="btn btn-secondary" onClick={() => onNavigate('world-select')}>World Select</button>
                    <button className="btn btn-secondary" onClick={() => onNavigate('shop')}>Trader's Shop</button>
                    <button className="btn btn-secondary" onClick={() => onNavigate('settings')}>Settings</button>
                </div>
                <div className="footer-credits">Built with Premium HTML5 Canvas & React</div>
            </div>
        </ScreenOverlay>
    );
}
