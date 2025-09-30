'use client';

import { GameBoard } from '@/components/Game/GameBoard';
import { useGameStore } from '@/store/gameStore';
import { useEffect, useState } from 'react';

export default function Home() {
  const { hasSavedGame, loadGame, deleteSavedGame, startGame } = useGameStore();
  const [showSaveOptions, setShowSaveOptions] = useState(false);

  useEffect(() => {
    // Mostrar opciones de partida guardada si existe una
    if (hasSavedGame()) {
      setShowSaveOptions(true);
    }
  }, []);

  const handleNewGame = () => {
    setShowSaveOptions(false);
    deleteSavedGame(); // Eliminar partida guardada antes de empezar nueva
    startGame();
  };

  const handleLoadGame = () => {
    const loaded = loadGame();
    if (loaded) {
      setShowSaveOptions(false);
      startGame();
    }
  };

  const handleDeleteSave = () => {
    deleteSavedGame();
    setShowSaveOptions(false);
  };

  return (
    <main className="h-screen overflow-hidden">
      {showSaveOptions && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-8 rounded-lg border-2 border-yellow-400 max-w-md mx-4">
            <h2 className="text-2xl font-bold text-white mb-4 text-center">
              ¡Partida Guardada Encontrada!
            </h2>
            <p className="text-gray-300 mb-6 text-center">
              Tienes una partida guardada. ¿Qué quieres hacer?
            </p>
            
            <div className="space-y-4">
              <button
                onClick={handleLoadGame}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
              >
                Continuar Partida
              </button>
              
              <button
                onClick={handleNewGame}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
              >
                Nueva Partida
              </button>
              
              <button
                onClick={handleDeleteSave}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
              >
                Eliminar Partida Guardada
              </button>
            </div>
          </div>
        </div>
      )}
      
      <GameBoard />
    </main>
  );
}
