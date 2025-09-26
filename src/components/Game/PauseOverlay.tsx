'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PauseOverlayProps {
  isVisible: boolean;
}

export const PauseOverlay: React.FC<PauseOverlayProps> = ({ isVisible }) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-40 pointer-events-none"
        >
          {/* Borde superior */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-yellow-400 opacity-80"></div>
          
          {/* Borde inferior */}
          <div className="absolute bottom-0 left-0 right-0 h-2 bg-yellow-400 opacity-80"></div>
          
          {/* Borde izquierdo */}
          <div className="absolute top-0 bottom-0 left-0 w-2 bg-yellow-400 opacity-80"></div>
          
          {/* Borde derecho */}
          <div className="absolute top-0 bottom-0 right-0 w-2 bg-yellow-400 opacity-80"></div>
          
          {/* Indicador de pausa en el centro */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ delay: 0.2, duration: 0.3 }}
              className="bg-black bg-opacity-60 rounded-full p-4 border-4 border-yellow-400"
            >
              <div className="flex items-center justify-center space-x-1">
                <div className="w-3 h-8 bg-white rounded-sm"></div>
                <div className="w-3 h-8 bg-white rounded-sm"></div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
