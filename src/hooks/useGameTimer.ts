import { useEffect, useRef } from 'react';
import { useGameStore } from '@/store/gameStore';

export const useGameTimer = () => {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const balanceIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const { isPlaying, isPaused, advanceTime, updateHunger, updateThirst, updateHealth, hunger, thirst, health, isCold, isInfected } = useGameStore();

  useEffect(() => {
    if (isPlaying && !isPaused) {
      // Cada 5 segundos reales = 1 hora del juego
      intervalRef.current = setInterval(() => {
        advanceTime();
      }, 5000); // 5 segundos
      
      // Timer para fórmulas de balanceo
      balanceIntervalRef.current = setInterval(() => {
        // Hambre y sed bajan 1% cada 10 segundos
        updateHunger(-1);
        updateThirst(-1);
        
        // Solo perder vida por condiciones específicas:
        // 1. Si hambre o sed = 0: -3% vida cada 10 segundos
        if (hunger <= 0 || thirst <= 0) {
          updateHealth(-3);
        }
        // 2. Si está con frío: -2% vida cada 10 segundos  
        else if (isCold) {
          updateHealth(-2);
        }
        // 3. Si está infectado: -4% vida cada 10 segundos
        else if (isInfected) {
          updateHealth(-4);
        }
      }, 10000); // 10 segundos
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      if (balanceIntervalRef.current) {
        clearInterval(balanceIntervalRef.current);
        balanceIntervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (balanceIntervalRef.current) {
        clearInterval(balanceIntervalRef.current);
      }
    };
  }, [isPlaying, isPaused, advanceTime, updateHunger, updateThirst, updateHealth]);
};
