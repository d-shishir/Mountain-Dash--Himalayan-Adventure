import React from 'react';
import { ArrowLeft, ArrowRight, ArrowDown, Swords, ArrowUp } from 'lucide-react';

export default function MobileControls({ onTouchDown, onTouchUp }) {
    const handleTouch = (e, btn, isPressed) => {
        e.preventDefault();
        if (isPressed) {
            onTouchDown(btn);
        } else {
            onTouchUp(btn);
        }
    };

    return (
        <div id="mobile-controls">
            <div className="control-group" style={{ position: 'relative', width: 150, height: 150 }}>
                <button 
                    className="touch-btn" 
                    style={{ position: 'absolute', left: 0, top: 50 }}
                    onTouchStart={(e) => handleTouch(e, 'left', true)}
                    onTouchEnd={(e) => handleTouch(e, 'left', false)}
                >
                    <ArrowLeft size={32} />
                </button>
                <button 
                    className="touch-btn" 
                    style={{ position: 'absolute', left: 50, bottom: 0 }}
                    onTouchStart={(e) => handleTouch(e, 'down', true)}
                    onTouchEnd={(e) => handleTouch(e, 'down', false)}
                >
                    <ArrowDown size={32} />
                </button>
                <button 
                    className="touch-btn" 
                    style={{ position: 'absolute', right: 0, top: 50 }}
                    onTouchStart={(e) => handleTouch(e, 'right', true)}
                    onTouchEnd={(e) => handleTouch(e, 'right', false)}
                >
                    <ArrowRight size={32} />
                </button>
            </div>
            
            <div className="control-group" style={{ alignItems: 'flex-end' }}>
                <button 
                    className="touch-btn btn-attack" 
                    style={{ width: 65, height: 65, marginBottom: 10 }}
                    onTouchStart={(e) => handleTouch(e, 'attack', true)}
                    onTouchEnd={(e) => handleTouch(e, 'attack', false)}
                >
                    <Swords size={32} />
                </button>
                <button 
                    className="touch-btn btn-jump" 
                    onTouchStart={(e) => {
                        e.preventDefault();
                        onTouchDown('jump');
                        onTouchDown('jumpPressed');
                    }}
                    onTouchEnd={(e) => handleTouch(e, 'jump', false)}
                >
                    <ArrowUp size={40} />
                </button>
            </div>
        </div>
    );
}
