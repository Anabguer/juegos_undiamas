# 🧟 UN DÍA MÁS - Especificación Completa del Juego

## 📋 **INFORMACIÓN GENERAL**

- **Nombre**: Un día más
- **Género**: Survival Arcade con humor irónico
- **Plataforma**: Móvil (Next.js + Capacitor)
- **Objetivo**: Sobrevivir el máximo número de días posible
- **Tono**: Gracioso, irónico, con mensajes divertidos
- **Enfoque**: Supervivencia pura, sin sistema de puntos

---

## 🎯 **MECÁNICAS PRINCIPALES**

### **Sistema de Tiempo**
- **Reloj en pantalla**: `Día X - HH:MM`
- **Cada 5 segundos reales** = 1 hora del juego
- **Cada 24 horas** = 1 día completo
- **Efecto día/noche**: 
  - Día (08:00-20:00): Fondo claro ☀️
  - Noche (20:00-08:00): Fondo oscuro 🌙
  - Durante la noche: más frío (necesitas bufanda)

### **Barras de Estado**
- **🍎 Hambre** (0-100)
- **💧 Sed** (0-100) 
- **❤️ Salud** (0-100)
- **Regla**: Cuando hambre/sed llegan a 0 → empieza a bajar salud
- **Efectos visuales**:
  - Hambre: Pantalla rojiza + personaje con tripa vacía
  - Sed: Pantalla borrosa + gotas de agua
  - Contagiado: Pantalla psicodélica verde + personaje temblando
  - Frío: Personaje tiritando + vaho en la respiración

### **Sistema de Cartas**
- **3 cartas por turno** durante 5 segundos
- **Si no eliges**: Pierdes salud (penalización)
- **Tipos de cartas**:
  - **Comida**: manzana 🍏, pollo 🍗, patatas 🍟 → +hambre
  - **Bebida**: agua 💧, zumo 🥤, refresco 🥫 → +sed
  - **Curación**: antídoto 💉 → cura contagio
  - **Bufanda 🧣**: evita daño por frío nocturno
  - **Bate 🏏**: sirve para golpear zombis
  - **Basura graciosa**: pato de goma, osito, CD, sombrero → mensajes irónicos

### **Sistema de Zombis**
- **4 tipos diferentes** (variación visual)
- **Aparecen en casillas laterales** (izquierda o derecha)
- **Mecánica**:
  - Cada turno avanzan 1 casilla hacia el jugador
  - Si llegan al jugador: **contagio** (comida/sed se consumen 3-4x más rápido)
  - Para eliminarlos: usar **bate** desde inventario + clic en casilla con zombi

### **Inventario**
- **Barra inferior** con objetos acumulados
- **Items clicables** para usarlos en cualquier momento
- **Ejemplo**: Bate ×2, Antídoto ×1, Bufanda ×1

---

## 🎨 **SISTEMA DE MENSAJES IRÓNICOS**

### **Mensajes por Objetos Inútiles**
```typescript
const mensajesObjetosInutiles = {
  patoGoma: "¡Cuac! Muy útil... para nada.",
  osito: "Yo no juego con esas cosas...",
  cd: "¿Quién tiene un lector de esto?",
  sombrero: "Al menos te ves elegante...",
  peluche: "Un amigo peludo... que no te salvará.",
  pelota: "¿Vamos a jugar al fútbol en el apocalipsis?"
};
```

### **Mensajes por Hitos de Supervivencia**
```typescript
const mensajesHitos = {
  dia1: "¡Felicidades! Has sobrevivido un día completo. ¿Quieres una medalla?",
  dia2: "Dos días seguidos... ¿Eres inmortal o qué?",
  dia3: "Tres días... Los zombis están empezando a respetarte.",
  dia5: "Cinco días. ¿Eres el nuevo líder del apocalipsis?",
  dia7: "Una semana completa. Los zombis están considerando rendirse.",
  dia10: "Diez días... ¿Eres humano o qué?",
  dia15: "Quince días. Los zombis ya no te ven como comida, sino como amenaza.",
  dia30: "Un mes completo. ¿Eres el nuevo rey del apocalipsis?"
};
```

