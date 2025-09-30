# Hola Cursor — Documento completo de estabilización para **“Un Día Más”** (PoP → móvil)

> **Propósito:** estabilizar el tutorial (sin cambiar textos), fijar la jugabilidad (hambre/sed/vida, frío/bufanda, infección), proteger el early‑game de zombis sin arma y sanear persistencia por partida. Todo listo para aplicar, archivo por archivo.

---

## 0) Resumen de cambios (vista ejecutiva)

- **Nuevo**: `src/tutorial/TutorialService.ts` (máquina de estados + gate + sayOnce por partida).
- **Sustituir**: `src/hooks/useGameTimer.ts` (ticks constantes y balance).
- **Modificar**: `src/store/gameStore.ts` (inyectar slice, namespacing saveId, guards).
- **Modificar**: `src/components/BlockedHouseModal.tsx` (sayOnce + dispatch + gate).
- **Modificar**: `src/components/ItemFoundModal.tsx` (sayOnce por tipo de ítem).
- **Modificar**: `advanceTime()` (parche de spawn de zombis early‑game sin arma).
- **Modificar**: `deleteSavedGame()` (limpieza namespaced y nuevo saveId).
- **No se cambian textos** de tutorial ni finales; solo comportamiento.

---

## 1) Nuevo archivo — `src/tutorial/TutorialService.ts`

> Crea este archivo tal cual. Controla el flujo del tutorial y evita que se repitan mensajes.

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

---

## 2) Sustituir `src/hooks/useGameTimer.ts`

```ts
import { useEffect, useRef } from 'react';
import { useGameStore } from '@/store/gameStore';

// --- Constantes de balance (ajustables) ---
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
    if (isPlaying && !isPaused) {
      clockRef.current = setInterval(() => { advanceTime(); }, 5000);
    }

    if (isPlaying && !isPaused) {
      balanceRef.current = setInterval(() => {
        if (showTutorial) return;

        let hungerDelta = BASE_HUNGER_DRAIN_PER_SEC;
        let thirstDelta = BASE_THIRST_DRAIN_PER_SEC;

        if (isCold) { hungerDelta *= COLD_MULTIPLIER; thirstDelta *= COLD_MULTIPLIER; }
        if (isInfected) { hungerDelta *= INFECTION_MULTIPLIER; thirstDelta *= INFECTION_MULTIPLIER; }

        updateHunger(hungerDelta);
        updateThirst(thirstDelta);

        const hungerEmpty = (hunger <= 0);
        const thirstEmpty = (thirst <= 0);

        if (hungerEmpty && thirstEmpty) updateHealth(HEALTH_DRAIN_BOTH_EMPTY);
        else if (hungerEmpty || thirstEmpty) updateHealth(HEALTH_DRAIN_PER_SEC_EMPTY);
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

---

## 3) Modificar `src/store/gameStore.ts`

### 3.1 Inyectar slice y método `showBearGuide`

```ts
// import { createTutorialSlice, TutorialSlice } from '@/tutorial/TutorialService';

export const useGameStore = create<GameState & TutorialSlice>()((...a) => ({
  ...initialState,
  ...createTutorialSlice(...a),
  showBearGuide: (text: string) => {
    set({ currentMessage: text, showMessage: true, showTutorial: true, isPaused: true });
  },
}));
```

### 3.2 Namespacing y deleteSavedGame()

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

deleteSavedGame: () => {
  if (typeof window === 'undefined') return;
  const saveId = JSON.parse(localStorage.getItem('saveId') || 'null');
  if (saveId) {
    Object.keys(localStorage).forEach(k => { if (k.startsWith(saveId + ':')) localStorage.removeItem(k); });
  }
  localStorage.removeItem('unDiaMas_savedGame');
  localStorage.removeItem('unDiaMas_lastSave');
  const newId = crypto.randomUUID();
  localStorage.setItem('saveId', JSON.stringify(newId));
  set({ /* reinicia tu estado base aquí si procede */ });
},
```

### 3.3 Guard anti‑input durante tutorial

```ts
const { tutGateLocked } = useGameStore.getState();
if (tutGateLocked) return;
```

### 3.4 Clamps en stats

