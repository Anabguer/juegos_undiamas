'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface InfoModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onClose: () => void;
}

export const InfoModal: React.FC<InfoModalProps> = ({
  isOpen,
  title,
  message,
  onClose
}) => {
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.8, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.8, y: 50 }}
        className="bg-gray-800 p-6 sm:p-8 rounded-lg shadow-xl text-center max-w-md w-full border-4 border-blue-500"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl sm:text-3xl font-black text-blue-400 mb-4" style={{ fontFamily: 'Comic Sans MS, cursive', textShadow: '2px 2px 0px #000' }}>
          {title}
        </h2>
        
        <p className="text-lg sm:text-xl text-white mb-6" style={{ fontFamily: 'Comic Sans MS, cursive' }}>
          {message}
        </p>
        
        <button
          onClick={onClose}
          className="bg-blue-500 text-white px-6 py-3 rounded-lg text-lg font-black hover:bg-blue-400 transition-colors"
          style={{ 
            fontFamily: 'Comic Sans MS, cursive',
            textShadow: '1px 1px 0px #000',
            boxShadow: '2px 2px 0px #000'
          }}
        >
          ¡Entendido!
        </button>
      </motion.div>
    </motion.div>
  );
};
