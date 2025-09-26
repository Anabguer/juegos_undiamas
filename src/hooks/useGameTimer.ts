import { useEffect, useRef } from 'react';
import { useGameStore } from '@/store/gameStore';

export const useGameTimer = () => {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const balanceIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const { isPlaying, isPaused, advanceTime, updateHunger, updateThirst, updateHealth, hunger, thirst, health } = useGameStore();

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
        
        // Vida baja 2% cada 5 segundos si hambre o sed = 0
        if (hunger <= 0 || thirst <= 0) {
          updateHealth(-2);
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
  }, [isPlaying, isPaused, advanceTime, updateHunger, updateThirst, updateHealth, hunger, thirst, health]);

  // Cleanup al desmontar
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);
};
