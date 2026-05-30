import React from 'react';

export default function ScreenOverlay({ children, className = '' }) {
    return (
        <div className={`screen-overlay ${className}`}>
            {children}
        </div>
    );
}
