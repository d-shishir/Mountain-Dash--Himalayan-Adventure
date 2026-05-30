import React, { useState } from 'react';
import ScreenOverlay from './ScreenOverlay';
import WorldManager from '../utils/world';

const manager = new WorldManager();

export default function WorldSelector({ unlockedWorld, unlockedLevel, onSelectStage, onBack }) {
    const [selectedWorld, setSelectedWorld] = useState(null);

    const handleSelectWorld = (world) => {
        if (world.id > unlockedWorld) return; // Locked
        setSelectedWorld(world);
    };

    return (
        <ScreenOverlay>
            <div className="menu-card glass-panel large-card">
                <div className="card-header">
                    <button className="back-btn" onClick={selectedWorld ? () => setSelectedWorld(null) : onBack}>
                        ⬅ Back
                    </button>
                    <h2>{selectedWorld ? selectedWorld.name : "Select Valley / Mountain"}</h2>
                </div>

                {!selectedWorld ? (
                    <div className="world-grid">
                        {manager.worlds.map(w => {
                            const isLocked = w.id > unlockedWorld;
                            return (
                                <div 
                                    key={w.id} 
                                    className={`world-card ${isLocked ? 'locked' : ''}`}
                                    onClick={() => handleSelectWorld(w)}
                                >
                                    <div className="world-card-num">World {w.id}</div>
                                    <div className="world-card-title">{w.name}</div>
                                    <div className="world-card-progress">
                                        {isLocked ? '🔒 Locked' : 'Select Stage'}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
                        <div className="story-teaser" style={{ margin: 0, fontSize: '1rem' }}>
                            {selectedWorld.intro}
                        </div>
                        <h3 style={{ fontFamily: 'Cinzel', color: '#ffbe33' }}>Choose Stage:</h3>
                        <div style={{ display: 'flex', gap: '15px', marginTop: '10px' }}>
                            {[1, 2, 3, 4].map(s => {
                                const isStageLocked = (selectedWorld.id === unlockedWorld && s > unlockedLevel);
                                const label = s === 4 ? 'BOSS' : `Stage ${s}`;
                                return (
                                    <button 
                                        key={s}
                                        className="btn btn-secondary" 
                                        disabled={isStageLocked}
                                        onClick={() => onSelectStage(selectedWorld.id, s)}
                                    >
                                        {label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </ScreenOverlay>
    );
}
