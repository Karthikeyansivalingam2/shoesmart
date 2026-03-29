import React from 'react';
import { motion } from 'framer-motion';

const LoadingSpinner = () => {
    return (
        <div className="fixed inset-0 z-[100] bg-background flex items-center justify-center">
            <div className="relative">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-16 h-16 border-4 border-accent/20 border-t-accent rounded-full"
                />
                <motion.div
                    initial={{ opacity: 0.5, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, repeat: Infinity, repeatType: 'reverse' }}
                    className="absolute inset-0 flex items-center justify-center"
                >
                    <div className="w-4 h-4 bg-accent rounded-full" />
                </motion.div>
            </div>
        </div>
    );
};

export default LoadingSpinner;
