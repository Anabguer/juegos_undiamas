'use client';

import React from 'react';
import { useGameStore } from '@/store/gameStore';
import { motion } from 'framer-motion';

export const ZombieField: React.FC = () => {
  const { zombies, killZombie } = useGameStore();

  const getZombieImage = (type: string) => {
    const images = ['/images/zombie1.png', '/images/zombie2.png', '/images/zombie3.png', '/images/zombie4.png'];
    const randomIndex = Math.floor(Math.random() * images.length);
    return images[randomIndex];
  };

  const getZombieColor = (type: string) => {
    switch (type) {
      case 'slow':
        return 'text-blue-400';
      case 'normal':
        return 'text-green-400';
      case 'fast':
        return 'text-red-400';
      case 'resistant':
        return 'text-purple-400';
      default:
        return 'text-green-400';
    }
  };

  const handleZombieClick = (zombieId: string) => {
    // Verificar si el jugador tiene un bate
    const { inventory } = useGameStore.getState();
    const bate = inventory.find(item => item.name === 'Bate' && item.quantity > 0);
    
    if (bate) {
      killZombie(zombieId);
      // Usar el bate
      useGameStore.getState().useItem(bate.id);
    } else {
      useGameStore.getState().showMessage("Necesitas un bate para eliminar zombis!");
    }
  };

  return (
    <div className="mb-4 sm:mb-8">
      <h3 className="text-white text-center text-lg sm:text-xl font-bold mb-2 sm:mb-4">Campo de Batalla</h3>
      
      {/* Campo de 6 casillas (0-5) */}
      <div className="grid grid-cols-6 gap-1 sm:gap-2 max-w-2xl mx-auto">
        {Array.from({ length: 6 }, (_, index) => {
          const zombie = zombies.find(z => z.position === index);
          
          return (
            <div
              key={index}
              className="h-16 sm:h-20 bg-gray-800 bg-opacity-50 rounded-lg border-2 border-gray-600 flex items-center justify-center relative touch-manipulation"
              style={{ minHeight: '44px' }}
            >
              {zombie ? (
                <motion.div
                  className="cursor-pointer"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleZombieClick(zombie.id)}
                  title={`Zombi ${zombie.type} - Haz clic para usar bate`}
                >
                  <img 
                    src={getZombieImage(zombie.type)} 
                    alt="Zombi"
                    className="w-8 h-8 sm:w-12 sm:h-12 object-contain"
                  />
                </motion.div>
              ) : (
                <div className="text-gray-500 text-xs sm:text-sm">
                  {index === 0 ? '👤' : index}
                </div>
              )}
              
              {/* Indicador de posición */}
              <div className="absolute bottom-0.5 right-0.5 text-xs text-gray-400">
                {index}
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Información de zombis */}
      {zombies.length > 0 && (
        <div className="mt-2 sm:mt-4 text-center text-white">
          <p className="text-xs sm:text-sm">
            {zombies.length} zombi{zombies.length !== 1 ? 's' : ''} en el campo
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Toca un zombi para usar un bate
          </p>
        </div>
      )}
    </div>
  );
};
