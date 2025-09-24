# 🧟 Un Día Más - Juego de Supervivencia

Un juego de supervivencia arcade con humor irónico donde el objetivo es sobrevivir el máximo número de días posible en un mundo apocalíptico.

## 🎮 Características

- **Sistema de supervivencia**: Gestiona hambre, sed y salud
- **Cartas por turno**: Toma decisiones rápidas cada 5 segundos
- **Zombis**: Elimina zombis que se acercan con bates
- **Inventario**: Acumula y usa objetos estratégicamente
- **Efectos visuales**: La pantalla cambia según el estado del personaje
- **Mensajes irónicos**: Humor gracioso en cada acción
- **Dificultad progresiva**: Cada día es más difícil

## 🚀 Tecnologías

- **Next.js 14** con App Router
- **TypeScript** para tipado estático
- **Tailwind CSS** para estilos
- **Framer Motion** para animaciones
- **Zustand** para estado global
- **PWA** para móvil

## 📱 Instalación y Uso

### Desarrollo

```bash
# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev

# Abrir en el navegador
http://localhost:3000
```

### Producción

```bash
# Construir para producción
npm run build

# Ejecutar en producción
npm start
```

## 🎯 Cómo Jugar

1. **Inicia el juego** haciendo clic en "Empezar a Sobrevivir"
2. **Gestiona tus barras** de hambre, sed y salud
3. **Elige cartas** cada turno (tienes 5 segundos)
4. **Elimina zombis** usando bates del inventario
5. **Sobrevive** el máximo número de días posible

## 🎨 Mecánicas del Juego

### Sistema de Tiempo
- Cada 5 segundos reales = 1 hora del juego
- Día (08:00-20:00) y Noche (20:00-08:00)
- Efectos diferentes según la hora

### Barras de Estado
- **🍎 Hambre**: Baja con el tiempo, restaura con comida
- **💧 Sed**: Baja con el tiempo, restaura con bebida
- **❤️ Salud**: Baja cuando hambre/sed llegan a 0

### Cartas
- **Comida**: Manzana, Pollo, Patatas
- **Bebida**: Agua, Zumo, Refresco
- **Medicina**: Antídoto (cura infección)
- **Ropa**: Bufanda (protege del frío)
- **Armas**: Bate (elimina zombis)
- **Basura**: Objetos inútiles con mensajes graciosos

### Zombis
- Aparecen en casillas laterales
- Avanzan hacia el jugador cada turno
- Si te tocan, te infectan
- Usa bates para eliminarlos

## 🎭 Efectos Visuales

- **Hambre**: Pantalla rojiza
- **Sed**: Pantalla borrosa
- **Infección**: Pantalla psicodélica verde
- **Frío**: Personaje tiritando
- **Día/Noche**: Cambio de fondo

## 📊 Progresión

- **Día 1**: Fácil, zombis lentos
- **Día 2**: Media, zombis normales
- **Día 3**: Difícil, zombis rápidos
- **Día 4+**: Muy difícil, múltiples zombis

## 🛠️ Estructura del Proyecto

```
src/
├── app/                 # App Router de Next.js
├── components/          # Componentes React
│   ├── Game/           # Componentes del juego
│   └── UI/             # Componentes de interfaz
├── hooks/              # Hooks personalizados
├── store/              # Estado global con Zustand
├── types/              # Tipos de TypeScript
└── utils/              # Utilidades
```

## 🎨 Personalización

### Colores
Los colores del juego están definidos en `tailwind.config.js`:
- `apocalypse-dark`: #0b132b
- `apocalypse-medium`: #13315c
- `apocalypse-light`: #1e3a8a
- `apocalypse-accent`: #ffd447
- `apocalypse-secondary`: #7cf5ff
- `apocalypse-danger`: #ff6bcb

### Mensajes
Los mensajes irónicos están en `src/store/gameStore.ts` en la sección `ironicMessages`.

## 📱 Móvil

El juego está optimizado para móvil con:
- Controles táctiles
- Responsive design
- PWA (Progressive Web App)
- Touch targets de 44px mínimo

## 🔮 Próximas Características

- [ ] Sistema de crafting
- [ ] Más tipos de zombis
- [ ] Eventos especiales
- [ ] Ranking global
- [ ] Modo multijugador
- [ ] Más temas visuales

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor, abre un issue o pull request.

---

**¡Sobrevive un día más!** 🧟‍♂️
