import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Coins, Heart, Wind, Swords, Zap } from 'lucide-react';
import ScreenOverlay from './ScreenOverlay';
import { audio } from '../utils/audio';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
        opacity: 1, 
        transition: { staggerChildren: 0.1 } 
    }
};

const itemVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 200, damping: 20 } }
};

export default function Shop({ coins, upgrades, onUpgrade, onBack }) {
    const items = [
        { id: 'hearts', name: 'Extra Hearts', icon: <Heart size={36} color="#e11d48" />, desc: 'Increases Arjun\'s max health', cost: 10, current: upgrades.hearts, limit: 6 },
        { id: 'jump', name: 'Yak Spring Boots', icon: <Wind size={36} color="#0ea5e9" />, desc: 'Increases vertical jump power', cost: 15, current: upgrades.jump, limit: 5 },
        { id: 'speed', name: 'Sherpa Windboots', icon: <Zap size={36} color="#fbbf24" />, desc: 'Arjun runs and sprints faster', cost: 15, current: upgrades.speed, limit: 5 },
        { id: 'khukuri', name: 'Golden Khukuri', icon: <Swords size={36} color="#f59e0b" />, desc: 'Unsheathe permanent blade attacks', cost: 25, current: upgrades.khukuri, limit: 1 }
    ];

    const handleBuy = (item, cost) => {
        if (coins >= cost && item.current < item.limit) {
            onUpgrade(item.id, cost);
            audio.playSFX('powerup');
        }
    };

    return (
        <ScreenOverlay>
            <motion.div 
                className="menu-card glass-panel large-card"
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.4 }}
            >
                <div className="card-header">
                    <button className="icon-btn-back" onClick={onBack}>
                        <ArrowLeft size={24} />
                    </button>
                    <h2>Trader's Bazaar</h2>
                    <div className="hud-stat-pill" style={{ padding: '6px 12px', fontSize: '1rem', color: '#fbbf24', borderColor: '#fbbf24' }}>
                        <Coins size={18} style={{marginRight: '6px'}}/>
                        <span>{coins}</span>
                    </div>
                </div>

                <motion.div 
                    className="shop-grid"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {items.map(item => {
                        const isLimitReached = item.current >= item.limit;
                        const itemCost = item.cost + (item.current * 5);
                        const buyBtnLabel = isLimitReached ? 'MAX OUT' : `BUY: ${itemCost} Coins`;
                        const canAfford = coins >= itemCost;

                        return (
                            <motion.div key={item.id} className="shop-item" variants={itemVariants}>
                                <div className="shop-icon" style={{filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.5))'}}>
                                    {item.icon}
                                </div>
                                <div className="shop-title">{item.name} ({item.current}/{item.limit})</div>
                                <div className="shop-desc">{item.desc}</div>
                                <button 
                                    className={`btn ${!isLimitReached && canAfford ? 'btn-primary' : ''}`} 
                                    style={{ width: '100%', fontSize: '0.9rem', padding: '12px' }}
                                    disabled={isLimitReached || !canAfford}
                                    onClick={() => handleBuy(item, itemCost)}
                                >
                                    {buyBtnLabel}
                                </button>
                            </motion.div>
                        );
                    })}
                </motion.div>
            </motion.div>
        </ScreenOverlay>
    );
}
