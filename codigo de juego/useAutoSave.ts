import { useEffect } from 'react';
import { useGameStore } from '@/store/gameStore';

export const useAutoSave = () => {
  const { isPlaying, saveGame } = useGameStore();

  useEffect(() => {
    if (!isPlaying) return;

    // Guardar automáticamente cada 30 segundos cuando el juego está activo
    const autoSaveInterval = setInterval(() => {
      saveGame();
    }, 30000); // 30 segundos

    return () => {
      clearInterval(autoSaveInterval);
    };
  }, [isPlaying, saveGame]);

  // Guardar cuando el usuario cierra la página
  useEffect(() => {
    const handleBeforeUnload = () => {
      saveGame();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [saveGame]);
};
