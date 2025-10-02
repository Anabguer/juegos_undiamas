'use client';

import React from 'react';
import { useMultiAudio } from '@/hooks/useAudio';
import { useGameStore } from '@/store/gameStore';

export const BackgroundMusic: React.FC = () => {
  const { volume, soundEnabled, showItemSelection } = useGameStore();
  const audioFunctions = useMultiAudio(soundEnabled, volume);
  
  const { 
    playBackground, 
    pauseBackground, 
    playItemSearch, 
    pauseItemSearch, 
    playBatHit,
    playEat,
    playDrink,
    playPill,
    playHit,
    playZombieBat,
    playRat,
    playMinigameStart, 
    playZombieMinigame,
    playHouseCard, 
    playShiver,
    setBackgroundVolume, 
    setItemSearchVolume,
    setBatHitVolume,
    setEatVolume,
    setDrinkVolume,
    setPillVolume,
    setHitVolume,
    setZombieBatVolume,
    setRatVolume,
    setMinigameStartVolume,
    setHouseCardVolume,
    setShiverVolume
  } = audioFunctions;

  // Intentar reproducir música de fondo al cargar la aplicación
  React.useEffect(() => {
    console.log('BACKGROUND MUSIC - Intentando iniciar música de fondo...');
    console.log('BACKGROUND MUSIC - playBackground disponible en useEffect:', !!playBackground);
    if (playBackground) {
      playBackground();
    } else {
      console.log('BACKGROUND MUSIC - playBackground NO DISPONIBLE en useEffect');
    }
  }, []); // Solo se ejecuta una vez al montar el componente

  // Controlar música de fondo según el estado de soundEnabled
  React.useEffect(() => {
    if (soundEnabled) {
      playBackground();
    } else {
      pauseBackground();
    }
  }, [soundEnabled, playBackground, pauseBackground]);

  // Controlar sonido de búsqueda de items
  React.useEffect(() => {
    if (soundEnabled && showItemSelection) {
      playItemSearch();
    } else {
      pauseItemSearch();
    }
  }, [soundEnabled, showItemSelection]);

  // Actualizar volúmenes
  React.useEffect(() => {
    setBackgroundVolume(volume);
    setItemSearchVolume(volume);
    setBatHitVolume(volume);
    setEatVolume(volume);
    setDrinkVolume(volume);
    setPillVolume(volume);
    setHitVolume(volume);
    setZombieBatVolume(volume);
    setRatVolume(volume);
    setMinigameStartVolume(volume);
    setHouseCardVolume(volume);
    setShiverVolume(volume);
  }, [volume, setBackgroundVolume, setItemSearchVolume, setBatHitVolume, setEatVolume, setDrinkVolume, setPillVolume, setHitVolume, setZombieBatVolume, setRatVolume, setMinigameStartVolume, setHouseCardVolume, setShiverVolume]);

  // Exponer funciones de sonido para uso en otros componentes (solo una vez)
  React.useEffect(() => {
    console.log('BACKGROUND MUSIC - Configurando funciones de audio en el store...');
    console.log('BACKGROUND MUSIC - playBackground disponible:', !!playBackground);
    console.log('BACKGROUND MUSIC - pauseItemSearch disponible:', !!pauseItemSearch);
    
    // Usar setPauseItemSearch para asignar la función al store
    if (pauseItemSearch) {
      useGameStore.getState().setPauseItemSearch(pauseItemSearch);
    }
    
    // Guardar las funciones en el store para que otros componentes puedan usarlas
    useGameStore.setState({ 
      playBatHit,
      playEat,
      playDrink,
      playPill,
      playHit,
      playZombieBat,
      playRat,
      playMinigameStart, 
      playZombieMinigame,
      playHouseCard, 
      playShiver,
      playBackground
    });
    console.log('BACKGROUND MUSIC - Funciones configuradas, playBackground:', !!playBackground);
    
    // Verificar que se guardó correctamente
    const storeState = useGameStore.getState();
    console.log('BACKGROUND MUSIC - Verificación del store, playBackground:', !!storeState.playBackground);
    console.log('BACKGROUND MUSIC - Verificación del store, pauseItemSearch:', !!storeState.pauseItemSearch);
  }, []); // Eliminar todas las dependencias para evitar el bucle infinito

  return null; // Este componente no renderiza nada visual
};
