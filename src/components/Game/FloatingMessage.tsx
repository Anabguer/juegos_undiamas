'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface FloatingMessageProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
  isGuide?: boolean; // Si es true, pausa el juego
}

export const FloatingMessage: React.FC<FloatingMessageProps> = ({ 
  message, 
  isVisible, 
  onClose,
  isGuide = false
}) => {
  // No renderizar si no hay mensaje o está vacío
  if (!message || message.trim() === '' || !isVisible) {
    return null;
  }
  
  // Función para cerrar y reanudar el juego
  const handleClose = React.useCallback(() => {
    if (isGuide) {
      const { useGameStore } = require('@/store/gameStore');
      const state = useGameStore.getState();
      
        // Tutorial eliminado - solo reanudar el juego
        useGameStore.setState({ 
          isPaused: false
        });
    }
    onClose();
  }, [isGuide, onClose]);
  
  // Auto-ocultar después de 6 segundos
  React.useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 6000);
      
      return () => clearTimeout(timer);
    }
  }, [isVisible]); // Solo depende de isVisible, no de onClose
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: -300, scale: 0.8 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: -300, scale: 0.8 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed top-28 sm:top-32 left-4 z-[60] max-w-xs"
        >
          <div className="bg-black bg-opacity-80 rounded-lg p-3 shadow-2xl border-2 border-yellow-400">
            {/* Imagen del oso y mensaje */}
            <div className="flex items-start space-x-3">
              <img 
                src="/images/ositonarrador.png" 
                alt="Peluso" 
                className="w-8 h-8 flex-shrink-0"
              />
              <div className="flex-1">
                <p className="text-white text-sm font-bold leading-tight" style={{ fontFamily: 'Comic Sans MS, cursive' }}>
                  {message}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
