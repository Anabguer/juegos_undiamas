// Configuración de ejemplo para el juego
export const gameConfig = {
  // Configuración del entorno
  appName: "Un Día Más",
  appVersion: "1.0.0",
  appDescription: "Juego de supervivencia apocalíptica",
  
  // Configuración del juego
  timePerHour: 5000, // 5 segundos reales = 1 hora del juego
  cardsPerTurn: 3,
  cardDisplayTime: 5000, // 5 segundos para elegir
  zombieSpawnRate: 0.2, // 20% de probabilidad por turno
  difficultyMultiplier: 1.1, // +10% dificultad por día
  
  // Configuración de efectos visuales
  screenEffects: {
    hunger: {
      filter: 'hue-rotate(0deg) saturate(150%) brightness(110%)',
      duration: 2000
    },
    thirst: {
      filter: 'blur(1px)',
      duration: 2000
    },
    infected: {
      filter: 'hue-rotate(90deg) saturate(150%)',
      duration: 2000
    },
    cold: {
      filter: 'brightness(75%)',
      duration: 2000
    }
  },
  
  // Configuración de colores
  colors: {
    apocalypse: {
      dark: '#0b132b',
      medium: '#13315c',
      light: '#1e3a8a',
      accent: '#ffd447',
      secondary: '#7cf5ff',
      danger: '#ff6bcb'
    },
    status: {
      hunger: '#ff4444',
      thirst: '#4444ff',
      health: '#44ff44',
      infected: '#44ff44'
    }
  }
};
