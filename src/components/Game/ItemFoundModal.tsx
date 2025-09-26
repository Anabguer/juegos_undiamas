'use client';

import React from 'react';
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
  if (!isOpen) return null;

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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4"
      onClick={handleClose}
    >
      <motion.div
        initial={{ scale: 0.8, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.8, y: 50 }}
        className="bg-gray-800 p-6 sm:p-8 rounded-lg shadow-xl text-center max-w-sm w-full border-4 border-yellow-500"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl sm:text-3xl font-black text-yellow-400 mb-4" style={{ fontFamily: 'Comic Sans MS, cursive', textShadow: '2px 2px 0px #000' }}>
          ¡Encontrado!
        </h2>
        
        <div className="mb-6">
          <img 
            src={itemImage} 
            alt={itemName}
            className="w-24 h-24 sm:w-32 sm:h-32 mx-auto mb-4 object-contain"
          />
          <p className="text-lg sm:text-xl text-white font-bold mb-3" style={{ fontFamily: 'Comic Sans MS, cursive' }}>
            {itemName}
          </p>
          {funnyPhrase && (
            <p className="text-sm sm:text-base text-yellow-300 italic" style={{ fontFamily: 'Comic Sans MS, cursive' }}>
              "{funnyPhrase}"
            </p>
          )}
        </div>
        
        <button
          onClick={onClose}
          className="bg-yellow-400 text-black px-6 py-3 rounded-lg text-lg font-black hover:bg-yellow-300 transition-colors"
          style={{ 
            fontFamily: 'Comic Sans MS, cursive',
            textShadow: '1px 1px 0px #000',
            boxShadow: '2px 2px 0px #000'
          }}
        >
          ¡Continuar!
        </button>
      </motion.div>
    </motion.div>
  );
};
