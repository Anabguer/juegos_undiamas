'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import { ItemType } from '@/types/game';

interface GridItem {
  id: string;
  type: ItemType;
  name: string;
  emoji: string;
  image?: string;
  x: number;
  y: number;
  scale: number;
  rotation: number;
}

export const ItemSelectionGrid: React.FC = () => {
  const { startGame, addToInventory, pauseItemSearch } = useGameStore();
  
  // Limpiar inventario al empezar la selección de items
  useEffect(() => {
    useGameStore.setState({ inventory: [] });
  }, []);
  const [timeLeft, setTimeLeft] = useState(8);
  const [gridItems, setGridItems] = useState<GridItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [usefulItemsCount, setUsefulItemsCount] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Listener para la tecla 'D' para pausar/continuar
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === 'd') {
        setIsPaused(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  // Generar items del grid
  useEffect(() => {
    const items: GridItem[] = [];
    const itemTypes = [
      // ITEMS ÚTILES FIJOS (solo los 5 que van al inventario)
      { type: 'food', name: 'Manzana', emoji: '🍏', image: '/images/apple.png' },
      { type: 'drink', name: 'Agua', emoji: '💧', image: '/images/water.png' },
      { type: 'medicine', name: 'Pastilla', emoji: '💊', image: '/images/pill.png' },
      { type: 'weapon', name: 'Bate', emoji: '🏏', image: '/images/bat.png' },
      { type: 'clothing', name: 'Bufanda', emoji: '🧣', image: '/images/scarf.png' },
      
      // BASURA GRACIOSA (SIN COMIDA/BEBIDA)
      { type: 'junk', name: 'Pato de goma', emoji: '🦆', image: '/images/duck.png' },
      { type: 'junk', name: 'CD rayado', emoji: '💿', image: '/images/cd.png' },
      { type: 'junk', name: 'Osito de peluche', emoji: '🧸', image: '/images/plush.png' },
      { type: 'junk', name: 'Pelota desinflada', emoji: '⚽', image: '/images/ball.png' },
      { type: 'junk', name: 'Calcetín', emoji: '🧦', image: '/images/calcetin.png' },
      { type: 'junk', name: 'Teléfono', emoji: '📱', image: '/images/telefono.png' },
      { type: 'junk', name: 'Zapato', emoji: '👞', image: '/images/zapato.png' },
      { type: 'junk', name: 'Libro', emoji: '📖', image: '/images/libro.png' },
      { type: 'junk', name: 'Llaves', emoji: '🗝️', image: '/images/llaves.png' },
      { type: 'junk', name: 'Sombrero', emoji: '🎩', image: '/images/hat.png' },
    ];

    // Crear repeticiones de cada item (caos controlado) - MÁS ITEMS
    for (let i = 0; i < 400; i++) { // Aumentado de 200 a 400 para más items
      const itemType = itemTypes[Math.floor(Math.random() * itemTypes.length)];
      items.push({
        id: `${itemType.type}-${i}`,
        type: itemType.type as ItemType,
        name: itemType.name,
        emoji: itemType.emoji,
        image: itemType.image,
        x: Math.random() * 100,
        y: Math.random() * 100,
        scale: 0.9 + Math.random() * 0.8, // Más grandes y más variación
        rotation: Math.random() * 360,
      });
    }

    setGridItems(items);
  }, []);

  // Timer de 13 segundos
  useEffect(() => {
    if (timeLeft > 0 && !isPaused) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      // Tiempo agotado, parar sonido de búsqueda y mostrar resumen del inventario
      console.log('ITEM SELECTION - Tiempo agotado, llamando pauseItemSearch...');
      if (pauseItemSearch) {
        pauseItemSearch();
      }
      console.log('ITEM SELECTION - pauseItemSearch llamado, mostrando resumen...');
      useGameStore.getState().setShowInventorySummary(true);
    }
  }, [timeLeft, isPaused, startGame, pauseItemSearch]);

  // Animación continua del grid y regeneración de items
  useEffect(() => {
    const interval = setInterval(() => {
      setGridItems(prev => {
        // Si quedan pocos items, regenerar más
        if (prev.length < 100) {
          const newItems: GridItem[] = [];
          const itemTypes = [
            { type: 'food', name: 'Manzana', emoji: '🍏', image: '/images/apple.png' },
            { type: 'drink', name: 'Agua', emoji: '💧', image: '/images/water.png' },
            { type: 'medicine', name: 'Pastilla', emoji: '💊', image: '/images/pill.png' },
            { type: 'weapon', name: 'Bate', emoji: '🏏', image: '/images/bat.png' },
            { type: 'clothing', name: 'Bufanda', emoji: '🧣', image: '/images/scarf.png' },
            { type: 'junk', name: 'Pato de goma', emoji: '🦆', image: '/images/duck.png' },
            { type: 'junk', name: 'CD rayado', emoji: '💿', image: '/images/cd.png' },
            { type: 'junk', name: 'Osito de peluche', emoji: '🧸', image: '/images/plush.png' },
            { type: 'junk', name: 'Pelota desinflada', emoji: '⚽', image: '/images/ball.png' },
            { type: 'junk', name: 'Calcetín', emoji: '🧦', image: '/images/calcetin.png' },
            { type: 'junk', name: 'Teléfono', emoji: '📱', image: '/images/telefono.png' },
            { type: 'junk', name: 'Zapato', emoji: '👞', image: '/images/zapato.png' },
            { type: 'junk', name: 'Libro', emoji: '📖', image: '/images/libro.png' },
            { type: 'junk', name: 'Llaves', emoji: '🗝️', image: '/images/llaves.png' },
            { type: 'junk', name: 'Sombrero', emoji: '🎩', image: '/images/hat.png' },
          ];
          
          // Añadir 100 items nuevos
          for (let i = 0; i < 100; i++) {
            const itemType = itemTypes[Math.floor(Math.random() * itemTypes.length)];
            newItems.push({
              id: `${itemType.type}-${Date.now()}-${i}`,
              type: itemType.type as ItemType,
              name: itemType.name,
              emoji: itemType.emoji,
              image: itemType.image,
              x: Math.random() * 100,
              y: Math.random() * 100,
              scale: 0.7 + Math.random() * 0.6,
              rotation: Math.random() * 360,
            });
          }
          
          return [...prev, ...newItems];
        }
        
        // Si hay suficientes items, solo moverlos
        return prev.map(item => ({
          ...item,
          x: Math.random() * 100,
          y: Math.random() * 100,
          rotation: Math.random() * 360,
          scale: 0.8 + Math.random() * 0.4,
        }));
      });
    }, 2000); // Volver al intervalo original

    return () => clearInterval(interval);
  }, []);

  const getItemMessage = (item: GridItem) => {
    // Mensajes específicos para items útiles
    const usefulMessages = {
      'Manzana': "¡Comida! Al menos quita el hambre… mejor que masticar aire.",
      'Agua': "Agua… vale, la sed no se mata sola.",
      'Pastilla': "Medicina… cura el contagio, no la estupidez.",
      'Bate': "Un bate… para darle duro a esos zombis.",
      'Bufanda': "Bufanda… porque morirse de frío no es tan épico."
    };

    // Si es un item útil, usar mensaje específico
    if (usefulMessages[item.name as keyof typeof usefulMessages]) {
      return usefulMessages[item.name as keyof typeof usefulMessages];
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
    if (junkMessages[item.name as keyof typeof junkMessages]) {
      return junkMessages[item.name as keyof typeof junkMessages];
    }
    
    // Fallback genérico
    return "¿Esto? ¡No sé ni para qué sirve!";
  };

  const handleItemClick = (itemId: string) => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setSelectedItems(prev => [...prev, itemId]);
    
    // Añadir al inventario del juego
    const item = gridItems.find(i => i.id === itemId);
    if (item) {
      const message = getItemMessage(item);
      
      // NO mostrar mensajes aquí - solo en el juego principal
      
      // Añadir items útiles al inventario (solo los 5 tipos específicos)
      if (item.name === 'Manzana' || item.name === 'Agua' || item.name === 'Pastilla' || 
          item.name === 'Bate' || item.name === 'Bufanda') {
        
        // Crear ID fijo basado en el nombre para que coincida con Inventory
        const fixedId = `${item.type}-${item.name.toLowerCase()}`;
        
        
        addToInventory({
          id: fixedId,
          name: item.name,
          type: item.type,
          emoji: item.emoji,
          image: item.image,
          quantity: 1,
          description: `Objeto seleccionado: ${item.name}`
        });
        // Incrementar contador de items útiles
        setUsefulItemsCount(prev => prev + 1);
      } else {
        // No añadir basura al inventario - solo mostrar mensaje gracioso
      }
    }

    // Tiempo más corto para respuesta más rápida
    setTimeout(() => setIsAnimating(false), 150);
  };

  const getItemColor = (type: string) => {
    switch (type) {
      case 'food':
        return 'bg-green-500';
      case 'drink':
        return 'bg-blue-500';
      case 'medicine':
        return 'bg-red-500';
      case 'weapon':
        return 'bg-yellow-500';
      case 'clothing':
        return 'bg-purple-500';
      case 'junk':
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat flex flex-col items-center justify-center p-2 sm:p-4 relative overflow-hidden"
      style={{ backgroundImage: 'url(/images/coger.png)' }}
    >
      {/* Efectos de "viejo sucio" - Partículas negras flotantes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={`dust-${i}`}
            className="absolute w-1 h-1 bg-black rounded-full opacity-50"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -25, 0],
              x: [0, Math.random() * 15 - 7.5, 0],
              opacity: [0.5, 0.1, 0.5],
              scale: [1, 1.3, 1],
            }}
            transition={{
              duration: 5 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      {/* Efectos de "polvo" más grandes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={`smoke-${i}`}
            className="absolute w-12 h-12 bg-gray-800 rounded-full opacity-15 blur-sm"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -80, 0],
              x: [0, Math.random() * 30 - 15, 0],
              opacity: [0.15, 0.03, 0.15],
              scale: [1, 1.4, 1],
            }}
            transition={{
              duration: 8 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 6,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      {/* Efectos de "rayas" o "arañazos" */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={`scratch-${i}`}
            className="absolute bg-black opacity-8"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${15 + Math.random() * 30}px`,
              height: '1px',
              transform: `rotate(${Math.random() * 360}deg)`,
            }}
            animate={{
              opacity: [0.08, 0.2, 0.08],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 1.5,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>
      {/* Texto arriba del contador - CON EFECTO DE MOVIMIENTO */}
      <div className="text-center mb-8 sm:mb-12 relative z-10 -mt-32 sm:-mt-40">
        <motion.h1 
          className="text-2xl sm:text-3xl md:text-4xl font-bold text-white" 
          style={{ fontFamily: 'Comic Sans MS, cursive', textShadow: '2px 2px 0px #000' }}
          animate={{
            y: [0, -5, 0],
            opacity: [1, 0.8, 1],
            scale: [1, 1.05, 1]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          ¡COGE LO MÁS IMPORTANTE!
        </motion.h1>
      </div>

      {/* Contador grande - BAJADO UN POCO PARA NO SOLAPAR */}
      <motion.div
        key={timeLeft}
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className={`text-6xl sm:text-8xl md:text-9xl font-bold mb-8 sm:mb-12 text-center relative z-10 -mt-8 sm:-mt-12 ${timeLeft <= 3 ? 'text-red-500' : 'text-white'}`}
        style={{ fontFamily: 'Comic Sans MS, cursive', textShadow: '3px 3px 0px #000' }}
      >
        {timeLeft}
      </motion.div>

      {/* Sin indicador visual para no variar el diseño */}

      {/* Grid de objetos - MÁS ESTRECHA Y CENTRADA */}
      <div className="relative max-w-2xl h-[400px] sm:h-[500px] md:h-[600px] lg:h-[650px] overflow-hidden rounded-lg z-10 mt-6 sm:mt-8 md:mt-12 mx-auto" style={{ width: '95%' }}>
        <AnimatePresence>
          {gridItems.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0, y: -20 }}
              animate={{ 
                opacity: selectedItems.includes(item.id) ? 0 : 1,
                scale: selectedItems.includes(item.id) ? 0 : item.scale,
                x: `${item.x}%`,
                y: `${item.y}%`,
                rotate: item.rotation
              }}
              exit={{ opacity: 0, scale: 0, y: 20 }}
              transition={{ 
                duration: 0.4,
                ease: "easeOut",
                delay: Math.random() * 0.2 // Pequeño delay aleatorio para efecto cascada
              }}
              whileHover={{ 
                scale: 1.1, 
                transition: { duration: 0.2 }
              }}
              whileTap={{ 
                scale: 0.9,
                transition: { duration: 0.1 }
              }}
              className={`
                absolute w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 lg:w-44 lg:h-44
                bg-transparent
                cursor-pointer flex items-center justify-center
                transition-all duration-300 ease-out
                ${selectedItems.includes(item.id) ? 'pointer-events-none' : ''}
              `}
              style={{
                left: `${item.x}%`,
                top: `${item.y}%`,
                transform: `translate(-50%, -50%) rotate(${item.rotation}deg)`,
              }}
              onClick={() => handleItemClick(item.id)}
            >
              {item.image ? (
                <img 
                  src={item.image} 
                  alt={item.name}
                  className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 lg:w-36 lg:h-36 object-contain"
                />
              ) : (
                <div className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl">{item.emoji}</div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Texto debajo de la caja - MÁS SEPARADO DE LA CAJA */}
      <div className="mt-20 sm:mt-24 text-center px-4 relative z-10">
        <p className="text-sm sm:text-lg md:text-xl text-gray-300" style={{ fontFamily: 'Comic Sans MS, cursive' }}>
          Toca los objetos que quieras llevar contigo
        </p>
      </div>
    </div>
  );
};
