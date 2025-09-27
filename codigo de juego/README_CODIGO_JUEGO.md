# 🎮 CÓDIGO DEL JUEGO "UN DÍA MÁS"

## 📋 **RESUMEN DEL PROBLEMA**
El tutorial del juego está roto porque hay demasiada lógica compleja y conflictiva en `gameStore.ts`. El archivo principal tiene más de 1,600 líneas y maneja todo: tutorial, guardado, zombies, cartas, inventario, timer, finales, etc.

## 📁 **ARCHIVOS PRINCIPALES**

### 🔥 **gameStore.ts** (ARCHIVO MÁS IMPORTANTE - 1,600+ líneas)
**¿Qué hace?** Lógica principal del juego usando Zustand
**Problemas principales:**
- Líneas 380-459: Función `startGame` - maneja inicio del juego y tutorial
- Líneas 1508-1522: Función `showBearGuide` - mensajes del oso
- Todo el flujo del tutorial está mezclado con la lógica del juego
- Sistema de guardado complejo con localStorage
- Lógica de zombies, cartas, inventario, timer todo en un solo archivo

### 🎯 **GameBoard.tsx** 
**¿Qué hace?** Pantalla principal del juego
**Contiene:** UI principal, pantalla de ayuda, pantalla de final del juego
**Problemas:** Depende mucho de gameStore.ts

### 💬 **FloatingMessage.tsx**
**¿Qué hace?** Muestra mensajes del oso Peluso
**Problemas:** Maneja el cierre del tutorial y puede causar errores

### 🎒 **Inventory.tsx**
**¿Qué hace?** Inventario del jugador
**Contiene:** Lista de items, uso de items, lógica de tutorial

### 🃏 **CardDeck.tsx**
**¿Qué hace?** Muestra las cartas del juego
**Contiene:** Selección de cartas, efectos visuales

### 🧟 **ZombieField.tsx**
**¿Qué hace?** Muestra los zombies en pantalla
**Contiene:** Animaciones de zombies, imágenes consistentes

### 🏠 **BlockedHouseModal.tsx**
**¿Qué hace?** Modal de casas bloqueadas
**Contiene:** Sistema de clicks, mensajes del oso durante tutorial

### 🎁 **ItemFoundModal.tsx**
**¿Qué hace?** Modal cuando encuentras items
**Contiene:** Notificaciones discretas, auto-cierre

### ⏰ **useGameTimer.ts**
**¿Qué hace?** Timer del juego
**Contiene:** Avance de tiempo, pérdida de vida, hambre, sed
**Problemas:** Lógica de pérdida de vida puede ser confusa

### 💾 **useAutoSave.ts**
**¿Qué hace?** Guardado automático
**Contiene:** Guarda cada 30 segundos y al cerrar página

### 🐻 **characters.ts**
**¿Qué hace?** Mensajes del oso Peluso
**Contiene:** Todos los mensajes del tutorial y frases graciosas

### 🏗️ **game.ts**
**¿Qué hace?** Tipos TypeScript
**Contiene:** Interfaces, tipos, enums del juego

### 🏠 **page.tsx**
**¿Qué hace?** Página principal
**Contiene:** Sistema de partidas guardadas, modal de opciones

## 🚨 **PROBLEMAS PRINCIPALES**

### 1. **Tutorial Roto**
- El tutorial se salta pasos
- Mensajes del oso no aparecen correctamente
- Lógica compleja mezclada con el juego principal

### 2. **gameStore.ts Sobrecargado**
- 1,600+ líneas en un solo archivo
- Maneja tutorial, juego, guardado, zombies, cartas, inventario
- Lógica conflictiva entre diferentes sistemas

### 3. **Sistema de Guardado Complejo**
- localStorage con múltiples claves
- Conversión de Sets a Arrays
- Estado temporal vs permanente confuso

### 4. **Dependencias Circulares**
- gameStore depende de characters.ts
- Componentes dependen de gameStore
- Lógica del tutorial mezclada en múltiples archivos

## 💡 **RECOMENDACIONES PARA OTRA IA**

### 1. **Separar el Tutorial**
- Crear `useTutorial.ts` o `tutorialStore.ts` independiente
- Mover toda la lógica del tutorial fuera de gameStore.ts
- Simplificar el flujo del tutorial

### 2. **Simplificar gameStore.ts**
- Dividir en múltiples stores más pequeños
- Separar lógica de zombies, cartas, inventario
- Mantener solo la lógica core del juego

### 3. **Arreglar el Sistema de Guardado**
- Simplificar localStorage
- Separar preferencias del estado del juego
- Hacer el guardado más robusto

### 4. **Limpiar Dependencias**
- Reducir dependencias circulares
- Hacer componentes más independientes
- Mejorar la arquitectura general

## 🎯 **OBJETIVOS PRINCIPALES**
1. **Tutorial funcional** que no se salte pasos
2. **Código más limpio** y mantenible
3. **Sistema de guardado** más simple
4. **Mejor separación** de responsabilidades

## 📞 **CONTACTO**
Si necesitas más información sobre algún archivo específico o tienes preguntas sobre la lógica del juego, revisa principalmente `gameStore.ts` que contiene la mayoría de la lógica.
