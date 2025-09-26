'use client';

import React from 'react';
import { useGameStore } from '@/store/gameStore';
import { motion } from 'framer-motion';

export const Character: React.FC = () => {
  const { hunger, thirst, health, isInfected, isCold, characterEffect } = useGameStore();

  const getCharacterState = () => {
    if (isInfected) return 'infected';
    if (isCold) return 'cold';
    if (hunger < 30) return 'hungry';
    if (thirst < 30) return 'thirsty';
    return 'normal';
  };

  const getCharacterImage = () => {
    // Si hay un efecto temporal, usar char_thirsty para CUALQUIER acción
    if (characterEffect === 'drinking' || characterEffect === 'eating' || characterEffect === 'healing') {
      return '/images/char_thirsty.png';
    }
    
    // Si no hay efecto temporal, usar el estado actual (NO normal)
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
    // Si hay un efecto temporal, usar animación especial
    if (characterEffect === 'drinking') {
      return {
        animate: { 
          scale: [1, 1.1, 1],
          rotate: [0, 5, -5, 0]
        },
        transition: { 
          duration: 1, 
          repeat: 1,
          ease: "easeInOut"
        }
      };
    }
    if (characterEffect === 'eating') {
      return {
        animate: { 
          scale: [1, 1.05, 1],
          y: [0, -5, 0]
        },
        transition: { 
          duration: 1, 
          repeat: 1,
          ease: "easeInOut"
        }
      };
    }
    if (characterEffect === 'healing') {
      return {
        animate: { 
          scale: [1, 1.2, 1],
          rotate: [0, 10, -10, 0]
        },
        transition: { 
          duration: 1.5, 
          repeat: 1,
          ease: "easeInOut"
        }
      };
    }
    
    // Si no hay efecto temporal, usar animación normal
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
    // Si hay un efecto temporal, usar brillo especial
    if (characterEffect === 'drinking') {
      return 'shadow-lg shadow-blue-400/70 animate-pulse';
    }
    if (characterEffect === 'eating') {
      return 'shadow-lg shadow-orange-400/70 animate-pulse';
    }
    if (characterEffect === 'healing') {
      return 'shadow-lg shadow-green-400/70 animate-pulse';
    }
    
    // Si no hay efecto temporal, usar brillo normal
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
          className="w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 object-contain"
        />
      </motion.div>
    </div>
  );
};
