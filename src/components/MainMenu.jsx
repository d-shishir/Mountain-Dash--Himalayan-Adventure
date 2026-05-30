import React from 'react';
import { motion } from 'framer-motion';
import { Play, Map, ShoppingBag, Settings as SettingsIcon } from 'lucide-react';
import ScreenOverlay from './ScreenOverlay';

const containerVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: { 
        opacity: 1, 
        y: 0, 
        scale: 1,
        transition: {
            duration: 0.5,
            ease: "easeOut",
            staggerChildren: 0.1,
            delayChildren: 0.2
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
};

export default function MainMenu({ onPlay, onNavigate, onResumeGame, hasActiveGame }) {
    return (
        <ScreenOverlay>
            <motion.div 
                className="menu-card glass-panel"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <div className="nepali-border"></div>
                
                <motion.h1 variants={itemVariants} className="game-title">Mountain Dash</motion.h1>
                <motion.h2 variants={itemVariants} className="game-subtitle">Himalayan Adventure</motion.h2>
                
                <motion.div variants={itemVariants} className="story-teaser">
                    The dark mountain spirits have stolen the sacred prayer flags protecting Sagarmatha. Unsheathe your khukuri, guide Arjun across Nepal's peaks, and defeat the Shadow Yeti King!
                </motion.div>
                
                <motion.div variants={itemVariants} className="menu-buttons">
                    {hasActiveGame ? (
                        <button className="btn btn-primary" onClick={onResumeGame}>
                            <Play size={20} style={{marginRight: '8px', verticalAlign: 'middle'}}/>
                            Resume Adventure
                        </button>
                    ) : (
                        <button className="btn btn-primary" onClick={onPlay}>
                            <Play size={20} style={{marginRight: '8px', verticalAlign: 'middle'}}/>
                            Adventure Start
                        </button>
                    )}
                    <button className="btn" onClick={() => onNavigate('world-select')}>
                        <Map size={20} style={{marginRight: '8px', verticalAlign: 'middle'}}/>
                        World Select
                    </button>
                    <button className="btn" onClick={() => onNavigate('shop')}>
                        <ShoppingBag size={20} style={{marginRight: '8px', verticalAlign: 'middle'}}/>
                        Trader's Shop
                    </button>
                    <button className="btn" onClick={() => onNavigate('settings')}>
                        <SettingsIcon size={20} style={{marginRight: '8px', verticalAlign: 'middle'}}/>
                        Settings
                    </button>
                </motion.div>
                
                <motion.div variants={itemVariants} className="footer-credits" style={{marginTop: '30px', fontSize: '0.8rem', opacity: 0.6}}>
                    Built with Premium HTML5 Canvas & React
                </motion.div>
            </motion.div>
        </ScreenOverlay>
    );
}
