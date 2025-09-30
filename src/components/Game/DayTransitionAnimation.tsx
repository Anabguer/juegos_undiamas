'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface DayTransitionAnimationProps {
  isVisible: boolean;
  day: number;
  onComplete: () => void;
}

export const DayTransitionAnimation: React.FC<DayTransitionAnimationProps> = ({
  isVisible,
  day,
  onComplete
}) => {
  if (!isVisible) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center"
          onAnimationComplete={() => {
            // Llamar onComplete después de que termine la animación
            setTimeout(onComplete, 2000);
          }}
        >
          {/* Overlay con efecto de flash */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ 
              opacity: [0, 0.8, 0.6, 0.8, 0],
              scale: [0.8, 1.2, 1, 1.1, 0.8]
            }}
            transition={{ 
              duration: 2,
              times: [0, 0.3, 0.6, 0.8, 1],
              ease: "easeInOut"
            }}
            className="absolute inset-0 bg-gradient-to-br from-gray-500 via-gray-600 to-gray-700"
          />
          
          {/* Texto principal */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ 
              scale: [0, 1.5, 1, 1.1, 1],
              rotate: [-180, 0, 10, -10, 0],
              y: [100, -20, 0, -10, 0]
            }}
            transition={{ 
              duration: 2,
              times: [0, 0.4, 0.7, 0.9, 1],
              ease: [0.68, -0.55, 0.265, 1.55]
            }}
            className="relative z-10 text-center"
          >
            {/* Número del día */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ 
                opacity: [0, 1, 1, 0],
                y: [50, 0, 0, -50]
              }}
              transition={{ 
                duration: 2,
                times: [0, 0.2, 0.8, 1],
                delay: 0.3
              }}
              className="text-8xl sm:text-9xl font-black text-white mb-4"
              style={{ 
                fontFamily: 'Comic Sans MS, cursive',
                textShadow: '4px 4px 0px #000, 8px 8px 0px #333'
              }}
            >
              {day}
            </motion.div>
            
            {/* Texto "DÍA" */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ 
                opacity: [0, 1, 1, 0],
                scale: [0.5, 1.2, 1, 0.8]
              }}
              transition={{ 
                duration: 2,
                times: [0, 0.3, 0.7, 1],
                delay: 0.5
              }}
              className="text-4xl sm:text-5xl font-bold text-gray-300"
              style={{ 
                fontFamily: 'Comic Sans MS, cursive',
                textShadow: '3px 3px 0px #000'
              }}
            >
              DÍA
            </motion.div>
            
            {/* Efectos de partículas */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 2, times: [0, 0.5, 1] }}
            >
              {/* Partículas grises */}
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-gray-400 rounded-full"
                  initial={{ 
                    x: '50%', 
                    y: '50%', 
                    scale: 0,
                    opacity: 0
                  }}
                  animate={{ 
                    x: `${50 + (Math.cos(i * 30 * Math.PI / 180) * 200)}%`,
                    y: `${50 + (Math.sin(i * 30 * Math.PI / 180) * 200)}%`,
                    scale: [0, 1, 0],
                    opacity: [0, 1, 0]
                  }}
                  transition={{ 
                    duration: 1.5,
                    delay: 0.5 + (i * 0.1),
                    ease: "easeOut"
                  }}
                />
              ))}
            </motion.div>
          </motion.div>
          
          {/* Efecto de ondas */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.6, 0] }}
            transition={{ duration: 2, times: [0, 0.5, 1] }}
          >
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute inset-0 border-4 border-gray-400 rounded-full"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ 
                  scale: [0, 2, 4],
                  opacity: [0, 0.8, 0]
                }}
                transition={{ 
                  duration: 2,
                  delay: i * 0.3,
                  ease: "easeOut"
                }}
              />
            ))}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
