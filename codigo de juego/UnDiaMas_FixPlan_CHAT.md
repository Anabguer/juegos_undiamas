# Hola Cursor — Plan de estabilización para **“Un Día Más”** (PoP → móvil)

> Objetivo: **arreglar el tutorial**, **estabilizar la jugabilidad** (hambre/sed/vida, frío, zombies), y **sanear el `gameStore.ts`** sin tocar textos de hitos ni el tono de Peluso. Vamos a separar responsabilidades, añadir una máquina de estados para el tutorial y fijar reglas de balance claras.

---

## 0) Foto actual (lo que he visto en el repo)

- Proyecto con 14 archivos. El núcleo está en **`/src/store/gameStore.ts`** (~1600 líneas).
- **Problemas detectados** (funcionales y de arquitectura):
  - El **tutorial** está mezclado con lógica de inventario, zombies, guardado y UI → se duplican mensajes, se saltan pasos y se re-ejecuta lo que debería ser “solo una vez”.
  - **Flags** del tutorial y mensajes sin namespacing por partida. `deleteSavedGame()` no limpia esos residuos.
  - **Hambre/Sed**: no hay **tick base** claro de bajada progresiva; la bajada depende casi solo de cartas/acciones → a veces “no baja nunca”, otras “pega bajón” y mueres en 3 ticks.
  - **Vida**: debería bajar **solo** como consecuencia de hambre/sed a 0 (y/o infección); ahora parece bajar directa/rápida.
  - **Frío/Noche/Bufanda**: lógica presente, pero el efecto en hambre/sed/vida no se aplica de forma consistente.
  - **Zombis early game**: primera noche salen demasiados si aún no hay bate.
  - **Finales**: definidas (`gameEndings`) pero el disparo es inconsistente por el punto anterior (vida cae mal).

**Objetivos a conseguir**
1. Tutorial **determinista** con “solo-una-vez” (por **partida**).
2. Bajadas **progresivas** de hambre/sed por tiempo; **vida** solo cae si hambre o sed están a 0 (o por infección).
3. **Noche/frío/bufanda** coherentes: el frío **acelera** hambre/sed; la bufanda **anula** ese extra.
4. **Zombis** de la noche 1-3 **capados** si no hay arma; progresión suave.
5. Guardado/limpieza robustos, **namespaced por `saveId`**.

---

## 1) Separar el Tutorial en su propio slice (máquina de estados + “sayOnce”)

Crea el archivo **`/src/tutorial/TutorialService.ts`** con esta implementación. No cambia textos; solo controla **cuándo** salen y **cuándo** avanza cada paso.

