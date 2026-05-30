import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Lock, Unlock } from 'lucide-react';
import ScreenOverlay from './ScreenOverlay';
import WorldManager from '../utils/world';

const manager = new WorldManager();

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
        opacity: 1, 
        transition: { staggerChildren: 0.1 } 
    }
};

const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export default function WorldSelector({ unlockedWorld, unlockedLevel, onSelectStage, onBack }) {
    const [selectedWorld, setSelectedWorld] = useState(null);

    const handleSelectWorld = (world) => {
        if (world.id > unlockedWorld) return;
        setSelectedWorld(world);
    };

    return (
        <ScreenOverlay>
            <motion.div 
                className="menu-card glass-panel large-card"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
            >
                <div className="card-header">
                    <button className="icon-btn-back" onClick={selectedWorld ? () => setSelectedWorld(null) : onBack}>
                        <ArrowLeft size={24} />
                    </button>
                    <h2>{selectedWorld ? selectedWorld.name : "Select Region"}</h2>
                    <div style={{ width: 44 }}></div> {/* Spacer for centering */}
                </div>

                {!selectedWorld ? (
                    <motion.div 
                        className="world-grid"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        {manager.worlds.map(w => {
                            const isLocked = w.id > unlockedWorld;
                            return (
                                <motion.div 
                                    key={w.id} 
                                    variants={cardVariants}
                                    className={`world-card ${isLocked ? 'locked' : ''}`}
                                    onClick={() => handleSelectWorld(w)}
                                >
                                    <div className="world-num">World {w.id}</div>
                                    <div className="world-title">{w.name}</div>
                                    <div className="world-progress" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        {isLocked ? <><Lock size={14} /> Locked</> : <><Unlock size={14} /> Available</>}
                                    </div>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                ) : (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px', padding: '20px 0' }}
                    >
                        <div className="story-teaser" style={{ margin: 0, fontSize: '1.1rem', maxWidth: '600px', textAlign: 'center' }}>
                            {selectedWorld.intro}
                        </div>
                        <h3 style={{ fontFamily: 'Cinzel', color: '#f59e0b', fontSize: '1.5rem', letterSpacing: '2px' }}>Choose Stage</h3>
                        <div style={{ display: 'flex', gap: '20px', marginTop: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
                            {[1, 2, 3, 4].map(s => {
                                const isStageLocked = (selectedWorld.id === unlockedWorld && s > unlockedLevel);
                                const label = s === 4 ? 'BOSS' : `Stage ${s}`;
                                return (
                                    <button 
                                        key={s}
                                        className={`btn ${s === 4 ? 'btn-primary' : ''}`}
                                        disabled={isStageLocked}
                                        onClick={() => onSelectStage(selectedWorld.id, s)}
                                        style={{ minWidth: '120px' }}
                                    >
                                        {isStageLocked && <Lock size={16} style={{marginRight: '6px', verticalAlign: 'middle'}}/>}
                                        {label}
                                    </button>
                                );
                            })}
                        </div>
                    </motion.div>
                )}
            </motion.div>
        </ScreenOverlay>
    );
}
