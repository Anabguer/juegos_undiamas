import { useEffect, useRef } from 'react';
import { useGameStore } from '@/store/gameStore';

// Constantes de balanceo del juego
const BALANCE_CONFIG = {
  // Tiempo del juego
  HOUR_DURATION_MS: 128, // 0.128 segundos reales = 1 minuto del juego (rápido)
  BALANCE_INTERVAL_MS: 10000, // 10 segundos para aplicar efectos
  
  // Drenaje de stats básicos
  HUNGER_DRAIN_PER_INTERVAL: 1.0, // 1% hambre cada 5 segundos (más realista)
  THIRST_DRAIN_PER_INTERVAL: 1.5, // 1.5% sed cada 5 segundos (más realista)
  
  // Drenaje de vida por condiciones
  HEALTH_DRAIN_HUNGER_THIRST_ZERO: 5, // -5% vida si hambre o sed = 0
  HEALTH_DRAIN_COLD: 3, // -3% vida si tiene frío
  HEALTH_DRAIN_INFECTED: 6, // -6% vida si está infectado
  
  // Multiplicadores por dificultad
  DIFFICULTY_BASE: 1.15, // +15% dificultad por día
  INFECTION_MULTIPLIER: 3 // 3x más rápido hambre/sed si está infectado
};

export const useGameTimer = () => {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const balanceIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const zombieMoveIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const { 
    isPlaying, 
    isPaused, 
    advanceTime, 
    updateHunger, 
    updateThirst, 
    updateHealth, 
    hunger, 
    thirst, 
    health, 
    isCold, 
    isInfected,
    day 
  } = useGameStore();

  useEffect(() => {
    // Limpiar timers existentes antes de crear nuevos
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (balanceIntervalRef.current) {
      clearInterval(balanceIntervalRef.current);
      balanceIntervalRef.current = null;
    }
    if (zombieMoveIntervalRef.current) {
      clearInterval(zombieMoveIntervalRef.current);
      zombieMoveIntervalRef.current = null;
    }

    if (isPlaying && !isPaused) {
      // Timer principal del juego - avanza tiempo cada segundo
      intervalRef.current = setInterval(() => {
        // Verificar estado actual dentro del callback
        const currentState = useGameStore.getState();
        // Si el juego está pausado, no avanzar tiempo
        if (!currentState.isPlaying || currentState.isPaused) {
          return;
        }
        
        advanceTime();
        // Los zombies se mueven dentro de advanceTime, no aquí
      }, BALANCE_CONFIG.HOUR_DURATION_MS); // 0.128 segundos reales = 1 minuto del juego
      
      // Timer de movimiento de zombies - cada 15 segundos (más lento)
      zombieMoveIntervalRef.current = setInterval(() => {
        // Verificar estado actual dentro del callback
        const currentState = useGameStore.getState();
        // Si el juego está pausado, no mover zombies
        if (!currentState.isPlaying || currentState.isPaused) {
          return;
        }
        
        // Mover zombies cada 15 segundos
        useGameStore.getState().moveZombies();
      }, 15000); // 15 segundos reales = movimiento de zombie (más lento)
      
      // Timer de balanceo - aplica efectos cada 10 segundos
      balanceIntervalRef.current = setInterval(() => {
        // Verificar estado actual dentro del callback
        const currentState = useGameStore.getState();
        // Si el juego está pausado, no aplicar efectos
        if (!currentState.isPlaying || currentState.isPaused) {
          return;
        }
        
        // Calcular multiplicador de dificultad
        const difficultyMultiplier = Math.pow(BALANCE_CONFIG.DIFFICULTY_BASE, day - 1);
        
        // Drenaje base de hambre y sed
        let hungerDrain = BALANCE_CONFIG.HUNGER_DRAIN_PER_INTERVAL * difficultyMultiplier;
        let thirstDrain = BALANCE_CONFIG.THIRST_DRAIN_PER_INTERVAL * difficultyMultiplier;
        
        // Si está infectado, hambre y sed bajan 3x más rápido
        if (isInfected) {
          hungerDrain *= BALANCE_CONFIG.INFECTION_MULTIPLIER;
          thirstDrain *= BALANCE_CONFIG.INFECTION_MULTIPLIER;
        }
        
        // Aplicar drenaje de hambre y sed
        updateHunger(-hungerDrain);
        updateThirst(-thirstDrain);
        
        // Obtener valores actualizados después del drenaje
        const updatedState = useGameStore.getState();
        const currentHunger = updatedState.hunger;
        const currentThirst = updatedState.thirst;
        
        // Drenaje de vida por condiciones específicas (prioridad):
        // 1. Si hambre o sed = 0: -5% vida cada 10 segundos
        if (currentHunger <= 0 || currentThirst <= 0) {
          console.log(`HEALTH DRAIN - Hambre/Sed = 0: Hambre=${currentHunger}, Sed=${currentThirst}, Vida=${updatedState.health}`);
          updateHealth(-BALANCE_CONFIG.HEALTH_DRAIN_HUNGER_THIRST_ZERO);
        }
        // 2. Si está con frío: -3% vida cada 10 segundos  
        else if (isCold) {
          console.log(`HEALTH DRAIN - Frío: Vida=${updatedState.health}`);
          updateHealth(-BALANCE_CONFIG.HEALTH_DRAIN_COLD);
        }
        // 3. Si está infectado: -6% vida cada 10 segundos
        else if (isInfected) {
          console.log(`HEALTH DRAIN - Infectado: Vida=${updatedState.health}`);
          updateHealth(-BALANCE_CONFIG.HEALTH_DRAIN_INFECTED);
        }
        // 4. Recuperación natural: si tienes hambre y sed altos, recuperas vida lentamente
        else if (currentHunger >= 70 && currentThirst >= 70 && updatedState.health < 100) {
          console.log(`HEALTH RECOVERY - Bien alimentado: Hambre=${currentHunger}, Sed=${currentThirst}, Vida=${updatedState.health}`);
          updateHealth(0.5); // +0.5% vida cada 10 segundos si estás bien alimentado
        }
        else {
          console.log(`HEALTH STATUS - Sin cambios: Hambre=${currentHunger}, Sed=${currentThirst}, Vida=${updatedState.health}, Frío=${isCold}, Infectado=${isInfected}`);
        }
      }, BALANCE_CONFIG.BALANCE_INTERVAL_MS);
    } else {
      // Limpiar timers cuando el juego está pausado
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      if (balanceIntervalRef.current) {
        clearInterval(balanceIntervalRef.current);
        balanceIntervalRef.current = null;
      }
      if (zombieMoveIntervalRef.current) {
        clearInterval(zombieMoveIntervalRef.current);
        zombieMoveIntervalRef.current = null;
      }
    }

    return () => {
      // Cleanup al desmontar el componente
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (balanceIntervalRef.current) {
        clearInterval(balanceIntervalRef.current);
      }
      if (zombieMoveIntervalRef.current) {
        clearInterval(zombieMoveIntervalRef.current);
      }
    };
  }, [isPlaying, isPaused]);
};
