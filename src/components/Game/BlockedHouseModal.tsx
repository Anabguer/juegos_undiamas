import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';

interface BlockedHouseModalProps {
  isVisible: boolean;
  cardId: string;
  clicks: number;
  totalClicks: number;
  onClose: () => void;
}

const BlockedHouseModal: React.FC<BlockedHouseModalProps> = ({
  isVisible,
  cardId,
  clicks,
  totalClicks,
  onClose
}) => {
  const { clickBlockedHouse, skipTutorial } = useGameStore();

  // Función para vibrar en móvil mejorada
  const vibrate = (pattern: number | number[]) => {
    if ('vibrate' in navigator) {
      try {
        // Verificar si el dispositivo soporta vibración
        if (navigator.vibrate) {
          navigator.vibrate(pattern);
          console.log(`VIBRACIÓN - Patrón: ${JSON.stringify(pattern)}`);
        }
      } catch (error) {
        console.log(`VIBRACIÓN - Error: ${error}`);
      }
    } else {
      console.log(`VIBRACIÓN - No soportada en este dispositivo`);
    }
  };
  
  // Función para vibrar con diferentes intensidades
  const vibrateIntense = () => {
    vibrate([200, 100, 200, 100, 300, 100, 200]);
  };
  
  const vibrateImpact = () => {
    vibrate(100);
  };
  
  const vibrateSuccess = () => {
    vibrate([150, 50, 150, 50, 300]);
  };

  // Efecto de vibración cuando se abre el modal
  useEffect(() => {
    if (isVisible) {
      // Vibración dramática: patrón largo seguido de vibraciones cortas
      vibrateIntense();
      console.log(`PUERTA BLOQUEADA - Modal abierto, vibración activada`);
    } else {
      // Vibración de éxito cuando se cierra (puerta desbloqueada)
      vibrateSuccess();
      console.log(`PUERTA BLOQUEADA - Modal cerrado, vibración de éxito`);
    }
  }, [isVisible]);

  // Mensajes específicos de Peluso según el número de clics
  const getClickMessage = (clicks: number) => {
    const remaining = 10 - clicks;
    switch (remaining) {
      case 10: return "¡Daleeee!";
      case 8: return "¡Le puede dar más fuerteee!";
      case 7: return "¡Madre mía con esos bracitosss!";
      case 6: return "Creo que veré la serie Juego de Tronos mientras espero...";
      case 4: return "¡Me aburrooooo!";
      case 3: return "¡Es penoso!";
      case 2: return "¡A puntitoooo!";
      case 1: return "¡yaaaa!";
      default: return "¡Dale como loco!";
    }
  };

  const handleClick = () => {
    // Vibración de impacto al hacer clic
    vibrateImpact();
    
    // Hacer clic en la puerta
    clickBlockedHouse(cardId);
    console.log(`PUERTA BLOQUEADA - Clic en puerta, vibración de impacto`);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: 1,
            background: [
              "rgba(0,0,0,0.9)",
              "rgba(255,140,0,0.3)",
              "rgba(0,0,0,0.9)",
              "rgba(255,140,0,0.3)",
              "rgba(0,0,0,0.9)"
            ]
          }}
          exit={{ opacity: 0 }}
          transition={{
            background: {
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }
          }}
          className="fixed inset-0 z-50 flex items-center justify-center"
          onClick={handleClick}
        >
          {/* Efectos de partículas de fondo mejoradas */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(30)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-orange-400 rounded-full"
                initial={{
                  x: Math.random() * window.innerWidth,
                  y: Math.random() * window.innerHeight,
                  opacity: 0,
                  scale: 0
                }}
                animate={{
                  x: Math.random() * window.innerWidth,
                  y: Math.random() * window.innerHeight,
                  opacity: [0, 0.8, 0],
                  scale: [0, 1.5, 0],
                  rotate: [0, 360]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  delay: Math.random() * 3,
                  ease: "easeInOut"
                }}
              />
            ))}
            
            {/* Partículas más grandes */}
            {[...Array(10)].map((_, i) => (
              <motion.div
                key={`large-${i}`}
                className="absolute w-3 h-3 bg-yellow-400 rounded-full opacity-60"
                initial={{
                  x: Math.random() * window.innerWidth,
                  y: Math.random() * window.innerHeight,
                  opacity: 0
                }}
                animate={{
                  x: Math.random() * window.innerWidth,
                  y: Math.random() * window.innerHeight,
                  opacity: [0, 0.6, 0],
                  scale: [0, 1.2, 0]
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  delay: Math.random() * 4,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>

          {/* Ondas de choque mejoradas */}
          <div className="absolute inset-0 flex items-center justify-center">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute border-2 border-orange-400 rounded-full"
                initial={{ 
                  width: 50, 
                  height: 50, 
                  opacity: 0.9,
                  scale: 0
                }}
                animate={{ 
                  width: 1000, 
                  height: 1000, 
                  opacity: 0,
                  scale: 1
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: i * 0.5,
                  ease: "easeOut"
                }}
              />
            ))}
            
            {/* Ondas de choque internas */}
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={`inner-${i}`}
                className="absolute border-2 border-yellow-400 rounded-full"
                initial={{ 
                  width: 200, 
                  height: 200, 
                  opacity: 0.6,
                  scale: 0
                }}
                animate={{ 
                  width: 600, 
                  height: 600, 
                  opacity: 0,
                  scale: 1
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.8 + 1,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>
          
          {/* Efecto de destello de fondo */}
          <motion.div
            className="absolute inset-0 bg-gradient-radial from-orange-400/20 via-transparent to-transparent"
            animate={{
              opacity: [0, 0.3, 0],
              scale: [0.8, 1.2, 0.8]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />

          <div className="relative z-10">
            {/* Imagen de puerta bloqueada con temblor */}
            <motion.img 
              src="/images/puertabloqueada.png" 
              alt="Puerta Bloqueada"
              className="w-80 h-80 sm:w-96 sm:h-96 object-contain"
              animate={{
                x: [0, -5, 5, -3, 3, 0],
                y: [0, -3, 3, -2, 2, 0],
                rotate: [0, -1, 1, -0.5, 0.5, 0],
                scale: [1, 1.05, 0.95, 1.02, 0.98, 1]
              }}
              transition={{
                duration: 0.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            
            {/* Efecto de destello en la puerta */}
            <motion.div
              className="absolute inset-0 bg-white bg-opacity-30 rounded-lg"
              animate={{
                opacity: [0, 0.3, 0],
                scale: [0.8, 1.1, 0.8]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            
            {/* Instrucciones con efecto de parpadeo */}
            <motion.div 
              className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-80 text-white text-center p-4 rounded-lg border-2 border-orange-400"
              animate={{
                borderColor: ["#fb923c", "#f97316", "#ea580c", "#fb923c"],
                boxShadow: [
                  "0 0 10px rgba(251, 146, 60, 0.5)",
                  "0 0 20px rgba(249, 115, 22, 0.8)",
                  "0 0 10px rgba(234, 88, 12, 0.5)",
                  "0 0 10px rgba(251, 146, 60, 0.5)"
                ]
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <motion.p 
                className="text-lg font-bold text-orange-400"
                animate={{
                  color: ["#fb923c", "#f97316", "#ea580c", "#fb923c"]
                }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                ¡Dale como loco!
              </motion.p>
              <motion.p 
                className="text-sm text-gray-300"
                animate={{
                  opacity: [0.7, 1, 0.7]
                }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                Haz clic en la puerta para desbloquearla
              </motion.p>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BlockedHouseModal;
