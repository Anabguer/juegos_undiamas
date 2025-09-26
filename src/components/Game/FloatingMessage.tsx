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
  // Pausar el juego si es un mensaje de guía
  React.useEffect(() => {
    if (isVisible && isGuide) {
      const { pauseGame } = require('@/store/gameStore').useGameStore.getState();
      pauseGame();
    } else if (!isVisible && isGuide) {
      const { resumeGame } = require('@/store/gameStore').useGameStore.getState();
      resumeGame();
    }
  }, [isVisible, isGuide]);

  // Función para cerrar y reanudar el juego
  const handleClose = React.useCallback(() => {
    if (isGuide) {
      const { resumeGame, skipTutorial, showBearGuide } = require('@/store/gameStore').useGameStore.getState();
      const { BEAR_MESSAGES } = require('@/config/characters');
      
      // Si es el primer mensaje de bienvenida, mostrar el segundo
      if (message === BEAR_MESSAGES.WELCOME && !skipTutorial) {
        setTimeout(() => {
          showBearGuide(BEAR_MESSAGES.TUTORIAL_DISABLE);
        }, 500);
      } else {
        // Si es el segundo mensaje, iniciar el tutorial de comida
        if (message === BEAR_MESSAGES.TUTORIAL_DISABLE && !skipTutorial) {
          setTimeout(() => {
            // Dar una manzana al jugador (siempre, tenga o no tenga)
            const { addToInventory, triggerFlyingItem } = require('@/store/gameStore').useGameStore.getState();
            addToInventory({
              id: 'tutorial_apple',
              name: 'Manzana',
              type: 'food',
              image: '/images/manzana.png',
              quantity: 1
            });
            // Efecto visual de manzana volando desde Peluso
            triggerFlyingItem('Manzana', 'from_bear');
            // Mostrar mensaje de tutorial de comida
            showBearGuide(BEAR_MESSAGES.TUTORIAL_FOOD);
          }, 500);
        } else if (message === BEAR_MESSAGES.TUTORIAL_FOOD) {
          // Si es el mensaje de comida, NO cerrar hasta que coma
          return; // No ejecutar onClose()
        } else if (message === BEAR_MESSAGES.TIP_HOUSES) {
          // Si es el mensaje de casas, NO cerrar hasta que haga clic en una casa
          return; // No ejecutar onClose()
        } else if (message === BEAR_MESSAGES.TUTORIAL_BLOCKED_HOUSE) {
          // Si es el mensaje de casas bloqueadas, NO cerrar automáticamente
          return; // No ejecutar onClose()
        } else if (message === BEAR_MESSAGES.TUTORIAL_FINAL) {
          // Si es el mensaje final del tutorial, completar el tutorial
          const { set, resumeGame } = require('@/store/gameStore').useGameStore.getState();
          set({ showTutorial: false });
          resumeGame();
          return; // No ejecutar onClose()
        } else {
          resumeGame();
        }
      }
    }
    onClose();
  }, [isGuide, onClose, message]);
  
  // Auto-ocultar solo si NO es un mensaje de guía
  React.useEffect(() => {
    if (isVisible && !isGuide) {
      const timer = setTimeout(() => {
        handleClose();
      }, 4000);
      
      return () => clearTimeout(timer);
    }
  }, [isVisible, isGuide, handleClose]);

  // Cerrar al hacer clic en cualquier parte de la pantalla
  React.useEffect(() => {
    if (isVisible) {
      const handleClick = () => {
        // No cerrar si es el mensaje de tutorial de comida, casas, casas bloqueadas, bate o bufanda
        const { BEAR_MESSAGES } = require('@/config/characters');
        if (message === BEAR_MESSAGES.TUTORIAL_FOOD || message === BEAR_MESSAGES.TIP_HOUSES || message === BEAR_MESSAGES.TUTORIAL_BLOCKED_HOUSE || message === BEAR_MESSAGES.TUTORIAL_BAT || message === BEAR_MESSAGES.TUTORIAL_COLD_NIGHT) {
          return;
        }
        handleClose();
      };
      
      // Añadir listener a todo el documento
      document.addEventListener('click', handleClick);
      
      return () => {
        document.removeEventListener('click', handleClick);
      };
    }
  }, [isVisible, handleClose, message]);
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: -300, scale: 0.8 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: -300, scale: 0.8 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed top-16 left-4 z-[60] max-w-xs cursor-pointer"
          onClick={() => {
            // Si es el mensaje de casa bloqueada, abrir el modal
            const { BEAR_MESSAGES } = require('@/config/characters');
            if (message === BEAR_MESSAGES.TUTORIAL_BLOCKED_HOUSE) {
              const { openBlockedHouseModal, currentCards } = require('@/store/gameStore').useGameStore.getState();
              
              // Encontrar la carta de casa bloqueada y abrir el modal
              const blockedHouseCard = currentCards.find(card => card.isBlockedHouse);
              if (blockedHouseCard) {
                openBlockedHouseModal(blockedHouseCard.id);
              }
              
              // Cerrar el mensaje
              onClose();
            }
          }}
        >
          <div className="bg-black bg-opacity-80 rounded-lg p-3 flex items-start space-x-3 shadow-2xl border-2 border-yellow-400">
            {/* Imagen de Peluso (clickeable para mensajes graciosos) */}
            <div 
              className="flex-shrink-0 cursor-pointer hover:scale-110 transition-transform duration-200"
              onClick={() => {
                // Solo mostrar mensaje gracioso si NO es un mensaje de tutorial
                if (!isGuide) {
                  const { BEAR_MESSAGES } = require('@/config/characters');
                  const randomTouchMsg = BEAR_MESSAGES.TOUCH_OBJECTS[Math.floor(Math.random() * BEAR_MESSAGES.TOUCH_OBJECTS.length)];
                  // Mostrar como mensaje normal (no tutorial)
                  const { useGameStore } = require('@/store/gameStore');
                  useGameStore.getState().setState({ 
                    currentMessage: randomTouchMsg, 
                    showMessage: true 
                  });
                }
              }}
            >
              <img 
                src="/images/ositonarrador.png" 
                alt="Peluso" 
                className="w-12 h-12 object-contain"
              />
            </div>
            
            {/* Mensaje */}
            <div className="flex-1">
              <p className="text-white text-sm font-bold leading-tight" style={{ fontFamily: 'Comic Sans MS, cursive' }}>
                {message}
              </p>
            </div>
            
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