### **Mensajes por Acciones**
```typescript
const mensajesAcciones = {
  zombie1: "Un zombi menos. La población mundial te lo agradece.",
  zombie5: "Cinco zombis eliminados. ¿Eres el nuevo héroe del apocalipsis?",
  zombie10: "Diez zombis. Los demás zombis están empezando a tener miedo.",
  zombie25: "Veinticinco zombis. ¿Eres un exterminador profesional?",
  comboComida: "Comida + Bebida = Combo saludable. ¡Eres un genio!",
  bateEstrategico: "Bate usado en el momento perfecto. ¿Eres un estratega?",
  sinComida: "Sin comida... ¿Planeas hacer dieta en el apocalipsis?",
  sinAgua: "Sin agua... ¿Eres un cactus?",
  zombieTeAtrapa: "El zombi te atrapó. ¿No viste que se acercaba?",
  nocheSinBufanda: "Noche sin bufanda... ¿Eres un pingüino o qué?"
};
```

### **Mensajes de Estado**
```typescript
const mensajesEstado = {
  hambreBaja: "¡Tienes hambre! Busca comida antes de que sea tarde.",
  sedBaja: "¡Tienes sed! Necesitas agua urgentemente.",
  saludBaja: "¡Tu salud está bajando! Come o bebe algo YA.",
  zombieCerca: "¡Zombi cerca! Usa un bate o prepárate para el contagio.",
  nocheLlegando: "Se acerca la noche... ¿Tienes una bufanda?",
  diaNuevo: "¡Nuevo día! ¿Cuánto podrás aguantar esta vez?",
  contagiado: "Te sientes raro... ¿Será el apocalipsis o algo más?",
  frio: "Hace frío... ¿No tienes una bufanda?"
};
```

---

## 🔧 **SISTEMA DE CRAFTING ESTRATÉGICO**

### **Combinaciones de Objetos**
```typescript
const crafting = {
  "Bate + Bate": {
    resultado: "Bate Mejorado",
    efecto: "Elimina zombis en 1 golpe",
    mensaje: "¡Dos bates juntos! Ahora sí que das miedo."
  },
  "Antídoto + Antídoto": {
    resultado: "Antídoto Potente", 
    efecto: "Cura instantáneamente + 1 hora de inmunidad",
    mensaje: "Antídoto doble. ¿Eres un químico del apocalipsis?"
  },
  "Bufanda + Bufanda": {
    resultado: "Bufanda Gruesa",
    efecto: "Protección total contra el frío nocturno",
    mensaje: "Bufanda doble. Ahora sí que estás preparado para el invierno."
  },
  "Comida + Bebida": {
    resultado: "Combo Saludable",
    efecto: "Restaura hambre Y sed al mismo tiempo",
    mensaje: "¡Combo perfecto! Eres un chef del apocalipsis."
  },
  "Bate + Antídoto": {
    resultado: "Bate Medicinal",
    efecto: "Elimina zombis + cura contagio si te tocan",
    mensaje: "Bate con medicina. ¿Eres un doctor del apocalipsis?"
  }
};
```

---

## 📈 **DIFICULTAD PROGRESIVA**

### **Evolución por Días**
```typescript
const dificultadProgresiva = {
  dia1: {
    zombis: "Lentos, aparecen cada 30 segundos",
    cartas: "Duran 5 segundos",
    clima: "Tranquilo",
    mensaje: "Primer día... ¿Será fácil?"
  },
  dia2: {
    zombis: "Normales, aparecen cada 25 segundos", 
    cartas: "Duran 4 segundos",
    clima: "Ligera lluvia (más sed)",
    mensaje: "Segundo día... ¿Ya te acostumbraste?"
  },
  dia3: {
    zombis: "Rápidos, aparecen cada 20 segundos",
    cartas: "Duran 3 segundos", 
    clima: "Tormenta (más frío + más sed)",
    mensaje: "Tercer día... ¿Sigues aquí?"
  },
  dia4: {
    zombis: "Muy rápidos + algunos resistentes",
    cartas: "Duran 2 segundos",
    clima: "Niebla (zombis más difíciles de ver)",
    mensaje: "Cuarto día... ¿Eres humano o qué?"
  },
  dia5: {
    zombis: "Rápidos + resistentes + aparecen en grupos",
    cartas: "Duran 1.5 segundos",
    clima: "Tormenta + niebla",
    mensaje: "Quinto día... ¿Eres inmortal?"
  }
};
```

