'use client';

import React, { useEffect, useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import { motion, AnimatePresence } from 'framer-motion';

export const CardDeck: React.FC = () => {
  const { currentCards, selectCard, openBlockedHouseModal, generateCards, updateHealth, inventory, isPaused, showTutorial } = useGameStore();
  const [timeLeft, setTimeLeft] = useState(10);
  const [hasShownTimeMessage, setHasShownTimeMessage] = useState(false);
  

  // Timer para las cartas
  useEffect(() => {
    if (currentCards.length > 0 && !isPaused && !showTutorial) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            // Tiempo agotado - penalización
            updateHealth(-10);
            // Solo mostrar mensaje una vez
            if (!hasShownTimeMessage) {
              setTimeout(() => {
                useGameStore.setState({ currentMessage: "¡Tiempo agotado! Pierdes salud por no elegir.", showMessage: true });
                setHasShownTimeMessage(true);
              }, 0);
            }
            return 5;
          }
          return prev - 1;
        });
      }, 1000);

      return () => {
        clearInterval(timer);
      };
    }
  }, [currentCards.length, isPaused, showTutorial, hasShownTimeMessage, updateHealth]);

  // Generar cartas cuando no hay ninguna y resetear timer
  useEffect(() => {
    if (currentCards.length === 0) {
      generateCards();
    }
    setTimeLeft(10);
    setHasShownTimeMessage(false);
  }, [currentCards.length, generateCards]);

  const handleCardSelect = (cardId: string) => {
    const card = currentCards.find(c => c.id === cardId);
    if (!card) {
      return;
    }

    // Manejar casas bloqueadas
    if (card.effect.type === 'blocked_house' || card.isBlockedHouse) {
      openBlockedHouseModal(cardId);
      return;
    }

    // Verificar si tienes el item específico necesario para usar la carta
    const hasRequiredItem = inventory.some(item => {
      switch (card.effect.type) {
        case 'hunger':
          return item.name === 'Manzana';
        case 'thirst':
          return item.name === 'Agua';
        case 'health':
        case 'infection':
          return item.name === 'Pastilla';
        case 'cold':
          return item.name === 'Bufanda';
        case 'zombie':
          return item.name === 'Bate';
        case 'house':
        case 'blocked_house':
          return true; // Las casas no requieren items
        default:
          return true; // Para cartas de basura, siempre se puede usar
      }
    });

    if (!hasRequiredItem) {
      const messages = {
        hunger: "¡No tienes una Manzana! Busca comida primero.",
        thirst: "¡No tienes Agua! Busca bebida primero.",
        health: "¡No tienes una Pastilla! Busca medicina primero.",
        infection: "¡No tienes una Pastilla! Busca medicina para curar la infección.",
        cold: "¡No tienes una Bufanda! Busca ropa para abrigarte primero.",
        zombie: "¡No tienes un Bate! Busca un arma para defenderte primero."
      };
      
      const message = messages[card.effect.type as keyof typeof messages] || "¡No tienes lo necesario para usar esto!";
      useGameStore.setState({ currentMessage: message, showMessage: true });
      return;
    }

    selectCard(cardId);
    setTimeLeft(10);
  };

  const getCardColor = (type: string) => {
    switch (type) {
      case 'food':
        return 'bg-green-600 border-green-400';
      case 'drink':
        return 'bg-blue-600 border-blue-400';
      case 'medicine':
        return 'bg-red-600 border-red-400';
      case 'clothing':
        return 'bg-purple-600 border-purple-400';
      case 'weapon':
        return 'bg-yellow-600 border-yellow-400';
      case 'junk':
        return 'bg-gray-600 border-gray-400';
      case 'zombie':
        return 'bg-red-800 border-red-600';
      default:
        return 'bg-gray-600 border-gray-400';
    }
  };

  const getCardRarity = (type: string) => {
    switch (type) {
      case 'medicine':
      case 'weapon':
        return 'ring-2 ring-yellow-400';
      case 'junk':
        return 'ring-2 ring-gray-400';
      default:
        return '';
    }
  };

  return (
    <div className="mb-4 sm:mb-8">
      <div className="text-center text-white mb-2 sm:mb-4">
        <div className="flex items-center justify-center space-x-3">
          <h3 className="text-lg sm:text-xl font-bold">Elije</h3>
          {currentCards.length > 0 && (
            <div className={`text-lg sm:text-xl font-bold px-2 py-1 rounded-full bg-red-600 ${timeLeft <= 2 ? 'animate-pulse' : ''}`}>
              {timeLeft}
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-center space-x-2 sm:space-x-4 overflow-x-auto pb-2">
        <AnimatePresence>
          {currentCards.map((card, index) => (
            <motion.div
              key={card.id}
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              transition={{ 
                delay: index * 0.1,
                type: "spring",
                stiffness: 200,
                damping: 20
              }}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              className={`
                w-24 h-24 sm:w-28 sm:h-28 rounded-lg cursor-pointer
                shadow-lg hover:shadow-xl transition-all duration-200
                flex flex-col items-center justify-center p-1 sm:p-2
                text-white touch-manipulation flex-shrink-0
                bg-cover bg-center bg-no-repeat
              `}
              style={{ 
                backgroundImage: 'url(/images/carta.png)',
                minHeight: '44px', 
                minWidth: '44px' 
              }}
              onClick={() => {
                // Bloquear TODAS las interacciones durante el tutorial inicial
                const { showTutorial, currentMessage } = useGameStore.getState();
                if (showTutorial && !currentMessage.includes('Entra en las casas') && !currentMessage.includes('bloqueada')) {
                  return;
                }
                handleCardSelect(card.id);
              }}
            >
              {/* Mostrar casa estática (sin rotación) */}
              {card.effect.type === 'house' && card.houseImage ? (
                <img 
                  src={card.houseImage} 
                  alt={card.name}
                  className="w-20 h-20 sm:w-24 sm:h-24 mb-1 sm:mb-2 object-contain"
                />
              ) : card.effect.type === 'blocked_house' || card.isBlockedHouse ? (
                <img 
                  src={card.houseImage} 
                  alt={card.name}
                  className="w-20 h-20 sm:w-24 sm:h-24 mb-1 sm:mb-2 object-contain"
                />
              ) : card.image ? (
                <img 
                  src={card.image} 
                  alt={card.name}
                  className="w-16 h-16 sm:w-20 sm:h-20 mb-1 sm:mb-2 object-contain"
                />
              ) : (
                <div className="text-3xl sm:text-5xl mb-1 sm:mb-2">{card.emoji}</div>
              )}
              
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {currentCards.length === 0 && (
        <div className="text-center text-white">
          <p className="text-sm sm:text-lg">Generando nuevas cartas...</p>
        </div>
      )}
    </div>
  );
};
