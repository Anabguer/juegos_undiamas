'use client';

import React, { useEffect, useCallback, useRef } from 'react';
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
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  // Auto-cerrar después de 3 segundos
  useEffect(() => {
    if (isOpen) {
      console.log(`ITEM MODAL - Abriendo modal, auto-cerrar en 3 segundos`);
      timerRef.current = setTimeout(() => {
        console.log(`ITEM MODAL - Auto-cerrando modal después de 3 segundos`);
        handleClose(); // Usar handleClose en lugar de onClose directamente
      }, 3000);
      
      return () => {
        if (timerRef.current) {
          console.log(`ITEM MODAL - Limpiando timer`);
          clearTimeout(timerRef.current);
          timerRef.current = null;
        }
      };
    }
  }, [isOpen, handleClose]); // Incluir handleClose en las dependencias

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 flex items-center justify-center z-50 cursor-pointer"
      onClick={handleClose}
    >
      <motion.div
        initial={{ scale: 0.1, rotate: -180, y: -50 }}
        animate={{ 
          scale: [0.1, 1.3, 1], 
          y: [0, -20, 0],
          rotate: [-180, 0, 10, -10, 0],
          boxShadow: [
            "0 0 15px rgba(100, 100, 100, 0.3)",
            "0 0 25px rgba(150, 150, 150, 0.5)",
            "0 0 15px rgba(100, 100, 100, 0.3)"
          ]
        }}
        exit={{ scale: 0.1, rotate: 180, y: 50 }}
        transition={{ 
          duration: 0.8, 
          ease: [0.68, -0.55, 0.265, 1.55],
          times: [0, 0.4, 0.7, 1],
          boxShadow: { duration: 1.5, repeat: Infinity }
        }}
        className="bg-black bg-opacity-80 border-2 border-gray-600 rounded-lg shadow-2xl p-4 backdrop-blur-sm cursor-pointer"
        onClick={handleClose}
      >
        <div className="flex flex-col items-center space-y-4">
          <motion.img 
            src={itemImage} 
            alt={itemName}
            className="w-16 h-16 object-contain"
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 10, -10, 0]
            }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              repeatDelay: 1
            }}
          />
          <div className="text-center space-y-2">
            <p 
              className="text-4xl font-black text-orange-400" 
              style={{ fontFamily: 'Comic Sans MS, cursive', textShadow: '3px 3px 0px #000' }}
            >
              ¡{itemName}!
            </p>
            {funnyPhrase && (
              <motion.p 
                className="text-base text-gray-300 font-semibold" 
                style={{ fontFamily: 'Comic Sans MS, cursive' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {funnyPhrase}
              </motion.p>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};