---

## 🎭 **PERSONAJE Y ESTADOS**

### **5 Estados Visuales del Personaje**
1. **Normal**: Personaje estándar
2. **Con hambre**: Tripa vacía, expresión de hambre
3. **Con sed**: Boca seca, expresión de sed
4. **Contagiado**: Cara verde, temblando
5. **Con frío**: Tiritando, vaho en la respiración

### **Animaciones**
- **Boca que se abre/cierra** para comer/beber
- **Objetos vuelan a su boca** al usarse
- **Temblor** cuando tiene frío o está contagiado
- **Expresiones faciales** según el estado

---

## 📊 **PROBABILIDADES DE CARTAS**

### **Distribución Inicial**
```typescript
const probabilidadesCartas = {
  comida: 20,        // 20%
  bebida: 20,        // 20%
  curacion: 5,       // 5%
  bufanda: 5,        // 5%
  bate: 10,          // 10%
  basuraGraciosa: 20, // 20%
  zombis: 20         // 20%
};
```

### **Ajustes por Día**
- **Día 1-2**: Probabilidades base
- **Día 3-4**: +5% zombis, -5% basura
- **Día 5+**: +10% zombis, -10% basura

---

## 🎮 **FLUJO DE JUEGO**

### **1. Inicio del Día**
- **Modal con mensaje irónico** del día anterior
- **Empieza a las 08:00**
- **30 segundos de preparación** (recoger objetos del suelo)

### **2. Durante el Día**
- **Cada 5 segundos = 1 hora**
- **Cada turno aparecen 3 cartas** → elegir o perder salud
- **Zombis avanzan** hacia el jugador
- **Efectos visuales** según el estado

### **3. Durante la Noche (20:00-08:00)**
- **Fondo oscuro**
- **Más frío** (necesitas bufanda)
- **Zombis más agresivos**
- **Cartas duran menos tiempo**

### **4. Fin del Día**
- **Mensaje irónico** sobre tu supervivencia
- **Estadísticas del día**: objetos usados, zombis eliminados, etc.
- **Preparación para el siguiente día**

---

## 🛠️ **TECNOLOGÍAS**

### **Frontend**
- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS** (para estilos)
- **Framer Motion** (para animaciones)
- **Zustand** (para estado global)

### **Backend/Base de Datos**
- **MySQL** (Hostalia)
- **API REST** (PHP)
- **Sistema de autenticación** existente

### **Móvil**
- **Capacitor** (para APK)
- **PWA** (Progressive Web App)

---

## 🗄️ **ESTRUCTURA DE BASE DE DATOS**

### **Tabla Principal del Juego**
```sql
CREATE TABLE un_dia_mas_progreso (
  progreso_id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_aplicacion_key VARCHAR(150) NOT NULL,
  dias_sobrevividos INT DEFAULT 0,
  record_personal INT DEFAULT 0,
  monedas INT DEFAULT 0,
  nivel_desbloqueado INT DEFAULT 1,
  configuracion JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_aplicacion_key) REFERENCES usuarios_aplicaciones(usuario_aplicacion_key)
);
```

### **Historial de Partidas**
```sql
CREATE TABLE un_dia_mas_partidas (
  partida_id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_aplicacion_key VARCHAR(150) NOT NULL,
  dias_sobrevividos INT NOT NULL,
  puntuacion_final INT NOT NULL,
  tiempo_total_segundos INT NOT NULL,
  objetos_usados JSON,
  zombis_eliminados INT DEFAULT 0,
  fecha_partida TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_aplicacion_key) REFERENCES usuarios_aplicaciones(usuario_aplicacion_key)
);
```

