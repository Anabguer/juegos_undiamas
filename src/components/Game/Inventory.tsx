'use client';

import React from 'react';
import { useGameStore } from '@/store/gameStore';
import { motion } from 'framer-motion';

export const Inventory: React.FC = () => {
  const { inventory, useItem } = useGameStore();

  // Items fijos que siempre se muestran
  const fixedItems = [
    { name: 'Manzana', type: 'food', image: '/images/apple.png', emoji: '🍏' },
    { name: 'Agua', type: 'drink', image: '/images/water.png', emoji: '💧' },
    { name: 'Pastilla', type: 'medicine', image: '/images/pill.png', emoji: '💊' },
    { name: 'Bate', type: 'weapon', image: '/images/bat.png', emoji: '🏏' },
    { name: 'Bufanda', type: 'clothing', image: '/images/scarf.png', emoji: '🧣' }
  ];

  const handleItemUse = (itemName: string) => {
    console.log('INVENTORY: Intentando usar item:', itemName);
    // Buscar el item en el inventario real
    const item = inventory.find(i => i.name === itemName);
    if (item) {
      console.log('INVENTORY: Item encontrado, usando:', item);
      useItem(item.id);
    } else {
      console.log('INVENTORY: Item no encontrado en inventario');
    }
  };

  const getItemQuantity = (itemName: string) => {
    const item = inventory.find(i => i.name === itemName);
    return item ? item.quantity : 0;
  };

  const getItemColor = (type: string) => {
    switch (type) {
      case 'food':
        return 'bg-green-600 border-green-400';
      case 'drink':
        return 'bg-blue-600 border-blue-400';
      case 'medicine':
        return 'bg-red-600 border-red-400';
      case 'clothing':
        return 'bg-purple-600 border-purple-400';
      case 'weapon':
        return 'bg-yellow-600 border-yellow-400';
      case 'junk':
        return 'bg-gray-600 border-gray-400';
      default:
        return 'bg-gray-600 border-gray-400';
    }
  };

  const getItemDescription = (item: any) => {
    switch (item.type) {
      case 'weapon':
        return 'Haz clic para usar contra zombis';
      case 'medicine':
        return 'Haz clic para curar infección';
      case 'clothing':
        return 'Haz clic para protegerse del frío';
      case 'food':
        return 'Haz clic para comer';
      case 'drink':
        return 'Haz clic para beber';
      default:
        return 'Haz clic para usar';
    }
  };

  // Separar items útiles de basura
  const usefulItems = fixedItems.filter(item => 
    ['Manzana', 'Agua', 'Pastilla', 'Bate', 'Bufanda'].includes(item.name)
  );
  
  const junkItems = inventory.filter(item => 
    !['Manzana', 'Agua', 'Pastilla', 'Bate', 'Bufanda'].includes(item.name)
  );

  return (
    <div className="mb-2">
      <div 
        className="flex justify-center w-full rounded-lg p-1 sm:p-2"
        style={{ 
          backgroundImage: 'url(/images/estanteriainventario.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          minHeight: '80px',
          width: '100%'
        }}
      >
        {fixedItems.map((item, index) => {
          const quantity = getItemQuantity(item.name);
          return (
            <motion.div
              key={item.name}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className={`
                w-24 h-24 sm:w-28 sm:h-28 cursor-pointer
                bg-transparent
                shadow-lg hover:shadow-xl transition-all duration-200
                flex flex-col items-center justify-center p-1
                text-white relative touch-manipulation
                ${quantity === 0 ? 'opacity-50' : ''}
                mx-4
              `}
              style={{ minHeight: '48px', minWidth: '48px' }}
              onClick={() => {
                // No permitir usar items durante el tutorial (excepto la manzana del tutorial, el bate cuando aparece zombie, y la bufanda cuando hace frío)
                const { showTutorial, tutorialPhase } = useGameStore.getState();
                console.log('INVENTORY: Click en item:', item.name, 'showTutorial:', showTutorial, 'tutorialPhase:', tutorialPhase);
                
                if (showTutorial && item.name !== 'Manzana' && 
                    !(item.name === 'Bate' && tutorialPhase === 'zombie_warning') &&
                    !(item.name === 'Bufanda' && tutorialPhase === 'cold_night')) {
                  console.log('INVENTORY: Item bloqueado durante tutorial');
                  return;
                }
                console.log('INVENTORY: Item permitido, procediendo a usar');
                handleItemUse(item.name);
              }}
              title={`${item.name} (${quantity}) - ${getItemDescription({ type: item.type })}`}
            >
              <img 
                src={item.image} 
                alt={item.name}
                className="w-12 h-12 sm:w-14 sm:h-14 object-contain"
              />
              
              {/* Contador de cantidad - Estilo retro */}
              <div className="absolute bottom-0 right-0 bg-yellow-600 text-black text-sm sm:text-base rounded-md w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center font-black border-2 border-yellow-800 shadow-lg" style={{ fontFamily: 'Comic Sans MS, cursive' }}>
                {quantity}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
