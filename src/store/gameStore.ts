
'use client';
import { create } from 'zustand';
import { GameState, Card, Zombie, InventoryItem, GameStats, CardType, ItemType, ZombieType, GameEndingType, CardEffect } from '@/types/game';
import { BEAR_MESSAGES } from '@/config/characters';
// Tutorial eliminado

// Función para cargar preferencias guardadas (TUTORIAL ELIMINADO)
const loadSavedPreferences = () => {
  return {
    skipTutorial: false,
    tutorialCompleted: false
  };
};

// Función para cargar partida guardada
const loadSavedGame = () => {
  if (typeof window !== 'undefined') {
    try {
      const savedGame = localStorage.getItem('unDiaMas_savedGame');
      if (savedGame) {
        const gameData = JSON.parse(savedGame);
        // Convertir Set de vuelta desde array
        if (gameData.shownMessages) {
          gameData.shownMessages = new Set(gameData.shownMessages);
        }
        return gameData;
      }
    } catch (error) {
      console.error('Error loading saved game:', error);
    }
  }
  return null;
};

// Función para guardar partida
const saveGameToStorage = (gameState: any) => {
  if (typeof window !== 'undefined') {
    try {
      // Crear copia del estado sin funciones y convertir Set a Array
      const stateToSave = { ...gameState };
      if (stateToSave.shownMessages) {
        stateToSave.shownMessages = Array.from(stateToSave.shownMessages);
      }
      
      // Remover propiedades temporales que no deben guardarse
      delete stateToSave.flyingItem;
      delete stateToSave.flyingItemType;
      delete stateToSave.characterEffect;
      delete stateToSave.currentCards;
      delete stateToSave.zombies;
      delete stateToSave.showItemFoundModal;
      delete stateToSave.foundItemName;
      delete stateToSave.foundItemImage;
      delete stateToSave.showInfoModal;
      delete stateToSave.infoTitle;
      delete stateToSave.infoMessage;
      delete stateToSave.showBlockedHouseModal;
      delete stateToSave.blockedHouseCardId;
      delete stateToSave.blockedHouseClicks;
      delete stateToSave.currentMessage;
      delete stateToSave.showMessage;
      delete stateToSave.showTutorial;
      delete stateToSave.tutorialMessage;
      delete stateToSave.tutorialPhase;
      delete stateToSave.gameEnding; // No guardar el final del juego
      
      localStorage.setItem('unDiaMas_savedGame', JSON.stringify(stateToSave));
      localStorage.setItem('unDiaMas_lastSave', Date.now().toString());
    } catch (error) {
      console.error('Error saving game:', error);
    }
  }
};

// Estado inicial del juego - cargar partida guardada si existe
const savedGame = loadSavedGame();
const initialState: GameState = savedGame ? {
  ...savedGame,
  // Restaurar estado de juego activo
  isPlaying: false,
  isPaused: false,
  gameOver: false,
  showItemSelection: false,
  showManual: false,
  showInventorySummary: false,
  showHelp: false,
  showItemFoundModal: false,
  foundItemName: '',
  foundItemImage: '',
  showSettings: false,
  showRanking: false,
  showRegister: false,
  showPelusoMessage: false,
  volume: 0.5,
  soundEnabled: true,
  playBatHit: null,
  playEat: null,
  playDrink: null,
  playPill: null,
  pauseItemSearch: null,
  playHit: null,
  playZombieBat: null,
  playRat: null,
  playMinigameStart: null,
  playZombieMinigame: null,
  playHouseCard: null,
  playShiver: null,
  playBackground: null,
  showInfoModal: false,
  infoTitle: '',
  infoMessage: '',
  showTutorial: false,
  tutorialMessage: '',
  tutorialPhase: null,
  showBlockedHouseModal: false,
  blockedHouseCardId: null,
  blockedHouseClicks: 0,
  blockedHouseTimeout: null,
  showRatsMinigame: false,
  ratsMinigameCardId: null,
  showZombieBatsMinigame: false,
  zombieBatsMinigameCardId: null,
  currentCards: [],
  zombies: [],
  currentMessage: '',
  showMessage: false,
  flyingItem: null,
  flyingItemType: null,
  characterEffect: null,
  skipTutorial: false
} : {
  hunger: 100,
  thirst: 100,
  health: 100,
  isInfected: false,
  isCold: false,
  isShaking: false,
  scarfUsedTonight: false, // Para evitar que vuelva el frío si ya usaste bufanda
  coldAppliedTonight: false, // Para aplicar frío solo una vez por noche
  hasShownRegistrationPrompt: false, // Para mostrar el prompt de registro solo una vez
  flyingItem: null,
  flyingItemType: null,
  zombieDeathEffect: null, // Efecto visual cuando se mata un zombie
  characterEffect: null,
  
  day: 1,
  hour: 8,
  minute: 0,
  isNight: false,
  
  isPlaying: false,
  isPaused: false,
  gameOver: false,
  showItemSelection: false,
  showManual: false,
  showInventorySummary: false,
  showHelp: false,
  showItemFoundModal: false,
  foundItemName: '',
  foundItemImage: '',
  showSettings: false,
  showRanking: false,
  showRegister: false,
  showPelusoMessage: false,
  volume: 0.5,
  soundEnabled: true,
  playBatHit: null,
  playEat: null,
  playDrink: null,
  playPill: null,
  pauseItemSearch: null,
  playHit: null,
  playZombieBat: null,
  playRat: null,
  playMinigameStart: null,
  playZombieMinigame: null,
  playHouseCard: null,
  playShiver: null,
  playBackground: null,
  showInfoModal: false,
  infoTitle: '',
  infoMessage: '',
  showTutorial: false,
  tutorialMessage: '',
  skipTutorial: false,
  tutorialPhase: null,
  
  // Modal de casa bloqueada
  showBlockedHouseModal: false,
  blockedHouseCardId: null,
  blockedHouseClicks: 0,
  blockedHouseTimeout: null, // Timer para cerrar automáticamente
  
  // Minijuegos
  showRatsMinigame: false,
  ratsMinigameCardId: null,
  showZombieBatsMinigame: false,
  zombieBatsMinigameCardId: null,
  
  inventory: [],
  zombies: [],
  currentCards: [],
  lastZombieSpawnHour: 0, // Para controlar cooldown entre spawns
  zombiesSpawnedTonight: 0, // Contador de zombies generados en la noche actual
  currentNightDay: 1, // Día de la noche actual
  
  currentMessage: '',
  showMessage: false,
  shownMessages: new Set<string>(), // Para evitar mensajes repetidos
  
  // Animación de transición de día
  showDayTransition: false,
  transitionDay: 1,
  
  stats: {
    daysSurvived: 0,
    zombiesKilled: 0,
    itemsUsed: 0,
    bestDay: 0,
    totalPlayTime: 0
  }
};

// Configuración del juego
  const gameConfig = {
    timePerHour: 1, // 1 segundo real = 1 hora del juego (súper rápido)
    cardsPerTurn: 3,
    cardDisplayTime: 5, // 5 segundos para elegir
    zombieSpawnRate: 0.25, // 25% de probabilidad por hora (más emocionante)
    maxZombiesAtOnce: 2, // Máximo 2 zombies a la vez
    zombieSpawnCooldown: 2, // 2 horas de cooldown entre spawns
    difficultyMultiplier: 1.15 // +15% dificultad por día
  };

// Función para calcular la dificultad actual
const getCurrentDifficulty = (day: number) => {
  return Math.pow(gameConfig.difficultyMultiplier, day - 1);
};

// Datos de los finales del juego
const gameEndings = {
  [GameEndingType.HUNGER]: {
    type: GameEndingType.HUNGER,
    title: "¡Muerto de Hambre!",
    message: "Te quedaste sin comida y tu estómago se comió a sí mismo. Al menos no pasaste hambre al final.",
    image: "/images/final_hambre.png",
    isGood: false
  },
  [GameEndingType.THIRST]: {
    type: GameEndingType.THIRST,
    title: "¡Deshidratado!",
    message: "Sin agua, te convertiste en un humano pasa. Ahora eres parte del desierto apocalíptico.",
    image: "/images/final_sed.png",
    isGood: false
  },
  [GameEndingType.COLD]: {
    type: GameEndingType.COLD,
    title: "¡Congelado!",
    message: "El frío te convirtió en un cubito de hielo humano. Al menos ahora eres refrescante.",
    image: "/images/final_frio.png",
    isGood: false
  },
  [GameEndingType.ZOMBIE]: {
    type: GameEndingType.ZOMBIE,
    title: "¡Zombificado!",
    message: "Te uniste al club de los zombis. ¡Bienvenido! Ahora puedes caminar lento y gruñir todo el día.",
    image: "/images/final_zombi.png",
    isGood: false
  },
  [GameEndingType.ABSURD]: {
    type: GameEndingType.ABSURD,
    title: "¡Final Absurdo!",
    message: "Moriste de una forma tan ridícula que ni siquiera los zombis se lo creen. ¡Felicidades por tu creatividad!",
    image: "/images/final_absurdo.png",
    isGood: false
  }
};

// Datos de las cartas
const cardData = {
  [CardType.FOOD]: [
    { name: 'Manzana', emoji: '🍏', image: '/images/apple.png', effect: { type: 'hunger', value: 30 } }
  ],
  [CardType.DRINK]: [
    { name: 'Agua', emoji: '💧', image: '/images/water.png', effect: { type: 'thirst', value: 40 } }
  ],
  [CardType.MEDICINE]: [
    { name: 'Pastilla', emoji: '💊', image: '/images/pill.png', effect: { type: 'infection', value: 100 } }
  ],
  [CardType.CLOTHING]: [
    { name: 'Bufanda', emoji: '🧣', image: '/images/scarf.png', effect: { type: 'cold', value: 100 } }
  ],
  [CardType.WEAPON]: [
    { name: 'Bate', emoji: '🏏', image: '/images/bat.png', effect: { type: 'zombie', value: 1 } }
  ],
  [CardType.JUNK]: [
    { name: 'Pato de goma', emoji: '🦆', image: '/images/duck.png', effect: { type: 'junk', value: 0 } },
    { name: 'CD rayado', emoji: '💿', image: '/images/cd.png', effect: { type: 'junk', value: 0 } },
    { name: 'Osito de peluche', emoji: '🧸', image: '/images/plush.png', effect: { type: 'junk', value: 0 } },
    { name: 'Pelota desinflada', emoji: '⚽', image: '/images/ball.png', effect: { type: 'junk', value: 0 } },
    { name: 'Calcetín', emoji: '🧦', image: '/images/calcetin.png', effect: { type: 'junk', value: 0 } },
    { name: 'Teléfono', emoji: '📱', image: '/images/telefono.png', effect: { type: 'junk', value: 0 } },
    { name: 'Zapato', emoji: '👞', image: '/images/zapato.png', effect: { type: 'junk', value: 0 } },
    { name: 'Libro', emoji: '📖', image: '/images/libro.png', effect: { type: 'junk', value: 0 } },
    { name: 'Llaves', emoji: '🗝️', image: '/images/llaves.png', effect: { type: 'junk', value: 0 } },
    { name: 'Sombrero', emoji: '🎩', image: '/images/hat.png', effect: { type: 'junk', value: 0 } }
  ],
  [CardType.HOUSE]: [
    { name: 'Casa 1', emoji: '🏠', houseImage: '/images/casa1.png', effect: { type: 'house', value: 0 } },
    { name: 'Casa 2', emoji: '🏠', houseImage: '/images/casa2.png', effect: { type: 'house', value: 0 } },
    { name: 'Casa 3', emoji: '🏠', houseImage: '/images/casa3.png', effect: { type: 'house', value: 0 } },
    { name: 'Casa 4', emoji: '🏠', houseImage: '/images/casa4.png', effect: { type: 'house', value: 0 } },
    { name: 'Casa 5', emoji: '🏠', houseImage: '/images/casa5.png', effect: { type: 'house', value: 0 } },
    { name: 'Casa 6', emoji: '🏠', houseImage: '/images/casa6.png', effect: { type: 'house', value: 0 } }
  ],
  [CardType.BLOCKED_HOUSE]: [
    { name: 'Puerta Bloqueada', emoji: '🚪', houseImage: '/images/puertabloqueada.png', effect: { type: 'blocked_house', value: 0 } }
  ]
};

