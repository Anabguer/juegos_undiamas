'use client';

import React from 'react';
import { useGameStore } from '@/store/gameStore';
import { motion, AnimatePresence } from 'framer-motion';

export const StatusIndicators: React.FC = () => {
  const { isInfected, isCold } = useGameStore();

  // No mostrar nada si no hay estados activos
  if (!isInfected && !isCold) {
    return null;
  }

  return (
    <div className="flex justify-center space-x-3 sm:space-x-4 mb-2 sm:mb-4">
      <AnimatePresence>
        {isInfected && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="flex items-center space-x-1 sm:space-x-2 text-green-400"
          >
            <span className="text-2xl sm:text-3xl">🦠</span>
            <span className="text-sm sm:text-base font-semibold drop-shadow-lg">Contagiado</span>
          </motion.div>
        )}
        {isCold && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="flex items-center space-x-1 sm:space-x-2 text-blue-400"
          >
            <span className="text-2xl sm:text-3xl">❄️</span>
            <span className="text-sm sm:text-base font-semibold drop-shadow-lg">Frío</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

