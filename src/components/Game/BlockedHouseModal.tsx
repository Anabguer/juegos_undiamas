import React from 'react';
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
  const { clickBlockedHouse } = useGameStore();

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
    // Mostrar mensaje de Peluso en el mensaje flotante
    const message = getClickMessage(clicks);
    const { useGameStore } = require('@/store/gameStore');
    useGameStore.setState({ 
      currentMessage: message, 
      showMessage: true 
    });
    
    // Luego hacer clic en la puerta
    clickBlockedHouse(cardId);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center"
          onClick={handleClick}
        >
          <div className="relative">
            {/* Imagen de puerta bloqueada */}
            <img 
              src="/images/puertabloqueada.png" 
              alt="Puerta Bloqueada"
              className="w-80 h-80 sm:w-96 sm:h-96 object-contain"
            />
            
            {/* Instrucciones */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-70 text-white text-center p-4 rounded-lg">
              <p className="text-lg font-bold">¡Dale como loco!</p>
              <p className="text-sm">Haz clic en la puerta para desbloquearla</p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BlockedHouseModal;