### **Ranking Global**
```sql
CREATE TABLE un_dia_mas_ranking (
  ranking_id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_aplicacion_key VARCHAR(150) NOT NULL,
  tipo ENUM('global', 'semanal', 'mensual') NOT NULL,
  posicion INT NOT NULL,
  dias_sobrevividos INT NOT NULL,
  periodo VARCHAR(20) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_aplicacion_key) REFERENCES usuarios_aplicaciones(usuario_aplicacion_key)
);
```

---

## 📱 **OPTIMIZACIÓN PARA MÓVIL**

### **Controles Táctiles**
- **Tap** para seleccionar cartas
- **Swipe** para usar inventario
- **Tap** en zombi + bate para eliminar
- **Tap** en objeto para usar

### **Sesiones Cortas**
- **Pausa automática** si sales de la app
- **Guardado automático** cada 30 segundos
- **Notificaciones push** opcionales (no invasivas)

### **Responsive Design**
- **Adaptable** a diferentes tamaños de pantalla
- **Touch targets** de al menos 44px
- **Optimizado** para una mano

---

## 🎨 **DISEÑO VISUAL**

### **Estilo Artístico**
- **Colores**: Tonos apocalípticos (grises, rojos, verdes)
- **Tipografía**: Sans-serif, legible en móvil
- **Iconos**: Estilo cartoon, expresivos
- **Animaciones**: Fluidas, con personalidad

### **Efectos Visuales**
- **Transiciones suaves** entre día/noche
- **Efectos de partículas** (lluvia, niebla, etc.)
- **Feedback visual** inmediato en todas las acciones
- **Efectos de pantalla** según el estado del personaje

---

## 🚀 **ROADMAP DE DESARROLLO**

### **Fase 1: MVP (2-3 semanas)**
- [ ] Estructura base del proyecto Next.js
- [ ] Sistema de cartas básico
- [ ] Barras de estado y efectos visuales
- [ ] Sistema de zombis simple
- [ ] Inventario básico
- [ ] Persistencia local (localStorage)

### **Fase 2: Mecánicas Avanzadas (2-3 semanas)**
- [ ] Sistema de crafting
- [ ] Dificultad progresiva
- [ ] Efectos de clima
- [ ] Sistema de mensajes irónicos
- [ ] Animaciones mejoradas
- [ ] Integración con Hostalia

### **Fase 3: Pulido y Móvil (1-2 semanas)**
- [ ] Optimización para móvil
- [ ] Controles táctiles
- [ ] PWA
- [ ] APK con Capacitor
- [ ] Testing y bug fixes

### **Fase 4: Funcionalidades Extra (1-2 semanas)**
- [ ] Ranking global
- [ ] Sistema de logros (mensajes)
- [ ] Más tipos de zombis
- [ ] Eventos especiales
- [ ] Mejoras visuales finales

---

## 📝 **NOTAS DE IMPLEMENTACIÓN**

### **Consideraciones Técnicas**
- **Estado global** con Zustand para manejar el juego
- **Hooks personalizados** para lógica específica
- **Componentes reutilizables** para UI
- **Sistema de eventos** para comunicación entre componentes

### **Consideraciones de UX**
- **Feedback inmediato** en todas las acciones
- **Mensajes claros** sobre el estado del personaje
- **Tutorial progresivo** en los primeros días
- **Dificultad escalada** gradualmente

### **Consideraciones de Performance**
- **Lazy loading** de componentes pesados
- **Optimización** de imágenes y animaciones
- **Caching** de datos del servidor
- **Compresión** de assets

---

## 🔄 **VERSIONES FUTURAS**

### **v1.1: Contenido Extra**
- Más tipos de zombis
- Eventos especiales (tormentas, invasiones)
- Sistema de amigos
- Modo multijugador local

### **v1.2: Personalización**
- Diferentes personajes
- Temas visuales
- Objetos especiales
- Modo historia

### **v1.3: Social**
- Ranking de amigos
- Compartir logros
- Eventos comunitarios
- Modo cooperativo

---

*Documento vivo - Última actualización: [FECHA]*
*Versión: 1.0*
*Estado: En desarrollo*

