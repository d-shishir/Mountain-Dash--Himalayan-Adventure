import React from 'react';
import { motion } from 'framer-motion';

export default function ScreenOverlay({ children, className = '' }) {
    return (
        <motion.div 
            className={`screen-overlay ${className}`}
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(8px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            transition={{ duration: 0.4, ease: "easeOut" }}
        >
            {children}
        </motion.div>
    );
}