```ts
// /src/tutorial/TutorialService.ts
import { StateCreator } from 'zustand';

export type TutState =
  | 'idle' | 'intro' | 'eat' | 'openHouse' | 'unlockDoor'
  | 'killZombie' | 'wearScarf' | 'done';

type TutEvent =
  | 'ateApple' | 'openedHouse' | 'unlockedDoor'
  | 'killedZombie' | 'woreScarf';

export interface TutorialSlice {
  saveId: string;
  tutState: TutState;
  tutCompleted: boolean;
  tutSeenMsgs: Set<string>;
  tutStepsDone: Set<string>;
  tutGateLocked: boolean;

  initTutorial: (opts?: { fresh?: boolean }) => void;
  dispatchTut: (ev: TutEvent) => void;
  sayOnce: (msgId: string, text: string) => void;
  lockGate: (reason?: string) => void;
  unlockGate: (reason?: string) => void;
}

const SAVE_KEY = (id: string, k: string) => `${id}:${k}`;
const loadSet = (raw?: string | null) => new Set<string>(raw ? JSON.parse(raw) : []);

export const createTutorialSlice: StateCreator<any, [], [], TutorialSlice> =
  (set, get) => ({
    saveId: typeof window !== 'undefined'
      ? JSON.parse(localStorage.getItem('saveId') || 'null') ?? (() => {
          const id = crypto.randomUUID();
          localStorage.setItem('saveId', JSON.stringify(id));
          return id;
        })()
      : 'dev',

    tutState: 'idle',
    tutCompleted: false,
    tutSeenMsgs: new Set<string>(),
    tutStepsDone: new Set<string>(),
    tutGateLocked: false,

    initTutorial: ({ fresh } = { fresh: false }) => {
      const { saveId } = get();
      if (fresh) {
        Object.keys(localStorage).forEach(k => {
          if (k.startsWith(saveId + ':')) localStorage.removeItem(k);
        });
      }
      const state = (localStorage.getItem(SAVE_KEY(saveId, 'tutState')) ?? '"intro"');
      const completed = localStorage.getItem(SAVE_KEY(saveId, 'tutCompleted')) === 'true';
      const seen = loadSet(localStorage.getItem(SAVE_KEY(saveId, 'tutSeenMsgs')));
      const steps = loadSet(localStorage.getItem(SAVE_KEY(saveId, 'tutStepsDone')));
      set({
        tutState: completed ? 'done' : JSON.parse(state),
        tutCompleted: completed,
        tutSeenMsgs: seen,
        tutStepsDone: steps,
      });
      if (!completed && get().tutState === 'intro') {
        get().lockGate('tutorial:intro');
        get().sayOnce('intro_gift', '¡Hola! Te regalo una manzana. Tócala para comer.');
      }
    },

    sayOnce: (msgId, text) => {
      const { saveId, tutSeenMsgs } = get();
      if (tutSeenMsgs.has(msgId)) return;
      get().showBearGuide?.(text);
      const next = new Set(tutSeenMsgs); next.add(msgId);
      set({ tutSeenMsgs: next });
      localStorage.setItem(SAVE_KEY(saveId, 'tutSeenMsgs'), JSON.stringify([...next]));
    },

    lockGate: (reason) => set({ tutGateLocked: true }, false, `GATE_LOCK:${reason ?? ''}`),
    unlockGate: (reason) => set({ tutGateLocked: false }, false, `GATE_UNLOCK:${reason ?? ''}`),

    dispatchTut: (ev) => {
      const { saveId, tutState, tutStepsDone } = get();
      if (get().tutCompleted) return;

      const stepDone = (stepId: string) => {
        const next = new Set(tutStepsDone); next.add(stepId);
        set({ tutStepsDone: next });
        localStorage.setItem(SAVE_KEY(saveId, 'tutStepsDone'), JSON.stringify([...next]));
      };
      const setState = (s: TutState) => {
        set({ tutState: s });
        localStorage.setItem(SAVE_KEY(saveId, 'tutState'), JSON.stringify(s));
      };
      const finish = () => {
        set({ tutCompleted: true, tutState: 'done' });
        localStorage.setItem(SAVE_KEY(saveId, 'tutCompleted'), 'true');
        get().unlockGate('tutorial:done');
        get().showBearGuide?.('¡Listo! Tutorial completado.');
      };

      switch (tutState) {
        case 'intro':
          if (ev === 'ateApple') {
            stepDone('eat_apple');
            setState('eat');
            get().sayOnce('open_house', 'Ahora abre esa casa.');
            get().lockGate('tutorial:eat');
          }
          break;
        case 'eat':
          if (ev === 'openedHouse') {
            stepDone('open_house');
            setState('openHouse');
            get().sayOnce('unlock_door', 'Está bloqueada. Desbloquéala.');
            get().lockGate('tutorial:openHouse');
          }
          break;
        case 'openHouse':
          if (ev === 'unlockedDoor') {
            stepDone('unlock_door');
            setState('unlockDoor');
            get().sayOnce('kill_zombie', 'Buen loot. Ahora, cuidado con los zombis.');
            get().lockGate('tutorial:unlockDoor');
          }
          break;
        case 'unlockDoor':
          if (ev === 'killedZombie') {
            stepDone('kill_zombie');
            setState('killZombie');
            get().sayOnce('wear_scarf', 'Si hace frío, equípate la bufanda.');
            get().lockGate('tutorial:killZombie');
          }
          break;
        case 'killZombie':
          if (ev === 'woreScarf') {
            stepDone('wear_scarf');
            setState('wearScarf');
            finish();
          }
          break;
      }
    },
  });
```

### Conexión con el store principal

En **`/src/store/gameStore.ts`**, **inyecta** el slice justo al crear el store:

```ts
// import { createTutorialSlice } from '@/tutorial/TutorialService';

export const useGameStore = create<GameState & TutorialSlice>()((...a) => ({
  ...initialState,
  ...createTutorialSlice(...a), // ← añade este spread
  // expón showBearGuide si aún no es método público
  showBearGuide: (text: string) => {
    set({ currentMessage: text, showMessage: true, showTutorial: true, isPaused: true });
  },
}));
```

**Respeta el Gate del tutorial** en cualquier input/acción de juego:

```ts
const { tutGateLocked } = useGameStore.getState();
if (tutGateLocked) return; // no ejecutar acciones mientras el tutorial bloquea
```

