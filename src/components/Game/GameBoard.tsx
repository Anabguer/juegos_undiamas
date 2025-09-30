'use client';

import React from 'react';
import { useGameStore } from '@/store/gameStore';
import { useGameTimer } from '@/hooks/useGameTimer';
import { useAutoSave } from '@/hooks/useAutoSave';
import { motion } from 'framer-motion';
import { StatusBars } from './StatusBars';
import { Character } from './Character';
import { CardDeck } from './CardDeck';
import { ZombieField } from './ZombieField';
import { Inventory } from './Inventory';
import { GameHUD } from './GameHUD';
import { GameMessage } from './GameMessage';
import { ItemFoundModal } from './ItemFoundModal';
import { TutorialModal } from './TutorialModal';
import { ItemSelectionGrid } from './ItemSelectionGrid';
import { FloatingMessage } from './FloatingMessage';
import { PauseOverlay } from './PauseOverlay';
import BlockedHouseModal from './BlockedHouseModal';
import { DayTransitionAnimation } from './DayTransitionAnimation';

// Función para obtener mensajes absurdos de items
const getAbsurdMessage = (itemName: string, quantity: number) => {
  // Mensajes específicos para items útiles
  const usefulMessages = {
    'Manzana': "¡Comida! Al menos quita el hambre… mejor que masticar aire.",
    'Agua': "Agua… vale, la sed no se mata sola.",
    'Pastilla': "Medicina… cura el contagio, no la estupidez.",
    'Bate': "Un bate… para darle duro a esos zombis.",
    'Bufanda': "Bufanda… porque morirse de frío no es tan épico."
  };

  // Si es un item útil, usar mensaje específico
  if (usefulMessages[itemName as keyof typeof usefulMessages]) {
    return usefulMessages[itemName as keyof typeof usefulMessages];
  }

  // Mensajes específicos para cada item basura
  const junkMessages = {
    'Pato de goma': "Un pato de goma… ¿le doy de comer o qué?",
    'CD rayado': "Un CD… espero que esté bueno con un poco de perejil.",
    'Osito de peluche': "Un osito… siempre quise un guardaespaldas blandito.",
    'Pelota desinflada': "Una pelota… sin aire, como yo los lunes.",
    'Calcetín': "¿Solo uno? Siempre pierdo el otro, incluso en el apocalipsis.",
    'Teléfono': "Un teléfono roto… igual aún tiene cobertura zombi.",
    'Zapato': "Un zapato… me falta el pie que combine.",
    'Libro': "Un libro mojado… edición de lujo apocalíptica.",
    'Llaves': "Llaves oxidadas… seguro que abren dramas.",
    'Sombrero': "Un sombrero… perfecto para la pasarela del fin del mundo."
  };
  
  // Si tiene mensaje específico, usarlo
  if (junkMessages[itemName as keyof typeof junkMessages]) {
    return junkMessages[itemName as keyof typeof junkMessages];
  }
  
  // Fallback genérico
  return "¿Esto? ¡No sé ni para qué sirve!";
};

