'use client';

import React, { useEffect, useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import { motion, AnimatePresence } from 'framer-motion';

export const CardDeck: React.FC = () => {
  const { currentCards, selectCard, generateCards, showMessage, updateHealth, inventory } = useGameStore();
  const [timeLeft, setTimeLeft] = useState(5);
  const [isSelecting, setIsSelecting] = useState(false);

  // Timer para las cartas
  useEffect(() => {
    if (currentCards.length > 0 && !isSelecting) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            // Tiempo agotado - penalización
            updateHealth(-10);
            // Usar setTimeout para evitar problemas con setState
            setTimeout(() => {
              useGameStore.setState({ currentMessage: "¡Tiempo agotado! Pierdes salud por no elegir.", showMessage: true });
            }, 0);
            return 5;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [currentCards.length, isSelecting]);

  // Generar cartas cuando no hay ninguna
  useEffect(() => {
    if (currentCards.length === 0) {
      generateCards();
      setTimeLeft(5);
      setIsSelecting(false);
    }
  }, [currentCards.length, generateCards]);

  const handleCardSelect = (cardId: string) => {
    const card = currentCards.find(c => c.id === cardId);
    if (!card) return;

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
      showMessage(message);
      return;
    }

    setIsSelecting(true);
    selectCard(cardId);
    setTimeLeft(5);
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
        <h3 className="text-lg sm:text-xl font-bold">Cartas del Turno</h3>
        {currentCards.length > 0 && (
          <div className="flex items-center justify-center space-x-2 mt-1 sm:mt-2">
            <span className="text-xs sm:text-sm">Tiempo restante:</span>
            <div className={`text-sm sm:text-lg font-bold ${timeLeft <= 2 ? 'text-red-400 animate-pulse' : 'text-white'}`}>
              {timeLeft}s
            </div>
          </div>
        )}
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
                w-24 h-32 sm:w-32 sm:h-40 rounded-lg border-2 cursor-pointer
                shadow-lg hover:shadow-xl transition-all duration-200
                flex flex-col items-center justify-center p-2 sm:p-4
                text-white touch-manipulation flex-shrink-0
                bg-cover bg-center bg-no-repeat
              `}
              style={{ 
                backgroundImage: 'url(/images/carta.png)',
                minHeight: '44px', 
                minWidth: '44px' 
              }}
              onClick={() => handleCardSelect(card.id)}
            >
              {card.image ? (
                <img 
                  src={card.image} 
                  alt={card.name}
                  className="w-8 h-8 sm:w-12 sm:h-12 mb-1 sm:mb-2 object-contain"
                />
              ) : (
                <div className="text-2xl sm:text-4xl mb-1 sm:mb-2">{card.emoji}</div>
              )}
              <div className="text-xs sm:text-sm font-bold text-center mb-1">{card.name}</div>
              <div className="text-xs text-center opacity-80 hidden sm:block">{card.description}</div>
              
              {/* Efecto de la carta */}
              {card.effect && (
                <div className="text-xs text-center mt-1 sm:mt-2 opacity-70">
                  {card.effect.type === 'hunger' && `+${card.effect.value} hambre`}
                  {card.effect.type === 'thirst' && `+${card.effect.value} sed`}
                  {card.effect.type === 'health' && `+${card.effect.value} salud`}
                  {card.effect.type === 'infection' && 'Cura infección'}
                  {card.effect.type === 'cold' && 'Protege del frío'}
                  {card.effect.type === 'zombie' && 'Añade bate'}
                  {card.effect.type === 'junk' && 'Objeto inútil'}
                </div>
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
