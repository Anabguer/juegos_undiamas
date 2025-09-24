import { useEffect, useRef } from 'react';
import { useGameStore } from '@/store/gameStore';

export const useGameTimer = () => {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const { isPlaying, isPaused, advanceTime } = useGameStore();

  useEffect(() => {
    if (isPlaying && !isPaused) {
      // Cada 5 segundos reales = 1 hora del juego
      intervalRef.current = setInterval(() => {
        advanceTime();
      }, 5000); // 5 segundos
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, isPaused, advanceTime]);

  // Cleanup al desmontar
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);
};