// Mensajes irónicos
const ironicMessages = {
  junk: [
    "¡Cuac! Muy útil... para nada.",
    "Yo no juego con esas cosas...",
    "¿Quién tiene un lector de esto?",
    "Al menos te ves elegante...",
    "Un amigo peludo... que no te salvará.",
    "¿Vamos a jugar al fútbol en el apocalipsis?"
  ],
  milestones: [
    "¡Felicidades! Has sobrevivido un día completo. ¿Quieres una medalla?",
    "Dos días seguidos... ¿Eres inmortal o qué?",
    "Tres días... Los zombis están empezando a respetarte.",
    "Cinco días. ¿Eres el nuevo líder del apocalipsis?",
    "Una semana completa. Los zombis están considerando rendirse.",
    "Diez días... ¿Eres humano o qué?",
    "Quince días. Los zombis ya no te ven como comida, sino como amenaza.",
    "Un mes completo. ¿Eres el nuevo rey del apocalipsis?"
  ],
  actions: [
    "Un zombi menos. La población mundial te lo agradece.",
    "Cinco zombis eliminados. ¿Eres el nuevo héroe del apocalipsis?",
    "Diez zombis. Los demás zombis están empezando a tener miedo.",
    "Veinticinco zombis. ¿Eres un exterminador profesional?",
    "Comida + Bebida = Combo saludable. ¡Eres un genio!",
    "Bate usado en el momento perfecto. ¿Eres un estratega?",
    "Sin comida... ¿Planeas hacer dieta en el apocalipsis?",
    "Sin agua... ¿Eres un cactus?",
    "El zombi te atrapó. ¿No viste que se acercaba?",
    "Noche sin bufanda... ¿Eres un pingüino o qué?"
  ]
};

