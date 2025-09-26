'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';

interface GridItem {
  id: string;
  type: string;
  name: string;
  emoji: string;
  image?: string;
  x: number;
  y: number;
  scale: number;
  rotation: number;
}

export const ItemSelectionGrid: React.FC = () => {
  const { startGame, addToInventory } = useGameStore();
  const [timeLeft, setTimeLeft] = useState(8);
  const [gridItems, setGridItems] = useState<GridItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [usefulItemsCount, setUsefulItemsCount] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

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

    // Crear repeticiones de cada item (caos controlado) - MUCHOS MÁS ITEMS
    for (let i = 0; i < 200; i++) {
      const itemType = itemTypes[Math.floor(Math.random() * itemTypes.length)];
      items.push({
        id: `${itemType.type}-${i}`,
        type: itemType.type,
        name: itemType.name,
        emoji: itemType.emoji,
        image: itemType.image,
        x: Math.random() * 100,
        y: Math.random() * 100,
        scale: 0.7 + Math.random() * 0.6, // Más variación de tamaño
        rotation: Math.random() * 360,
      });
    }

    setGridItems(items);
  }, []);

  // Timer de 13 segundos
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      // Tiempo agotado, mostrar resumen del inventario
      useGameStore.getState().setShowInventorySummary(true);
    }
  }, [timeLeft, startGame]);

  // Animación continua del grid y regeneración de items
  useEffect(() => {
    const interval = setInterval(() => {
      setGridItems(prev => {
        // Si quedan pocos items, regenerar más
        if (prev.length < 50) {
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
              type: itemType.type,
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
    }, 2000);

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
      
      // Mostrar mensaje gracioso
      useGameStore.setState({ currentMessage: message, showMessage: true });
      
      // Añadir items útiles al inventario (solo los 5 tipos específicos)
      if (item.name === 'Manzana' || item.name === 'Agua' || item.name === 'Pastilla' || 
          item.name === 'Bate' || item.name === 'Bufanda') {
        addToInventory({
          id: itemId,
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
        // Añadir items basura al inventario con cantidad 0 (para mostrar en resumen)
        addToInventory({
          id: itemId,
          name: item.name,
          type: item.type,
          emoji: item.emoji,
          image: item.image,
          quantity: 0, // Cantidad 0 para que no se puedan usar
          description: `Item basura recogido - solo para colección`
        });
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
      className="min-h-screen bg-cover bg-center bg-no-repeat flex flex-col items-center p-4"
      style={{ backgroundImage: 'url(/images/coger.png)' }}
    >
      {/* Texto arriba del contador */}
      <div className="text-center mt-12 sm:mt-16 mb-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-white" style={{ fontFamily: 'Comic Sans MS, cursive', textShadow: '2px 2px 0px #000' }}>
          ¡COGE LO MÁS IMPORTANTE!
        </h1>
      </div>

      {/* Contador grande */}
      <motion.div
        key={timeLeft}
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="text-7xl sm:text-8xl font-bold text-white mb-4 text-center"
        style={{ fontFamily: 'Comic Sans MS, cursive', textShadow: '3px 3px 0px #000' }}
      >
        {timeLeft}
      </motion.div>

      {/* Grid de objetos */}
      <div className="relative w-full max-w-2xl h-[420px] sm:h-[520px] overflow-hidden rounded-lg mt-10 ml-4 sm:ml-6 mx-2 sm:mx-4">
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
                scale: 1.15, 
                rotate: item.rotation + 15,
                y: -5,
                transition: { duration: 0.2 }
              }}
              whileTap={{ 
                scale: 0.9,
                rotate: item.rotation - 5,
                transition: { duration: 0.1 }
              }}
              className={`
                absolute w-24 h-24 sm:w-28 sm:h-28
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
                  className="w-18 h-18 sm:w-20 sm:h-20 object-contain"
                />
              ) : (
                <div className="text-5xl sm:text-6xl">{item.emoji}</div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Texto debajo de la caja */}
      <div className="mt-12 text-center">
        <p className="text-sm sm:text-lg text-gray-300" style={{ fontFamily: 'Comic Sans MS, cursive' }}>
          Toca los objetos que quieras llevar contigo
        </p>
      </div>

    </div>
  );
};
