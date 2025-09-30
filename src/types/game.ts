// Tipos principales del juego

export interface GameState {
  // Estado del personaje
  hunger: number;      // 0-100
  thirst: number;      // 0-100
  health: number;      // 0-100
  isInfected: boolean;
  isCold: boolean;
  isShaking: boolean;
  scarfUsedTonight: boolean;
  flyingItem: string | null;
  flyingItemType: 'from_inventory' | 'from_bear' | null;
  zombieDeathEffect: {
    zombieId: string;
    position: number;
    isActive: boolean;
  } | null;
  characterEffect: 'drinking' | 'eating' | 'healing' | null;
  
  // Tiempo del juego
  day: number;
  hour: number;
  minute: number;
  isNight: boolean;
  
  // Estado del juego
  isPlaying: boolean;
  isPaused: boolean;
  gameOver: boolean;
  showItemSelection: boolean;
  showManual: boolean;
  showInventorySummary: boolean;
  showHelp: boolean;
  showItemFoundModal: boolean;
  foundItemName: string;
  foundItemImage: string;
  showInfoModal: boolean;
  infoTitle: string;
  infoMessage: string;
  showTutorial: boolean;
  tutorialMessage: string;
  skipTutorial: boolean;
  tutorialPhase: 'welcome' | 'food' | 'houses' | 'blocked_house_message' | 'blocked_house_modal' | 'zombie_warning' | 'bat_gift' | 'zombie_kill' | 'cold_night' | 'final' | 'completed' | null;
  gameEnding?: GameEnding;
  
  // Inventario
  inventory: InventoryItem[];
  
  // Zombis
  zombies: Zombie[];
  lastZombieSpawnHour: number;
  
  // Cartas actuales
  currentCards: Card[];
  
  // Mensajes
  currentMessage: string;
  showMessage: boolean;
  shownMessages: Set<string>;
  
  // Animación de transición de día
  showDayTransition: boolean;
  transitionDay: number; // Para evitar mensajes repetidos
  
  // Modal de casa bloqueada
  showBlockedHouseModal: boolean;
  blockedHouseCardId: string | null;
  blockedHouseClicks: number;
  blockedHouseTimeout: NodeJS.Timeout | null;
  
  // Tutorial eliminado
  
  // Estadísticas
  stats: GameStats;
}

export interface InventoryItem {
  id: string;
  type: ItemType;
  name: string;
  emoji: string;
  image?: string;
  quantity: number;
  description: string;
  uses?: number; // Para items con usos limitados
  maxUses?: number; // Máximo de usos
}

export interface Card {
  id: string;
  type: CardType;
  name: string;
  emoji: string;
  image?: string;
  description: string;
  effect: CardEffect;
  rarity: CardRarity;
  // Para casas
  houseImage?: string;
  isBlocked?: boolean;
  clicksToUnlock?: number;
  currentClicks?: number;
  isRevealed?: boolean;
  hiddenItemType?: CardType; // Item oculto dentro de la casa
  isBlockedHouse?: boolean; // Si esta casa será bloqueada al hacer clic
}

export interface Zombie {
  id: string;
  type: ZombieType;
  position: number; // 0-5 (casillas)
  speed: number;
  health: number;
  isMoving: boolean;
}

export interface GameStats {
  daysSurvived: number;
  zombiesKilled: number;
  itemsUsed: number;
  bestDay: number;
  totalPlayTime: number;
}

export interface GameEnding {
  type: GameEndingType;
  title: string;
  message: string;
  image: string;
  isGood: boolean;
}

// Enums
export enum ItemType {
  FOOD = 'food',
  DRINK = 'drink',
  MEDICINE = 'medicine',
  CLOTHING = 'clothing',
  WEAPON = 'weapon',
  JUNK = 'junk'
}

export enum CardType {
  FOOD = 'food',
  DRINK = 'drink',
  MEDICINE = 'medicine',
  CLOTHING = 'clothing',
  WEAPON = 'weapon',
  JUNK = 'junk',
  ZOMBIE = 'zombie',
  HOUSE = 'house',
  BLOCKED_HOUSE = 'blocked_house'
}

export enum ZombieType {
  SLOW = 'slow',
  NORMAL = 'normal',
  FAST = 'fast',
  RESISTANT = 'resistant'
}

export enum GameEndingType {
  HUNGER = 'hunger',
  THIRST = 'thirst',
  COLD = 'cold',
  ZOMBIE = 'zombie',
  ABSURD = 'absurd'
}

export enum CardRarity {
  COMMON = 'common',
  UNCOMMON = 'uncommon',
  RARE = 'rare',
  EPIC = 'epic'
}

export interface CardEffect {
  type: 'hunger' | 'thirst' | 'health' | 'infection' | 'cold' | 'zombie' | 'junk' | 'house' | 'blocked_house';
  value: number;
  duration?: number; // en horas
}

// Configuración del juego
export interface GameConfig {
  timePerHour: number; // segundos reales por hora del juego
  cardsPerTurn: number;
  cardDisplayTime: number; // segundos
  zombieSpawnRate: number; // probabilidad por turno
  difficultyMultiplier: number; // multiplicador por día
}

// Mensajes del juego
export interface GameMessage {
  id: string;
  text: string;
  type: 'info' | 'warning' | 'success' | 'error' | 'ironic';
  duration: number; // milisegundos
}

// Eventos del juego
export interface GameEvent {
  type: 'card_selected' | 'zombie_spawned' | 'zombie_killed' | 'item_used' | 'day_completed' | 'game_over';
  data: any;
  timestamp: number;
}
