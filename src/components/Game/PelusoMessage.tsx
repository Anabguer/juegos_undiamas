'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface PelusoMessageProps {
  isVisible: boolean;
  onRegister: () => void;
  onLater: () => void;
}

export const PelusoMessage: React.FC<PelusoMessageProps> = ({
  isVisible,
  onRegister,
  onLater
}) => {
  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[80] flex items-center justify-center bg-black bg-opacity-80"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="bg-black border-4 border-yellow-400 rounded-xl p-6 max-w-md mx-4"
        style={{
          boxShadow: '0 0 30px 10px rgba(255, 255, 0, 0.3), inset 0 0 20px rgba(255, 255, 0, 0.1)',
          animation: 'pulse 2s ease-in-out infinite'
        }}
      >
        {/* Avatar de Peluso usando la imagen correcta */}
        <div className="flex items-center space-x-4 mb-4">
          <img 
            src="/images/peluso.png" 
            alt="Peluso" 
            className="w-16 h-16 object-contain"
          />
          <h3 className="text-2xl font-black text-yellow-400" style={{
            fontFamily: 'Comic Sans MS, cursive',
            textShadow: '3px 3px 0px #000, -2px -2px 0px #000, 2px -2px 0px #000, -2px 2px 0px #000'
          }}>
            PELUSO DICE:
          </h3>
        </div>

        {/* Mensaje de Peluso */}
        <div className="mb-6">
          <p className="text-white text-lg font-bold leading-relaxed" style={{
            fontFamily: 'Comic Sans MS, cursive',
            textShadow: '2px 2px 0px #000'
          }}>
            "¡Oye! Estás durando más de lo que imaginaba al verte esas patuchas... 
            ¿No quieres registrarte y así no pierdas lo que llevas? 
            Total, si se borra la caché o algo, al menos tendrás tus datos guardados."
          </p>
        </div>

        {/* Botones */}
        <div className="flex space-x-4">
          <button
            onClick={onRegister}
            className="flex-1 bg-yellow-400 hover:bg-yellow-300 text-black font-black py-3 px-4 rounded-lg transition-colors"
            style={{
              fontFamily: 'Comic Sans MS, cursive',
              textShadow: '2px 2px 0px #000',
              boxShadow: '4px 4px 0px #000, 0 0 20px rgba(255, 255, 0, 0.6)',
              border: '4px solid #000'
            }}
          >
            REGISTRAR
          </button>
          <button
            onClick={onLater}
            className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-4 rounded-lg transition-colors"
            style={{
              fontFamily: 'Comic Sans MS, cursive',
              textShadow: '2px 2px 0px #000',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)'
            }}
          >
            MÁS TARDE
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};
