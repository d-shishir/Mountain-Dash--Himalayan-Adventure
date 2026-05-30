import React from 'react';
import ScreenOverlay from './ScreenOverlay';
import { audio } from '../utils/audio';

export default function Shop({ coins, upgrades, onUpgrade, onBack }) {
    const items = [
        { id: 'hearts', name: 'Extra Hearts', icon: '❤️', desc: 'Increases Arjun\'s max health', cost: 10, current: upgrades.hearts, limit: 6 },
        { id: 'jump', name: 'Yak Spring Boots', icon: '🥾', desc: 'Increases vertical jump power', cost: 15, current: upgrades.jump, limit: 5 },
        { id: 'speed', name: 'Sherpa Windboots', icon: '🌀', desc: 'Arjun runs and sprints faster', cost: 15, current: upgrades.speed, limit: 5 },
        { id: 'khukuri', name: 'Golden Khukuri', icon: '⚔️', desc: 'Unsheathe permanent blade attacks', cost: 25, current: upgrades.khukuri, limit: 1 }
    ];

    const handleBuy = (item, cost) => {
        if (coins >= cost && item.current < item.limit) {
            onUpgrade(item.id, cost);
            audio.playSFX('powerup');
        }
    };

    return (
        <ScreenOverlay>
            <div className="menu-card glass-panel large-card">
                <div className="card-header">
                    <button className="back-btn" onClick={onBack}>⬅ Back</button>
                    <h2>Trader's Bazaar</h2>
                    <div className="coins-balance">
                        <span>{coins}</span> Coins
                    </div>
                </div>

                <div className="shop-grid">
                    {items.map(item => {
                        const isLimitReached = item.current >= item.limit;
                        const itemCost = item.cost + (item.current * 5);
                        const buyBtnLabel = isLimitReached ? 'MAX OUT' : `BUY: ${itemCost} Coins`;
                        const canAfford = coins >= itemCost;

                        return (
                            <div key={item.id} className="shop-item">
                                <div className="shop-item-icon">{item.icon}</div>
                                <div className="shop-item-title">{item.name} ({item.current}/{item.limit})</div>
                                <div className="shop-item-desc">{item.desc}</div>
                                <button 
                                    className="btn btn-primary shop-item-buy" 
                                    disabled={isLimitReached || !canAfford}
                                    onClick={() => handleBuy(item, itemCost)}
                                >
                                    {buyBtnLabel}
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>
        </ScreenOverlay>
    );
}