**Dispara eventos** del tutorial en los puntos correctos (no cambian textos, solo sincronizan pasos):

```ts
// Al comer la manzana
useGameStore.getState().dispatchTut('ateApple');

// Al abrir una casa
useGameStore.getState().dispatchTut('openedHouse');

// Al desbloquear la puerta (modal completado)
useGameStore.getState().dispatchTut('unlockedDoor');

// Al matar un zombi con el bate
useGameStore.getState().dispatchTut('killedZombie');

// Al equipar bufanda (quitar frío)
useGameStore.getState().dispatchTut('woreScarf');
```

**Inicializa** el tutorial al empezar o tras “nueva partida”:

```ts
useGameStore.getState().initTutorial({ fresh: /* true si es nueva partida */ });
```

---

## 2) Tick de jugabilidad (hambre/sed/vida) — Reemplaza `useGameTimer.ts`

El hook actual está truncado. Propongo reemplazarlo por una versión explícita con dos temporizadores:
- **Reloj del juego**: cada 5s = +1 hora (llama `advanceTime()`).
- **Balance tick**: cada 1s aplica fórmulas de hambre/sed/vida.

Crea/reemplaza **`/src/hooks/useGameTimer.ts`**:

```ts
import { useEffect, useRef } from 'react';
import { useGameStore } from '@/store/gameStore';

// Constantes de balance (ajustables)
const BASE_HUNGER_DRAIN_PER_SEC   = -0.02; // -2 por minuto
const BASE_THIRST_DRAIN_PER_SEC   = -0.03; // -3 por minuto
const COLD_MULTIPLIER             = 1.5;   // 50% más rápido con frío
const INFECTION_MULTIPLIER        = 1.8;   // 80% más rápido contagiado
const HEALTH_DRAIN_PER_SEC_EMPTY  = -0.10; // -6 por minuto si hambre O sed a 0
const HEALTH_DRAIN_BOTH_EMPTY     = -0.20; // -12 por minuto si hambre Y sed a 0

export const useGameTimer = () => {
  const clockRef = useRef<NodeJS.Timeout | null>(null);
  const balanceRef = useRef<NodeJS.Timeout | null>(null);

  const {
    isPlaying, isPaused, showTutorial,
    advanceTime, updateHunger, updateThirst, updateHealth,
    hunger, thirst, isCold, isInfected
  } = useGameStore();

  useEffect(() => {
    // Reloj de juego (horas)
    if (isPlaying && !isPaused) {
      clockRef.current = setInterval(() => {
        advanceTime();
      }, 5000);
    }

    // Balance tick (segundos)
    if (isPlaying && !isPaused) {
      balanceRef.current = setInterval(() => {
        // No aplicar balance si el tutorial está activo y bloqueando
        if (showTutorial) return;

        // 1) Hambre/Sed bajan siempre un poquito
        let hungerDelta = BASE_HUNGER_DRAIN_PER_SEC;
        let thirstDelta = BASE_THIRST_DRAIN_PER_SEC;

        // 2) Modificadores por estado
        if (isCold) {
          hungerDelta *= COLD_MULTIPLIER;
          thirstDelta *= COLD_MULTIPLIER;
        }
        if (isInfected) {
          hungerDelta *= INFECTION_MULTIPLIER;
          thirstDelta *= INFECTION_MULTIPLIER;
        }

        updateHunger(hungerDelta);
        updateThirst(thirstDelta);

        // 3) Vida solo baja si hambre/sed están en 0
        const hungerEmpty = (hunger <= 0);
        const thirstEmpty = (thirst <= 0);

        if (hungerEmpty && thirstEmpty) {
          updateHealth(HEALTH_DRAIN_BOTH_EMPTY);
        } else if (hungerEmpty || thirstEmpty) {
          updateHealth(HEALTH_DRAIN_PER_SEC_EMPTY);
        }
        // Si ninguna está a 0, la vida NO baja por tick
      }, 1000);
    }

    return () => {
      if (clockRef.current) clearInterval(clockRef.current);
      if (balanceRef.current) clearInterval(balanceRef.current);
      clockRef.current = null;
      balanceRef.current = null;
    };
  }, [isPlaying, isPaused, showTutorial, advanceTime, updateHunger, updateThirst, updateHealth, hunger, thirst, isCold, isInfected]);
};
```

