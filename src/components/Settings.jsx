import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Volume2, VolumeX, Music, Smartphone, RotateCcw } from 'lucide-react';
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
            <motion.div 
                className="menu-card glass-panel"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
            >
                <div className="nepali-border"></div>
                
                <div className="card-header">
                    <button className="icon-btn-back" onClick={onBack}>
                        <ArrowLeft size={24} />
                    </button>
                    <h2>Settings</h2>
                    <div style={{ width: 44 }}></div>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '30px', position: 'relative', zIndex: 2 }}>
                    <div className="setting-row">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '1.1rem', fontWeight: 600 }}>
                            {settings.music ? <Music size={22} color="#fbbf24"/> : <VolumeX size={22} color="#64748b"/>}
                            Adventure Music
                        </div>
                        <input 
                            type="checkbox" 
                            checked={settings.music} 
                            onChange={(e) => handleToggleMusic(e.target.checked)} 
                        />
                    </div>

                    <div className="setting-row">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '1.1rem', fontWeight: 600 }}>
                            {settings.sfx ? <Volume2 size={22} color="#10b981"/> : <VolumeX size={22} color="#64748b"/>}
                            Sound Effects (SFX)
                        </div>
                        <input 
                            type="checkbox" 
                            checked={settings.sfx} 
                            onChange={(e) => handleToggleSFX(e.target.checked)} 
                        />
                    </div>

                    <div className="setting-row">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '1.1rem', fontWeight: 600 }}>
                            <Smartphone size={22} color="#0ea5e9"/>
                            On-Screen Touch Controls
                        </div>
                        <input 
                            type="checkbox" 
                            checked={settings.touch} 
                            onChange={(e) => onUpdateSettings({ ...settings, touch: e.target.checked })} 
                        />
                    </div>
                </div>

                <button 
                    className="btn" 
                    style={{ width: '100%', borderColor: 'rgba(244, 63, 94, 0.4)', color: '#f43f5e', position: 'relative', zIndex: 2 }}
                    onClick={onResetSave}
                >
                    <RotateCcw size={18} style={{marginRight: '8px', verticalAlign: 'middle'}}/>
                    Reset Progress
                </button>
            </motion.div>
        </ScreenOverlay>
    );
}
