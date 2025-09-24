# 🎨 ESTRUCTURA CSS PARA HOSTALIA - MEMOFLIP NEO

## 📋 ESTRUCTURA DE ARCHIVOS CSS

```
css/
├── main.css                    # Estilos principales y variables
├── reset.css                   # Reset CSS base
├── components/                 # Componentes reutilizables
│   ├── cards.css              # Estilos de cartas
│   ├── screens.css            # Estilos de pantallas
│   ├── modals.css             # Estilos de modales
│   ├── buttons.css            # Estilos de botones
│   ├── hud.css                # Estilos del HUD
│   └── animations.css          # Animaciones base
├── themes/                     # Temas del juego
│   ├── ocean.css              # Tema océano
│   ├── candy.css              # Tema caramelo
│   └── space.css              # Tema espacio
├── mechanics/                  # Estilos de mecánicas
│   ├── basic.css              # Mecánicas básicas
│   ├── special.css            # Mecánicas especiales
│   └── boss.css               # Mecánicas de jefe
├── responsive/                 # Media queries
│   ├── mobile.css             # Móvil (320px-768px)
│   ├── tablet.css             # Tablet (768px-1024px)
│   └── desktop.css            # Desktop (1024px+)
└── utilities/                  # Utilidades
    ├── spacing.css            # Espaciado
    ├── typography.css         # Tipografía
    └── helpers.css            # Clases helper
```

## 🎨 VARIABLES CSS PRINCIPALES

### main.css
```css
:root {
  /* Colores base */
  --color-primary: #ffd447;
  --color-secondary: #7cf5ff;
  --color-accent: #ff6bcb;
  --color-success: #4caf50;
  --color-warning: #ff9800;
  --color-error: #f44336;
  --color-info: #2196f3;
  
  /* Colores de fondo */
  --bg-primary: #0b132b;
  --bg-secondary: #13315c;
  --bg-card: #ffffff;
  --bg-overlay: rgba(0, 0, 0, 0.7);
  
  /* Colores de texto */
  --text-primary: #ffffff;
  --text-secondary: #cccccc;
  --text-muted: #888888;
  --text-dark: #333333;
  
  /* Espaciado */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;
  --spacing-xxl: 3rem;
  
  /* Tipografía */
  --font-family-primary: 'Roboto', 'Arial', sans-serif;
  --font-family-display: 'Roboto', 'Arial', sans-serif;
  --font-size-xs: 0.75rem;
  --font-size-sm: 0.875rem;
  --font-size-md: 1rem;
  --font-size-lg: 1.125rem;
  --font-size-xl: 1.25rem;
  --font-size-xxl: 1.5rem;
  --font-size-display: 2rem;
  
  /* Bordes */
  --border-radius-sm: 0.25rem;
  --border-radius-md: 0.5rem;
  --border-radius-lg: 1rem;
  --border-radius-xl: 1.5rem;
  --border-radius-full: 50%;
  
  /* Sombras */
  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.12);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.16);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.2);
  --shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.25);
  
  /* Transiciones */
  --transition-fast: 0.15s ease;
  --transition-normal: 0.3s ease;
  --transition-slow: 0.5s ease;
  
  /* Z-index */
  --z-dropdown: 1000;
  --z-sticky: 1020;
  --z-fixed: 1030;
  --z-modal-backdrop: 1040;
  --z-modal: 1050;
  --z-popover: 1060;
  --z-tooltip: 1070;
  
  /* Breakpoints */
  --breakpoint-mobile: 320px;
  --breakpoint-tablet: 768px;
  --breakpoint-desktop: 1024px;
  --breakpoint-wide: 1440px;
}
```

## 🃏 ESTILOS DE CARTAS

