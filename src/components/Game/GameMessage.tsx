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
        className="w-full"
      >
        <div className="bg-black bg-opacity-90 text-white px-3 py-2 sm:px-4 sm:py-3 rounded-lg border-2 border-yellow-400 shadow-2xl w-full mx-auto">
          <div className="text-center">
            <p className="text-sm sm:text-lg font-semibold">{message}</p>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
