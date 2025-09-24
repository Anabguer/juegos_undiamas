'use client';

import React from 'react';
import { useGameStore } from '@/store/gameStore';
import { motion } from 'framer-motion';

export const Character: React.FC = () => {
  const { hunger, thirst, health, isInfected, isCold } = useGameStore();

  const getCharacterState = () => {
    if (isInfected) return 'infected';
    if (isCold) return 'cold';
    if (hunger < 30) return 'hungry';
    if (thirst < 30) return 'thirsty';
    return 'normal';
  };

  const getCharacterImage = () => {
    const state = getCharacterState();
    switch (state) {
      case 'infected':
        return '/images/char_infected.png';
      case 'cold':
        return '/images/char_cold.png';
      case 'hungry':
        return '/images/char_hungry.png';
      case 'thirsty':
        return '/images/char_thirsty.png';
      default:
        return '/images/char_normal.png';
    }
  };

  const getCharacterAnimation = () => {
    const state = getCharacterState();
    switch (state) {
      case 'infected':
        return {
          animate: { 
            rotate: [0, -5, 5, -5, 0],
            scale: [1, 1.05, 1, 1.05, 1]
          },
          transition: { 
            duration: 2, 
            repeat: Infinity,
            ease: "easeInOut"
          }
        };
      case 'cold':
        return {
          animate: { 
            y: [0, -2, 0, -2, 0],
            rotate: [0, -1, 1, -1, 0]
          },
          transition: { 
            duration: 1.5, 
            repeat: Infinity,
            ease: "easeInOut"
          }
        };
      case 'hungry':
        return {
          animate: { 
            scale: [1, 0.95, 1, 0.95, 1]
          },
          transition: { 
            duration: 2, 
            repeat: Infinity,
            ease: "easeInOut"
          }
        };
      case 'thirsty':
        return {
          animate: { 
            scale: [1, 0.95, 1, 0.95, 1]
          },
          transition: { 
            duration: 2, 
            repeat: Infinity,
            ease: "easeInOut"
          }
        };
      default:
        return {
          animate: { 
            y: [0, -2, 0]
          },
          transition: { 
            duration: 3, 
            repeat: Infinity,
            ease: "easeInOut"
          }
        };
    }
  };

  const getCharacterGlow = () => {
    const state = getCharacterState();
    switch (state) {
      case 'infected':
        return 'shadow-lg shadow-green-500/50';
      case 'cold':
        return 'shadow-lg shadow-blue-500/50';
      case 'hungry':
        return 'shadow-lg shadow-red-500/50';
      case 'thirsty':
        return 'shadow-lg shadow-blue-500/50';
      default:
        return 'shadow-lg shadow-white/20';
    }
  };

  return (
    <div className="flex justify-center mb-4 sm:mb-8">
      <motion.div
        className={`${getCharacterGlow()} rounded-full p-3 sm:p-6 bg-black bg-opacity-30`}
        {...getCharacterAnimation()}
      >
        <img 
          src={getCharacterImage()} 
          alt="Personaje"
          className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 object-contain"
        />
      </motion.div>
    </div>
  );
};
