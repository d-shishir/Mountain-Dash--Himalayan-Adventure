import React from 'react';

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
            <div className="control-dpad">
                <button 
                    className="control-btn" 
                    id="ctrl-left" 
                    type="button"
                    onTouchStart={(e) => handleTouch(e, 'left', true)}
                    onTouchEnd={(e) => handleTouch(e, 'left', false)}
                >
                    ◀
                </button>
                <button 
                    className="control-btn" 
                    id="ctrl-down" 
                    type="button"
                    onTouchStart={(e) => handleTouch(e, 'down', true)}
                    onTouchEnd={(e) => handleTouch(e, 'down', false)}
                >
                    ▼
                </button>
                <button 
                    className="control-btn" 
                    id="ctrl-right" 
                    type="button"
                    onTouchStart={(e) => handleTouch(e, 'right', true)}
                    onTouchEnd={(e) => handleTouch(e, 'right', false)}
                >
                    ▶
                </button>
            </div>
            <div className="control-actions">
                <button 
                    className="control-btn action-btn-sprint" 
                    id="ctrl-sprint" 
                    type="button"
                    onTouchStart={(e) => handleTouch(e, 'sprint', true)}
                    onTouchEnd={(e) => handleTouch(e, 'sprint', false)}
                >
                    Sprint
                </button>
                <button 
                    className="control-btn action-btn-attack" 
                    id="ctrl-attack" 
                    type="button"
                    onTouchStart={(e) => handleTouch(e, 'attack', true)}
                    onTouchEnd={(e) => handleTouch(e, 'attack', false)}
                >
                    ⚔️
                </button>
                <button 
                    className="control-btn action-btn-jump" 
                    id="ctrl-jump" 
                    type="button"
                    onTouchStart={(e) => {
                        e.preventDefault();
                        onTouchDown('jump');
                        onTouchDown('jumpPressed'); // Trigger single tap jump
                    }}
                    onTouchEnd={(e) => handleTouch(e, 'jump', false)}
                >
                    Jump
                </button>
            </div>
        </div>
    );
}
