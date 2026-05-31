import React from 'react';
import { ArrowLeft, ArrowRight, Swords, ArrowUp } from 'lucide-react';

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
            {/* Left side D-Pad */}
            <div className="control-group dpad-group">
                <button 
                    className="touch-btn btn-jump" 
                    onTouchStart={(e) => handleTouch(e, 'jump', true)}
                    onTouchEnd={(e) => handleTouch(e, 'jump', false)}
                    onTouchCancel={(e) => handleTouch(e, 'jump', false)}
                >
                    <ArrowUp size={32} />
                </button>
                <button 
                    className="touch-btn btn-left" 
                    onTouchStart={(e) => handleTouch(e, 'left', true)}
                    onTouchEnd={(e) => handleTouch(e, 'left', false)}
                    onTouchCancel={(e) => handleTouch(e, 'left', false)}
                >
                    <ArrowLeft size={32} />
                </button>
                <button 
                    className="touch-btn btn-right" 
                    onTouchStart={(e) => handleTouch(e, 'right', true)}
                    onTouchEnd={(e) => handleTouch(e, 'right', false)}
                    onTouchCancel={(e) => handleTouch(e, 'right', false)}
                >
                    <ArrowRight size={32} />
                </button>
            </div>

            {/* Right side Actions */}
            <div className="control-group action-group">
                <button 
                    className="touch-btn btn-attack" 
                    onTouchStart={(e) => handleTouch(e, 'attack', true)}
                    onTouchEnd={(e) => handleTouch(e, 'attack', false)}
                    onTouchCancel={(e) => handleTouch(e, 'attack', false)}
                >
                    <Swords size={38} />
                </button>
            </div>
        </div>
    );
}