### components/cards.css
```css
/* Contenedor de cartas */
.card-grid {
  display: grid;
  gap: var(--spacing-md);
  padding: var(--spacing-lg);
  justify-content: center;
  align-items: center;
  min-height: 400px;
}

/* Grid responsive */
.card-grid--2x2 { grid-template-columns: repeat(2, 1fr); }
.card-grid--3x2 { grid-template-columns: repeat(3, 1fr); }
.card-grid--4x3 { grid-template-columns: repeat(4, 1fr); }
.card-grid--5x4 { grid-template-columns: repeat(5, 1fr); }
.card-grid--6x4 { grid-template-columns: repeat(6, 1fr); }

/* Carta individual */
.card {
  position: relative;
  width: 100%;
  height: 120px;
  cursor: pointer;
  transform-style: preserve-3d;
  transition: transform var(--transition-normal);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-md);
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.card:active {
  transform: translateY(0);
}

/* Estados de la carta */
.card.flip {
  transform: rotateY(180deg);
}

.card.matched {
  opacity: 0.7;
  transform: scale(0.95);
  pointer-events: none;
}

.card.disabled {
  pointer-events: none;
  opacity: 0.5;
}

/* Caras de la carta */
.card-face {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  border-radius: var(--border-radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--font-size-xl);
  font-weight: bold;
  color: var(--text-dark);
  background: linear-gradient(145deg, #ffffff, #f0f0f0);
  border: 2px solid var(--color-primary);
}

.card-face--back {
  transform: rotateY(180deg);
  background: linear-gradient(145deg, var(--color-primary), #ffed4e);
}

/* Efectos de mecánicas */
.card--fog {
  filter: blur(2px);
  opacity: 0.7;
}

.card--ghost {
  animation: ghost-fade 2s infinite;
}

.card--frozen {
  filter: grayscale(100%);
  pointer-events: none;
}

.card--bomb {
  animation: bomb-pulse 1s infinite;
}

.card--mirror {
  transform: scaleX(-1);
}

.card--rotation {
  animation: card-rotate 3s infinite linear;
}

/* Animaciones de mecánicas */
@keyframes ghost-fade {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 1; }
}

@keyframes bomb-pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

@keyframes card-rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
```

## 🖥️ ESTILOS DE PANTALLAS

### components/screens.css
```css
/* Contenedor de pantallas */
.screen-container {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background: linear-gradient(135deg, var(--bg-primary), var(--bg-secondary));
}

/* Pantalla individual */
.screen {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: none;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-lg);
  opacity: 0;
  transform: translateY(20px);
  transition: all var(--transition-normal);
}

.screen.active {
  display: flex;
  opacity: 1;
  transform: translateY(0);
}

/* Pantalla de inicio */
.screen--intro {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  text-align: center;
}

.screen--intro .logo {
  max-width: 200px;
  height: auto;
  margin-bottom: var(--spacing-xl);
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
  animation: logo-glow 2s ease-in-out infinite alternate;
}

.screen--intro .title {
  font-size: var(--font-size-display);
  font-weight: bold;
  color: var(--text-primary);
  margin-bottom: var(--spacing-lg);
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}

.screen--intro .subtitle {
  font-size: var(--font-size-lg);
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: var(--spacing-xxl);
  line-height: 1.6;
}

/* Pantalla de juego */
.screen--game {
  background: linear-gradient(135deg, var(--bg-primary), var(--bg-secondary));
  position: relative;
}

.screen--game .game-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 1200px;
}

/* Pantalla de selección de niveles */
.screen--levels {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: var(--spacing-lg);
}

.screen--levels .levels-container {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border-radius: var(--border-radius-xl);
  padding: var(--spacing-xxl);
  box-shadow: var(--shadow-xl);
  border: 2px solid rgba(255, 255, 255, 0.2);
  max-width: 800px;
  width: 100%;
}

.screen--levels .levels-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-xl);
  max-height: 400px;
  overflow-y: auto;
  padding: var(--spacing-sm);
}

/* Animaciones de pantalla */
@keyframes logo-glow {
  0% { filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3)) drop-shadow(0 0 10px rgba(255, 212, 71, 0.3)); }
  100% { filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3)) drop-shadow(0 0 20px rgba(255, 212, 71, 0.6)); }
}
```

## 🎭 ESTILOS DE MECÁNICAS

### mechanics/basic.css
```css
/* Mecánica de niebla */
.mechanic-fog {
  position: relative;
}

.mechanic-fog::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.1) 50%, transparent 70%);
  animation: fog-drift 3s infinite linear;
  pointer-events: none;
  z-index: 1;
}

@keyframes fog-drift {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

/* Mecánica de barajar */
.mechanic-shuffle .card {
  animation: shuffle-bounce 0.5s ease-in-out;
}

@keyframes shuffle-bounce {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  25% { transform: translateY(-10px) rotate(-5deg); }
  75% { transform: translateY(-5px) rotate(5deg); }
}

/* Mecánica de cronómetro */
.mechanic-timer {
  position: relative;
}

.mechanic-timer::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(90deg, transparent 0%, rgba(255, 0, 0, 0.1) 50%, transparent 100%);
  animation: timer-sweep 1s infinite linear;
  pointer-events: none;
  z-index: 1;
}

@keyframes timer-sweep {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}
```

## 📱 RESPONSIVE DESIGN

