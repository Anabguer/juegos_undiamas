import { create } from 'zustand';
import { GameState, Card, Zombie, InventoryItem, GameStats, CardType, ItemType, ZombieType } from '@/types/game';

// Estado inicial del juego
const initialState: GameState = {
  hunger: 100,
  thirst: 100,
  health: 100,
  isInfected: false,
  isCold: false,
  
  day: 1,
  hour: 8,
  minute: 0,
  
  isPlaying: false,
  isPaused: false,
  gameOver: false,
  showItemSelection: false,
  showManual: false,
  showInventorySummary: false,
  showHelp: false,
  
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

// Datos de las cartas
const cardData = {
  [CardType.FOOD]: [
    { name: 'Manzana', emoji: '🍏', image: '/images/apple.png', effect: { type: 'hunger', value: 30 } },
    { name: 'Pollo', emoji: '🍗', image: '/images/chicken.png', effect: { type: 'hunger', value: 50 } },
    { name: 'Patatas', emoji: '🍟', image: '/images/chips.png', effect: { type: 'hunger', value: 40 } }
  ],
  [CardType.DRINK]: [
    { name: 'Agua', emoji: '💧', image: '/images/water.png', effect: { type: 'thirst', value: 40 } },
    { name: 'Zumo', emoji: '🥤', image: '/images/juice.png', effect: { type: 'thirst', value: 30 } },
    { name: 'Refresco', emoji: '🥫', image: '/images/soda.png', effect: { type: 'thirst', value: 35 } }
  ],
  [CardType.MEDICINE]: [
    { name: 'Antídoto', emoji: '💉', image: '/images/antidote.png', effect: { type: 'infection', value: 100 } },
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
    { name: 'Osito', emoji: '🧸', image: '/images/plush.png', effect: { type: 'junk', value: 0 } },
    { name: 'CD', emoji: '💿', image: '/images/cd.png', effect: { type: 'junk', value: 0 } },
    { name: 'Sombrero', emoji: '🎩', image: '/images/hat.png', effect: { type: 'junk', value: 0 } },
    { name: 'Pelota', emoji: '⚽', image: '/images/ball.png', effect: { type: 'junk', value: 0 } }
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
  pauseGame: () => void;
  resumeGame: () => void;
  endGame: () => void;
  
  // Tiempo
  advanceTime: () => void;
  
  // Cartas
  generateCards: () => void;
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
  showMessage: (message: string) => void;
  hideMessage: () => void;
  
  // Utilidades
  resetGame: () => void;
}>((set, get) => ({
  ...initialState,
  
  // Acciones del juego
  startGame: () => {
    set({ isPlaying: true, gameOver: false, showItemSelection: false });
    get().generateCards();
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
  
  pauseGame: () => set({ isPaused: true }),
  
  resumeGame: () => set({ isPaused: false }),
  
  endGame: () => {
    const state = get();
    set({ 
      isPlaying: false, 
      gameOver: true,
      stats: {
        ...state.stats,
        bestDay: Math.max(state.stats.bestDay, state.day)
      }
    });
  },
  
  // Avanzar tiempo
  advanceTime: () => {
    const state = get();
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
    
    set({ 
      hour: newHour, 
      minute: newMinute, 
      day: newDay 
    });
    
    // Generar cartas cada hora
    if (newMinute === 0) {
      get().generateCards();
    }
    
    // Spawn de zombis
    if (Math.random() < gameConfig.zombieSpawnRate) {
      get().spawnZombie();
    }
    
    // Mover zombis
    get().moveZombies();
  },
  
  // Generar cartas
  generateCards: () => {
    const cards: Card[] = [];
    const cardTypes = Object.keys(cardData) as CardType[];
    
    for (let i = 0; i < gameConfig.cardsPerTurn; i++) {
      const randomType = cardTypes[Math.floor(Math.random() * cardTypes.length)];
      const typeData = cardData[randomType];
      const randomCard = typeData[Math.floor(Math.random() * typeData.length)];
      
      cards.push({
        id: `${randomType}_${Date.now()}_${i}`,
        type: randomType,
        name: randomCard.name,
        emoji: randomCard.emoji,
        image: randomCard.image,
        description: `Efecto: ${randomCard.effect.type}`,
        effect: randomCard.effect,
        rarity: 'common' as any
      });
    }
    
    set({ currentCards: cards });
  },
  
  // Seleccionar carta
  selectCard: (cardId: string) => {
    const state = get();
    const card = state.currentCards.find(c => c.id === cardId);
    
    if (!card) return;
    
    // Aplicar efecto de la carta
    if (card.effect.type === 'hunger') {
      get().updateHunger(card.effect.value);
    } else if (card.effect.type === 'thirst') {
      get().updateThirst(card.effect.value);
    } else if (card.effect.type === 'infection') {
      get().setInfected(false);
    } else if (card.effect.type === 'cold') {
      get().setCold(false);
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
      position: 5, // Empieza en la última casilla
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
      set({ currentMessage: "El zombi te atrapó. ¿No viste que se acercaba?", showMessage: true });
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
      
      set({ currentMessage: "Un zombi menos. La población mundial te lo agradece.", showMessage: true });
    }
  },
  
  // Añadir al inventario
  addToInventory: (item: InventoryItem) => {
    const state = get();
    const existingItem = state.inventory.find(i => i.name === item.name);
    
    if (existingItem) {
      existingItem.quantity += item.quantity;
    } else {
      state.inventory.push(item);
    }
    
    set({ inventory: [...state.inventory] });
  },
  
  // Usar item
  useItem: (itemId: string) => {
    const state = get();
    const item = state.inventory.find(i => i.id === itemId);
    
    if (!item || item.quantity <= 0) return;
    
    // Aplicar efecto del item
    if (item.type === ItemType.WEAPON) {
      // Usar bate para matar zombi
      const zombie = state.zombies[0]; // Zombi más cercano
      if (zombie) {
        get().killZombie(zombie.id);
      }
    }
    
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
    const newHunger = Math.max(0, Math.min(100, state.hunger + value));
    set({ hunger: newHunger });
    
    if (newHunger < 30) {
      set({ currentMessage: "¡Tienes hambre! Busca comida antes de que sea tarde.", showMessage: true });
    }
  },
  
  // Actualizar sed
  updateThirst: (value: number) => {
    const state = get();
    const newThirst = Math.max(0, Math.min(100, state.thirst + value));
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
    
    if (newHealth <= 0) {
      get().endGame();
    }
  },
  
  // Establecer infección
  setInfected: (infected: boolean) => {
    set({ isInfected: infected });
    
    if (infected) {
      set({ currentMessage: "Te sientes raro... ¿Será el apocalipsis o algo más?", showMessage: true });
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
  showMessage: (message: string) => {
    set({ currentMessage: message, showMessage: true });
    
    // Ocultar mensaje después de 3 segundos
    setTimeout(() => {
      get().hideMessage();
    }, 3000);
  },
  
  // Ocultar mensaje
  hideMessage: () => {
    set({ showMessage: false });
  },
  
  // Reiniciar juego
  resetGame: () => {
    set(initialState);
  }
}));