**Qué cambia con esto**
- Hambre/Sed **siempre** descienden un poco (incluso de día) → sensación de supervivencia constante.
- De noche con frío (sin bufanda) → **bajan más rápido** (no baja la vida directamente por frío).
- **Vida** solo cae si hambre o sed llegan a 0 (más rápido si ambas están a 0).
- Infección acelera hambre/sed (como pediste).

> Ajusta las constantes al gusto. La idea es que “morir en 3 ticks” no pase ni de lejos con bufanda y comida decente.

---

## 3) Frío/Noche/Bufanda — coherencia (cambiar solo lógica, NO textos)

En `advanceTime()` ya estás marcando `isNight` y lanzando mensajes. Mantén eso. Importante:
- **No** bajes vida por “frío” directamente.
- El **efecto real** del frío es acelerar hambre/sed (ya aplicado en el hook).
- Al **equipar bufanda**, ejecutas `setCold(false)` y el tick vuelve a normal.

**Extra (opcional, pero recomendado):** si quieres blindar que el frío no haga daño nunca directo, asegúrate de que **ninguna** otra parte del código llame `updateHealth()` por el mero hecho de `isCold`. (No lo he visto, pero por si hay restos).

---

## 4) Zombies — progresión suave y protección “sin arma”

Tu `advanceTime()` ya trae esta base:
- Día 1: **sin** zombies.
- Días 2-4: **solo** de noche.
- Día 5: día+noche.
- Cooldown y `maxZombiesAtOnce` = 2.

**Parche sugerido** dentro de `advanceTime()` (antes de decidir el spawn):

```ts
// Protección si no hay arma (bate) en early-game
const hasWeapon = state.inventory.some(i => i.type === ItemType.WEAPON && i.quantity > 0);

if (newDay <= 3) {
  if (!hasWeapon) {
    // Noche: como mucho 1 zombie y con probabilidad reducida
    if (newHour >= 21 || newHour < 5) {
      adjustedSpawnRate = Math.min(adjustedSpawnRate, 0.03); // 3% por hora
    } else {
      adjustedSpawnRate = 0; // de día, nada
    }
  }
  // Limitar a 1 a la vez en los primeros días
  if (state.zombies.length >= 1) {
    adjustedSpawnRate = 0;
  }
}
```

Esto evita la situación “me caen 3 zombis sin bate”. Si ya hay bate, se mantiene tu progresión.

---

## 5) Guardados/limpieza — namespacing por `saveId`

Añade **namespacing** para tutorial y mensajes únicos por **partida**. En `gameStore.ts` (arriba del todo) añade helpers:

```ts
const ensureSaveId = (): string => {
  const raw = localStorage.getItem('saveId');
  if (raw) return JSON.parse(raw);
  const id = crypto.randomUUID();
  localStorage.setItem('saveId', JSON.stringify(id));
  return id;
};

export const SAVE_ID = (typeof window !== 'undefined') ? ensureSaveId() : 'dev';
export const nsKey = (k: string) => `${SAVE_ID}:${k}`;
```

Modifica cualquier clave persistente del tutorial a `nsKey('tutState')`, `nsKey('tutCompleted')`, `nsKey('tutSeenMsgs')`, etc. (En el código del **TutorialService** ya lo hemos hecho).

**Reemplaza** tu `deleteSavedGame()` por una que limpie también las claves namespaced:

```ts
deleteSavedGame: () => {
  if (typeof window === 'undefined') return;
  const saveId = JSON.parse(localStorage.getItem('saveId') || 'null');
  if (saveId) {
    Object.keys(localStorage).forEach(k => {
      if (k.startsWith(saveId + ':')) localStorage.removeItem(k);
    });
  }
  localStorage.removeItem('unDiaMas_savedGame');
  localStorage.removeItem('unDiaMas_lastSave');

  // nuevo saveId para la nueva partida
  const newId = crypto.randomUUID();
  localStorage.setItem('saveId', JSON.stringify(newId));
},
```

> Esto arregla que aparezcan mensajes del tutorial re-repetidos cuando “borras partida” pero quedaban restos.

---

## 6) Componentes con mensajes “solo-una-vez”

- **`BlockedHouseModal.tsx`**: cuando se abre por primera vez, usa `sayOnce('unlock_door', 'Está bloqueada. Desbloquéala.')`. Al completar clicks, **dispara** `dispatchTut('unlockedDoor')` y `unlockGate()`.

```ts
// al abrir el modal por 1ª vez
useGameStore.getState().sayOnce('unlock_door', 'Está bloqueada. Desbloquéala.');

// al completar desbloqueo
useGameStore.getState().dispatchTut('unlockedDoor');
useGameStore.getState().unlockGate('unblocked:door');
```