### responsive/mobile.css
```css
@media (max-width: 767px) {
  /* Ajustes para móvil */
  .card {
    height: 80px;
    font-size: var(--font-size-md);
  }
  
  .card-grid {
    gap: var(--spacing-sm);
    padding: var(--spacing-md);
  }
  
  .card-grid--4x3 { grid-template-columns: repeat(3, 1fr); }
  .card-grid--5x4 { grid-template-columns: repeat(4, 1fr); }
  .card-grid--6x4 { grid-template-columns: repeat(4, 1fr); }
  
  .screen--intro .title {
    font-size: var(--font-size-xl);
  }
  
  .screen--intro .subtitle {
    font-size: var(--font-size-md);
  }
  
  .screen--levels .levels-container {
    padding: var(--spacing-lg);
  }
  
  .screen--levels .levels-grid {
    grid-template-columns: repeat(auto-fill, minmax(60px, 1fr));
    gap: var(--spacing-sm);
  }
}

@media (max-width: 480px) {
  .card {
    height: 60px;
    font-size: var(--font-size-sm);
  }
  
  .card-grid--3x2 { grid-template-columns: repeat(2, 1fr); }
  .card-grid--4x3 { grid-template-columns: repeat(3, 1fr); }
  .card-grid--5x4 { grid-template-columns: repeat(3, 1fr); }
  .card-grid--6x4 { grid-template-columns: repeat(3, 1fr); }
}
```

### responsive/tablet.css
```css
@media (min-width: 768px) and (max-width: 1023px) {
  .card {
    height: 100px;
  }
  
  .card-grid {
    gap: var(--spacing-md);
    padding: var(--spacing-lg);
  }
  
  .screen--intro .title {
    font-size: 2.5rem;
  }
  
  .screen--levels .levels-grid {
    grid-template-columns: repeat(auto-fill, minmax(70px, 1fr));
  }
}
```

### responsive/desktop.css
```css
@media (min-width: 1024px) {
  .card {
    height: 120px;
  }
  
  .card-grid {
    gap: var(--spacing-lg);
    padding: var(--spacing-xl);
  }
  
  .screen--intro .title {
    font-size: 3rem;
  }
  
  .screen--levels .levels-grid {
    grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  }
}
```

## 🎨 TEMAS DEL JUEGO

### themes/ocean.css
```css
.theme-ocean {
  --bg-primary: #0b132b;
  --bg-secondary: #13315c;
  --color-primary: #ffd447;
  --color-secondary: #7cf5ff;
  --color-accent: #ff6bcb;
}

.theme-ocean .card-face {
  background: linear-gradient(145deg, #ffffff, #e3f2fd);
  border-color: var(--color-primary);
}

.theme-ocean .card-face--back {
  background: linear-gradient(145deg, var(--color-primary), #ffed4e);
}

.theme-ocean .screen--game {
  background: linear-gradient(135deg, var(--bg-primary), var(--bg-secondary));
}

.theme-ocean .particles {
  background: radial-gradient(circle at 30% 30%, var(--color-primary), transparent);
}
```

### themes/candy.css
```css
.theme-candy {
  --bg-primary: #2d1b69;
  --bg-secondary: #8e44ad;
  --color-primary: #ff6bcb;
  --color-secondary: #ffd447;
  --color-accent: #7cf5ff;
}

.theme-candy .card-face {
  background: linear-gradient(145deg, #ffffff, #fce4ec);
  border-color: var(--color-primary);
}

.theme-candy .card-face--back {
  background: linear-gradient(145deg, var(--color-primary), #ff8a95);
}

.theme-candy .screen--game {
  background: linear-gradient(135deg, var(--bg-primary), var(--bg-secondary));
}

.theme-candy .particles {
  background: radial-gradient(circle at 30% 30%, var(--color-primary), transparent);
}
```

## 🎯 OPTIMIZACIONES PARA HOSTALIA

### 1. Minificación
```bash
# Minificar CSS para producción
cssnano main.css main.min.css
```

### 2. Compresión
```css
/* Usar variables CSS para reducir tamaño */
:root {
  --c1: #ffd447;
  --c2: #7cf5ff;
  --c3: #ff6bcb;
}
```

### 3. Critical CSS
```css
/* Cargar estilos críticos inline */
<style>
  .screen { display: none; }
  .screen.active { display: flex; }
  .card { position: relative; }
</style>
```

### 4. Lazy Loading
```css
/* Cargar estilos de mecánicas solo cuando se necesiten */
.mechanic-fog { /* ... */ }
.mechanic-bomb { /* ... */ }
```

## 📝 NOTAS IMPORTANTES

1. **Compatibilidad**: Usar prefijos para navegadores antiguos
2. **Rendimiento**: Minimizar reflows y repaints
3. **Accesibilidad**: Contraste adecuado y focus visible
4. **Móvil**: Touch targets de al menos 44px
5. **Hostalia**: Rutas relativas y optimización de carga

---

*Estructura CSS creada para MemoFlip Neo*
*Optimizada para Hostalia y dispositivos móviles*
