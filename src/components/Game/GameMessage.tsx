'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface GameMessageProps {
  message: string;
}

export const GameMessage: React.FC<GameMessageProps> = ({ message }) => {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -50, scale: 0.8 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -50, scale: 0.8 }}
        transition={{ 
          type: "spring",
          stiffness: 300,
          damping: 30
        }}
        className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50"
      >
        <div className="bg-black bg-opacity-90 text-white px-4 py-3 sm:px-6 sm:py-4 rounded-lg border-2 border-yellow-400 shadow-2xl max-w-xs sm:max-w-md mx-2 sm:mx-4">
          <div className="text-center">
            <div className="text-xl sm:text-2xl mb-1 sm:mb-2">💬</div>
            <p className="text-sm sm:text-lg font-semibold">{message}</p>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