- **`ItemFoundModal.tsx`**: si quieres frases únicas por tipo de item (agua, medicina, ropa, arma, basura), usa ids distintos:
```ts
useGameStore.getState().sayOnce('water_tip', '¡Agua! Mantén la sed a raya.');
useGameStore.getState().sayOnce('medicine_found', 'Una medicina nunca viene mal.');
// etc.
```

> Esto quita la repetición de mensajes “consejo de agua” cada vez que cae otra botella.

---

## 7) Vida y finales

No toco tus textos ni tus `gameEndings`. Con el **tick nuevo**, `updateHealth()` solo es llamado por:
- Hambre=0 o Sed=0 (lento; configurable).
- Ataques/zombis (si aplicas daño ahí).
- Uso de medicina suma salud, etc.

Tu `updateHealth()` ya llama `endGame()` cuando llega a 0, y `endGame()` decide el final en función del estado (`HUNGER`, `THIRST`, `COLD`, `ZOMBIE`, `ABSURD`). Con las reglas nuevas, la elección del final será **coherente** (morir de frío directo no ocurre; mueres porque hambre/sed llegaron a 0 más rápido por el frío).

---

## 8) Cableado mínimo (lista de cambios concretos)

1. **Añadir** `src/tutorial/TutorialService.ts` (código arriba).
2. **Inyectar** el slice en `gameStore.ts` al crear el store + exponer `showBearGuide` si hace falta.
3. **Respetar Gate**: En cualquier handler de entrada/UI, abortar si `tutGateLocked` está true.
4. **Disparar eventos** del tutorial en los 5 puntos clave (comer → abrir casa → desbloquear → matar zombi → bufanda).
5. **Reemplazar** `useGameTimer.ts` por el hook de balance con ticks (código arriba).
6. **Zombis early game**: parche dentro de `advanceTime()` para proteger sin arma (código arriba).
7. **Namespacing** de tutorial/mensajes únicos por `saveId` y **limpieza** en `deleteSavedGame()`.
8. **Actualizar** `BlockedHouseModal.tsx` e `ItemFoundModal.tsx` a `sayOnce(...)` + `dispatchTut(...)` en los puntos indicados.
9. (Opcional) Asegurar que cualquier “mensaje random” de Peluso **no** se lanza mientras `showTutorial` esté activo.

---

## 9) Checklist de pruebas (rápidas)

- [ ] Partida nueva → oso regala manzana → solo puedes **comer** (Gate activo).
- [ ] Comes manzana → “abre casa” → abres casa → “está bloqueada” → desbloqueas → item.
- [ ] Matar zombi → “si hace frío, bufanda” → al equiparla, **fin del tutorial**, Gate off.
- [ ] Segunda casa bloqueada → **no** repite el mensaje.
- [ ] Reaparece una botella de agua → **no** repite el consejo de agua.
- [ ] Día 1: 0 zombis; Día 2-3: como mucho 1 por noche si no hay bate.
- [ ] Hambre/sed bajan suave de día; bajan un poco más rápido de noche **solo si** `isCold=true` (sin bufanda).
- [ ] Vida **no baja** si hambre/sed > 0; **sí** baja lentamente si alguna está en 0; más rápido si ambas.
- [ ] Infección acelera hambre/sed.
- [ ] Borrar partida limpia tutorial y mensajes (claves namespaced).

---

## 10) Notas de compatibilidad

- No hemos cambiado ningún **texto** de hitos/osos/finales.
- Todos los cambios son **aditivos** o mínimos; `gameStore.ts` sigue mandando, pero el tutorial deja de “empotrar” lógica de UI.
- Si usas SSR/Next, los accesos a `localStorage` ya están protegidos por `typeof window !== 'undefined'` (seguir haciéndolo).

---

## 11) Siguientes pasos opcionales (cuando haya tiempo)

- Dividir `gameStore.ts` en sub-slices: `inventory`, `zombies`, `cards`, `playerStats`. Mantiene la cabeza limpia.
- Tests unitarios de `TutorialService` (máquina de estados y `sayOnce`).

---

## Cierre

Con esto, el tutorial deja de repetirse/saltarse, la supervivencia se siente **justa** (vida no cae sola), el frío **acelera** lo que tiene que acelerar, y los zombis del inicio no te hacen “soft-lock” sin bate.  
Si algo del balance se os queda corto/largo, tocad únicamente las **constantes** del hook y el pequeño parche del spawn.

— Fin del parche.
