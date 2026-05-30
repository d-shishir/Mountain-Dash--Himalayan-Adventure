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
                <div className="card-header">
                    <button className="icon-btn-back" onClick={onBack}>
                        <ArrowLeft size={24} />
                    </button>
                    <h2>Settings</h2>
                    <div style={{ width: 44 }}></div>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '30px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '1.1rem', fontWeight: 500 }}>
                            {settings.music ? <Music size={22} color="#0ea5e9"/> : <VolumeX size={22} color="#475569"/>}
                            Sound Music
                        </div>
                        <input 
                            type="checkbox" 
                            checked={settings.music} 
                            onChange={(e) => handleToggleMusic(e.target.checked)} 
                            style={{ width: '24px', height: '24px', accentColor: '#f59e0b', cursor: 'pointer' }}
                        />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '1.1rem', fontWeight: 500 }}>
                            {settings.sfx ? <Volume2 size={22} color="#10b981"/> : <VolumeX size={22} color="#475569"/>}
                            Sound FX
                        </div>
                        <input 
                            type="checkbox" 
                            checked={settings.sfx} 
                            onChange={(e) => handleToggleSFX(e.target.checked)} 
                            style={{ width: '24px', height: '24px', accentColor: '#f59e0b', cursor: 'pointer' }}
                        />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '1.1rem', fontWeight: 500 }}>
                            <Smartphone size={22} color="#e11d48"/>
                            Virtual Touch Controls
                        </div>
                        <input 
                            type="checkbox" 
                            checked={settings.touch} 
                            onChange={(e) => onUpdateSettings({ ...settings, touch: e.target.checked })} 
                            style={{ width: '24px', height: '24px', accentColor: '#f59e0b', cursor: 'pointer' }}
                        />
                    </div>
                </div>

                <button 
                    className="btn" 
                    style={{ width: '100%', borderColor: '#e11d48', color: '#e11d48' }}
                    onClick={onResetSave}
                >
                    <RotateCcw size={18} style={{marginRight: '8px', verticalAlign: 'middle'}}/>
                    Reset Save Progress
                </button>
            </motion.div>
        </ScreenOverlay>
    );
}
