'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';

interface ZombieBatsMinigameProps {
  isVisible: boolean;
  cardId: string;
  onComplete: () => void;
  onTimeout: () => void;
}

interface FallingItem {
  id: number;
  image: string;
  isBat: boolean; // Solo los bates cuentan
  position: { x: number; y: number };
  clicked: boolean;
}

export const ZombieBatsMinigame: React.FC<ZombieBatsMinigameProps> = ({ 
  isVisible, 
  cardId, 
  onComplete,
  onTimeout 
}) => {
  const [items, setItems] = useState<FallingItem[]>([]);
  const [batsHit, setBatsHit] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const totalBats = 10;

  // Imágenes de items que pueden caer (además de los bates)
  const itemImages = [
    '/images/apple.png',
    '/images/water.png',
    '/images/pill.png',
    '/images/scarf.png',
    '/images/duck.png',
    '/images/cd.png',
    '/images/plush.png',
    '/images/ball.png'
  ];

  // Generar items cayendo (mezcla de bates y otros items)
  useEffect(() => {
    console.warn(`🧟 ZOMBIE BATS MINIGAME - useEffect triggered - isVisible: ${isVisible}, items.length: ${items.length}`);
    
    if (isVisible && items.length === 0) {
      console.warn(`🧟 ZOMBIE BATS MINIGAME - Iniciando generación de items...`);
      
      const newItems: FallingItem[] = [];
      const totalItems = 15; // Menos items para que sea más fácil (15 total, 10 son bates)
      
      // Primero agregar los 10 bates necesarios con posiciones aleatorias simples
      for (let i = 0; i < totalBats; i++) {
        const position = {
          x: 15 + Math.random() * 70, // 15-85% (más margen en los lados)
          y: 25 + Math.random() * 60  // 25-85% (más margen arriba y abajo)
        };
        
        newItems.push({
          id: i,
          image: '/images/bat.png',
          isBat: true,
          position: position,
          clicked: false
        });
      }
      
      // Luego agregar solo 5 items aleatorios de relleno
      for (let i = totalBats; i < totalItems; i++) {
        const position = {
          x: 15 + Math.random() * 70,
          y: 25 + Math.random() * 60
        };
        
        newItems.push({
          id: i,
          image: itemImages[Math.floor(Math.random() * itemImages.length)],
          isBat: false,
          position: position,
          clicked: false
        });
      }
      
      console.warn(`🧟 ZOMBIE BATS MINIGAME - Generados ${newItems.length} items (${totalBats} bates, ${totalItems - totalBats} otros)`);
      console.warn(`🧟 ZOMBIE BATS MINIGAME - Posiciones de bates:`, newItems.filter(i => i.isBat).map(i => `(${i.position.x.toFixed(1)}%, ${i.position.y.toFixed(1)}%)`));
      console.warn(`🧟 ZOMBIE BATS MINIGAME - ¡TODO BIEN! Los bates se generaron correctamente. Si no los ves inmediatamente, es tu ordenador.`);
      setItems(newItems);
      setTimeLeft(15);
      console.warn(`🧟 ZOMBIE BATS MINIGAME - Estado inicializado - tiempo: 15s, items: ${newItems.length}`);
    }
  }, [isVisible]);

  // Timer de 15 segundos
  useEffect(() => {
    if (isVisible && timeLeft > 0 && batsHit < totalBats) {
      const timer = setTimeout(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);

      return () => clearTimeout(timer);
    } else if (isVisible && timeLeft === 0 && batsHit < totalBats) {
      // Tiempo agotado
      console.log(`ZOMBIE BATS MINIGAME - ¡Tiempo agotado! Solo ${batsHit}/${totalBats} bates`);
      onTimeout();
      // Reset
      setItems([]);
      setBatsHit(0);
      setTimeLeft(15);
    }
  }, [isVisible, timeLeft, batsHit, onTimeout]);

  // Verificar si todos los bates han sido clickeados
  useEffect(() => {
    if (batsHit === totalBats && batsHit > 0) {
      console.log(`ZOMBIE BATS MINIGAME - ¡Todos los bates golpeados! (${batsHit}/${totalBats})`);
      // Delay antes de cerrar para que se vea el último efecto
      setTimeout(() => {
        console.log(`ZOMBIE BATS MINIGAME - Llamando a onComplete()`);
        onComplete();
        // Reset para la próxima vez
        setItems([]);
        setBatsHit(0);
        setTimeLeft(15);
      }, 800);
    }
  }, [batsHit, onComplete]);

  const handleItemClick = (itemId: number) => {
    console.log(`ZOMBIE BATS MINIGAME - Clic en item ${itemId}`);
    
    // Solo permitir clic si el item no ha sido clickeado
    const item = items.find(i => i.id === itemId);
    if (!item || item.clicked) {
      console.log(`ZOMBIE BATS MINIGAME - Item ${itemId} no encontrado o ya clickeado`);
      return;
    }
    
    console.log(`ZOMBIE BATS MINIGAME - Item ${itemId} clickeado correctamente - esBate: ${item.isBat}`);
    
    // Reproducir sonido de bate zombie si es un bate
    if (item.isBat) {
      const { playZombieBat, soundEnabled } = useGameStore.getState();
      if (playZombieBat && soundEnabled) {
        console.log(`ZOMBIE BATS MINIGAME - Reproduciendo sonido de bate zombie`);
        playZombieBat();
      }
    }
    
    setItems(prevItems =>
      prevItems.map(i =>
        i.id === itemId ? { ...i, clicked: true } : i
      )
    );
    
    // Solo contar si es un bate
    if (item.isBat) {
      setBatsHit(prev => {
        const newCount = prev + 1;
        console.log(`ZOMBIE BATS MINIGAME - Bates golpeados: ${newCount}/${totalBats}`);
        return newCount;
      });
    }
  };

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black bg-opacity-95"
      onClick={(e) => {
        // Evitar cerrar al hacer clic en el fondo
        e.stopPropagation();
      }}
    >
      <div className="relative w-full max-w-4xl h-[600px] mx-4 overflow-hidden">
        {/* Fondo del minijuego con borde animado verde (zombie) */}
        <div
          className="absolute inset-0 bg-cover bg-center rounded-lg animate-pulse overflow-hidden"
          style={{
            backgroundImage: 'url(/images/Minijuego_zombie.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            boxShadow: '0 0 20px 5px rgba(0, 255, 0, 0.6), inset 0 0 30px rgba(0, 255, 0, 0.3)',
            border: '4px solid rgba(0, 255, 0, 0.8)',
            animation: 'pulse 1s ease-in-out infinite'
          }}
        >
          {/* Título simple - ABAJO para ver el zombie */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center z-10">
            <p className="text-2xl sm:text-3xl font-black text-yellow-400" style={{ 
              fontFamily: 'Comic Sans MS, cursive',
              textShadow: '3px 3px 0 #000, -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000'
            }}>
              ¡GOLPEA CON LOS BATES!
            </p>
          </div>

        </div>

        {/* Capa separada para los items - ARRIBA del fondo */}
        <div className="absolute inset-0 z-20 pointer-events-none">
          <AnimatePresence>
            {items.map((item, index) => {
              // Log solo para el primer bate para confirmar que se renderiza
              if (item.isBat && index === 0) {
                console.warn(`🧟 ZOMBIE BATS MINIGAME - ¡RENDERIZANDO BATES! Total items: ${items.length}, Bates: ${items.filter(i => i.isBat).length}, Primer bate en posición (${item.position.x.toFixed(1)}%, ${item.position.y.toFixed(1)}%)`);
              }
              return (
              <motion.div
                key={item.id}
                initial={{ scale: 0, opacity: 0 }}
                animate={!item.clicked ? {
                  scale: 1,
                  opacity: 1,
                  rotate: [0, 360], // Girar mientras cae
                  y: [0, 5, 0], // Movimiento más sutil
                } : {
                  scale: [1, 1.3, 0],
                  opacity: [1, 0.8, 0],
                  rotate: item.isBat ? [0, 360] : [0, 180],
                  y: [0, -30]
                }}
                exit={{
                  scale: 0,
                  opacity: 0
                }}
                transition={!item.clicked ? {
                  // Aparición INMEDIATA y SIMPLE
                  scale: { duration: 0.05, delay: 0 },
                  opacity: { duration: 0.05, delay: 0 },
                  rotate: {
                    duration: 2.0,
                    repeat: Infinity,
                    ease: "linear",
                    delay: 0
                  },
                  y: {
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0
                  }
                } : {
                  duration: 0.5,
                  ease: "easeOut"
                }}
                className="absolute cursor-pointer hover:scale-110 transition-transform pointer-events-auto"
                style={{
                  left: `${item.position.x}%`,
                  top: `${item.position.y}%`,
                  transform: 'translate(-50%, -50%)', // Centrar el item en su posición
                  zIndex: 30
                }}
                onClick={() => handleItemClick(item.id)}
              >
                <div className="relative">
                  {/* Fondo circular sutil para mejor visibilidad */}
                  <div 
                    className="absolute inset-0 rounded-full bg-white bg-opacity-20 blur-sm"
                    style={{
                      width: '120%',
                      height: '120%',
                      left: '-10%',
                      top: '-10%'
                    }}
                  />
                  <img
                    src={item.image}
                    alt={item.isBat ? "Bate" : "Item"}
                    className="w-10 h-10 sm:w-14 sm:h-14 object-contain relative z-10"
                    style={{
                      filter: item.clicked 
                        ? 'drop-shadow(2px 2px 8px rgba(0, 255, 0, 0.8)) brightness(1.5)' 
                        : 'drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.8)) brightness(1.1)'
                    }}
                  />
                </div>
                
                {/* Efecto de golpe al clickear - SOLO PARA BATES */}
                {item.clicked && item.isBat && (
                  <>
                    {/* Flash de impacto verde */}
                    <motion.div
                      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[-1]"
                      initial={{ scale: 0, opacity: 1 }}
                      animate={{ 
                        scale: [0, 2, 3],
                        opacity: [1, 0.5, 0]
                      }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                    >
                      <div className="w-16 h-16 rounded-full bg-green-500 blur-md" />
                    </motion.div>
                    
                    {/* Texto "HIT!" */}
                    <motion.div
                      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                      initial={{ scale: 0, opacity: 0, y: 0 }}
                      animate={{ 
                        scale: [0, 1.5, 1],
                        opacity: [0, 1, 0],
                        y: [0, -20, -30]
                      }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                    >
                      <div className="text-green-500 font-black text-xl sm:text-2xl" style={{
                        textShadow: '2px 2px 0 #000, -1px -1px 0 #000',
                        fontFamily: 'Impact, fantasy',
                        WebkitTextStroke: '1px black'
                      }}>
                        HIT!
                      </div>
                    </motion.div>
                  </>
                )}
              </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