// Store principal del juego
export const useGameStore = create<GameState & {
  // Modal de casa bloqueada
  showBlockedHouseModal: boolean;
  blockedHouseCardId: string | null;
  blockedHouseClicks: number;
  // Acciones
  startGame: () => void;
  setShowItemSelection: (show: boolean) => void;
  setShowManual: (show: boolean) => void;
  setShowInventorySummary: (show: boolean) => void;
  setShowHelp: (show: boolean) => void;
  setShowItemFoundModal: (show: boolean) => void;
  setShowSettings: (show: boolean) => void;
  setShowRanking: (show: boolean) => void;
  setShowRegister: (show: boolean) => void;
  setVolume: (volume: number) => void;
  setSoundEnabled: (enabled: boolean) => void;
  playBatHit: (() => void) | null;
  playEat: (() => void) | null;
  playDrink: (() => void) | null;
  playPill: (() => void) | null;
  pauseItemSearch: (() => void) | null;
  setPauseItemSearch: (fn: (() => void) | null) => void;
  setFoundItem: (name: string, image: string) => void;
  setShowInfoModal: (show: boolean) => void;
  setInfoMessage: (title: string, message: string) => void;
  setShowTutorial: (show: boolean) => void;
  setTutorialMessage: (message: string) => void;
  setSkipTutorial: (skip: boolean) => void;
  setTutorialCompleted: () => void;
  pauseGame: () => void;
  resumeGame: () => void;
  resumeGameOnly: () => void;
  endGame: () => void;
  
  // Tiempo
  advanceTime: () => void;
  
  // Cartas
  generateCards: () => void;
  generateBlockedHouseForTutorial: () => void;
  selectCard: (cardId: string) => void;
  
  // Zombis
  spawnZombie: () => void;
  moveZombies: () => void;
  killZombie: (zombieId: string) => void;
  
  // Inventario
  addToInventory: (item: InventoryItem) => void;
  useItem: (itemId: string) => void;
  
  // Estado del personaje
  updateHunger: (value: number) => void;
  updateThirst: (value: number) => void;
  updateHealth: (value: number) => void;
  setInfected: (infected: boolean) => void;
  setCold: (cold: boolean) => void;
  
  // Mensajes
  displayMessage: (message: string) => void;
  hideMessage: () => void;
  hidePelusoMessage: () => void;
  goToRegister: () => void;
  showDayTransitionAnimation: (day: number) => void;
  hideDayTransitionAnimation: () => void;
  showRegistrationPrompt: () => void;
  
  // Efectos visuales
  triggerShake: () => void;
  triggerFlyingItem: (itemName: string, type?: 'from_inventory' | 'from_bear') => void;
  triggerCharacterEffect: (effect: 'drinking' | 'eating' | 'healing') => void;
  showRandomBearQuote: () => void;
  showBearGuide: (message: string) => void;
  startRandomBearTimer: () => void;
  
  // Modal de casa bloqueada
  openBlockedHouseModal: (cardId: string) => void;
  closeBlockedHouseModal: () => void;
  clickBlockedHouse: (cardId: string) => void;
  
  // Minijuego de ratas
  openRatsMinigame: (cardId: string) => void;
  completeRatsMinigame: () => void;
  timeoutRatsMinigame: () => void;
  
  // Minijuego de zombie con bates
  openZombieBatsMinigame: (cardId: string) => void;
  completeZombieBatsMinigame: () => void;
  timeoutZombieBatsMinigame: () => void;
  
  // Utilidades
  resetGame: () => void;
  saveGame: () => void;
  loadGame: () => boolean;
  hasSavedGame: () => boolean;
  deleteSavedGame: () => void;
}>((set, get, api) => ({
  ...initialState,
  
  // Acciones del juego
  startGame: () => {
    console.log('START GAME - Iniciando juego...');
    // Reiniciar completamente el estado del juego
    set({ 
      isPlaying: true, 
      isPaused: false,
      gameOver: false, 
      showItemSelection: false,
      showInventorySummary: false,
      showManual: false,
      showHelp: false,
      showItemFoundModal: false,
      foundItemName: '',
      foundItemImage: '',
      showInfoModal: false,
      infoTitle: '',
      infoMessage: '',
      showTutorial: false,
      tutorialMessage: '',
      tutorialPhase: null,
      showBlockedHouseModal: false,
      blockedHouseCardId: null,
      blockedHouseClicks: 0,
      currentCards: [],
      zombies: [],
      currentMessage: '',
      showMessage: false,
      shownMessages: new Set<string>(),
      flyingItem: null,
      flyingItemType: null,
      characterEffect: null,
      isShaking: false,
      
      // Estado del personaje
      hunger: 80,
      thirst: 80,
      health: 100,
      isInfected: false,
      isCold: false,
      
      // Tiempo
      day: 1,
      hour: 8,
      minute: 0,
      isNight: false,
      lastZombieSpawnHour: 0,
      scarfUsedTonight: false, // Resetear bufanda al empezar
      coldAppliedTonight: false, // Resetear frío al empezar
  hasShownRegistrationPrompt: false, // Resetear prompt de registro al empezar
      
      // Inventario limpio - NO limpiar aquí, se maneja en ItemSelectionGrid
      // inventory: [],
      
      // Estadísticas
      stats: {
        daysSurvived: 0,
        zombiesKilled: 0,
        itemsUsed: 0,
        bestDay: 0,
        totalPlayTime: 0
      }
    });
    
    console.log('START GAME - Estado actualizado, isPlaying debería ser true');
    
    // Generar cartas inmediatamente
    setTimeout(() => {
      get().generateCards();
    }, 100);
    
    // Iniciar timer de frases random de Peluso
    get().startRandomBearTimer();
  },

  setShowItemSelection: (show: boolean) => {
    set({ showItemSelection: show });
  },
  
  setShowManual: (show: boolean) => {
    set({ showManual: show });
  },
  
  setShowInventorySummary: (show: boolean) => {
    set({ showInventorySummary: show });
  },
  
  setShowHelp: (show: boolean) => {
    set({ showHelp: show });
  },
  
  setShowItemFoundModal: (show: boolean) => {
    const state = get();
    
    // Si el juego terminó, no mostrar modales
    if (state.gameOver) {
      console.log(`ITEM MODAL - Juego terminado, ignorando apertura de modal`);
      return;
    }
    
    // Si ya hay un modal abierto y se intenta abrir otro, ignorar
    if (state.showItemFoundModal && show) {
      console.log(`ITEM MODAL - Ya hay un modal abierto, ignorando apertura duplicada`);
      return;
    }
    
    set({ showItemFoundModal: show });
  },
  
  setShowSettings: (show: boolean) => {
    set({ showSettings: show });
  },
  
  setShowRanking: (show: boolean) => {
    set({ showRanking: show });
  },
  
  setShowRegister: (show: boolean) => {
    set({ showRegister: show });
  },
  
  setVolume: (volume: number) => {
    set({ volume: Math.max(0, Math.min(1, volume)) });
  },
  
  setSoundEnabled: (enabled: boolean) => {
    set({ soundEnabled: enabled });
  },
  
  setPauseItemSearch: (fn: (() => void) | null) => {
    set({ pauseItemSearch: fn });
  },
  
  playBatHit: null,
  playEat: null,
  playDrink: null,
  playPill: null,
  pauseItemSearch: null,
  playHit: null,
  playZombieBat: null,
  playRat: null,
  playMinigameStart: null,
  playZombieMinigame: null,
  playHouseCard: null,
  playShiver: null,
  playBackground: null,
  
  setFoundItem: (name: string, image: string) => {
    set({ foundItemName: name, foundItemImage: image });
  },
  
  setShowInfoModal: (show: boolean) => {
    set({ showInfoModal: show });
  },
  
  setInfoMessage: (title: string, message: string) => {
    set({ infoTitle: title, infoMessage: message });
  },
  
  setShowTutorial: (show: boolean) => {
    set({ showTutorial: show });
  },
  
  setTutorialMessage: (message: string) => {
    set({ tutorialMessage: message });
  },
  
  setSkipTutorial: (skip: boolean) => {
    set({ skipTutorial: skip });
    // Guardar la preferencia en localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('skipTutorial', skip.toString());
    }
  },
  
  // Marcar tutorial como completado
  setTutorialCompleted: () => {
    // Tutorial eliminado - función vacía
  },
  
  pauseGame: () => set({ isPaused: true }),
  
  resumeGame: () => set({ isPaused: false, showTutorial: false }),
  
  // Reanudar solo el juego sin cerrar el tutorial
  resumeGameOnly: () => set({ isPaused: false }),
  
  endGame: () => {
    const state = get();
    
    // Si el juego ya terminó, no hacer nada
    if (state.gameOver) {
      console.log(`GAME END - Juego ya terminado, ignorando llamada a endGame`);
      return;
    }
    
    console.log(`🎮 GAME END - ¡JUEGO TERMINADO! Estado actual:`, {
      health: state.health,
      hunger: state.hunger,
      thirst: state.thirst,
      isCold: state.isCold,
      isInfected: state.isInfected,
      day: state.day,
      isPlaying: state.isPlaying,
      gameOver: state.gameOver
    });
    
    // Determinar el tipo de final basado en las condiciones de muerte
    let endingType: GameEndingType;
    
    // Prioridad: si la salud llegó a 0, determinar por qué
    if (state.health <= 0) {
      if (state.hunger <= 0) {
        endingType = GameEndingType.HUNGER;
      } else if (state.thirst <= 0) {
        endingType = GameEndingType.THIRST;
      } else if (state.isCold) {
        endingType = GameEndingType.COLD;
      } else if (state.isInfected) {
        endingType = GameEndingType.ZOMBIE;
      } else {
        endingType = GameEndingType.ABSURD;
      }
    } else {
      // Si no hay salud 0, usar condiciones directas
      if (state.hunger <= 0) {
        endingType = GameEndingType.HUNGER;
      } else if (state.thirst <= 0) {
        endingType = GameEndingType.THIRST;
      } else if (state.isCold) {
        endingType = GameEndingType.COLD;
      } else if (state.isInfected) {
        endingType = GameEndingType.ZOMBIE;
      } else {
        endingType = GameEndingType.ABSURD;
      }
    }
    
    const ending = gameEndings[endingType];
    
    console.log(`GAME END - Tipo de final: ${endingType}, Ending:`, ending);
    
    set({ 
      isPlaying: false, 
      gameOver: true,
      gameEnding: ending,
      stats: {
        ...state.stats,
        bestDay: Math.max(state.stats.bestDay, state.day)
      }
    });
    
    console.log(`GAME END - Estado final establecido:`, {
      gameOver: true,
      gameEnding: ending
    });
  },
  
  // Avanzar tiempo
  advanceTime: () => {
    const state = get();
    
    // No avanzar tiempo si el tutorial está activo o el juego está pausado
    if (state.showTutorial || state.isPaused) {
      return;
    }
    
    let newHour = state.hour;
    let newMinute = state.minute + 1; // Avanzar 1 minuto cada vez (cada 0.128 segundos reales)
    let newDay = state.day;
    
    if (newMinute >= 60) {
      newMinute = 0;
      newHour += 1;
    }
    
    if (newHour >= 24) {
      newHour = 0;
      newDay += 1;
      
      // NO resetear bufanda al empezar nuevo día - la bufanda se resetea solo al empezar nueva noche
      console.log(`NUEVO DÍA - Día ${newDay} - bufanda mantiene su estado hasta nueva noche`);
      
      // Mostrar animación de transición de día
      get().showDayTransitionAnimation(newDay);
      
      // Mostrar prompt de registro el día 3 si no se ha mostrado antes
      if (newDay === 3 && !state.hasShownRegistrationPrompt) {
        setTimeout(() => {
          get().showRegistrationPrompt();
        }, 3000); // Esperar 3 segundos después de la transición
      } else {
        // Mensaje de nuevo día del osito (se mostrará después de la animación)
        setTimeout(() => {
          const { BEAR_MESSAGES } = require('@/config/characters');
          const randomMessage = BEAR_MESSAGES.NEW_DAY[Math.floor(Math.random() * BEAR_MESSAGES.NEW_DAY.length)];
          set({ currentMessage: randomMessage, showMessage: true });
        }, 2500); // 2.5 segundos después de que empiece la animación
      }
    }
    
    // Verificar si es de noche (21:00-05:00) para aplicar frío
    const isNight = newHour >= 21 || newHour < 5;
    const wasDay = state.hour >= 6 && state.hour < 21;
    
    // Solo mostrar cambios de día o hora importantes
    if (newDay !== state.day || newHour !== state.hour) {
      console.log(`TIME UPDATE - Día: ${state.day} → ${newDay}, Hora: ${state.hour} → ${newHour}`);
    }
    set({ 
      hour: newHour, 
      minute: newMinute, 
      day: newDay,
      isNight: isNight
    });
    
    // Guardar automáticamente cada hora
    if (newMinute === 0) {
      get().saveGame();
    }
    
    // Si es de noche, aplicar frío SOLO UNA VEZ por noche (a menos que ya haya usado bufanda)
    if (isNight && !state.isCold && !state.scarfUsedTonight && !state.coldAppliedTonight) {
      console.log(`FRÍO APLICADO - Es de noche, hora: ${newHour}, día: ${newDay} - PRIMERA VEZ ESTA NOCHE`);
      set({ 
        isCold: true, 
        coldAppliedTonight: true 
      });
      set({ currentMessage: "¡Hace mucho frío! Usa una bufanda para calentarte.", showMessage: true });
    }
    
    // Si es de noche y ya usó bufanda ESTA NOCHE, no aplicar frío de nuevo
    if (isNight && state.scarfUsedTonight) {
      console.log(`FRÍO PREVENIDO - Es de noche pero ya usó bufanda ESTA NOCHE, hora: ${newHour}, día: ${newDay}`);
      // No hacer nada, el frío ya está controlado
    }
    
    // Si es de noche y ya se aplicó frío ESTA NOCHE, no aplicar de nuevo
    if (isNight && state.coldAppliedTonight) {
      console.log(`FRÍO PREVENIDO - Ya se aplicó frío ESTA NOCHE, hora: ${newHour}, día: ${newDay}`);
      // No hacer nada, el frío ya se aplicó esta noche
    }
    
    // Generar cartas cada hora
    if (newMinute === 0) {
      get().generateCards();
    }
    
    // Spawn de zombis con lógica mejorada y progresiva + GARANTIZADOS
    let adjustedSpawnRate = 0;
    let canSpawnByTime = false;
    let minZombiesPerNight = 0;
    
    // Resetear contador de zombies cuando empieza una nueva noche
    if (isNight && state.currentNightDay !== newDay) {
      set({ 
        zombiesSpawnedTonight: 0,
        currentNightDay: newDay,
        scarfUsedTonight: false, // Resetear bufanda para nueva noche
        coldAppliedTonight: false // Resetear frío para nueva noche
      });
      console.log(`NUEVA NOCHE - Día ${newDay}, reseteando contador de zombies, bufanda y frío`);
    }
    
    // También resetear al cambiar de día (cuando pasa de noche a día)
    if (!isNight && state.isNight) {
      set({ 
        scarfUsedTonight: false, // Resetear bufanda al empezar el día
        coldAppliedTonight: false // Resetear frío al empezar el día
      });
      console.log(`NUEVO DÍA - Reseteando bufanda y frío al empezar el día`);
    }
    
    // Sistema de dificultad gradual por días
    if (newDay === 1) {
      // Día 1: Solo zombies de noche, 1 GARANTIZADO + probabilidad 15%
      canSpawnByTime = (newHour >= 21 || newHour < 5);
      adjustedSpawnRate = 0.15;
      minZombiesPerNight = 1;
    } else if (newDay === 2) {
      // Día 2: Solo zombies de noche, 1 GARANTIZADO + probabilidad 25%
      canSpawnByTime = (newHour >= 21 || newHour < 5);
      adjustedSpawnRate = 0.25;
      minZombiesPerNight = 1;
    } else if (newDay === 3) {
      // Día 3: Solo zombies de noche, 1 GARANTIZADO + probabilidad 35%
      canSpawnByTime = (newHour >= 21 || newHour < 5);
      adjustedSpawnRate = 0.35;
      minZombiesPerNight = 1;
    } else if (newDay === 4) {
      // Día 4: Solo zombies de noche, 1 GARANTIZADO + probabilidad 45%
      canSpawnByTime = (newHour >= 21 || newHour < 5);
      adjustedSpawnRate = 0.45;
      minZombiesPerNight = 1;
    } else if (newDay === 5) {
      // Día 5: ¡Los zombies aprenden a salir de día! 2 GARANTIZADOS + probabilidad 30%
      canSpawnByTime = true;
      adjustedSpawnRate = 0.30;
      minZombiesPerNight = 2;
      
      // Mostrar mensaje de Peluso una sola vez a las 8:00 del día 5
      if (newHour === 8 && newMinute === 0) {
        const msg = "Mira, parece que los zombis son más listos que tú... ahora han aprendido que la luz del sol no les molesta. Suerte, ¡la vas a necesitar!";
        get().displayMessage(msg);
      }
    } else {
      // Día 6+: Zombies todo el día, 2 GARANTIZADOS + probabilidad aumenta +5% cada día
      canSpawnByTime = true;
      adjustedSpawnRate = 0.30 + ((newDay - 5) * 0.05);
      adjustedSpawnRate = Math.min(0.80, adjustedSpawnRate);
      minZombiesPerNight = 2;
    }
    
    const hoursSinceLastSpawn = newHour - state.lastZombieSpawnHour;
    const canSpawnByCooldown = hoursSinceLastSpawn >= gameConfig.zombieSpawnCooldown;
    const hasSpaceForZombie = state.zombies.length < gameConfig.maxZombiesAtOnce;
    
    // LÓGICA DE SPAWN: Primero garantizar mínimos, luego probabilidad
    let shouldSpawn = false;
    let isGuaranteedSpawn = false;
    
    // Si aún no hemos generado los zombies mínimos de la noche
    if (isNight && state.zombiesSpawnedTonight < minZombiesPerNight && canSpawnByTime && hasSpaceForZombie) {
      shouldSpawn = true;
      isGuaranteedSpawn = true;
    }
    // Si ya cumplimos los mínimos, aplicar probabilidad normal
    else if (canSpawnByTime && canSpawnByCooldown && hasSpaceForZombie && Math.random() < adjustedSpawnRate) {
      shouldSpawn = true;
      isGuaranteedSpawn = false;
    }
    
    // Debug: mostrar información de spawn
    if (newHour % 2 === 0 && newMinute === 0) {
      console.log(`ZOMBIE DEBUG - Día: ${newDay}, Hora: ${newHour}, Spawned tonight: ${state.zombiesSpawnedTonight}/${minZombiesPerNight}, canSpawnByTime: ${canSpawnByTime}, adjustedSpawnRate: ${adjustedSpawnRate}, zombies: ${state.zombies.length}`);
    }
    
    if (shouldSpawn) {
      console.log(`ZOMBIE SPAWNED! Día: ${newDay}, Hora: ${newHour}, Tipo: ${isGuaranteedSpawn ? 'GARANTIZADO' : 'PROBABILIDAD'}, Total esta noche: ${state.zombiesSpawnedTonight + 1}/${minZombiesPerNight}`);
      get().spawnZombie();
      set({ 
        lastZombieSpawnHour: newHour,
        zombiesSpawnedTonight: state.zombiesSpawnedTonight + 1
      });
    }
    
    // Los zombies se mueven en su propio timer (cada 15 segundos)
    
    // Lógica del frío - solo quitar frío cuando es de día
    if (!isNight && state.isCold) {
      // Es de día - quitar frío
      console.log(`FRÍO QUITADO - Hora: ${newHour}, es de día`);
      set({ isCold: false });
      set({ currentMessage: "¡El sol calienta! Ya no tienes frío.", showMessage: true });
    }
  },
  
  // Generar casa bloqueada para tutorial (ELIMINADO)
  generateBlockedHouseForTutorial: () => {
    // Tutorial eliminado - función vacía
  },
  
  // Generar cartas
  generateCards: () => {
    const state = get();
    
    const cards: Card[] = [];
    
    // Calcular probabilidades según el día (dificultad progresiva)
    // Días 1-2: 35% útiles, 30% comida/agua, 35% basura
    // Días 3-4: 30% útiles, 30% comida/agua, 40% basura
    // Día 5+: Cada día -2% útiles, +2% basura (mínimo 10% útiles, máximo 80% basura)
    let usefulChance = 0.35; // Probabilidad de items útiles
    let foodWaterChance = 0.30; // Probabilidad de comida/agua
    
    if (state.day <= 2) {
      usefulChance = 0.35;
      foodWaterChance = 0.30;
    } else if (state.day <= 4) {
      usefulChance = 0.30;
      foodWaterChance = 0.30;
    } else {
      // Día 5+: Reduce útiles 2% por día
      usefulChance = 0.25 - ((state.day - 5) * 0.02);
      usefulChance = Math.max(0.10, usefulChance); // Mínimo 10%
      foodWaterChance = 0.30;
    }
    
    // TODAS las cartas son casas normales, pero algunas están "marcadas" para ser bloqueadas
    for (let i = 0; i < gameConfig.cardsPerTurn; i++) {
      const random = Math.random();
      let hiddenItemType: CardType;
      let isBlockedHouse = false;
      
      // Determinar si esta casa tendrá minijuego (20% probabilidad total)
      const hasMinigame = Math.random() < 0.2;
      let minigameType: 'blocked' | 'rats' | 'zombiebats' | null = null;
      
      console.log(`GENERATE CARDS - Casa ${i + 1}: hasMinigame = ${hasMinigame}`);
      
      if (hasMinigame) {
        // 33% bloqueada, 33% ratas, 33% zombie con bates
        const random = Math.random();
        if (random < 0.33) {
          minigameType = 'blocked';
        } else if (random < 0.66) {
          minigameType = 'rats';
        } else {
          minigameType = 'zombiebats';
        }
        isBlockedHouse = minigameType === 'blocked';
        console.log(`GENERATE CARDS - Casa ${i + 1}: minigameType = ${minigameType}, isBlockedHouse = ${isBlockedHouse}`);
      } else {
        console.log(`GENERATE CARDS - Casa ${i + 1}: Sin minijuego`);
      }
      
      // Determinar el item oculto con diferentes probabilidades según si tiene minijuego
      if (minigameType === 'blocked' || minigameType === 'rats' || minigameType === 'zombiebats') {
        // Casas con minijuego: SIEMPRE mejor probabilidad de items útiles (60%)
        // Aunque no se use en minijuegos (siempre da útil), necesitamos definirlo para evitar errores
        if (random < 0.6) {
          // 60% útiles (medicina, ropa, arma) - Recompensa por desbloquear
          const usefulTypes = [CardType.MEDICINE, CardType.CLOTHING, CardType.WEAPON];
          hiddenItemType = usefulTypes[Math.floor(Math.random() * usefulTypes.length)];
        } else if (random < 0.85) {
          // 25% comida/agua
          hiddenItemType = Math.random() < 0.5 ? CardType.FOOD : CardType.DRINK;
        } else {
          // 15% basura (mucho menos que casas normales)
          hiddenItemType = CardType.JUNK;
        }
      } else {
        // Casas normales: probabilidades según dificultad del día
        const foodWaterThreshold = foodWaterChance;
        const usefulThreshold = foodWaterChance + usefulChance;
        
        if (random < foodWaterThreshold) {
          // Comida/agua
          hiddenItemType = Math.random() < 0.5 ? CardType.FOOD : CardType.DRINK;
        } else if (random < usefulThreshold) {
          // Útiles (medicina, ropa, arma)
          const usefulTypes = [CardType.MEDICINE, CardType.CLOTHING, CardType.WEAPON];
          hiddenItemType = usefulTypes[Math.floor(Math.random() * usefulTypes.length)];
        } else {
          // Basura (el resto)
          hiddenItemType = CardType.JUNK;
        }
      }
      
      // Siempre usar casa normal, pero marcar si será bloqueada
      const typeData = cardData[CardType.HOUSE];
      const randomCard = typeData[Math.floor(Math.random() * typeData.length)];
      
      const card: Card = {
        id: `house_${Date.now()}_${i}`,
        type: CardType.HOUSE,
        name: randomCard.name,
        emoji: randomCard.emoji,
        image: randomCard.houseImage, // Siempre mostrar casa normal
        houseImage: randomCard.houseImage, // Asegurar que houseImage esté asignado
        description: `Efecto: ${minigameType ? minigameType : randomCard.effect.type}`,
        effect: { type: minigameType === 'blocked' ? 'blocked_house' : randomCard.effect.type, value: 0 } as CardEffect,
        rarity: 'common' as any,
        // Guardar el item oculto y si será bloqueada o tendrá minijuego
        hiddenItemType: hiddenItemType,
        isBlockedHouse: isBlockedHouse,
        isBlocked: isBlockedHouse,
        minigameType: minigameType,
        clicksToUnlock: isBlockedHouse ? 10 : undefined,
        currentClicks: isBlockedHouse ? 0 : undefined
      };
      
      
      // Configurar propiedades de la casa
      card.houseImage = randomCard.houseImage;
      card.isRevealed = false;
      card.isBlocked = false;
      
      // Si será bloqueada, configurar clics
      if (isBlockedHouse) {
        card.clicksToUnlock = 10;
        card.currentClicks = 0;
      }
      
      cards.push(card);
    }
    
    console.log(`GENERATE CARDS - Cartas generadas:`, cards.map(c => ({ 
      id: c.id, 
      minigameType: c.minigameType, 
      isBlockedHouse: c.isBlockedHouse 
    })));
    
    set({ currentCards: cards });
  },
  
  // Abrir modal de casa bloqueada
  openBlockedHouseModal: (cardId: string) => {
    const state = get();
    const card = state.currentCards.find(c => c.id === cardId);
    
    if (!card || !card.isBlockedHouse) {
      return;
    }

    // Reproducir sonido de inicio de minijuego
    if (state.playMinigameStart && state.soundEnabled) {
      state.playMinigameStart();
    }
    
    // Limpiar timeout anterior si existe
    if (state.blockedHouseTimeout) {
      clearTimeout(state.blockedHouseTimeout);
    }
    
    // Abrir puerta bloqueada (sin pausar el juego)
    set({
      showBlockedHouseModal: true,
      blockedHouseCardId: cardId,
      blockedHouseClicks: card.currentClicks || 0
    });
    
    // Timeout para cerrar automáticamente después de 15 segundos
    const timeout = setTimeout(() => {
      const currentState = get();
      if (currentState.showBlockedHouseModal && currentState.blockedHouseCardId === cardId) {
        console.log(`BLOCKED HOUSE TIMEOUT - Cerrando puerta bloqueada sin recompensa`);
        get().closeBlockedHouseModal();
        set({ 
          currentMessage: "La puerta se cerró sola... ¡Demasiado lento!", 
          showMessage: true 
        });
      }
    }, 15000); // 15 segundos
    
    set({ blockedHouseTimeout: timeout });
  },
  
  // Cerrar modal de casa bloqueada
  closeBlockedHouseModal: () => {
    const state = get();
    
    // Limpiar timeout si existe
    if (state.blockedHouseTimeout) {
      clearTimeout(state.blockedHouseTimeout);
    }
    
    set({
      showBlockedHouseModal: false,
      blockedHouseCardId: null,
      blockedHouseClicks: 0,
      blockedHouseTimeout: null
    });
  },

  // Hacer clic en casa bloqueada
  clickBlockedHouse: (cardId: string) => {
    const state = get();
    
    // Reproducir sonido de golpe si está habilitado
    if (state.playHit && state.soundEnabled) {
      state.playHit();
    }
    
    console.log(`CLICK BLOCKED HOUSE - CardId: ${cardId}, Estado actual:`, {
      currentCards: state.currentCards.length,
      blockedHouseClicks: state.blockedHouseClicks,
      showBlockedHouseModal: state.showBlockedHouseModal
    });
    
    // Verificar si el modal está cerrado - si es así, no procesar más clics
    if (!state.showBlockedHouseModal) {
      console.log(`CLICK BLOCKED HOUSE - Modal cerrado, ignorando clic`);
      return;
    }
    
    // Si no hay carta en currentCards, usar el estado del modal
    let card = state.currentCards.find(c => c.id === cardId);
    let newClicks = state.blockedHouseClicks + 1;
    
    if (!card || !card.isBlockedHouse) {
      // Si la carta no está en currentCards, usar el estado del modal
      console.log(`CLICK BLOCKED HOUSE - Carta no encontrada en currentCards, usando estado del modal`);
      console.log(`CLICK BLOCKED HOUSE - Clics del modal: ${state.blockedHouseClicks} → ${newClicks}`);
    } else {
      // Si la carta existe, usar sus clics
      newClicks = (card.currentClicks || 0) + 1;
      console.log(`CLICK BLOCKED HOUSE - Clics de la carta: ${card.currentClicks || 0} → ${newClicks}, clicksToUnlock: ${card.clicksToUnlock}`);
      
      // Actualizar el número de clics en la carta
      set({
        currentCards: state.currentCards.map(c => 
          c.id === cardId 
            ? { ...c, currentClicks: newClicks }
            : c
        )
      });
    }
    
    // Actualizar el estado del modal
    set({
      blockedHouseClicks: newClicks
    });
    
    // Si se alcanzó el número de clics necesarios, desbloquear
    const clicksNeeded = card?.clicksToUnlock || 10;
    console.log(`CLICK BLOCKED HOUSE - Verificando desbloqueo: ${newClicks} >= ${clicksNeeded} = ${newClicks >= clicksNeeded}`);
    
    if (newClicks >= clicksNeeded) {
      console.log(`CLICK BLOCKED HOUSE - ¡PUERTA DESBLOQUEADA! Ejecutando lógica de recompensa...`);
      
      // Limpiar timeout antes de cerrar
      if (state.blockedHouseTimeout) {
        clearTimeout(state.blockedHouseTimeout);
      }
      
      // Cerrar el modal y limpiar la carta PRIMERO
      set({
        currentCards: state.currentCards.filter(c => c.id !== cardId),
        showBlockedHouseModal: false,
        blockedHouseCardId: null,
        blockedHouseClicks: 0,
        blockedHouseTimeout: null
      });
      
      // PUERTA BLOQUEADA: SIEMPRE dar un item útil (sin probabilidades)
      console.log(`CASA BLOQUEADA - Iniciando lógica de item útil garantizado`);
      
      const usefulItemTypes = [CardType.FOOD, CardType.DRINK, CardType.MEDICINE, CardType.CLOTHING, CardType.WEAPON];
      console.log(`CASA BLOQUEADA - Tipos útiles disponibles:`, usefulItemTypes);
      
      const randomUsefulType = usefulItemTypes[Math.floor(Math.random() * usefulItemTypes.length)];
      console.log(`CASA BLOQUEADA - Tipo seleccionado: ${randomUsefulType}`);
      
      const typeData = cardData[randomUsefulType as keyof typeof cardData];
      console.log(`CASA BLOQUEADA - Datos del tipo:`, typeData);
      
      if (typeData && typeData.length > 0) {
        const randomItem = typeData[Math.floor(Math.random() * typeData.length)];
        
        console.log(`CASA BLOQUEADA - Item útil garantizado: ${randomItem.name} (${randomUsefulType})`);
        
        // Añadir el item al inventario
        get().addToInventory({
          id: `${randomUsefulType}_${Date.now()}`,
          type: randomUsefulType as any,
          name: randomItem.name,
          emoji: randomItem.emoji,
          image: (randomItem as any).image || randomItem.emoji,
          quantity: 1,
          description: (randomItem as any).description || `Item útil encontrado en casa bloqueada`
        });
        
        // Mostrar el modal de item encontrado
        set({
          showItemFoundModal: true,
          foundItemName: randomItem.name,
          foundItemImage: (randomItem as any).image || randomItem.emoji
        });
      } else {
        console.error(`CASA BLOQUEADA - ERROR: No se encontraron datos para el tipo ${randomUsefulType}`);
      }

    }
    // No mostrar mensaje de progreso - los mensajes se muestran en el modal
  },

  // Abrir minijuego de ratas
  openRatsMinigame: (cardId: string) => {
    const state = get();
    const card = state.currentCards.find(c => c.id === cardId);
    
    console.warn(`🐀 RATAS MINIGAME - Intentando abrir minijuego para carta ${cardId}`);
    console.warn(`🐀 RATAS MINIGAME - Carta encontrada:`, card ? `Sí (minigameType: ${card.minigameType})` : 'No');
    console.warn(`🐀 RATAS MINIGAME - Current cards:`, state.currentCards.map(c => ({ id: c.id, minigameType: c.minigameType })));
    
    if (!card || card.minigameType !== 'rats') {
      console.error(`🐀 RATAS MINIGAME - No se puede abrir - carta no encontrada o tipo incorrecto`);
      return;
    }

    // Reproducir sonido de inicio de minijuego
    if (state.playMinigameStart && state.soundEnabled) {
      console.warn(`🐀 RATAS MINIGAME - Reproduciendo sonido de inicio`);
      state.playMinigameStart();
    }
    
    // Abrir minijuego de ratas (sin pausar el juego)
    console.warn(`🐀 RATAS MINIGAME - Abriendo minijuego para carta ${cardId}`);
    set({
      showRatsMinigame: true,
      ratsMinigameCardId: cardId
    });
    
    console.warn(`🐀 RATAS MINIGAME - Estado actualizado - showRatsMinigame: true`);
  },

  // Completar minijuego de ratas
  completeRatsMinigame: () => {
    const state = get();
    const cardId = state.ratsMinigameCardId;
    
    if (!cardId) {
      console.log(`RATAS MINIGAME - No hay cardId`);
      return;
    }
    
    console.warn(`🐀 RATAS MINIGAME - ¡COMPLETADO! CardId: ${cardId}, buscando carta...`);
    console.warn(`🐀 RATAS MINIGAME - Cartas actuales:`, state.currentCards.map(c => ({ id: c.id, type: c.type, minigameType: c.minigameType })));
    
    // Buscar la carta - puede no estar si ya se regeneraron las cartas
    const card = state.currentCards.find(c => c.id === cardId);
    
    if (!card) {
      console.log(`RATAS MINIGAME - Carta no encontrada en currentCards (probablemente ya se regeneraron). Dando item útil de todas formas...`);
    } else {
      console.log(`RATAS MINIGAME - Carta encontrada:`, { id: card.id, hiddenItemType: card.hiddenItemType, minigameType: card.minigameType });
    }
    
    console.log(`RATAS MINIGAME - Iniciando lógica de recompensa...`);
    
    // MINIJUEGO DE RATAS: SIEMPRE dar un item útil (como la puerta bloqueada)
    console.log(`RATAS MINIGAME - Iniciando lógica de item útil garantizado`);
    
    const usefulItemTypes = [CardType.FOOD, CardType.DRINK, CardType.MEDICINE, CardType.CLOTHING, CardType.WEAPON];
    console.log(`RATAS MINIGAME - Tipos útiles disponibles:`, usefulItemTypes);
    
    const randomUsefulType = usefulItemTypes[Math.floor(Math.random() * usefulItemTypes.length)];
    console.log(`RATAS MINIGAME - Tipo seleccionado: ${randomUsefulType}`);
    
    const typeData = cardData[randomUsefulType as keyof typeof cardData];
    console.log(`RATAS MINIGAME - Datos del tipo:`, typeData);
    
    if (typeData && typeData.length > 0) {
      const randomItem = typeData[Math.floor(Math.random() * typeData.length)];
      
      console.log(`RATAS MINIGAME - Item útil garantizado: ${randomItem.name} (${randomUsefulType})`);
      
      // Añadir el item al inventario
      get().addToInventory({
        id: `${randomUsefulType}_${Date.now()}`,
        type: randomUsefulType as any,
        name: randomItem.name,
        emoji: randomItem.emoji,
        image: (randomItem as any).image || randomItem.emoji,
        quantity: 1,
        description: (randomItem as any).description || `Item útil encontrado después de eliminar ratas`
      });
      
    // Cerrar el minijuego y eliminar la carta (si existe)
    set({
      currentCards: card ? state.currentCards.filter(c => c.id !== cardId) : state.currentCards,
      showRatsMinigame: false,
      ratsMinigameCardId: null,
    });
      
      // Delay para mostrar el modal después de cerrar el minijuego
      setTimeout(() => {
        // Mostrar el modal de item encontrado
        set({
          showItemFoundModal: true,
          foundItemName: randomItem.name,
          foundItemImage: (randomItem as any).image || randomItem.emoji
        });
        
        // Mensaje de Peluso
        set({
          currentMessage: "¡Esas ratas no volverán! Y mira lo que encontraste...",
          showMessage: true
        });
      }, 300);
    
    } else {
      console.error(`RATAS MINIGAME - ERROR: No se encontraron datos para el tipo ${randomUsefulType}`);
      // Cerrar de todas formas si hay error
      set({
        currentCards: state.currentCards.filter(c => c.id !== cardId),
        showRatsMinigame: false,
        ratsMinigameCardId: null,
      });
    }
  },

  // Timeout del minijuego de ratas (FRACASO)
  timeoutRatsMinigame: () => {
    const state = get();
    const cardId = state.ratsMinigameCardId;
    
    if (!cardId) {
      return;
    }
    
    console.error(`🐀 RATAS MINIGAME - ¡TIMEOUT! No completado a tiempo`);
    
    const card = state.currentCards.find(c => c.id === cardId);
    
    // Cerrar sin dar recompensa
    set({
      currentCards: card ? state.currentCards.filter(c => c.id !== cardId) : state.currentCards,
      showRatsMinigame: false,
      ratsMinigameCardId: null,
    });
    
    // Mensaje de fracaso
    set({
      currentMessage: "Las ratas se comieron todo. Demasiado lento...",
      showMessage: true
    });
  },

  // Abrir minijuego de zombie con bates
  openZombieBatsMinigame: (cardId: string) => {
    const state = get();
    const card = state.currentCards.find(c => c.id === cardId);
    
    console.warn(`🧟 ZOMBIE BATS MINIGAME - Intentando abrir minijuego para carta ${cardId}`);
    console.warn(`🧟 ZOMBIE BATS MINIGAME - Carta encontrada:`, card ? `Sí (minigameType: ${card.minigameType})` : 'No');
    console.warn(`🧟 ZOMBIE BATS MINIGAME - Current cards:`, state.currentCards.map(c => ({ id: c.id, minigameType: c.minigameType })));
    
    if (!card || card.minigameType !== 'zombiebats') {
      console.error(`🧟 ZOMBIE BATS MINIGAME - No se puede abrir - carta no encontrada o tipo incorrecto`);
      return;
    }

    // Reproducir sonido específico de minijuego de zombie
    if (state.playZombieMinigame && state.soundEnabled) {
      console.warn(`🧟 ZOMBIE BATS MINIGAME - Reproduciendo sonido de inicio`);
      state.playZombieMinigame();
    }
    
    console.warn(`🧟 ZOMBIE BATS MINIGAME - Abriendo minijuego para carta: ${cardId}`);
    
    // Abrir minijuego de zombie con bates (sin pausar el juego)
    set({
      showZombieBatsMinigame: true,
      zombieBatsMinigameCardId: cardId
    });
    
    console.warn(`🧟 ZOMBIE BATS MINIGAME - Estado actualizado - showZombieBatsMinigame: true`);
  },

  // Completar minijuego de zombie con bates (ÉXITO)
  completeZombieBatsMinigame: () => {
    const state = get();
    const cardId = state.zombieBatsMinigameCardId;
    
    if (!cardId) {
      console.log(`ZOMBIE BATS MINIGAME - No hay cardId`);
      return;
    }
    
    console.warn(`🧟 ZOMBIE BATS MINIGAME - ¡COMPLETADO! CardId: ${cardId}`);
    
    const card = state.currentCards.find(c => c.id === cardId);
    
    if (!card) {
      console.log(`ZOMBIE BATS MINIGAME - Carta no encontrada (ya regeneradas). Dando item de todas formas...`);
    }
    
    // MINIJUEGO ZOMBIE BATS: SIEMPRE dar un item útil
    const usefulItemTypes = [CardType.FOOD, CardType.DRINK, CardType.MEDICINE, CardType.CLOTHING, CardType.WEAPON];
    const randomUsefulType = usefulItemTypes[Math.floor(Math.random() * usefulItemTypes.length)];
    
    console.log(`ZOMBIE BATS MINIGAME - Item útil: ${randomUsefulType}`);
    
    const typeData = cardData[randomUsefulType as keyof typeof cardData];
    
    if (typeData && typeData.length > 0) {
      const randomItem = typeData[Math.floor(Math.random() * typeData.length)];
      
      console.log(`ZOMBIE BATS MINIGAME - Item garantizado: ${randomItem.name}`);
      
      // Añadir el item al inventario
      get().addToInventory({
        id: `${randomUsefulType}_${Date.now()}`,
        type: randomUsefulType as any,
        name: randomItem.name,
        emoji: randomItem.emoji,
        image: (randomItem as any).image || randomItem.emoji,
        quantity: 1,
        description: (randomItem as any).description || `Item encontrado tras defender del zombie`
      });
      
      // Cerrar el minijuego y eliminar la carta
      set({
        currentCards: card ? state.currentCards.filter(c => c.id !== cardId) : state.currentCards,
        showZombieBatsMinigame: false,
        zombieBatsMinigameCardId: null,
      });
      
      // Delay para mostrar el modal
      setTimeout(() => {
        set({
          showItemFoundModal: true,
          foundItemName: randomItem.name,
          foundItemImage: (randomItem as any).image || randomItem.emoji
        });
        
        set({
          currentMessage: "¡Le diste una paliza! Mira lo que dejó...",
          showMessage: true
        });
      }, 300);
    } else {
      console.error(`ZOMBIE BATS MINIGAME - ERROR: No se encontraron datos`);
      set({
        currentCards: card ? state.currentCards.filter(c => c.id !== cardId) : state.currentCards,
        showZombieBatsMinigame: false,
        zombieBatsMinigameCardId: null,
      });
    }
  },

  // Timeout del minijuego de zombie con bates (FRACASO)
  timeoutZombieBatsMinigame: () => {
    const state = get();
    const cardId = state.zombieBatsMinigameCardId;
    
    if (!cardId) {
      return;
    }
    
    console.error(`🧟 ZOMBIE BATS MINIGAME - ¡TIMEOUT! No completado a tiempo`);
    
    const card = state.currentCards.find(c => c.id === cardId);
    
    // Cerrar sin dar recompensa
    set({
      currentCards: card ? state.currentCards.filter(c => c.id !== cardId) : state.currentCards,
      showZombieBatsMinigame: false,
      zombieBatsMinigameCardId: null,
    });
    
    // Mensaje de fracaso
    console.warn(`🧟 ZOMBIE BATS MINIGAME - ¡TIMEOUT! Mostrando mensaje de Peluso`);
    set({
      currentMessage: "¡El zombie te alcanzó! Demasiado lento...",
      showMessage: true
    });
  },

  // Seleccionar carta
  selectCard: (cardId: string) => {
    const state = get();
    
    const card = state.currentCards.find(c => c.id === cardId);
    
    if (!card) return;
    
    // Consumir el item del inventario según el tipo de carta
    let itemToConsume = '';
    if (card.effect.type === 'hunger') {
      itemToConsume = 'Manzana';
    } else if (card.effect.type === 'thirst') {
      itemToConsume = 'Agua';
    } else if (card.effect.type === 'infection') {
      itemToConsume = 'Pastilla';
    } else if (card.effect.type === 'cold') {
      itemToConsume = 'Bufanda';
    } else if (card.effect.type === 'zombie') {
      itemToConsume = 'Bate';
    }
    
    // Si necesita un item, consumirlo
    if (itemToConsume) {
      const item = state.inventory.find(i => i.name === itemToConsume);
      if (item && item.quantity > 0) {
        // Consumir el item
        set({
          inventory: state.inventory.map(i => 
            i.id === item.id 
              ? { ...i, quantity: i.quantity - 1 }
              : i
          ).filter(i => i.quantity > 0) // Quitar items con cantidad 0
        });
      }
    }
    
    // Aplicar efecto de la carta
    if (card.effect.type === 'hunger') {
      get().updateHunger(card.effect.value);
    } else if (card.effect.type === 'thirst') {
      get().updateThirst(card.effect.value);
    } else if (card.effect.type === 'infection') {
      get().setInfected(false);
    } else if (card.effect.type === 'cold') {
      get().setCold(false);
      // Bufanda se usa normalmente - se gasta 1 cantidad
    } else if (card.effect.type === 'zombie') {
      // Matar el zombie más cercano (posición más baja = más cerca)
      const zombies = state.zombies;
      if (zombies.length > 0) {
        // Encontrar el zombie más cercano (menor posición)
        const closestZombie = zombies.reduce((closest, current) => 
          current.position < closest.position ? current : closest
        );
        
        console.log(`CARTA ZOMBIE - Matando zombie más cercano: ${closestZombie.id} en posición ${closestZombie.position}`);
        get().killZombie(closestZombie.id);
      } else {
        console.log('CARTA ZOMBIE - No hay zombies para matar');
        // Si no hay zombies, mostrar mensaje
        get().displayMessage("No hay zombies cerca para golpear con el bate.");
      }
    } else if (card.effect.type === 'house') {
      // Reproducir sonido de carta-casa
      if (state.playHouseCard && state.soundEnabled) {
        state.playHouseCard();
      }
      
      // Verificar si esta casa tiene un minijuego
      if (card.minigameType === 'blocked') {
        // Abrir modal de puerta bloqueada
        get().openBlockedHouseModal(cardId);
        return; // No continuar con el resto de la lógica
      } else if (card.minigameType === 'rats') {
        // Abrir minijuego de ratas
        get().openRatsMinigame(cardId);
        return; // No continuar con el resto de la lógica
      } else if (card.minigameType === 'zombiebats') {
        // Abrir minijuego de zombie con bates
        get().openZombieBatsMinigame(cardId);
        return; // No continuar con el resto de la lógica
      }
      
      // Casa normal - usar el item oculto
      const hiddenItemType = card.hiddenItemType;
      if (hiddenItemType) {
        const typeData = cardData[hiddenItemType as keyof typeof cardData];
        const randomItem = typeData[Math.floor(Math.random() * typeData.length)];
        
        // Añadir item al inventario
        get().addToInventory({
          id: `${hiddenItemType}_${Date.now()}`,
          type: hiddenItemType as any,
          name: randomItem.name,
          emoji: randomItem.emoji,
          image: (randomItem as any).image,
          quantity: 1,
          description: `Item encontrado en casa`
        });
        
            // Mostrar modal con el item encontrado
            get().setFoundItem(randomItem.name, (randomItem as any).image);
            get().setShowItemFoundModal(true);
            
            // Mostrar mensaje gracioso solo si no se ha mostrado antes (NO tutorial, solo mensaje normal)
            let funnyMsg = '';
            let messageKey = '';
            if (hiddenItemType === CardType.FOOD) {
              funnyMsg = BEAR_MESSAGES.FOOD_FOUND;
              messageKey = 'food_found';
            } else if (hiddenItemType === CardType.DRINK) {
              funnyMsg = BEAR_MESSAGES.DRINK_FOUND;
              messageKey = 'drink_found';
            } else if (hiddenItemType === CardType.MEDICINE) {
              funnyMsg = BEAR_MESSAGES.MEDICINE_FOUND;
              messageKey = 'medicine_found';
            } else if (hiddenItemType === CardType.WEAPON) {
              funnyMsg = BEAR_MESSAGES.WEAPON_FOUND;
              messageKey = 'weapon_found';
            } else if (hiddenItemType === CardType.CLOTHING) {
              funnyMsg = BEAR_MESSAGES.CLOTHING_FOUND;
              messageKey = 'clothing_found';
            }
            
            if (funnyMsg && messageKey) {
              const state = get();
              // Solo mostrar si no se ha mostrado antes
              if (!state.shownMessages.has(messageKey)) {
                set({ 
                  currentMessage: funnyMsg, 
                  showMessage: true,
                  shownMessages: new Set(Array.from(state.shownMessages).concat(messageKey))
                });
              }
            }
      }
    } else if (card.effect.type === 'junk') {
      // Mensaje irónico solo si no se ha mostrado antes
      const state = get();
      const junkMessageKey = 'junk_found';
      if (!state.shownMessages.has(junkMessageKey)) {
        const message = ironicMessages.junk[Math.floor(Math.random() * ironicMessages.junk.length)];
        set({ 
          currentMessage: message, 
          showMessage: true,
          shownMessages: new Set(Array.from(state.shownMessages).concat(junkMessageKey))
        });
      }
    }
    
    // Limpiar cartas
    set({ currentCards: [] });
  },
  
  // Spawn de zombi
  spawnZombie: () => {
    const state = get();
    const currentDifficulty = getCurrentDifficulty(state.day);
    
    // Zombies más lentos al principio, más rápidos con el tiempo
    const baseSpeed = Math.max(0.5, Math.min(2, currentDifficulty * 0.8));
    
    const zombie: Zombie = {
      id: `zombie_${Date.now()}`,
      type: ZombieType.NORMAL,
      position: 5, // Empieza en la última casilla (5)
      speed: 1, // Siempre se mueve 1 posición por turno
      health: 1,
      isMoving: true
    };
    
    console.log(`SPAWN ZOMBIE - Creando zombie:`, zombie);
    console.log(`SPAWN ZOMBIE - Zombies antes: ${state.zombies.length}, después: ${state.zombies.length + 1}`);
    
    set({ zombies: [...state.zombies, zombie] });
  },
  
  // Mover zombis
  moveZombies: () => {
    const state = get();
    let updatedZombies = state.zombies.map(zombie => ({
      ...zombie,
      position: Math.max(0, zombie.position - 1) // Mover exactamente 1 posición cada turno
    }));
    
    // Debug: mostrar movimiento de zombis
    if (state.zombies.length > 0) {
      console.log(`ZOMBIE MOVE - Zombies: ${state.zombies.length}, Positions: ${state.zombies.map(z => z.position).join(', ')}`);
    }
    
    // Verificar si algún zombi llegó al jugador
    const zombiesAtPlayer = updatedZombies.filter(z => z.position === 0);
    if (zombiesAtPlayer.length > 0) {
      console.log(`ZOMBIE INFECTION! ${zombiesAtPlayer.length} zombies llegaron al jugador`);
      get().setInfected(true);
      
      // Eliminar los zombies que llegaron al jugador después de contagiar
      updatedZombies = updatedZombies.filter(z => z.position !== 0);
      
      // Mensaje de Peluso cuando te contagias - ELIMINADO
      // const msg = "¡Por los pelos! Si te contagia más vale que tengas una pastillita, sino empezará tu cuenta atrás...";
      // get().showBearGuide(msg);
    }

    
    set({ zombies: updatedZombies });
  },
  
  // Matar zombi
  killZombie: (zombieId: string) => {
    // Verificar si hay stores duplicados
    if (typeof window !== 'undefined') {
      // @ts-ignore
      (window as any).__STORE_TOKEN__ ??= Math.random().toString(36).slice(2);
      console.log('[KILL ZOMBIE STORE TOKEN]', (window as any).__STORE_TOKEN__);
    }

    const state = get();
    const killedZombie = state.zombies.find(z => z.id === zombieId);
    
    console.log(`KILL ZOMBIE - Llamada recibida para zombie: ${zombieId}`);
    console.log(`KILL ZOMBIE - Zombies disponibles:`, state.zombies.map(z => z.id));
    console.log(`KILL ZOMBIE - Zombie encontrado:`, killedZombie);
    
    if (killedZombie) {
      const newZombiesKilled = state.stats.zombiesKilled + 1;
      console.log(`ZOMBIE KILLED - Zombie ${zombieId} eliminado. Contador antes: ${state.stats.zombiesKilled}, después: ${newZombiesKilled}`);
      
      // Reproducir sonido del bate
      console.log(`KILL ZOMBIE - playBatHit disponible: ${!!state.playBatHit}, soundEnabled: ${state.soundEnabled}`);
      if (state.playBatHit && state.soundEnabled) {
        console.log('KILL ZOMBIE - Reproduciendo sonido del bate...');
        state.playBatHit();
        console.log('KILL ZOMBIE - Sonido del bate reproducido');
      } else {
        console.log('KILL ZOMBIE - No se puede reproducir sonido del bate:', {
          hasPlayBatHit: !!state.playBatHit,
          soundEnabled: state.soundEnabled
        });
      }

      // Eliminar zombie y actualizar contador
      set({ 
        zombies: state.zombies.filter(z => z.id !== zombieId),
        stats: {
          ...state.stats,
          zombiesKilled: newZombiesKilled
        },
        zombieDeathEffect: {
          zombieId: zombieId,
          position: killedZombie.position,
          isActive: true
        }
      });
      
      // Desactivar el efecto después de 2 segundos
      setTimeout(() => {
        set({ zombieDeathEffect: null });
      }, 2000);
      
      console.log(`ZOMBIE KILLED - Contador actualizado: ${newZombiesKilled} zombies muertos`);
    } else {
      console.log(`ZOMBIE KILLED - ERROR: Zombie ${zombieId} no encontrado`);
    }
  },
  
  // Añadir al inventario
  addToInventory: (item: InventoryItem) => {
    const state = get();
    
    const existingItemIndex = state.inventory.findIndex(i => i.name === item.name);
    
    let newInventory;
    
    if (existingItemIndex !== -1) {
      // Item existe, incrementar cantidad
      newInventory = [...state.inventory];
      newInventory[existingItemIndex] = {
        ...newInventory[existingItemIndex],
        quantity: newInventory[existingItemIndex].quantity + item.quantity
      };
    } else {
      // Item nuevo, añadirlo
      const newItem = { ...item };
      newInventory = [...state.inventory, newItem];
    }
    set({ inventory: newInventory });
    
    // Guardar automáticamente después de añadir al inventario
    get().saveGame();
  },
  
  // Usar item
  useItem: (itemId: string) => {
    const state = get();
    
    const item = state.inventory.find(i => i.id === itemId);
    
    if (!item || item.quantity <= 0) return;
    
    // Validaciones para items innecesarios
    if (item.type === ItemType.MEDICINE && !state.isInfected && state.health >= 95) {
      // No está contagiado y tiene muy buena salud - mensaje irónico
      const { BEAR_MESSAGES } = require('@/config/characters');
      get().displayMessage(BEAR_MESSAGES.UNNECESSARY_ITEMS.MEDICINE_NOT_INFECTED);
      return; // No usar el item
    }
    
    // La bufanda se puede usar cuando tienes frío, no se bloquea cuando no tienes frío
    // La lógica de frío se maneja en el timer, no aquí
    
    // Aplicar efecto del item
    if (item.type === ItemType.WEAPON) {
      // Usar bate - verificar si hay zombies para matar
      const currentState = get();
      if (currentState.zombies.length > 0) {
        // Hay zombies - matar el primero y mostrar efectos
        const zombieToKill = currentState.zombies[0];
        console.log(`BATE USADO - Matando zombie: ${zombieToKill.id}`);
        
        // Reproducir sonido del bate
        if (currentState.playBatHit && currentState.soundEnabled) {
          console.log(`BATE USADO - Reproduciendo sonido del bate`);
          currentState.playBatHit();
        }
        
        // Remover zombie del campo y actualizar contador
        const updatedZombies = currentState.zombies.filter(z => z.id !== zombieToKill.id);
        const newZombiesKilled = currentState.stats.zombiesKilled + 1;
        set({ 
          zombies: updatedZombies,
          stats: {
            ...currentState.stats,
            zombiesKilled: newZombiesKilled
          }
        });
        
        // Mostrar efectos visuales - animación del bate al zombie
        get().triggerFlyingItem('Bate');
        get().triggerShake();
        
        // Efecto de muerte del zombie
        set({
          zombieDeathEffect: {
            zombieId: zombieToKill.id,
            position: zombieToKill.position,
            isActive: true
          }
        });
        
        // Desactivar el efecto después de 2 segundos
        setTimeout(() => {
          set({ zombieDeathEffect: null });
        }, 2000);
        
        // Mensaje de éxito
        get().displayMessage("¡Zombie eliminado con el bate!");
        
        console.log(`ZOMBIE ELIMINADO - Zombies restantes: ${updatedZombies.length}, Contador: ${newZombiesKilled}`);
      } else {
        // No hay zombies - mostrar mensaje de que no hay nada que atacar
        get().displayMessage("No hay zombies para atacar con el bate.");
        return; // No consumir el bate si no hay zombies
      }
      
      // Consumir el bate del inventario
      const updatedInventory = state.inventory.map(invItem => 
        invItem.id === itemId 
          ? { ...invItem, quantity: Math.max(0, invItem.quantity - 1) }
          : invItem
      ).filter(invItem => invItem.quantity > 0);
      
      set({ inventory: updatedInventory });
      console.log(`BATE USADO - Cantidad restante: ${updatedInventory.find(i => i.name === 'Bate')?.quantity || 0}`);
    } else {
      // Activar efecto de vuelo para otros items (comida, bebida, medicina, ropa)
      get().triggerFlyingItem(item.name);
    }
    
    if (item.type === ItemType.FOOD) {
      // Comer comida - restaurar hambre y bajar un poco la sed (realista)
      const state = get();
      
      // Reproducir sonido de comer
      if (state.playEat && state.soundEnabled) {
        state.playEat();
      }
      const newHunger = Math.min(100, state.hunger + 30);
      const newThirst = Math.max(0, state.thirst - 10); // -10% sed por comer
      set({ hunger: newHunger, thirst: newThirst });
      get().triggerCharacterEffect('eating');
      
      console.log(`COMIDA USADA - Hambre: +30 (${state.hunger} → ${newHunger}), Sed: -10 (${state.thirst} → ${newThirst})`);
      
      // Comer manzana - sin lógica de tutorial
    } else if (item.type === ItemType.DRINK) {
      // Beber - restaurar sed y bajar un poco la hambre (realista)
      const state = get();
      
      // Reproducir sonido de beber
      if (state.playDrink && state.soundEnabled) {
        state.playDrink();
      }
      const newThirst = Math.min(100, state.thirst + 30);
      const newHunger = Math.max(0, state.hunger - 5); // -5% hambre por beber (menos que la comida da sed)
      set({ thirst: newThirst, hunger: newHunger });
      
      console.log(`BEBIDA USADA - Sed: +30 (${state.thirst} → ${newThirst}), Hambre: -5 (${state.hunger} → ${newHunger})`);
      get().triggerCharacterEffect('drinking');
    } else if (item.type === ItemType.MEDICINE) {
      // Reproducir sonido de pastilla
      if (state.playPill && state.soundEnabled) {
        state.playPill();
      }
      
      // Tomar medicina - curar infección
      if (state.isInfected) {
        set({ isInfected: false });
      }
      get().updateHealth(20);
      get().triggerCharacterEffect('healing');
    } else if (item.type === ItemType.CLOTHING) {
      // Usar bufanda - curar frío y gastar 1 bufanda
      console.log(`BUFANDA USADA - isCold: ${state.isCold}, hour: ${state.hour}, scarfUsedTonight: ${state.scarfUsedTonight}`);
      if (state.isCold) {
        set({ 
          isCold: false, 
          scarfUsedTonight: true,
          currentMessage: "Te pones la bufanda y ya no tienes frío.", 
          showMessage: true 
        });
        console.log(`BUFANDA - Frío quitado correctamente, scarfUsedTonight: true`);
        
        // Verificar inmediatamente después del set
        const immediateState = get();
        console.log(`BUFANDA INMEDIATO - isCold: ${immediateState.isCold}, scarfUsedTonight: ${immediateState.scarfUsedTonight}`);
        
        // Verificar el estado después del set
        setTimeout(() => {
          const newState = get();
          console.log(`BUFANDA VERIFICACIÓN - Después de usar: isCold: ${newState.isCold}, scarfUsedTonight: ${newState.scarfUsedTonight}`);
        }, 100);
      } else {
        // No tiene frío - esto no debería pasar por la validación anterior
        console.log(`BUFANDA - ERROR: No tiene frío pero llegó aquí`);
        set({ 
          currentMessage: "No tienes frío, pero te pones la bufanda por si acaso.", 
          showMessage: true 
        });
      }
    }
    
    // Tutorial eliminado completamente
    
    // Reducir cantidad usando set() para mantener consistencia
    const updatedInventory = state.inventory.map(i => 
      i.id === itemId 
        ? { ...i, quantity: i.quantity - 1 }
        : i
    ).filter(i => i.quantity > 0);
    
    set({ 
      inventory: updatedInventory,
      stats: {
        ...state.stats,
        itemsUsed: state.stats.itemsUsed + 1
      }
    });
    
    // Guardar automáticamente después de usar un item
    get().saveGame();
  },
  
  // Actualizar hambre
  updateHunger: (value: number) => {
    const state = get();
    
    // Si está contagiado, hambre baja 3x más rápido
    let adjustedValue = value;
    if (state.isInfected && value < 0) {
      adjustedValue = adjustedValue * 3;
    }
    
    // Clamp: asegurar que hambre esté entre 0 y 100
    const newHunger = Math.max(0, Math.min(100, state.hunger + adjustedValue));
    set({ hunger: newHunger });
    
    // Mensajes irónicos de Peluso según el nivel de hambre
    if (newHunger <= 0) {
      // Crítico - hambre a 0
      const { BEAR_MESSAGES } = require('@/config/characters');
      const message = BEAR_MESSAGES.HUNGER_CRITICAL[Math.floor(Math.random() * BEAR_MESSAGES.HUNGER_CRITICAL.length)];
      set({ currentMessage: message, showMessage: true });
    } else if (newHunger < 20) {
      // Muy bajo - hambre < 20
      const { BEAR_MESSAGES } = require('@/config/characters');
      const message = BEAR_MESSAGES.HUNGER_CRITICAL[Math.floor(Math.random() * BEAR_MESSAGES.HUNGER_CRITICAL.length)];
      set({ currentMessage: message, showMessage: true });
    } else if (newHunger < 30) {
      // Bajo - hambre < 30
      set({ currentMessage: "¡Tienes hambre! Busca comida antes de que sea tarde.", showMessage: true });
    }
  },
  
  // Actualizar sed
  updateThirst: (value: number) => {
    const state = get();
    
    // Si está contagiado, sed baja 3x más rápido
    let adjustedValue = value;
    if (state.isInfected && value < 0) {
      adjustedValue = adjustedValue * 3;
    }
    
    // Clamp: asegurar que sed esté entre 0 y 100
    const newThirst = Math.max(0, Math.min(100, state.thirst + adjustedValue));
    set({ thirst: newThirst });
    
    // Mensajes irónicos de Peluso según el nivel de sed
    if (newThirst <= 0) {
      // Crítico - sed a 0
      const { BEAR_MESSAGES } = require('@/config/characters');
      const message = BEAR_MESSAGES.THIRST_CRITICAL[Math.floor(Math.random() * BEAR_MESSAGES.THIRST_CRITICAL.length)];
      set({ currentMessage: message, showMessage: true });
    } else if (newThirst < 20) {
      // Muy bajo - sed < 20
      const { BEAR_MESSAGES } = require('@/config/characters');
      const message = BEAR_MESSAGES.THIRST_CRITICAL[Math.floor(Math.random() * BEAR_MESSAGES.THIRST_CRITICAL.length)];
      set({ currentMessage: message, showMessage: true });
    } else if (newThirst < 30) {
      // Bajo - sed < 30
      set({ currentMessage: "¡Tienes sed! Necesitas agua urgentemente.", showMessage: true });
    }
  },
  
  // Actualizar salud
  updateHealth: (value: number) => {
    const state = get();
    
    // Si el juego ya terminó, no hacer nada
    if (state.gameOver) {
      console.log(`UPDATE HEALTH - Juego ya terminado, ignorando actualización de salud`);
      return;
    }
    
    // Calcular nueva salud sin clamp primero
    const rawNewHealth = state.health + value;
    
    console.log(`UPDATE HEALTH - Valor: ${value}, Salud anterior: ${state.health}, Salud calculada: ${rawNewHealth}`);
    
    // Verificar si el juego debe terminar ANTES de aplicar el clamp
    if (rawNewHealth <= 0) {
      console.log(`UPDATE HEALTH - ¡SALUD LLEGÓ A 0 O MENOS! (${rawNewHealth}), llamando endGame()`);
      set({ health: 0, gameOver: true }); // Establecer salud a 0 y marcar como terminado
      get().endGame();
      return;
    }
    
    // Clamp: asegurar que salud esté entre 0 y 100
    const newHealth = Math.max(0, Math.min(100, rawNewHealth));
    set({ health: newHealth });
    
    // Mensajes irónicos de Peluso según el nivel de salud
    if (newHealth <= 10) {
      // Crítico - salud <= 10
      const { BEAR_MESSAGES } = require('@/config/characters');
      const message = BEAR_MESSAGES.HEALTH_VERY_LOW[Math.floor(Math.random() * BEAR_MESSAGES.HEALTH_VERY_LOW.length)];
      set({ currentMessage: message, showMessage: true });
    } else if (newHealth <= 25) {
      // Muy bajo - salud <= 25
      const { BEAR_MESSAGES } = require('@/config/characters');
      const message = BEAR_MESSAGES.HEALTH_CRITICAL[Math.floor(Math.random() * BEAR_MESSAGES.HEALTH_CRITICAL.length)];
      set({ currentMessage: message, showMessage: true });
    }
    
    console.log(`UPDATE HEALTH - Salud final: ${newHealth}`);
    
    // Activar temblor si se recibe daño
    if (value < 0) {
      get().triggerShake();
    }
  },
  
  // Establecer infección
  setInfected: (infected: boolean) => {
    set({ isInfected: infected });
    
    if (infected) {
      set({ currentMessage: "Te sientes raro... ¿Será el apocalipsis o algo más?", showMessage: true });
    } else {
      set({ currentMessage: "¡Te curaste! Ya no estás contagiado.", showMessage: true });
    }
  },
  
  // Establecer frío
  setCold: (cold: boolean) => {
    set({ isCold: cold });
    
    if (cold) {
      set({ currentMessage: "Hace frío... ¿No tienes una bufanda?", showMessage: true });
    }
  },
  
  // Mostrar mensaje
  displayMessage: (message: string) => {
    const state = get();
    
    // Si el juego terminó, no mostrar mensajes
    if (state.gameOver) {
      console.log(`MESSAGE DEBUG - Juego terminado, ignorando mensaje: "${message}"`);
      return;
    }
    
    // Evitar mensajes duplicados si ya hay uno mostrándose
    if (state.showMessage && state.currentMessage === message) {
      console.log(`MESSAGE DEBUG - Mensaje duplicado ignorado: "${message}"`);
      return;
    }
    
    // Si ya hay un mensaje mostrándose, esperar a que se cierre
    if (state.showMessage) {
      console.log(`MESSAGE DEBUG - Ya hay un mensaje mostrándose, ignorando: "${message}"`);
      return;
    }
    
    console.log(`MESSAGE DEBUG - Mostrando mensaje: "${message}"`);
    set({ currentMessage: message, showMessage: true });
    
    // El FloatingMessage se encarga del auto-cierre
  },
  
  // Controlar animación de transición de día
  showDayTransitionAnimation: (day: number) => {
    set({ showDayTransition: true, transitionDay: day });
  },
  
  hideDayTransitionAnimation: () => {
    set({ showDayTransition: false });
  },

  // Mostrar prompt de registro (día 3)
  showRegistrationPrompt: () => {
    const state = get();
    
    // Pausar el juego y mostrar mensaje de Peluso
    set({ 
      isPaused: true,
      hasShownRegistrationPrompt: true,
      showPelusoMessage: true
    });
    
    console.log('REGISTRATION PROMPT - Mostrando mensaje de Peluso el día 3');
  },
  
  // Ocultar mensaje
  hideMessage: () => {
    set({ showMessage: false, showTutorial: false, currentMessage: '' });
  },

  // Ocultar mensaje de Peluso
  hidePelusoMessage: () => {
    set({ showPelusoMessage: false });
  },

  // Ir al registro desde el mensaje de Peluso
  goToRegister: () => {
    set({ showPelusoMessage: false, showRegister: true });
  },
  
  // Activar efecto de temblor
  triggerShake: () => {
    console.log(`SHAKE TRIGGERED - Activando efecto de temblor`);
    set({ isShaking: true });
    setTimeout(() => {
      set({ isShaking: false });
      console.log(`SHAKE ENDED - Desactivando efecto de temblor`);
    }, 500);
  },
  
  // Activar efecto de vuelo de item
  triggerFlyingItem: (itemName: string, type: 'from_inventory' | 'from_bear' = 'from_inventory') => {
    set({ flyingItem: itemName, flyingItemType: type });
    setTimeout(() => {
      set({ flyingItem: null, flyingItemType: null });
    }, 1000);
  },
  
  // Activar efecto temporal del personaje
  triggerCharacterEffect: (effect: 'drinking' | 'eating' | 'healing') => {
    set({ characterEffect: effect });
    setTimeout(() => {
      set({ characterEffect: null });
    }, 2000);
  },
  
  // Mostrar frase random de Peluso (NO pausa el juego)
  showRandomBearQuote: () => {
    const state = get();
    
    const { BEAR_MESSAGES } = require('@/config/characters');
    const randomQuote = BEAR_MESSAGES.FUNNY_QUOTES[Math.floor(Math.random() * BEAR_MESSAGES.FUNNY_QUOTES.length)];
    set({ 
      currentMessage: randomQuote, 
      showMessage: true
      // NO activar showTutorial para que NO pause el juego
    });
  },
  
  // Mostrar mensaje de guía de Peluso (SÍ pausa el juego)
  showBearGuide: (message: string) => {
    const state = get();
    
    set({ 
      currentMessage: message,
      showMessage: true,
      showTutorial: true
      // Usar mensaje flotante pero marcar como tutorial
    });
  },
  
  // Iniciar timer de frases random de Peluso
  startRandomBearTimer: () => {
    // Frase random cada 30-60 segundos
    const randomInterval = Math.random() * 30000 + 30000; // 30-60 segundos
    setTimeout(() => {
      const state = get();
      if (state.isPlaying && !state.isPaused && !state.showTutorial) {
        get().showRandomBearQuote();
        get().startRandomBearTimer(); // Programar la siguiente
      }
    }, randomInterval);
  },
  
  // Reiniciar juego
  resetGame: () => {
    set(initialState);
    // Eliminar partida guardada al reiniciar
    if (typeof window !== 'undefined') {
      localStorage.removeItem('unDiaMas_savedGame');
      localStorage.removeItem('unDiaMas_lastSave');
    }
  },
  
  // Guardar partida
  saveGame: () => {
    const state = get();
    saveGameToStorage(state);
  },
  
  // Cargar partida
  loadGame: () => {
    const savedGame = loadSavedGame();
    if (savedGame) {
      set({
        ...savedGame,
        // Restaurar estado de juego activo
        isPlaying: false,
        isPaused: false,
        gameOver: false,
        showItemSelection: false,
        showManual: false,
        showInventorySummary: false,
        showHelp: false,
        showItemFoundModal: false,
        foundItemName: '',
        foundItemImage: '',
        showInfoModal: false,
        infoTitle: '',
        infoMessage: '',
        showTutorial: false,
        tutorialMessage: '',
        tutorialPhase: null,
        showBlockedHouseModal: false,
        blockedHouseCardId: null,
        blockedHouseClicks: 0,
        currentCards: [],
        zombies: [],
        currentMessage: '',
        showMessage: false,
        flyingItem: null,
        flyingItemType: null,
        characterEffect: null
      });
      return true;
    }
    return false;
  },
  
  // Verificar si hay partida guardada
  hasSavedGame: () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('unDiaMas_savedGame') !== null;
    }
    return false;
  },
  
  // Eliminar partida guardada
  deleteSavedGame: () => {
    if (typeof window !== 'undefined') {
      // Eliminar datos del juego
      localStorage.removeItem('unDiaMas_savedGame');
      localStorage.removeItem('unDiaMas_lastSave');
    }
  }
}));


