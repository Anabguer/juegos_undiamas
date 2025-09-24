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
  const [timeLeft, setTimeLeft] = useState(13);
  const [gridItems, setGridItems] = useState<GridItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
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
      
      // BASURA GRACIOSA (solo las que existen)
      { type: 'junk', name: 'Pato de goma', emoji: '🦆', image: '/images/duck.png' },
      { type: 'junk', name: 'CD rayado', emoji: '💿', image: '/images/cd.png' },
      { type: 'junk', name: 'Osito de peluche', emoji: '🧸', image: '/images/plush.png' },
      { type: 'junk', name: 'Pelota desinflada', emoji: '⚽', image: '/images/ball.png' },
      { type: 'junk', name: 'Calcetín', emoji: '🧦', image: '/images/calcetin.png' },
      { type: 'junk', name: 'Teléfono', emoji: '📱', image: '/images/telefono.png' },
      { type: 'junk', name: 'Zapato', emoji: '👟', image: '/images/zapato.png' },
      { type: 'junk', name: 'Libro', emoji: '📖', image: '/images/libro.png' },
      { type: 'junk', name: 'Llaves', emoji: '🗝️', image: '/images/llaves.png' },
    ];

    // Crear muchas repeticiones de cada item
    for (let i = 0; i < 50; i++) {
      const itemType = itemTypes[Math.floor(Math.random() * itemTypes.length)];
      items.push({
        id: `${itemType.type}-${i}`,
        type: itemType.type,
        name: itemType.name,
        emoji: itemType.emoji,
        image: itemType.image,
        x: Math.random() * 100,
        y: Math.random() * 100,
        scale: 0.8 + Math.random() * 0.4,
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

  // Animación continua del grid
  useEffect(() => {
    const interval = setInterval(() => {
      setGridItems(prev => prev.map(item => ({
        ...item,
        x: Math.random() * 100,
        y: Math.random() * 100,
        rotation: Math.random() * 360,
        scale: 0.8 + Math.random() * 0.4,
      })));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const getItemMessage = (item: GridItem) => {
    // Mensajes específicos para items útiles
    const usefulMessages = {
      'Manzana': "¡Manzana! Perfecto para no morir de hambre.",
      'Agua': "¡Agua! El líquido de la vida.",
      'Pastilla': "¡Pastilla! Esto podría salvarte la vida.",
      'Bate': "¡Bate! Para defenderse de los zombis.",
      'Bufanda': "¡Bufanda! Para protegerse del frío nocturno."
    };

    // Si es un item útil, usar mensaje específico
    if (usefulMessages[item.name as keyof typeof usefulMessages]) {
      return usefulMessages[item.name as keyof typeof usefulMessages];
    }

    // Mensajes graciosos para basura
    const junkMessages = [
      "¿Un zapato? ¿Para qué quieres un zapato?",
      "¡Un pato de goma! Muy útil... para nada.",
      "¿Un calcetín perdido? ¿En serio?",
      "¡Un CD rayado! ¿Quién tiene un lector de esto?",
      "¿Un cepillo de dientes usado? ¡Qué asco!",
      "¡Llaves oxidadas! Para abrir... ¿qué?",
      "¿Un libro mojado? ¡Perfecto para leer bajo la lluvia!",
      "¡Un teléfono roto! Para llamar a... nadie.",
      "¿Un osito de peluche? ¡Yo no juego con esas cosas!",
      "¡Una pelota desinflada! Para jugar... ¿al fútbol?",
      "¿Un calcetín? ¡Esto está agujereado!",
      "¿Un teléfono? ¡Esto no tiene señal!",
      "¿Un zapato? ¡Esto está roto!",
      "¿Un libro? ¡Esto está mojado!",
      "¿Unas llaves? ¡Esto no abre nada!",
      "¿Pollo? ¡Esto está podrido!",
      "¿Jugo? ¡Esto está agrio!",
      "¿Refresco? ¡Esto está caliente!",
      "¿Patatas fritas? ¡Están blandas!",
      "¿Antídoto? ¡Esto está caducado!",
      "¿Sombrero? ¡Ahora no estoy para postureo!",
      "¿Pan duro? ¡Esto está como una piedra!",
      "¿Queso mohoso? ¡Esto está verde!",
      "¿Pizza fría? ¡Esto está como cartón!",
      "¿Cerveza caliente? ¡Esto está asqueroso!",
      "¿Café frío? ¡Esto está amargo!",
      "¿Vendaje? ¡Esto está sucio!",
      "¿Jeringuilla? ¡Esto está oxidado!",
      "¿Cuchillo? ¡Esto está oxidado!",
      "¿Pistola? ¡Esto está roto!",
      "¿Hacha? ¡Esto está desafilado!",
      "¿Chaqueta? ¡Esto está roto!",
      "¿Guantes? ¡Esto está agujereado!"
    ];
    
    return junkMessages[Math.floor(Math.random() * junkMessages.length)];
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
      
      // Solo añadir items útiles al inventario (solo los 5 tipos específicos)
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
      }
    }

    setTimeout(() => setIsAnimating(false), 300);
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
      {/* Contador grande */}
      <motion.div
        key={timeLeft}
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="text-6xl sm:text-7xl font-bold text-white mb-4 text-center mt-20 sm:mt-24"
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
              initial={{ opacity: 0, scale: 0 }}
              animate={{ 
                opacity: selectedItems.includes(item.id) ? 0 : 1,
                scale: selectedItems.includes(item.id) ? 0 : item.scale,
                x: `${item.x}%`,
                y: `${item.y}%`,
                rotate: item.rotation
              }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ 
                duration: 0.3,
                ease: "easeInOut"
              }}
              whileHover={{ scale: item.scale * 1.2 }}
              whileTap={{ scale: item.scale * 0.8 }}
              className={`
                absolute w-20 h-20 sm:w-24 sm:h-24
                bg-transparent
                cursor-pointer flex items-center justify-center
                transition-all duration-200
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
                  className="w-14 h-14 sm:w-16 sm:h-16 object-contain"
                />
              ) : (
                <div className="text-4xl sm:text-5xl">{item.emoji}</div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Textos debajo de la caja */}
      <div className="mt-12 text-center">
        <h1 className="text-xl sm:text-2xl font-bold text-white mb-2" style={{ fontFamily: 'Comic Sans MS, cursive', textShadow: '2px 2px 0px #000' }}>
          ¡COGE LO MÁS IMPORTANTE!
        </h1>
        <p className="text-sm sm:text-lg text-gray-300" style={{ fontFamily: 'Comic Sans MS, cursive' }}>
          Toca los objetos que quieras llevar contigo
        </p>
      </div>

      {/* Contador de objetos seleccionados */}
      <div className="mt-4 text-center">
        <p className="text-lg sm:text-xl text-white font-bold" style={{ fontFamily: 'Comic Sans MS, cursive' }}>
          Objetos seleccionados: {selectedItems.length}
        </p>
      </div>
    </div>
  );
};
