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
            {/* Left side D-Pad with perfect spacing (no overlaps) */}
            <div className="control-group" style={{ position: 'relative', width: 180, height: 120 }}>
                <button 
                    className="touch-btn" 
                    style={{ position: 'absolute', left: 0, top: 20, width: 60, height: 60 }}
                    onTouchStart={(e) => handleTouch(e, 'left', true)}
                    onTouchEnd={(e) => handleTouch(e, 'left', false)}
                >
                    <ArrowLeft size={28} />
                </button>
                <button 
                    className="touch-btn" 
                    style={{ position: 'absolute', left: 60, bottom: 0, width: 60, height: 60 }}
                    onTouchStart={(e) => handleTouch(e, 'down', true)}
                    onTouchEnd={(e) => handleTouch(e, 'down', false)}
                >
                    <ArrowDown size={28} />
                </button>
                <button 
                    className="touch-btn" 
                    style={{ position: 'absolute', left: 120, top: 20, width: 60, height: 60 }}
                    onTouchStart={(e) => handleTouch(e, 'right', true)}
                    onTouchEnd={(e) => handleTouch(e, 'right', false)}
                >
                    <ArrowRight size={28} />
                </button>
            </div>
        </div>
    );
}