```ts
updateHunger: (delta: number) => set((s) => ({ hunger: Math.max(0, Math.min(100, s.hunger + delta)) })),
updateThirst: (delta: number) => set((s) => ({ thirst: Math.max(0, Math.min(100, s.thirst + delta)) })),
updateHealth: (delta: number) => set((s) => {
  const next = Math.max(0, Math.min(100, s.health + delta));
  if (next <= 0 && s.health > 0) s.endGame?.();
  return { health: next };
}),
```

---

## 4) `src/components/BlockedHouseModal.tsx` — inserciones exactas

**Al abrir el modal (una sola vez):**
```ts
import { useGameStore } from '@/store/gameStore';

// dentro de useEffect/onOpen
const store = useGameStore.getState();
store.sayOnce('unlock_door', 'Está bloqueada. Desbloquéala.');
store.lockGate('tutorial:blockHouse');
```

**Al completar el desbloqueo:**
```ts
const store = useGameStore.getState();
store.dispatchTut('unlockedDoor');
store.unlockGate('tutorial:blockHouse:done');
```

---

## 5) `src/components/ItemFoundModal.tsx` — consejos una sola vez

```ts
import { useGameStore } from '@/store/gameStore';

const store = useGameStore.getState();
switch (item.category) {
  case 'WATER':
    store.sayOnce('water_tip', '¡Agua! Mantén la sed a raya.');
    break;
  case 'FOOD':
    store.sayOnce('food_tip', 'Algo de comer. Gestiona el hambre con cabeza.');
    break;
  case 'WEAPON':
    store.sayOnce('weapon_tip', 'Un arma te salva de un apuro con zombis.');
    break;
  case 'CLOTHES':
    store.sayOnce('clothes_tip', 'Abrígate si hace frío: bufanda y listo.');
    break;
  case 'MEDICINE':
    store.sayOnce('med_tip', 'La medicina puede salvarte cuando la salud cae.');
    break;
}
```

---

## 6) `advanceTime()` — control de zombis early‑game sin arma

```ts
const hasWeapon = state.inventory?.some(i => i.type === ItemType.WEAPON && i.quantity > 0);

if (state.day <= 3) {
  if (!hasWeapon) {
    if (state.hour >= 21 || state.hour < 5) {
      adjustedSpawnRate = Math.min(adjustedSpawnRate ?? 0.05, 0.03);
    } else {
      adjustedSpawnRate = 0;
    }
  }
  if ((state.zombies?.length ?? 0) >= 1) adjustedSpawnRate = 0;
}
```

---

## 7) Eventos del tutorial — dónde dispararlos

```ts
// comer manzana OK
useGameStore.getState().dispatchTut('ateApple');

// abrir casa
useGameStore.getState().dispatchTut('openedHouse');

// puerta desbloqueada (fin del modal)
useGameStore.getState().dispatchTut('unlockedDoor');

// matar zombi
useGameStore.getState().dispatchTut('killedZombie');

// equipar bufanda (quita frío)
useGameStore.getState().dispatchTut('woreScarf');
```

---

## 8) Finales — sin tocar textos

- `endGame()` sólo se llama al llegar `health` a 0.
- La causa la decides con tu estado: hambre/sed 0, infección acelerando hambre/sed, daño de zombi, etc.
- No se modifica ninguna frase de final.

---

## 9) QA checklist

- [ ] Nueva partida: tutorial paso a paso, sin repetirse.
- [ ] Mensajes únicos (agua, arma, ropa, etc.) no se repiten.
- [ ] Hambre/sed descienden suave; con frío/infección aceleran.
- [ ] Vida no baja salvo por hambre/sed 0 o daño.
- [ ] No “3 zombis sin bate” en noches iniciales.
- [ ] Borrar partida limpia tutorial/mensajes y genera `saveId` nuevo.

---

## 10) Notas

- Si alguna ruta de import difiere, ajusta `@/` a tu alias real.
- Balance fino: cambia **solo** constantes en `useGameTimer.ts`.
- SSR/Next: los accesos a `localStorage` están protegidos con `typeof window !== 'undefined'`.

— **Aplicar tal cual.**
