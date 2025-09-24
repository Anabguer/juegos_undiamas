// Tipos principales del juego

export interface GameState {
  // Estado del personaje
  hunger: number;      // 0-100
  thirst: number;      // 0-100
  health: number;      // 0-100
  isInfected: boolean;
  isCold: boolean;
  
  // Tiempo del juego
  day: number;
  hour: number;
  minute: number;
  
  // Estado del juego
  isPlaying: boolean;
  isPaused: boolean;
  gameOver: boolean;
  showItemSelection: boolean;
  
  // Inventario
  inventory: InventoryItem[];
  
  // Zombis
  zombies: Zombie[];
  
  // Cartas actuales
  currentCards: Card[];
  
  // Mensajes
  currentMessage: string;
  showMessage: boolean;
  
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
  ZOMBIE = 'zombie'
}

export enum ZombieType {
  SLOW = 'slow',
  NORMAL = 'normal',
  FAST = 'fast',
  RESISTANT = 'resistant'
}

export enum CardRarity {
  COMMON = 'common',
  UNCOMMON = 'uncommon',
  RARE = 'rare',
  EPIC = 'epic'
}

export interface CardEffect {
  type: 'hunger' | 'thirst' | 'health' | 'infection' | 'cold' | 'zombie' | 'junk';
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
