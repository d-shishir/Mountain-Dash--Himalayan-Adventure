import React from 'react';
import { motion } from 'framer-motion';
import { Pause, Heart } from 'lucide-react';

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
    const renderHearts = () => {
        const heartElements = [];
        for (let i = 0; i < maxHearts; i++) {
            const isFull = i < Math.floor(hearts);
            const isHalf = !isFull && (i < hearts);
            
            let fillColor = "transparent";
            let strokeColor = "#475569";
            let opacity = 0.35;
            let scale = 0.85;
            
            if (isFull) {
                fillColor = "#e11d48";
                strokeColor = "#e11d48";
                opacity = 1;
                scale = 1.0;
            } else if (isHalf) {
                fillColor = "url(#half-heart-grad)";
                strokeColor = "#e11d48";
                opacity = 1;
                scale = 0.95;
            }
            
            heartElements.push(
                <motion.div
                    key={i}
                    initial={{ scale: 0.8 }}
                    animate={{ scale: scale, opacity: opacity }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                    <Heart 
                        size={24} 
                        fill={fillColor} 
                        color={strokeColor} 
                    />
                </motion.div>
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
        <motion.div 
            id="hud" 
            className="hud-container"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
        >
            {/* Hidden SVG for half-heart gradient fills */}
            <svg width="0" height="0" style={{ position: 'absolute' }}>
                <defs>
                    <linearGradient id="half-heart-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="50%" stopColor="#e11d48" />
                        <stop offset="50%" stopColor="transparent" stopOpacity="0" />
                    </linearGradient>
                </defs>
            </svg>

            <div className="hud-group">
                <div className="hud-stat-pill">
                    <div className="hearts-container">
                        {renderHearts()}
                    </div>
                </div>
                <div className="hud-stat-pill" style={{ color: '#fbbf24' }}>
                    <motion.svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        viewBox="0 0 24 24" 
                        fill="#f59e0b" 
                        style={{ width: 24, height: 24 }}
                        animate={{ rotateY: [0, 360] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    >
                        <circle cx="12" cy="12" r="10"/>
                        <text x="12" y="16" fontSize="12" fontWeight="bold" textAnchor="middle" fill="#78350f">$</text>
                    </motion.svg>
                    <span>{String(coins).padStart(3, '0')}</span>
                </div>
            </div>

            <div className="hud-group" style={{ flexDirection: 'column', alignItems: 'center' }}>
                <div className="hud-center-title">{levelName}</div>
                <div style={{ width: '300px', height: '6px', background: 'rgba(0,0,0,0.5)', borderRadius: '3px', overflow: 'hidden' }}>
                    <motion.div 
                        style={{ height: '100%', background: 'linear-gradient(90deg, #e11d48, #f59e0b)' }}
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ type: "tween", ease: "easeOut" }}
                    />
                </div>
            </div>

            <div className="hud-group">
                {activePowerup && (
                    <motion.div 
                        className="hud-stat-pill" 
                        style={{ background: 'linear-gradient(135deg, rgba(14,165,233,0.8), rgba(15,23,42,0.8))', borderColor: '#0ea5e9' }}
                        animate={{ boxShadow: ['0 0 10px #0ea5e9', '0 0 25px #0ea5e9', '0 0 10px #0ea5e9'] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                    >
                        <span>{powerupIcons[activePowerup] || '✨'}</span>
                        <span>{powerupTimer}s</span>
                    </motion.div>
                )}
                <div className="hud-stat-pill">
                    Score: <span style={{ color: '#fbbf24', marginLeft: '6px' }}>{String(score).padStart(5, '0')}</span>
                </div>
                <button className="icon-btn-back" onClick={onPause}>
                    <Pause size={20} />
                </button>
            </div>
        </motion.div>
    );
}
