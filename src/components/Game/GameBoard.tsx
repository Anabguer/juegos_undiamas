'use client';

import React from 'react';
import { useGameStore } from '@/store/gameStore';
import { useGameTimer } from '@/hooks/useGameTimer';
import { StatusBars } from './StatusBars';
import { Character } from './Character';
import { CardDeck } from './CardDeck';
import { ZombieField } from './ZombieField';
import { Inventory } from './Inventory';
import { GameHUD } from './GameHUD';
import { GameMessage } from './GameMessage';
import { ItemSelectionGrid } from './ItemSelectionGrid';

export const GameBoard: React.FC = () => {
  const { 
    isPlaying, 
    isPaused, 
    gameOver, 
    day, 
    hour, 
    minute,
    currentMessage,
    showMessage,
    startGame,
    pauseGame,
    resumeGame,
    resetGame,
    showItemSelection,
    showManual,
    showInventorySummary,
    inventory,
    showHelp,
    setShowHelp
  } = useGameStore();

  // Iniciar el timer del juego
  useGameTimer();

  // Efectos visuales según el estado
  const getBackgroundClass = () => {
    if (hour >= 20 || hour < 8) {
      return 'bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800'; // Noche
    }
    return 'bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600'; // Día
  };

  const getBackgroundImage = () => {
    if (hour >= 20 || hour < 8) {
      return { backgroundImage: 'url(/images/noche.png)' }; // Noche
    }
    return { backgroundImage: 'url(/images/dia.png)' }; // Día
  };

  const getScreenEffect = () => {
    const { hunger, thirst, health, isInfected, isCold } = useGameStore.getState();
    
    if (isInfected) {
      return 'filter hue-rotate-90 saturate-150'; // Efecto verde psicodélico
    }
    if (hunger < 30) {
      return 'filter hue-rotate-0 saturate-150 brightness-110'; // Efecto rojizo
    }
    if (thirst < 30) {
      return 'filter blur-sm'; // Efecto borroso
    }
    if (isCold) {
      return 'filter brightness-75'; // Efecto frío
    }
    return '';
  };

  // Pantalla de resumen del inventario
  if (showInventorySummary) {
    const getInventorySummary = () => {
      const summary = [];
      
      // Items útiles
      const usefulItems = ['Manzana', 'Agua', 'Pastilla', 'Bate', 'Bufanda'];
      usefulItems.forEach(itemName => {
        const item = inventory.find(i => i.name === itemName);
        const quantity = item ? item.quantity : 0;
        if (quantity > 0) {
          summary.push(`${quantity} ${itemName}${quantity > 1 ? 's' : ''}`);
        }
      });
      
      // Items de basura (solo los que se recogieron)
      const junkItems = inventory.filter(item => !usefulItems.includes(item.name));
      junkItems.forEach(item => {
        const quantity = item.quantity;
        if (quantity > 0) {
          summary.push(`${quantity} ${item.name}${quantity > 1 ? 's' : ''}`);
        }
      });
      
      return summary;
    };

    const getAbsurdMessage = (itemName: string, quantity: number) => {
      const messages = {
        // Items útiles
        'Manzana': "¡Perfecto! Ahora no morirás de hambre... por ahora.",
        'Agua': "¡Agua! El líquido de la vida. O de la supervivencia.",
        'Pastilla': "¡Medicina! Para cuando los zombis te muerdan.",
        'Bate': "¡Arma! Para golpear zombis en la cabeza.",
        'Bufanda': "¡Ropa! Para no morir de frío... o de vergüenza.",
        
        // Items de basura
        'Pato de goma': "¿Un pato de goma? ¡Muy útil para... nada!",
        'CD rayado': "¿Un CD? ¿Quién tiene un lector de esto?",
        'Osito de peluche': "¿Un osito? ¡Yo no juego con esas cosas!",
        'Pelota desinflada': "¿Una pelota? ¡Está desinflada!",
        'Calcetín': "¿Un calcetín? ¡Esto está agujereado!",
        'Teléfono': "¿Un teléfono? ¡Esto no tiene señal!",
        'Zapato': "¿Un zapato? ¡Esto está roto!",
        'Libro': "¿Un libro? ¡Esto está mojado!",
        'Llaves': "¿Unas llaves? ¡Esto no abre nada!",
        'Sombrero': "¿Un sombrero? ¡Ahora no estoy para postureo!",
        'Pollo': "¿Pollo? ¡Esto está podrido!",
        'Patatas': "¿Patatas? ¡Están blandas!",
        'Jugo': "¿Jugo? ¡Esto está agrio!",
        'Refresco': "¿Refresco? ¡Esto está caliente!",
        'Antídoto': "¿Antídoto? ¡Esto está caducado!"
      };
      
      return messages[itemName as keyof typeof messages] || "¡Qué objeto más raro!";
    };

    const inventorySummary = getInventorySummary();

    return (
      <div 
        className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat px-4"
        style={{ backgroundImage: 'url(/images/inventario0.png)' }}
      >
        <div className="text-center text-white max-w-2xl mx-auto bg-black bg-opacity-70 rounded-lg p-6 sm:p-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-6 text-yellow-400">🎒 Tu Inventario</h1>
          
          <div className="text-left space-y-3 text-sm sm:text-base">
            {inventorySummary.length === 0 ? (
              <p className="text-red-400 font-semibold">¡No recogiste nada! ¡Buena suerte sobreviviendo!</p>
            ) : (
              inventorySummary.map((item, index) => {
                const [quantity, ...nameParts] = item.split(' ');
                const itemName = nameParts.join(' ');
                const absurdMessage = getAbsurdMessage(itemName, parseInt(quantity));
                
                return (
                  <div key={index} className="flex items-center space-x-3">
                    <span className="text-yellow-400 font-bold">{item}:</span>
                    <span className="text-gray-300">{absurdMessage}</span>
                  </div>
                );
              })
            )}
          </div>
          
          <div className="mt-8">
            <button
              onClick={() => {
                useGameStore.getState().setShowInventorySummary(false);
                startGame();
              }}
              className="bg-yellow-400 text-black px-6 py-3 sm:px-8 sm:py-4 rounded-xl text-lg sm:text-xl font-black hover:bg-yellow-300 transition-colors touch-manipulation shadow-2xl border-4 border-black transform hover:scale-105"
              style={{ 
                minHeight: '50px',
                fontFamily: 'Comic Sans MS, cursive',
                textShadow: '2px 2px 0px #000',
                boxShadow: '4px 4px 0px #000'
              }}
            >
              ¡A VER CUÁNTO SOBREVIVO! 🎮
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Pantalla de ayuda
  if (showHelp) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat px-4"
        style={{ backgroundImage: 'url(/images/portada.png)' }}
      >
        <div className="text-center text-white max-w-2xl mx-auto bg-black bg-opacity-80 rounded-xl p-6 sm:p-8">
          <h1 className="text-3xl sm:text-4xl font-black mb-6 text-yellow-400" style={{ fontFamily: 'Comic Sans MS, cursive', textShadow: '3px 3px 0px #000' }}>
            🧟 ¿CÓMO SOBREVIVIR?
          </h1>
          
          <div className="text-left space-y-4 text-sm sm:text-base">
            <p className="text-yellow-300 font-bold" style={{ fontFamily: 'Comic Sans MS, cursive' }}>🎯 <strong>Tu misión:</strong> Sobrevive el máximo número de días posible</p>
            
            <p className="text-white" style={{ fontFamily: 'Comic Sans MS, cursive' }}>⏰ <strong>Tiempo:</strong> Cada día tiene 24 horas. El tiempo pasa automáticamente</p>
            
            <p className="text-green-400" style={{ fontFamily: 'Comic Sans MS, cursive' }}>🍎 <strong>Items útiles:</strong> Solo 5 tipos te ayudarán:
              <br/>• <span className="text-green-300">Manzana</span> - Restaura hambre
              <br/>• <span className="text-blue-300">Agua</span> - Restaura sed  
              <br/>• <span className="text-red-300">Pastilla</span> - Cura infección
              <br/>• <span className="text-yellow-300">Bate</span> - Defiende de zombis
              <br/>• <span className="text-purple-300">Bufanda</span> - Protege del frío
            </p>
            
            <p className="text-gray-300" style={{ fontFamily: 'Comic Sans MS, cursive' }}>🗑️ <strong>Basura:</strong> El resto son objetos inútiles que solo dan mensajes graciosos</p>
            
            <p className="text-blue-400" style={{ fontFamily: 'Comic Sans MS, cursive' }}>🎴 <strong>Cartas:</strong> Aparecerán situaciones que requieren items específicos</p>
            
            <p className="text-red-400" style={{ fontFamily: 'Comic Sans MS, cursive' }}>🧟 <strong>Zombis:</strong> Aparecen y se acercan. Si te tocan, te infectan</p>
          </div>
          
          <div className="mt-8">
            <button
              onClick={() => {
                setShowHelp(false);
                resumeGame();
              }}
              className="bg-yellow-400 text-black px-6 py-3 sm:px-8 sm:py-4 rounded-xl text-lg sm:text-xl font-black hover:bg-yellow-300 transition-colors touch-manipulation shadow-2xl border-4 border-black transform hover:scale-105"
              style={{ 
                minHeight: '50px',
                fontFamily: 'Comic Sans MS, cursive',
                textShadow: '2px 2px 0px #000',
                boxShadow: '4px 4px 0px #000'
              }}
            >
              ¡VOLVER AL JUEGO! 🎮
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Pantalla de selección de objetos
  if (showItemSelection) {
    return <ItemSelectionGrid />;
  }

  // Pantalla del manual
  if (showManual) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat px-4"
        style={{ backgroundImage: 'url(/images/portada.png)' }}
      >
        <div className="text-center text-white max-w-lg mx-auto bg-black bg-opacity-80 rounded-xl p-6 sm:p-8">
          <h1 className="text-4xl sm:text-5xl font-black mb-6 text-yellow-400" style={{ fontFamily: 'Comic Sans MS, cursive', textShadow: '3px 3px 0px #000' }}>
            🧟 ¡BIENVENIDO AL APOCALIPSIS!
          </h1>
          
          <div className="text-center space-y-4 text-lg sm:text-xl">
            <p className="text-white font-bold" style={{ fontFamily: 'Comic Sans MS, cursive' }}>
              ¡CORREEE! QUE VIENEN ZOMBIS!
            </p>
            
            <p className="text-white font-bold" style={{ fontFamily: 'Comic Sans MS, cursive' }}>
              ¡COGE TODO LO QUE PUEDAS Y LUEGO VEMOS SI SOBREVIVES!
            </p>
          </div>
          
          <div className="mt-8">
            <button
              onClick={() => useGameStore.getState().setShowItemSelection(true)}
              className="bg-yellow-400 text-black px-8 py-4 sm:px-12 sm:py-6 rounded-xl text-xl sm:text-2xl font-black hover:bg-yellow-300 transition-colors touch-manipulation shadow-2xl border-4 border-black transform hover:scale-105"
              style={{ 
                minHeight: '60px',
                fontFamily: 'Comic Sans MS, cursive',
                textShadow: '2px 2px 0px #000',
                boxShadow: '4px 4px 0px #000'
              }}
            >
              ¡AL LÍO!
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!isPlaying) {
    return (
      <div 
        className="min-h-screen flex items-end justify-center bg-cover bg-center bg-no-repeat px-4 pb-8 sm:pb-12"
        style={{ backgroundImage: 'url(/images/portada.png)' }}
      >
        <div className="text-center">
          <button
            onClick={() => useGameStore.getState().setShowManual(true)}
            className="bg-yellow-400 text-black px-8 py-4 sm:px-12 sm:py-6 rounded-xl text-xl sm:text-2xl font-black hover:bg-yellow-300 transition-colors touch-manipulation shadow-2xl border-4 border-black transform hover:scale-105"
            style={{ 
              minHeight: '60px',
              fontFamily: 'Comic Sans MS, cursive',
              textShadow: '2px 2px 0px #000',
              boxShadow: '4px 4px 0px #000'
            }}
          >
            ¡EMPEZAR A SOBREVIVIR!
          </button>
        </div>
      </div>
    );
  }

  if (gameOver) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-900 via-gray-900 to-red-800 px-4">
        <div className="text-center text-white max-w-md mx-auto">
          <h1 className="text-4xl sm:text-6xl font-bold mb-4">💀 Game Over</h1>
          <p className="text-lg sm:text-xl mb-4">Has sobrevivido {day} días</p>
          <button
            onClick={resetGame}
            className="bg-apocalypse-accent text-apocalypse-dark px-6 py-3 sm:px-8 sm:py-4 rounded-lg text-lg sm:text-xl font-bold hover:bg-yellow-400 transition-colors touch-manipulation w-full sm:w-auto"
            style={{ minHeight: '44px' }}
          >
            Intentar de Nuevo
          </button>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`min-h-screen ${getBackgroundClass()} ${getScreenEffect()} transition-all duration-1000 bg-cover bg-center bg-no-repeat`}
      style={getBackgroundImage()}
    >
      {/* HUD del juego */}
      <GameHUD />
      
      {/* Botón de ayuda */}
      <button
        onClick={() => {
          pauseGame();
          setShowHelp(true);
        }}
        className="fixed top-2 right-2 sm:top-4 sm:right-4 z-50 bg-yellow-400 text-black w-12 h-12 sm:w-14 sm:h-14 rounded-full font-black text-xl sm:text-2xl hover:bg-yellow-300 transition-colors touch-manipulation shadow-2xl border-4 border-black transform hover:scale-105"
        style={{ 
          fontFamily: 'Comic Sans MS, cursive',
          textShadow: '2px 2px 0px #000',
          boxShadow: '4px 4px 0px #000'
        }}
        title="Ayuda"
      >
        ?
      </button>
      
      {/* Mensaje del juego */}
      {showMessage && <GameMessage message={currentMessage} />}
      
      {/* Contenido principal */}
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
        {/* Barras de estado en una línea */}
        <StatusBars />
        
        {/* Cartas */}
        <CardDeck />
        
        {/* Personaje (más grande) */}
        <Character />
        
        {/* Campo de zombis */}
        <ZombieField />
        
        {/* Inventario en grid horizontal de todo el ancho */}
        <div className="mt-6 sm:mt-8">
          <Inventory />
        </div>
      </div>
      
      {/* Controles del juego */}
      <div className="fixed bottom-2 right-2 sm:bottom-4 sm:right-4 flex gap-2">
        {isPaused ? (
          <button
            onClick={resumeGame}
            className="bg-green-600 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg hover:bg-green-700 transition-colors text-sm sm:text-base touch-manipulation"
            style={{ minHeight: '44px', minWidth: '44px' }}
          >
            ▶️ Continuar
          </button>
        ) : (
          <button
            onClick={pauseGame}
            className="bg-yellow-600 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg hover:bg-yellow-700 transition-colors text-sm sm:text-base touch-manipulation"
            style={{ minHeight: '44px', minWidth: '44px' }}
          >
            ⏸️ Pausar
          </button>
        )}
      </div>
    </div>
  );
};
