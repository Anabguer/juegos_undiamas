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
    // Buscar el item en el inventario real
    const item = inventory.find(i => i.name === itemName);
    if (item) {
      useItem(item.id);
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

  return (
    <div className="mb-4 sm:mb-8">
      <h3 className="text-white text-center text-lg sm:text-xl font-bold mb-3 sm:mb-4">🎒 Inventario</h3>
      
      <div className="flex flex-wrap justify-center gap-2 sm:gap-3 w-full bg-black bg-opacity-20 rounded-lg p-3 sm:p-4">
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
                w-16 h-16 sm:w-20 sm:h-20 rounded-lg border-2 cursor-pointer
                ${getItemColor(item.type)}
                shadow-lg hover:shadow-xl transition-all duration-200
                flex flex-col items-center justify-center p-1 sm:p-2
                text-white relative touch-manipulation
                ${quantity === 0 ? 'opacity-50' : ''}
              `}
              style={{ minHeight: '44px', minWidth: '44px' }}
              onClick={() => handleItemUse(item.name)}
              title={`${item.name} (${quantity}) - ${getItemDescription({ type: item.type })}`}
            >
              <img 
                src={item.image} 
                alt={item.name}
                className="w-6 h-6 sm:w-8 sm:h-8 mb-0.5 sm:mb-1 object-contain"
              />
              <div className="text-xs font-bold text-center hidden sm:block">{item.name}</div>
              
              {/* Contador de cantidad */}
              <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center font-bold">
                {quantity}
              </div>
            </motion.div>
          );
        })}
      </div>
      
      {/* Información del inventario */}
      <div className="mt-2 sm:mt-4 text-center text-white">
        <p className="text-xs sm:text-sm">
          Items fijos - Toca para usar
        </p>
        <p className="text-xs text-gray-400 mt-1">
          Los números muestran cuántos tienes
        </p>
      </div>
    </div>
  );
};
