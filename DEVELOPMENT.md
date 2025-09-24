# 🛠️ Guía de Desarrollo - Un Día Más

## 📋 Estructura del Proyecto

```
un-dia-mas/
├── src/
│   ├── app/                    # App Router de Next.js
│   │   ├── layout.tsx         # Layout principal
│   │   ├── page.tsx           # Página principal
│   │   └── globals.css        # Estilos globales
│   ├── components/            # Componentes React
│   │   ├── Game/              # Componentes del juego
│   │   │   ├── GameBoard.tsx  # Tablero principal
│   │   │   ├── StatusBars.tsx # Barras de estado
│   │   │   ├── Character.tsx  # Personaje
│   │   │   ├── CardDeck.tsx   # Mazo de cartas
│   │   │   ├── ZombieField.tsx # Campo de zombis
│   │   │   ├── Inventory.tsx  # Inventario
│   │   │   ├── GameHUD.tsx    # HUD del juego
│   │   │   └── GameMessage.tsx # Mensajes
│   │   └── UI/                # Componentes de interfaz
│   ├── hooks/                 # Hooks personalizados
│   │   └── useGameTimer.ts    # Timer del juego
│   ├── store/                 # Estado global
│   │   └── gameStore.ts       # Store de Zustand
│   ├── types/                 # Tipos de TypeScript
│   │   └── game.ts            # Tipos del juego
│   └── utils/                 # Utilidades
├── public/                    # Archivos estáticos
│   └── manifest.json          # PWA manifest
├── docu/                      # Documentación
│   └── UN_DIA_MAS_ESPECIFICACION.md
└── config.example.js          # Configuración de ejemplo
```

## 🎮 Flujo del Juego

### 1. Inicialización
- El usuario hace clic en "Empezar a Sobrevivir"
- Se inicializa el estado del juego
- Se genera el primer conjunto de cartas
- Se inicia el timer del juego

### 2. Loop Principal
- Cada 5 segundos se avanza 1 hora
- Se generan nuevas cartas cada hora
- Los zombis se mueven cada turno
- Se actualizan las barras de estado

### 3. Interacciones
- **Cartas**: El usuario selecciona una carta en 5 segundos
- **Zombis**: El usuario hace clic en un zombi para usar un bate
- **Inventario**: El usuario hace clic en un objeto para usarlo

### 4. Estados del Personaje
- **Normal**: Estado base
- **Hambriento**: Hambre < 30%
- **Sediento**: Sed < 30%
- **Infectado**: Un zombi te ha tocado
- **Frío**: No tienes bufanda de noche

## 🔧 Componentes Principales

### GameBoard
- Componente principal que orquesta todo el juego
- Maneja el estado general y los efectos visuales
- Contiene todos los subcomponentes

### StatusBars
- Muestra las barras de hambre, sed y salud
- Cambia de color según el nivel
- Incluye estados especiales (infección, frío)

### Character
- Representa al personaje del jugador
- Cambia de emoji según el estado
- Tiene animaciones según la condición

### CardDeck
- Muestra las 3 cartas del turno
- Timer de 5 segundos para elegir
- Efectos visuales al seleccionar

### ZombieField
- Campo de 6 casillas donde aparecen los zombis
- Los zombis avanzan hacia el jugador
- Interacción para eliminar zombis

### Inventory
- Muestra los objetos acumulados
- Permite usar objetos haciendo clic
- Contador de cantidad por objeto

## 🎨 Efectos Visuales

### Efectos de Pantalla
- **Hambre**: Filtro rojizo
- **Sed**: Filtro borroso
- **Infección**: Filtro verde psicodélico
- **Frío**: Filtro oscuro

### Animaciones
- **Personaje**: Animaciones según el estado
- **Cartas**: Animaciones de entrada/salida
- **Zombis**: Movimiento hacia el jugador
- **Mensajes**: Animaciones de aparición

## 🎯 Lógica del Juego

### Sistema de Tiempo
```typescript
// Cada 5 segundos reales = 1 hora del juego
const timePerHour = 5000;

// Avanzar tiempo
const advanceTime = () => {
  let newHour = hour;
  let newMinute = minute + 1;
  let newDay = day;
  
  if (newMinute >= 60) {
    newMinute = 0;
    newHour += 1;
  }
  
  if (newHour >= 24) {
    newHour = 0;
    newDay += 1;
  }
};
```

### Sistema de Cartas
```typescript
// Generar cartas aleatorias
const generateCards = () => {
  const cards = [];
  const cardTypes = Object.keys(cardData);
  
  for (let i = 0; i < 3; i++) {
    const randomType = cardTypes[Math.floor(Math.random() * cardTypes.length)];
    const typeData = cardData[randomType];
    const randomCard = typeData[Math.floor(Math.random() * typeData.length)];
    
    cards.push({
      id: `${randomType}_${Date.now()}_${i}`,
      type: randomType,
      name: randomCard.name,
      emoji: randomCard.emoji,
      effect: randomCard.effect
    });
  }
  
  setCurrentCards(cards);
};
```

### Sistema de Zombis
```typescript
// Spawn de zombis
const spawnZombie = () => {
  const zombie = {
    id: `zombie_${Date.now()}`,
    type: 'normal',
    position: 5, // Empieza en la última casilla
    speed: 1,
    health: 1
  };
  
  setZombies([...zombies, zombie]);
};

// Movimiento de zombis
const moveZombies = () => {
  const updatedZombies = zombies.map(zombie => ({
    ...zombie,
    position: Math.max(0, zombie.position - zombie.speed)
  }));
  
  setZombies(updatedZombies);
};
```

## 🎨 Personalización

### Colores
Los colores están definidos en `tailwind.config.js`:
```javascript
colors: {
  'apocalypse': {
    'dark': '#0b132b',
    'medium': '#13315c',
    'light': '#1e3a8a',
    'accent': '#ffd447',
    'secondary': '#7cf5ff',
    'danger': '#ff6bcb',
  }
}
```

### Mensajes
Los mensajes irónicos están en `gameStore.ts`:
```typescript
const ironicMessages = {
  junk: [
    "¡Cuac! Muy útil... para nada.",
    "Yo no juego con esas cosas...",
    // ...
  ],
  milestones: [
    "¡Felicidades! Has sobrevivido un día completo.",
    "Dos días seguidos... ¿Eres inmortal o qué?",
    // ...
  ]
};
```

## 📱 Optimización Móvil

### Responsive Design
- Grid responsive para cartas
- Tamaños de fuente adaptativos
- Touch targets de 44px mínimo

### PWA
- Manifest.json configurado
- Service worker para caché
- Instalable en móvil

### Capacitor
- Configuración para APK
- Plugins para splash screen
- Optimización para Android

## 🚀 Despliegue

### Desarrollo
```bash
npm run dev
```

### Producción Web
```bash
npm run build
npm start
```

### APK Android
```bash
npm run build:mobile
npm run sync
npm run android
```

## 🐛 Debugging

### Herramientas
- React DevTools
- Zustand DevTools
- Next.js DevTools

### Logs
- Console.log en acciones importantes
- Estado del juego en DevTools
- Errores de TypeScript

## 📝 Próximas Mejoras

### Funcionalidades
- [ ] Sistema de crafting
- [ ] Más tipos de zombis
- [ ] Eventos especiales
- [ ] Ranking global

### Técnicas
- [ ] Tests unitarios
- [ ] Tests de integración
- [ ] Optimización de performance
- [ ] Mejoras de accesibilidad

---

**¡Happy coding!** 🚀
