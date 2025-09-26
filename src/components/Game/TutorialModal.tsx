'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CHARACTERS } from '@/config/characters';

interface TutorialModalProps {
  isOpen: boolean;
  message: string;
  onClose: () => void;
}

export const TutorialModal: React.FC<TutorialModalProps> = ({
  isOpen,
  message,
  onClose
}) => {
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 cursor-pointer"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.8, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.8, y: 50 }}
        className="bg-gray-800 p-6 sm:p-8 rounded-lg shadow-xl text-center max-w-md w-full border-4 border-yellow-500 cursor-pointer"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Osito de peluche */}
        <div className="flex items-center justify-center mb-4">
          <div className="text-center">
            <img 
              src="/images/ositonarrador.png" 
              alt="Osito Tutorial"
              className="w-16 h-16 sm:w-20 sm:h-20 object-contain mx-auto mb-2"
            />
            <h3 className="text-lg sm:text-xl font-bold text-yellow-400" style={{ fontFamily: 'Comic Sans MS, cursive' }}>
              {CHARACTERS.TUTORIAL_BEAR.name}
            </h3>
            <p className="text-sm text-gray-300" style={{ fontFamily: 'Comic Sans MS, cursive' }}>
              {CHARACTERS.TUTORIAL_BEAR.title}
            </p>
          </div>
        </div>
        
        {/* Bocadillo de texto */}
        <div className="bg-yellow-200 p-4 rounded-lg mb-4 relative">
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-yellow-200"></div>
          <p className="text-gray-800 text-lg font-bold" style={{ fontFamily: 'Comic Sans MS, cursive' }}>
            {message}
          </p>
        </div>
        
        {/* Texto de instrucción */}
        <div className="text-center">
          <p className="text-gray-400 text-sm" style={{ fontFamily: 'Comic Sans MS, cursive' }}>
            Toca cualquier parte para continuar
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};
