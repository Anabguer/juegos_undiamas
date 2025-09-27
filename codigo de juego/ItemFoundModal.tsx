'use client';

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

interface ItemFoundModalProps {
  isOpen: boolean;
  itemName: string;
  itemImage: string;
  funnyPhrase?: string;
  onClose: () => void;
  isTutorial?: boolean;
}

export const ItemFoundModal: React.FC<ItemFoundModalProps> = ({
  isOpen,
  itemName,
  itemImage,
  funnyPhrase,
  onClose,
  isTutorial = false
}) => {
  const handleClose = () => {
    if (isTutorial) {
      // Si es tutorial, mostrar el mensaje de zombie
      const { useGameStore } = require('@/store/gameStore');
      const { showBearGuide, set } = useGameStore.getState();
      const { BEAR_MESSAGES } = require('@/config/characters');
      
      set({ tutorialPhase: 'zombie_warning' });
      showBearGuide(BEAR_MESSAGES.TUTORIAL_ZOMBIE_DEFENSE);
    }
    onClose();
  };

  // Auto-cerrar después de 3 segundos
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        handleClose();
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [isOpen, handleClose]);

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: 300, scale: 0.8 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 300, scale: 0.8 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="fixed top-4 right-4 z-50 max-w-xs"
      onClick={handleClose}
    >
      <motion.div
        className="bg-gray-800 border-2 border-yellow-400 rounded-lg shadow-xl p-4 backdrop-blur-sm bg-opacity-95"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="flex items-center space-x-3">
          <img 
            src={itemImage} 
            alt={itemName}
            className="w-12 h-12 object-contain flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-yellow-400 truncate" style={{ fontFamily: 'Comic Sans MS, cursive' }}>
              ¡Encontrado!
            </p>
            <p className="text-white font-semibold text-sm truncate" style={{ fontFamily: 'Comic Sans MS, cursive' }}>
              {itemName}
            </p>
            {funnyPhrase && (
              <p className="text-xs text-gray-300 italic truncate" style={{ fontFamily: 'Comic Sans MS, cursive' }}>
                "{funnyPhrase}"
              </p>
            )}
          </div>
          <div className="flex-shrink-0">
            <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
