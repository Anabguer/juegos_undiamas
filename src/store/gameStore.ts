import { create } from 'zustand';
import { GameState, Card, Zombie, InventoryItem, GameStats, CardType, ItemType, ZombieType, GameEndingType, CardEffect } from '@/types/game';
import { BEAR_MESSAGES } from '@/config/characters';

// Estado inicial del juego
const initialState: GameState = {
  hunger: 100,
  thirst: 100,
  health: 100,
  isInfected: false,
  isCold: false,
  isShaking: false,
  flyingItem: null,
  flyingItemType: null,
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
  showInfoModal: false,
  infoTitle: '',
  infoMessage: '',
  showTutorial: false,
  tutorialMessage: '',
  skipTutorial: false,
  tutorialStep: 0,
  tutorialActive: false,
  tutorialDone: false,
  
  // Modal de casa bloqueada
  showBlockedHouseModal: false,
  blockedHouseCardId: null,
  blockedHouseClicks: 0,
  
  inventory: [],
  zombies: [],
  currentCards: [],
  
  currentMessage: '',
  showMessage: false,
  
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
  timePerHour: 5, // 5 segundos reales = 1 hora del juego
  cardsPerTurn: 3,
  cardDisplayTime: 5, // 5 segundos para elegir
  zombieSpawnRate: 0.2, // 20% de probabilidad por turno
  difficultyMultiplier: 1.1 // +10% dificultad por día
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
  // Acciones
  startGame: () => void;
  setShowItemSelection: (show: boolean) => void;
  setShowManual: (show: boolean) => void;
  setShowInventorySummary: (show: boolean) => void;
  setShowHelp: (show: boolean) => void;
  setShowItemFoundModal: (show: boolean) => void;
  setFoundItem: (name: string, image: string) => void;
  setShowInfoModal: (show: boolean) => void;
  setInfoMessage: (title: string, message: string) => void;
  setShowTutorial: (show: boolean) => void;
  setTutorialMessage: (message: string) => void;
  setSkipTutorial: (skip: boolean) => void;
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
  clickBlockedHouse: (cardId: string) => void;
  
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
  
  // Efectos visuales
  triggerShake: () => void;
  triggerFlyingItem: (itemName: string, type?: 'from_inventory' | 'from_bear') => void;
  triggerCharacterEffect: (effect: 'drinking' | 'eating' | 'healing') => void;
  showRandomBearQuote: () => void;
  showBearGuide: (message: string) => void;
  startRandomBearTimer: () => void;
  
  // Modal de casa bloqueada
  showBlockedHouseModal: boolean;
  blockedHouseCardId: string | null;
  blockedHouseClicks: number;
  openBlockedHouseModal: (cardId: string) => void;
  closeBlockedHouseModal: () => void;
  
  // Utilidades
  resetGame: () => void;
}>((set, get) => ({
  ...initialState,
  
  // Acciones del juego
  startGame: () => {
    set({ 
      isPlaying: true, 
      gameOver: false, 
      showItemSelection: false,
      showInventorySummary: false,
      showManual: false,
      showHelp: false,
      hunger: 50, // Iniciar con hambre moderada para el tutorial
      thirst: 80,
      health: 100
    });
    
    // Mostrar tutorial inicial si no está desactivado
    if (!get().skipTutorial) {
      get().showBearGuide(BEAR_MESSAGES.WELCOME);
    }
    
    // Generar cartas después de mostrar el tutorial
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
    set({ showItemFoundModal: show });
  },
  
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
  },
  
  pauseGame: () => set({ isPaused: true }),
  
  resumeGame: () => set({ isPaused: false, showTutorial: false }),
  
  // Reanudar solo el juego sin cerrar el tutorial
  resumeGameOnly: () => set({ isPaused: false }),
  
  endGame: () => {
    const state = get();
    
    // Determinar el tipo de final basado en las condiciones
    let endingType: GameEndingType;
    
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
    
    const ending = gameEndings[endingType];
    
    set({ 
      isPlaying: false, 
      gameOver: true,
      gameEnding: ending,
      stats: {
        ...state.stats,
        bestDay: Math.max(state.stats.bestDay, state.day)
      }
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
    let newMinute = state.minute + 1;
    let newDay = state.day;
    
    if (newMinute >= 60) {
      newMinute = 0;
      newHour += 1;
    }
    
    if (newHour >= 24) {
      newHour = 0;
      newDay += 1;
      
      // Mensaje de nuevo día
      const message = ironicMessages.milestones[Math.min(newDay - 1, ironicMessages.milestones.length - 1)];
      set({ currentMessage: message, showMessage: true });
    }
    
    // Verificar si es de noche (21:00-05:00) para aplicar frío
    const isNight = newHour >= 21 || newHour < 5;
    const wasDay = state.hour >= 5 && state.hour < 21;
    
    set({ 
      hour: newHour, 
      minute: newMinute, 
      day: newDay,
      isNight: isNight
    });
    
    // Si acaba de hacerse de noche y no tiene bufanda, aplicar frío
    if (isNight && wasDay && !state.isCold) {
      const hasScarf = state.inventory.some(item => item.name === 'Bufanda' && item.quantity > 0);
      if (!hasScarf) {
        set({ isCold: true });
        
        // Si estamos en el tutorial, dar bufanda automáticamente
        if (state.showTutorial) {
          get().addToInventory({
            id: 'tutorial_scarf',
            name: 'Bufanda',
            type: 'clothing',
            image: '/images/bufanda.png',
            quantity: 1
          });
        }
        
        const { BEAR_MESSAGES } = require('@/config/characters');
        get().showBearGuide(BEAR_MESSAGES.TUTORIAL_COLD_NIGHT);
      }
    }
    
    // Generar cartas cada hora
    if (newMinute === 0) {
      get().generateCards();
    }
    
    // Spawn de zombis con dificultad progresiva
    const currentDifficulty = getCurrentDifficulty(newDay);
    const adjustedSpawnRate = gameConfig.zombieSpawnRate * currentDifficulty;
    if (Math.random() < adjustedSpawnRate) {
      get().spawnZombie();
    }
    
    // Mover zombis
    get().moveZombies();
    
    // Verificar condiciones especiales de noche
    if (newHour >= 21 || newHour < 5) {
      // Es de noche - verificar si tiene bufanda
      const hasScarf = state.inventory.some(item => item.name === 'Bufanda' && item.quantity > 0);
      if (!hasScarf && !state.isCold) {
        // No tiene bufanda y no está ya con frío
        set({ isCold: true });
        
        // Si es tutorial, mostrar mensaje de Peluso
        if (state.showTutorial && state.tutorialPhase === 'zombie_kill') {
          const { BEAR_MESSAGES } = require('@/config/characters');
          get().showBearGuide(BEAR_MESSAGES.TUTORIAL_COLD_NIGHT);
        } else {
          set({ currentMessage: "¡Hace mucho frío! Necesitas una bufanda para sobrevivir la noche.", showMessage: true });
        }
      }
    } else {
      // Es de día - quitar frío si lo tiene
      if (state.isCold) {
        set({ isCold: false });
        set({ currentMessage: "¡El sol calienta! Ya no tienes frío.", showMessage: true });
      }
    }
  },
  
  // Generar casa bloqueada para tutorial
  generateBlockedHouseForTutorial: () => {
    const houseImages = ['casa1.png', 'casa2.png', 'casa3.png', 'casa4.png', 'casa5.png', 'casa6.png'];
    const randomHouse = houseImages[Math.floor(Math.random() * houseImages.length)];
    
    const blockedHouseCard = {
      id: `tutorial_blocked_${Date.now()}`,
      type: CardType.HOUSE,
      name: 'Casa Bloqueada',
      emoji: '🏠',
      image: '/images/puertabloqueada.png',
      description: 'Casa bloqueada que requiere múltiples clicks',
      effect: { type: 'blocked_house', value: 0 },
      rarity: 'common' as any,
      houseImage: `/images/${randomHouse}`,
      isBlocked: true,
      clicksToUnlock: 10,
      currentClicks: 0,
      isRevealed: false,
      isBlockedHouse: true
    };
    
    set({ currentCards: [blockedHouseCard] });
    
    // Mostrar tutorial de casa bloqueada
    setTimeout(() => {
      const { BEAR_MESSAGES } = require('@/config/characters');
      get().showBearGuide(BEAR_MESSAGES.TUTORIAL_BLOCKED_HOUSE);
    }, 500);
  },
  
  // Generar cartas
  generateCards: () => {
    console.log('generateCards llamado, generando', gameConfig.cardsPerTurn, 'cartas');
    const cards: Card[] = [];
    
    // TODAS las cartas son casas normales, pero algunas están "marcadas" para ser bloqueadas
    for (let i = 0; i < gameConfig.cardsPerTurn; i++) {
      const random = Math.random();
      let hiddenItemType: CardType;
      let isBlockedHouse = false;
      
      // Determinar el item oculto (con porcentajes balanceados)
      if (random < 0.3) {
        // 30% comida/agua
        hiddenItemType = Math.random() < 0.5 ? CardType.FOOD : CardType.DRINK;
      } else if (random < 0.4) {
        // 10% útiles (medicina, ropa, arma)
        const usefulTypes = [CardType.MEDICINE, CardType.CLOTHING, CardType.WEAPON];
        hiddenItemType = usefulTypes[Math.floor(Math.random() * usefulTypes.length)];
      } else {
        // 60% basura
        hiddenItemType = CardType.JUNK;
      }
      
      // Determinar si esta casa será bloqueada (50% probabilidad para testing)
      isBlockedHouse = Math.random() < 0.5;
      console.log(`Casa ${i}: isBlockedHouse = ${isBlockedHouse}`);
      
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
        description: `Efecto: ${isBlockedHouse ? 'blocked_house' : randomCard.effect.type}`,
        effect: { type: isBlockedHouse ? 'blocked_house' : randomCard.effect.type, value: 0 } as CardEffect,
        rarity: 'common' as any,
        // Guardar el item oculto y si será bloqueada
        hiddenItemType: hiddenItemType,
        isBlockedHouse: isBlockedHouse,
        isBlocked: isBlockedHouse,
        clicksToUnlock: isBlockedHouse ? 10 : undefined,
        currentClicks: isBlockedHouse ? 0 : undefined
      };
      
      console.log('Carta generada:', {
        id: card.id,
        name: card.name,
        effect: card.effect,
        houseImage: card.houseImage,
        isBlockedHouse: card.isBlockedHouse
      });
      
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
    
    const blockedHouses = cards.filter(c => c.isBlockedHouse).length;
    console.log('generateCards completado, cartas generadas:', cards.length, `(casas bloqueadas: ${blockedHouses})`);
    set({ currentCards: cards });
  },
  
  // Abrir modal de casa bloqueada
  openBlockedHouseModal: (cardId: string) => {
    const state = get();
    const card = state.currentCards.find(c => c.id === cardId);
    
    console.log('openBlockedHouseModal llamado con cardId:', cardId);
    console.log('Carta encontrada:', card);
    console.log('isBlockedHouse:', card?.isBlockedHouse);
    
    if (!card || !card.isBlockedHouse) {
      console.log('Modal no se abre: carta no encontrada o no es bloqueada');
      return;
    }
    
    console.log('Abriendo modal de casa bloqueada');
    // Pausar juego mientras está la puerta
    set({
      showBlockedHouseModal: true,
      blockedHouseCardId: cardId,
      blockedHouseClicks: card.currentClicks || 0,
      isPaused: true
    });
    
    // Si es tutorial, marcar la fase
    if (state.showTutorial && state.tutorialPhase === 'blocked_house_message') {
      console.log('Tutorial: abriendo modal de puerta bloqueada');
      set({ tutorialPhase: 'blocked_house_modal' });
    }
  },
  
  // Cerrar modal de casa bloqueada
  closeBlockedHouseModal: () => {
    set({
      showBlockedHouseModal: false,
      blockedHouseCardId: null,
      blockedHouseClicks: 0,
      isPaused: false
    });
  },

  // Hacer clic en casa bloqueada
  clickBlockedHouse: (cardId: string) => {
    const state = get();
    const card = state.currentCards.find(c => c.id === cardId);
    
    console.log('clickBlockedHouse llamado con cardId:', cardId);
    console.log('Carta encontrada:', card);
    console.log('isBlockedHouse:', card?.isBlockedHouse);
    
    if (!card || !card.isBlockedHouse) {
      console.log('clickBlockedHouse: carta no encontrada o no es bloqueada');
      return;
    }
    
    const newClicks = (card.currentClicks || 0) + 1;
    
    // Actualizar el número de clics en la carta y en el modal
    set({
      currentCards: state.currentCards.map(c => 
        c.id === cardId 
          ? { ...c, currentClicks: newClicks }
          : c
      ),
      blockedHouseClicks: newClicks
    });
    
    // Si se alcanzó el número de clics necesarios, desbloquear
    if (newClicks >= (card.clicksToUnlock || 10)) {
      // Cerrar el modal de puerta bloqueada
      get().closeBlockedHouseModal();
      
      // Si es el tutorial de casa bloqueada, manejar el flujo paso a paso
      if (state.showTutorial && state.tutorialPhase === 'blocked_house_modal') {
        console.log('Tutorial: puerta desbloqueada, mostrando item');
        set({ tutorialPhase: 'zombie_warning' });
        get().hideMessage();
        
        // Añadir bate al inventario para el tutorial
        get().addToInventory({
          id: `bate_tutorial_${Date.now()}`,
          type: ItemType.WEAPON,
          name: 'Bate',
          emoji: '🏏',
          image: '/images/bat.png',
          quantity: 1,
          description: 'Bate para defenderse de los zombis'
        });
        
        // NO reanudar el juego aquí - se reanudará cuando se use el bate
      } else {
        // Si no es tutorial, reanudar completamente
        get().resumeGame();
      }
      
      // Cerrar el modal y limpiar la carta
      set({
        currentCards: state.currentCards.filter(c => c.id !== cardId),
        showBlockedHouseModal: false,
        blockedHouseCardId: null,
        blockedHouseClicks: 0
      });
      
      // Tras desbloquear, aparecer un zombi en posición 3 para dar más tiempo
      const zombie: Zombie = {
        id: `zombie_${Date.now()}`,
        type: ZombieType.NORMAL,
        position: 3,
        speed: 1,
        health: 1,
        isMoving: true
      };
      set({ zombies: [...state.zombies, zombie] });

      // Mostrar mensaje de Peluso sobre el zombie
      const { BEAR_MESSAGES } = require('@/config/characters');
      get().showBearGuide(BEAR_MESSAGES.ZOMBIE_APPEAR);

      // Guardar el item para mostrarlo DESPUÉS de usar el bate
      const hiddenItemType = card.hiddenItemType;
      if (hiddenItemType) {
        const typeData = cardData[hiddenItemType as keyof typeof cardData];
        const randomItem = typeData[Math.floor(Math.random() * typeData.length)];
        
        // Añadir item al inventario (pero NO mostrar el modal todavía)
        get().addToInventory({
          id: `${hiddenItemType}_${Date.now()}`,
          type: hiddenItemType as any,
          name: randomItem.name,
          emoji: randomItem.emoji,
          image: (randomItem as any).image,
          quantity: 1,
          description: `Item encontrado en casa bloqueada`
        });
        
        // Guardar el item para mostrarlo después del bate
        set({ 
          foundItemName: randomItem.name,
          foundItemImage: (randomItem as any).image || '',
          showItemFoundModal: false // NO mostrar todavía
        });
      }

      // NO generar cartas aquí - se generarán cuando se use el bate
    }
    // No mostrar mensaje de progreso - los mensajes se muestran en el modal
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
      
      // Consumir bufanda (usos limitados)
      const scarfItem = state.inventory.find(i => i.name === 'Bufanda');
      if (scarfItem) {
        const newUses = (scarfItem.uses || 0) + 1;
        const maxUses = scarfItem.maxUses || 3;
        
        if (newUses >= maxUses) {
          // Bufanda se rompe
          set({
            inventory: state.inventory.filter(i => i.id !== scarfItem.id)
          });
          set({ 
            currentMessage: "¡Tu bufanda se rompió! Era muy vieja...", 
            showMessage: true 
          });
        } else {
          // Actualizar usos
          set({
            inventory: state.inventory.map(i => 
              i.id === scarfItem.id 
                ? { ...i, uses: newUses }
                : i
            )
          });
          set({ 
            currentMessage: `Bufanda usada (${newUses}/${maxUses}). Se está desgastando...`, 
            showMessage: true 
          });
        }
      }
    } else if (card.effect.type === 'zombie') {
      get().addToInventory({
        id: `bate_${Date.now()}`,
        type: ItemType.WEAPON,
        name: 'Bate',
        emoji: '🏏',
        image: '/images/bat.png',
        quantity: 1,
        description: 'Sirve para golpear zombis'
      });
    } else if (card.effect.type === 'house') {
      // Verificar si esta casa está marcada como bloqueada
      if (card.isBlockedHouse) {
        // Activar puerta bloqueada
        set({
          currentCards: state.currentCards.map(c => 
            c.id === cardId 
              ? { ...c, isBlocked: true, type: CardType.BLOCKED_HOUSE }
              : c
          )
        });
        
        // Mostrar mensaje de puerta bloqueada
        set({ 
          currentMessage: "¡Ábrelaaa que nos pillan!", 
          showMessage: true 
        });
        return; // No continuar con el resto de la lógica
      }
      
      // Si estamos en el tutorial de casas, mostrar mensaje de Peluso
      if (state.showTutorial && state.currentMessage.includes('Entra en las casas')) {
        get().hideMessage();
        
        // Convertir la casa actual en una casa bloqueada PRIMERO
        const updatedCards = state.currentCards.map(c => 
          c.id === cardId 
            ? {
                ...c,
                image: '/images/puertabloqueada.png',
                effect: { type: 'blocked_house', value: 0 },
                isBlocked: true,
                clicksToUnlock: 10,
                currentClicks: 0,
                isBlockedHouse: true
              }
            : c
        );
        set({ currentCards: updatedCards });
        
        // Mostrar tutorial de casa bloqueada DESPUÉS
        setTimeout(() => {
          const { BEAR_MESSAGES } = require('@/config/characters');
          console.log('Mostrando mensaje de casa bloqueada:', BEAR_MESSAGES.TUTORIAL_BLOCKED_HOUSE);
          get().showBearGuide(BEAR_MESSAGES.TUTORIAL_BLOCKED_HOUSE);
        }, 500);
        
        return; // No continuar con la lógica normal de casa
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
            
            // Mostrar mensaje gracioso (NO tutorial, solo mensaje normal)
            let funnyMsg = '';
            if (hiddenItemType === CardType.FOOD) {
              funnyMsg = BEAR_MESSAGES.FOOD_FOUND;
            } else if (hiddenItemType === CardType.DRINK) {
              funnyMsg = BEAR_MESSAGES.DRINK_FOUND;
            } else if (hiddenItemType === CardType.MEDICINE) {
              funnyMsg = BEAR_MESSAGES.MEDICINE_FOUND;
            } else if (hiddenItemType === CardType.WEAPON) {
              funnyMsg = BEAR_MESSAGES.WEAPON_FOUND;
            } else if (hiddenItemType === CardType.CLOTHING) {
              funnyMsg = BEAR_MESSAGES.CLOTHING_FOUND;
            }
            
            if (funnyMsg) {
              // Mostrar como mensaje normal (NO tutorial, no pausa el juego)
              set({ currentMessage: funnyMsg, showMessage: true });
            }
      }
    } else if (card.effect.type === 'junk') {
      // Mensaje irónico
      const message = ironicMessages.junk[Math.floor(Math.random() * ironicMessages.junk.length)];
      set({ currentMessage: message, showMessage: true });
    }
    
    // Limpiar cartas
    set({ currentCards: [] });
  },
  
  // Spawn de zombi
  spawnZombie: () => {
    const state = get();
    const zombie: Zombie = {
      id: `zombie_${Date.now()}`,
      type: ZombieType.NORMAL,
      position: 5, // Empieza en la última casilla (5)
      speed: 1,
      health: 1,
      isMoving: true
    };
    
    set({ zombies: [...state.zombies, zombie] });
  },
  
  // Mover zombis
  moveZombies: () => {
    const state = get();
    const updatedZombies = state.zombies.map(zombie => ({
      ...zombie,
      position: Math.max(0, zombie.position - zombie.speed)
    }));
    
    // Verificar si algún zombi llegó al jugador
    const zombiesAtPlayer = updatedZombies.filter(z => z.position === 0);
    if (zombiesAtPlayer.length > 0) {
      get().setInfected(true);
      
      // Mensaje de Peluso cuando te contagias
      const msg = "¡Por los pelos! Si te contagia más vale que tengas una pastillita, sino empezará tu cuenta atrás...";
      get().showBearGuide(msg);
    }

    
    set({ zombies: updatedZombies });
  },
  
  // Matar zombi
  killZombie: (zombieId: string) => {
    const state = get();
    const updatedZombies = state.zombies.filter(z => z.id !== zombieId);
    const killedZombie = state.zombies.find(z => z.id === zombieId);
    
    if (killedZombie) {
      set({ 
        zombies: updatedZombies,
        stats: {
          ...state.stats,
          zombiesKilled: state.stats.zombiesKilled + 1
        }
      });
      
      // Mensaje de Peluso cuando matas un zombi
      const msg = "¡Bien! Un zombi menos. La población mundial te lo agradece... si es que queda alguien.";
      get().showBearGuide(msg);
    }
  },
  
  // Añadir al inventario
  addToInventory: (item: InventoryItem) => {
    const state = get();
    const existingItem = state.inventory.find(i => i.name === item.name);
    
    if (existingItem) {
      existingItem.quantity += item.quantity;
    } else {
      // Configurar usos limitados para bufanda
      const newItem = { ...item };
      if (item.name === 'Bufanda') {
        newItem.uses = 0;
        newItem.maxUses = 3;
      }
      state.inventory.push(newItem);
    }
    
    set({ inventory: [...state.inventory] });
  },
  
  // Usar item
  useItem: (itemId: string) => {
    const state = get();
    const item = state.inventory.find(i => i.id === itemId);
    
    if (!item || item.quantity <= 0) return;
    
    // Activar efecto de vuelo
    get().triggerFlyingItem(item.name);
    
    // Aplicar efecto del item
    if (item.type === ItemType.WEAPON) {
      // Usar bate para matar zombi
      const zombie = state.zombies[0]; // Zombi más cercano
      if (zombie) {
        get().killZombie(zombie.id);
        
        // Si estaba en tutorial de bate, cerrar el mensaje y reanudar
        if (state.showTutorial && state.currentMessage.includes('te regalo un bate')) {
          get().hideMessage();
          // Generar nuevas cartas después de usar el bate
          get().generateCards();
        }
      }
    } else if (item.type === ItemType.FOOD) {
      // Comer comida - restaurar hambre directamente (sin dificultad)
      const state = get();
      const newHunger = Math.min(100, state.hunger + 30);
      set({ hunger: newHunger });
      get().triggerCharacterEffect('eating');
      
      // Si es el tutorial de comida y usa la manzana, continuar con tutorial de casas
      if (item.name === 'Manzana' && state.showTutorial && state.currentMessage.includes('Toma, comida')) {
        get().hideMessage();
        // Continuar con el tutorial de casas
        setTimeout(() => {
          const { BEAR_MESSAGES } = require('@/config/characters');
          get().showBearGuide(BEAR_MESSAGES.TIP_HOUSES);
        }, 500);
      }
    } else if (item.type === ItemType.DRINK) {
      // Beber - restaurar sed directamente (sin dificultad)
      const state = get();
      const newThirst = Math.min(100, state.thirst + 30);
      set({ thirst: newThirst });
      get().triggerCharacterEffect('drinking');
    } else if (item.type === ItemType.MEDICINE) {
      // Tomar medicina - curar infección
      if (state.isInfected) {
        set({ isInfected: false });
      }
      get().updateHealth(20);
      get().triggerCharacterEffect('healing');
    } else if (item.type === ItemType.CLOTHING) {
      // Usar ropa - curar frío
      if (state.isCold) {
        set({ isCold: false });
      }
      
      // Si es el tutorial de bufanda y usa la bufanda, continuar con mensaje final
      if (item.name === 'Bufanda' && state.showTutorial && state.currentMessage.includes('bufanda del inventario')) {
        get().hideMessage();
        // Continuar con el mensaje final del tutorial
        setTimeout(() => {
          const { BEAR_MESSAGES } = require('@/config/characters');
          get().showBearGuide(BEAR_MESSAGES.TUTORIAL_FINAL);
        }, 500);
      }
    }
    
    // Lógica antigua del tutorial eliminada - ahora se maneja en tutorialStore
    
    // Lógica antigua del tutorial eliminada - ahora se maneja en tutorialStore
    
    // Reducir cantidad
    item.quantity -= 1;
    if (item.quantity <= 0) {
      state.inventory = state.inventory.filter(i => i.id !== itemId);
    }
    
    set({ 
      inventory: [...state.inventory],
      stats: {
        ...state.stats,
        itemsUsed: state.stats.itemsUsed + 1
      }
    });
  },
  
  // Actualizar hambre
  updateHunger: (value: number) => {
    const state = get();
    const currentDifficulty = getCurrentDifficulty(state.day);
    let adjustedValue = value * currentDifficulty;
    
    // Si está contagiado, hambre baja 3x más rápido
    if (state.isInfected && value < 0) {
      adjustedValue = adjustedValue * 3;
    }
    
    const newHunger = Math.max(0, Math.min(100, state.hunger + adjustedValue));
    set({ hunger: newHunger });
    
    if (newHunger < 30) {
      set({ currentMessage: "¡Tienes hambre! Busca comida antes de que sea tarde.", showMessage: true });
    }
  },
  
  // Actualizar sed
  updateThirst: (value: number) => {
    const state = get();
    const currentDifficulty = getCurrentDifficulty(state.day);
    let adjustedValue = value * currentDifficulty;
    
    // Si está contagiado, sed baja 3x más rápido
    if (state.isInfected && value < 0) {
      adjustedValue = adjustedValue * 3;
    }
    
    const newThirst = Math.max(0, Math.min(100, state.thirst + adjustedValue));
    set({ thirst: newThirst });
    
    if (newThirst < 30) {
      set({ currentMessage: "¡Tienes sed! Necesitas agua urgentemente.", showMessage: true });
    }
  },
  
  // Actualizar salud
  updateHealth: (value: number) => {
    const state = get();
    const newHealth = Math.max(0, Math.min(100, state.health + value));
    set({ health: newHealth });
    
    // Activar temblor si se recibe daño
    if (value < 0) {
      get().triggerShake();
    }
    
    if (newHealth <= 0) {
      get().endGame();
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
    set({ currentMessage: message, showMessage: true });
    
    // Ocultar mensaje después de 3 segundos
    setTimeout(() => {
      get().hideMessage();
    }, 3000);
  },
  
  // Ocultar mensaje
  hideMessage: () => {
    set({ showMessage: false, showTutorial: false });
  },
  
  // Activar efecto de temblor
  triggerShake: () => {
    set({ isShaking: true });
    setTimeout(() => {
      set({ isShaking: false });
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
  }
}));
