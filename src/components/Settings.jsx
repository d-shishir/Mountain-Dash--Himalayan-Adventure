import React from 'react';
import ScreenOverlay from './ScreenOverlay';
import { audio } from '../utils/audio';

export default function Settings({ settings, onUpdateSettings, onResetSave, onBack }) {
    const handleToggleMusic = (checked) => {
        onUpdateSettings({ ...settings, music: checked });
        audio.musicEnabled = checked;
        if (checked) {
            audio.startMusic();
        } else {
            audio.stopMusic();
        }
    };

    const handleToggleSFX = (checked) => {
        onUpdateSettings({ ...settings, sfx: checked });
        audio.sfxEnabled = checked;
    };

    return (
        <ScreenOverlay>
            <div className="menu-card glass-panel">
                <div className="card-header">
                    <button className="back-btn" onClick={onBack}>⬅ Back</button>
                    <h2>Settings</h2>
                </div>
                
                <div className="settings-list">
                    <div className="settings-item">
                        <label>Sound Music</label>
                        <input 
                            type="checkbox" 
                            checked={settings.music} 
                            onChange={(e) => handleToggleMusic(e.target.checked)} 
                        />
                    </div>
                    <div className="settings-item">
                        <label>Sound FX</label>
                        <input 
                            type="checkbox" 
                            checked={settings.sfx} 
                            onChange={(e) => handleToggleSFX(e.target.checked)} 
                        />
                    </div>
                    <div className="settings-item">
                        <label>Virtual Touch Controls</label>
                        <input 
                            type="checkbox" 
                            checked={settings.touch} 
                            onChange={(e) => onUpdateSettings({ ...settings, touch: e.target.checked })} 
                        />
                    </div>
                </div>

                <button className="btn btn-secondary btn-full" onClick={onResetSave}>
                    Reset Save Progress
                </button>
            </div>
        </ScreenOverlay>
    );
}