export const GameBoard: React.FC = () => {
  const { 
    isPlaying, 
    isPaused, 
    gameOver, 
    gameEnding,
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
    isCold,
    isInfected,
    isShaking,
    flyingItem,
    flyingItemType,
    setShowHelp,
    showItemFoundModal,
    setShowItemFoundModal,
    foundItemName,
    foundItemImage,
    showTutorial,
    tutorialMessage,
    skipTutorial,
    tutorialPhase,
    setSkipTutorial,
    setShowTutorial,
    setTutorialMessage,
    showBlockedHouseModal,
    blockedHouseCardId,
    blockedHouseClicks,
    closeBlockedHouseModal,
    showDayTransition,
    transitionDay,
    hideDayTransitionAnimation
  } = useGameStore();

  // Iniciar el timer del juego
  useGameTimer();
  
  // Usar el hook de auto-guardado
  useAutoSave();

  // Efectos visuales según el estado
  const getBackgroundClass = () => {
    if (hour >= 20 || hour < 8) {
      return 'bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800'; // Noche
    }
    return 'bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600'; // Día
  };

  const getBackgroundImage = () => {
    if (hour >= 20 || hour < 8) {
      return { backgroundImage: 'url(/images/bg_night.png)' }; // Noche
    }
    return { backgroundImage: 'url(/images/bg_day.png)' }; // Día
  };

  const getScreenEffect = () => {
    const { hunger, thirst, health, isInfected, isCold } = useGameStore.getState();
    
    if (isInfected) {
      return 'filter hue-rotate-120 saturate-200 brightness-110 animate-pulse'; // Efecto verde psicodélico
    }
    if (hunger < 30) {
      return 'filter hue-rotate-0 saturate-200 brightness-125 animate-pulse'; // Efecto rojizo
    }
    if (thirst < 30) {
      return 'filter blur-sm brightness-90'; // Efecto borroso
    }
    if (isCold) {
      return 'filter brightness-60 hue-rotate-200 saturate-150'; // Efecto frío azulado
    }
    return '';
  };

  // Pantalla de resumen del inventario
  if (showInventorySummary) {
    const getInventorySummary = () => {
      const summary: string[] = [];
      
      // Items útiles
      const usefulItems = ['Manzana', 'Agua', 'Pastilla', 'Bate', 'Bufanda'];
      usefulItems.forEach(itemName => {
        const item = inventory.find(i => i.name === itemName);
        const quantity = item ? item.quantity : 0;
        if (quantity > 0) {
          summary.push(`${quantity} ${itemName}`);
        }
      });
      
      // Items de basura (todos los que se recogieron, incluso con cantidad 0)
      const junkItems = inventory.filter(item => !usefulItems.includes(item.name));
      junkItems.forEach(item => {
        const quantity = item.quantity;
        // Mostrar todos los items basura, incluso con cantidad 0
        summary.push(`${quantity} ${item.name}`);
      });
      
      return summary;
    };


    const inventorySummary = getInventorySummary();

    return (
      <div 
        className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat px-4"
        style={{ backgroundImage: 'url(/images/inventario0.png)' }}
      >
        <div className="text-center text-white max-w-2xl mx-auto bg-black bg-opacity-70 rounded-lg p-6 sm:p-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-6 text-yellow-400">Tu Inventario</h1>
          
          <div 
            className="text-left space-y-3 text-sm sm:text-base max-h-96 overflow-y-auto pr-2"
            style={{
              scrollbarWidth: 'thin',
              scrollbarColor: '#4B5563 #1F2937'
            }}
          >
            {inventorySummary.length === 0 ? (
              <p className="text-red-400 font-semibold">¡No recogiste nada! ¡Buena suerte sobreviviendo!</p>
            ) : (
              <>
                {/* SECCIÓN 1: COSAS ÚTILES SUPONGO */}
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold mb-3 text-yellow-300" style={{ fontFamily: 'Comic Sans MS, cursive', textShadow: '1px 1px 0px #000' }}>
                    Cosas útiles supongo
                  </h2>
                  <div className="space-y-3">
                    {inventorySummary
                      .filter(item => {
                        const [quantity, ...nameParts] = item.split(' ');
                        const itemName = nameParts.join(' ');
                        return ['Manzana', 'Agua', 'Pastilla', 'Bate', 'Bufanda'].includes(itemName);
                      })
                      .map((item, index) => {
                        const [quantity, ...nameParts] = item.split(' ');
                        const itemName = nameParts.join(' ');
                        const absurdMessage = getAbsurdMessage(itemName, parseInt(quantity));
                        
                        // Mapear nombres a rutas de imágenes correctas
                        const getItemImage = (name: string) => {
                          const imageMap: { [key: string]: string } = {
                            'Manzana': '/images/apple.png',
                            'Agua': '/images/water.png',
                            'Pastilla': '/images/pill.png',
                            'Bate': '/images/bat.png',
                            'Bufanda': '/images/scarf.png',
                            'Pato de goma': '/images/duck.png',
                            'CD rayado': '/images/cd.png',
                            'Osito de peluche': '/images/plush.png',
                            'Pelota desinflada': '/images/ball.png',
                            'Calcetín': '/images/calcetin.png',
                            'Teléfono': '/images/telefono.png',
                            'Zapato': '/images/zapato.png',
                            'Libro': '/images/libro.png',
                            'Llaves': '/images/llaves.png',
                            'Sombrero': '/images/hat.png'
                          };
                          return imageMap[name] || '/images/apple.png';
                        };

                        return (
                          <div key={index} className="flex items-center space-x-3">
                            <img 
                              src={getItemImage(itemName)} 
                              alt={itemName}
                              className="w-6 h-6 sm:w-8 sm:h-8 object-contain"
                            />
                            <span className="text-gray-300">{absurdMessage}</span>
                          </div>
                        );
                      })}
                  </div>
                </div>

                {/* SECCIÓN 2: ESTO ES BASURA */}
                {inventorySummary.some(item => {
                  const [quantity, ...nameParts] = item.split(' ');
                  const itemName = nameParts.join(' ');
                  return !['Manzana', 'Agua', 'Pastilla', 'Bate', 'Bufanda'].includes(itemName);
                }) && (
                  <div className="mt-6">
                    <h2 className="text-xl sm:text-2xl font-bold mb-3 text-gray-300" style={{ fontFamily: 'Comic Sans MS, cursive', textShadow: '1px 1px 0px #000' }}>
                      Esto es basura
                    </h2>
                    <div className="space-y-3">
                      {inventorySummary
                        .filter(item => {
                          const [quantity, ...nameParts] = item.split(' ');
                          const itemName = nameParts.join(' ');
                          return !['Manzana', 'Agua', 'Pastilla', 'Bate', 'Bufanda'].includes(itemName);
                        })
                        .map((item, index) => {
                          const [quantity, ...nameParts] = item.split(' ');
                          const itemName = nameParts.join(' ');
                          const absurdMessage = getAbsurdMessage(itemName, parseInt(quantity));
                          
                          // Mapear nombres a rutas de imágenes correctas
                          const getItemImage = (name: string) => {
                            const imageMap: { [key: string]: string } = {
                              'Manzana': '/images/apple.png',
                              'Agua': '/images/water.png',
                              'Pastilla': '/images/pill.png',
                              'Bate': '/images/bat.png',
                              'Bufanda': '/images/scarf.png',
                              'Pato de goma': '/images/duck.png',
                              'CD rayado': '/images/cd.png',
                              'Osito de peluche': '/images/plush.png',
                              'Pelota desinflada': '/images/ball.png',
                              'Calcetín': '/images/calcetin.png',
                              'Teléfono': '/images/telefono.png',
                              'Zapato': '/images/zapato.png',
                              'Libro': '/images/libro.png',
                              'Llaves': '/images/llaves.png',
                              'Sombrero': '/images/hat.png'
                            };
                            return imageMap[name] || '/images/apple.png';
                          };

                          return (
                            <div key={index} className="flex items-center space-x-3">
                              <img 
                                src={getItemImage(itemName)} 
                                alt={itemName}
                                className="w-6 h-6 sm:w-8 sm:h-8 object-contain opacity-70"
                              />
                              <span className="text-gray-400">{absurdMessage}</span>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
          
                 <div className="mt-8 mb-8 sm:mb-12">
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
                     ¡A VER CUÁNTO SOBREVIVO!
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
            GUÍA DE SUPERVIVENCIA
          </h1>
          
          <div className="text-left space-y-4 text-sm sm:text-base">
            <p className="text-yellow-300 font-bold" style={{ fontFamily: 'Comic Sans MS, cursive' }}><strong>OBJETIVO:</strong> Sobrevive el máximo número de días posible</p>
            
            <p className="text-white" style={{ fontFamily: 'Comic Sans MS, cursive' }}><strong>CÓMO JUGAR:</strong></p>
            
            <p className="text-green-400" style={{ fontFamily: 'Comic Sans MS, cursive' }}><strong>ITEMS ÚTILES:</strong>
              <br/>• <span className="text-green-300">Manzana</span> - Restaura hambre (+30)
              <br/>• <span className="text-blue-300">Agua</span> - Restaura sed (+30)
              <br/>• <span className="text-red-300">Pastilla</span> - Cura infección zombie (+20 salud)
              <br/>• <span className="text-yellow-300">Bate</span> - Mata zombies (haz clic en inventario)
              <br/>• <span className="text-purple-300">Bufanda</span> - Protege del frío nocturno
            </p>
            
            <p className="text-blue-400" style={{ fontFamily: 'Comic Sans MS, cursive' }}><strong>NOCTURNO (21:00-05:00):</strong> Hace frío, necesitas bufanda o te bajará el hambre y luego ya sabes lo que pasa</p>
            
            <p className="text-red-400" style={{ fontFamily: 'Comic Sans MS, cursive' }}><strong>PELIGROS:</strong> Si tu hambre, sed o salud llegan a 0, mueres</p>
            
            <p className="text-orange-400" style={{ fontFamily: 'Comic Sans MS, cursive' }}><strong>ZOMBIES:</strong> Te contagian si no los matas antes con el bate, bajarán tu sed y hambre más rápido. Haz clic en el bate del inventario para matarlos</p>
            
            <p className="text-purple-400" style={{ fontFamily: 'Comic Sans MS, cursive' }}><strong>CASAS:</strong> Haz clic para recoger items. Algunas están bloqueadas y necesitarán más clicks.</p>
            
            <p className="text-yellow-400" style={{ fontFamily: 'Comic Sans MS, cursive' }}><strong>USAR ITEMS:</strong> Haz clic en los items del inventario de abajo para usarlos</p>
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
              ¡VOLVER AL JUEGO!
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
          {/* Logo arriba */}
          <div className="mb-6">
            <img 
              src="/images/logo.png" 
              alt="Logo del juego" 
              className="mx-auto w-32 h-32 sm:w-40 sm:h-40 object-contain"
            />
          </div>
          
          {/* Texto de presentación de Cucho */}
          <div className="text-center space-y-4 text-lg sm:text-xl">
            <p className="text-white font-bold" style={{ fontFamily: 'Comic Sans MS, cursive' }}>
              Estupendo… ahora resulta que yo, Cucho, tengo que currar para sobrevivir. Genial.
            </p>
            
            <p className="text-white font-bold" style={{ fontFamily: 'Comic Sans MS, cursive' }}>
              Y encima oigo zombis. Vale, me piro, pero antes me llevo lo que pueda.
            </p>
            
            <p className="text-white font-bold" style={{ fontFamily: 'Comic Sans MS, cursive' }}>
              ¡A ver quién manda aquí!
            </p>
          </div>
          
          <div className="mt-8 space-y-4">
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
              className="min-h-screen flex items-end justify-center bg-cover bg-center bg-no-repeat px-4 pb-16 sm:pb-20"
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
    console.log(`GAME BOARD - gameOver: ${gameOver}, gameEnding:`, gameEnding);
    
    // Mostrar pantalla de muerte incluso si gameEnding es null
    const defaultEnding = {
      type: 'ABSURD',
      title: "¡Has Muerto!",
      message: "Algo salió mal y no sabemos qué pasó exactamente...",
      image: "/images/final_absurdo.png",
      isGood: false
    };
    
    const endingToShow = gameEnding || defaultEnding;
    
    // Frases específicas de Peluso para cada tipo de final (las correctas)
    const getPelusoQuote = (endingType: string) => {
      const quotes = {
        'HUNGER': "Murió de hambre… aunque rodeado de buffet libre.",
        'THIRST': "Ni un vaso de agua le dieron. Tragedia griega.",
        'COLD': "Se quedó helado… literalmente.",
        'ZOMBIE': "Se unió al equipo contrario. ¡Ahora muerde mejor que come!",
        'ABSURD': "Murió como vivió: abrazado a su peluche favorito."
      };
      
      return quotes[endingType as keyof typeof quotes] || quotes['ABSURD'];
    };
    
    const pelusoQuote = getPelusoQuote(endingToShow.type);
    
    console.log(`GAME BOARD - Mostrando pantalla de final:`, endingToShow);
    return (
      <div className="min-h-screen relative overflow-hidden">
        {/* Imagen de fondo que ocupa toda la pantalla */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${endingToShow.image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
        
        {/* Overlay oscuro para que el texto se vea bien - reducido para ver mejor la imagen */}
        <div className="absolute inset-0 bg-black bg-opacity-30" />
        
        {/* Contenido centrado */}
        <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
          <div className="text-center text-white max-w-lg mx-auto bg-black bg-opacity-80 rounded-xl p-6 sm:p-8">
            {/* Título del final */}
            <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-yellow-400" style={{ fontFamily: 'Comic Sans MS, cursive', textShadow: '3px 3px 0px #000' }}>
              {endingToShow.title}
            </h1>
            
            {/* Mensaje del final */}
            <p className="text-lg sm:text-xl mb-6 text-gray-200" style={{ fontFamily: 'Comic Sans MS, cursive' }}>
              {endingToShow.message}
            </p>
            
            {/* Estadísticas */}
            <div className="mb-6 text-sm sm:text-base text-gray-300">
              <p>Has sobrevivido <span className="text-yellow-400 font-bold">{day}</span> días</p>
            </div>
            
            {/* Frase irónica de Peluso */}
            <div className="mb-6 p-4 bg-yellow-400 bg-opacity-20 rounded-lg border-2 border-yellow-400">
              <div className="flex items-center justify-center mb-2">
                <img 
                  src="/images/ositonarrador.png" 
                  alt="Peluso" 
                  className="w-8 h-8 mr-2"
                />
                <span className="text-yellow-400 font-bold text-sm">Peluso dice:</span>
              </div>
              <p className="text-yellow-200 text-sm italic" style={{ fontFamily: 'Comic Sans MS, cursive' }}>
                "{pelusoQuote}"
              </p>
            </div>
            
            {/* Botón de reintentar */}
            <button
              onClick={() => {
                console.log(`GAME BOARD - Botón reintentar presionado`);
                resetGame();
              }}
              className="bg-yellow-400 text-black px-6 py-3 sm:px-8 sm:py-4 rounded-xl text-lg sm:text-xl font-black hover:bg-yellow-300 transition-colors touch-manipulation shadow-2xl border-4 border-black transform hover:scale-105"
              style={{ 
                minHeight: '50px',
                fontFamily: 'Comic Sans MS, cursive',
                textShadow: '2px 2px 0px #000',
                boxShadow: '4px 4px 0px #000'
              }}
            >
              ¡Intentar de Nuevo!
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`h-screen overflow-hidden ${getBackgroundClass()} ${getScreenEffect()} ${isShaking ? 'animate-pulse' : ''} transition-all duration-1000 bg-cover bg-center bg-no-repeat`}
      style={getBackgroundImage()}
    >
      {/* Item Found Modal */}
      <ItemFoundModal
        isOpen={showItemFoundModal}
        itemName={foundItemName}
        itemImage={foundItemImage}
        funnyPhrase={getAbsurdMessage(foundItemName, 1)}
        isTutorial={showTutorial && tutorialPhase === 'item_revealed'}
        onClose={() => {
          setShowItemFoundModal(false);
          // Limpiar cartas después de cerrar el modal
          useGameStore.getState().generateCards();
        }}
      />
      {/* HUD del juego */}
      <GameHUD />
      
      
      {/* Contenido principal */}
      <div className="h-full flex flex-col px-2 sm:px-4 pt-16 sm:pt-20 pb-20 sm:pb-24">
        {/* Barras de estado en una línea */}
        <StatusBars />
        
        {/* Campo de zombis - ARRIBA DE LAS CARTAS */}
        <ZombieField />
        
        {/* Cartas */}
        <CardDeck />
        
        {/* Personaje (más grande) - flex-grow para ocupar espacio restante */}
        <div className="flex-grow flex items-center justify-center">
          <Character />
        </div>
      </div>
      
      {/* Inventario y mensaje juntos al final */}
      <div className="fixed bottom-0 left-0 right-0 z-40">
        {/* Inventario */}
        <div className="px-2 sm:px-4">
          <Inventory />
        </div>
        
        {/* Banner negro para móvil */}
        <div className="bg-transparent px-4 py-5 sm:py-6">
          <p className="text-white text-center text-sm sm:text-base font-bold drop-shadow-lg" style={{ fontFamily: 'Comic Sans MS, cursive' }}>
            ¿Cuántos días sobrevivirás?
          </p>
        </div>
        
        {/* Mensajes eliminados - ahora son modales */}
      </div>
      
      {/* Modal de tutorial - DESHABILITADO */}
      {/* <TutorialModal
        isOpen={showTutorial}
        message={tutorialMessage}
        onClose={() => setShowTutorial(false)}
      /> */}
      
      {/* Mensaje flotante de Peluso */}
      <FloatingMessage
        message={currentMessage}
        isVisible={showMessage}
        onClose={() => useGameStore.getState().hideMessage()}
        isGuide={showTutorial}
      />
      
      {/* Overlay de pausa cuando aparece Peluso */}
      <PauseOverlay isVisible={isPaused && showMessage} />
      
      {/* Modal de casa bloqueada */}
      <BlockedHouseModal
        isVisible={showBlockedHouseModal}
        cardId={blockedHouseCardId || ''}
        clicks={blockedHouseClicks}
        totalClicks={10}
        onClose={closeBlockedHouseModal}
      />
      
      {/* Efecto de vuelo de item */}
      {flyingItem && (
        <div className="fixed inset-0 pointer-events-none z-50">
          <motion.div
            initial={{ 
              scale: 0, 
              x: flyingItemType === 'from_bear' ? -200 : 0, 
              y: flyingItemType === 'from_bear' ? -200 : 200 
            }}
            animate={{ 
              scale: 1, 
              x: flyingItemType === 'from_bear' ? 200 : 0, 
              y: flyingItemType === 'from_bear' ? 200 : -200 
            }}
            exit={{ 
              scale: 0, 
              x: flyingItemType === 'from_bear' ? 200 : 0, 
              y: flyingItemType === 'from_bear' ? 200 : -200 
            }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="w-12 h-12"
            style={{ 
              position: 'absolute',
              top: flyingItemType === 'from_bear' ? '20%' : '80%',
              left: flyingItemType === 'from_bear' ? '10%' : '50%',
              transform: flyingItemType === 'from_bear' ? 'none' : 'translateX(-50%)'
            }}
          >
            {flyingItem === 'Manzana' && <img src="/images/apple.png" alt="Manzana" className="w-12 h-12 object-contain" />}
            {flyingItem === 'Agua' && <img src="/images/water.png" alt="Agua" className="w-12 h-12 object-contain" />}
            {flyingItem === 'Pastilla' && <img src="/images/pill.png" alt="Pastilla" className="w-12 h-12 object-contain" />}
            {flyingItem === 'Bate' && <img src="/images/bat.png" alt="Bate" className="w-12 h-12 object-contain" />}
            {flyingItem === 'Bufanda' && <img src="/images/scarf.png" alt="Bufanda" className="w-12 h-12 object-contain" />}
          </motion.div>
        </div>
      )}
      
      {/* Animación de transición de día */}
      <DayTransitionAnimation
        isVisible={showDayTransition}
        day={day}
        onComplete={hideDayTransitionAnimation}
      />
      
    </div>
  );
};





