import { useEffect, useRef, useState } from 'react';

export const useAudio = (src: string, loop: boolean = false, volume: number = 1) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      audioRef.current = new Audio(src);
      audioRef.current.loop = loop;
      audioRef.current.volume = volume;
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [src, loop, volume]);

  const play = async () => {
    if (audioRef.current && !isPlaying) {
      try {
        await audioRef.current.play();
        setIsPlaying(true);
      } catch (error) {
        console.log('Error al reproducir audio:', error);
      }
    }
  };

  const pause = () => {
    if (audioRef.current && isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const setVolume = (newVolume: number) => {
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  return {
    play,
    pause,
    setVolume,
    isPlaying
  };
};

// Hook para manejar múltiples audios con diferentes volúmenes
export const useMultiAudio = (soundEnabled: boolean = true, volume: number = 0.5) => {
  const backgroundAudioRef = useRef<HTMLAudioElement | null>(null);
  const itemSearchAudioRef = useRef<HTMLAudioElement | null>(null);
  const batHitAudioRef = useRef<HTMLAudioElement | null>(null);
  const eatAudioRef = useRef<HTMLAudioElement | null>(null);
  const drinkAudioRef = useRef<HTMLAudioElement | null>(null);
  const pillAudioRef = useRef<HTMLAudioElement | null>(null);
  const hitAudioRef = useRef<HTMLAudioElement | null>(null);
  const zombieBatAudioRef = useRef<HTMLAudioElement | null>(null);
  const ratAudioRef = useRef<HTMLAudioElement | null>(null);
  const minigameStartAudioRef = useRef<HTMLAudioElement | null>(null);
  const zombieMinigameAudioRef = useRef<HTMLAudioElement | null>(null);
  const houseCardAudioRef = useRef<HTMLAudioElement | null>(null);
  const shiverAudioRef = useRef<HTMLAudioElement | null>(null);
  const [backgroundPlaying, setBackgroundPlaying] = useState(false);
  const [itemSearchPlaying, setItemSearchPlaying] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Audio de fondo (volumen más bajo)
      console.log('AUDIO SETUP - Creando audio de fondo...');
      backgroundAudioRef.current = new Audio('/sound/fondo.mp3');
      backgroundAudioRef.current.loop = true;
      backgroundAudioRef.current.volume = 0.3; // Volumen base más bajo
      backgroundAudioRef.current.preload = 'auto'; // Forzar precarga
      
      // Agregar event listeners para diagnosticar
      backgroundAudioRef.current.addEventListener('loadstart', () => {
        console.log('AUDIO SETUP - loadstart event fired');
      });
      
      backgroundAudioRef.current.addEventListener('canplay', () => {
        console.log('AUDIO SETUP - canplay event fired');
      });
      
      backgroundAudioRef.current.addEventListener('error', (e) => {
        console.log('AUDIO SETUP - error event fired:', e);
        console.log('AUDIO SETUP - error details:', backgroundAudioRef.current?.error);
      });
      
      backgroundAudioRef.current.addEventListener('loadeddata', () => {
        console.log('AUDIO SETUP - loadeddata event fired');
      });

      // Forzar carga del audio
      backgroundAudioRef.current.load();

      // Audio de búsqueda de items
      itemSearchAudioRef.current = new Audio('/sound/buscaritems.mp3');
      itemSearchAudioRef.current.preload = 'auto';
      itemSearchAudioRef.current.loop = true;
      itemSearchAudioRef.current.volume = 0.4; // Reducido para que no tape la música de fondo

      // Audio de golpe de bate
      batHitAudioRef.current = new Audio('/sound/golpebate.mp3');
      batHitAudioRef.current.loop = false;
      batHitAudioRef.current.volume = 0.5; // Reducido para que no tape la música de fondo
      batHitAudioRef.current.preload = 'auto';

      // Audio de comer
      eatAudioRef.current = new Audio('/sound/comer.mp3');
      eatAudioRef.current.loop = false;
      eatAudioRef.current.volume = 0.4; // Reducido para que no tape la música de fondo
      eatAudioRef.current.preload = 'auto';

      // Audio de beber
      drinkAudioRef.current = new Audio('/sound/beber.mp3');
      drinkAudioRef.current.loop = false;
      drinkAudioRef.current.volume = 0.4; // Reducido para que no tape la música de fondo
      drinkAudioRef.current.preload = 'auto';

      // Audio de pastilla
      pillAudioRef.current = new Audio('/sound/pastilla.mp3');
      pillAudioRef.current.preload = 'auto';
      pillAudioRef.current.loop = false;
      pillAudioRef.current.volume = 0.4; // Reducido para que no tape la música de fondo

      // Audio de golpe (puerta bloqueada)
      hitAudioRef.current = new Audio('/sound/golpe.mp3');
      hitAudioRef.current.loop = false;
      hitAudioRef.current.volume = 0.5; // Reducido para que no tape la música de fondo
      hitAudioRef.current.preload = 'auto';

      // Audio de bate en minijuego zombie
      zombieBatAudioRef.current = new Audio('/sound/bateminijuegozombie.mp3');
      zombieBatAudioRef.current.loop = false;
      zombieBatAudioRef.current.volume = 0.5; // Reducido para que no tape la música de fondo
      zombieBatAudioRef.current.preload = 'auto';

      // Audio de rata en minijuego
      ratAudioRef.current = new Audio('/sound/rata.mp3');
      ratAudioRef.current.loop = false;
      ratAudioRef.current.volume = 0.4; // Reducido para que no tape la música de fondo
      ratAudioRef.current.preload = 'auto';

      // Audio de inicio de minijuego
      minigameStartAudioRef.current = new Audio('/sound/iniciominijuego.mp3');
      minigameStartAudioRef.current.loop = false;
      minigameStartAudioRef.current.volume = 0.4; // Reducido para que no tape la música de fondo
      minigameStartAudioRef.current.preload = 'auto';

      // Audio específico de minijuego de zombie
      zombieMinigameAudioRef.current = new Audio('/sound/minijuegozombie.mp3');
      zombieMinigameAudioRef.current.loop = false;
      zombieMinigameAudioRef.current.volume = 0.4; // Reducido para que no tape la música de fondo
      zombieMinigameAudioRef.current.preload = 'auto';

      // Audio de carta-casa
      houseCardAudioRef.current = new Audio('/sound/cartacasa.mp3');
      houseCardAudioRef.current.loop = false;
      houseCardAudioRef.current.volume = 0.4; // Reducido para que no tape la música de fondo
      houseCardAudioRef.current.preload = 'auto';

      // Audio de tiritar (frío)
      shiverAudioRef.current = new Audio('/sound/tiritar.mp3');
      shiverAudioRef.current.loop = false;
      shiverAudioRef.current.volume = 0.3; // Reducido para que no tape la música de fondo
      shiverAudioRef.current.preload = 'auto';
    }

    return () => {
      if (backgroundAudioRef.current) {
        backgroundAudioRef.current.pause();
        backgroundAudioRef.current = null;
      }
      if (itemSearchAudioRef.current) {
        itemSearchAudioRef.current.pause();
        itemSearchAudioRef.current = null;
      }
      if (batHitAudioRef.current) {
        batHitAudioRef.current.pause();
        batHitAudioRef.current = null;
      }
      if (eatAudioRef.current) {
        eatAudioRef.current.pause();
        eatAudioRef.current = null;
      }
      if (drinkAudioRef.current) {
        drinkAudioRef.current.pause();
        drinkAudioRef.current = null;
      }
      if (pillAudioRef.current) {
        pillAudioRef.current.pause();
        pillAudioRef.current = null;
      }
      if (hitAudioRef.current) {
        hitAudioRef.current.pause();
        hitAudioRef.current = null;
      }
      if (zombieBatAudioRef.current) {
        zombieBatAudioRef.current.pause();
        zombieBatAudioRef.current = null;
      }
      if (ratAudioRef.current) {
        ratAudioRef.current.pause();
        ratAudioRef.current = null;
      }
      if (minigameStartAudioRef.current) {
        minigameStartAudioRef.current.pause();
        minigameStartAudioRef.current = null;
      }
      if (houseCardAudioRef.current) {
        houseCardAudioRef.current.pause();
        houseCardAudioRef.current = null;
      }
      if (shiverAudioRef.current) {
        shiverAudioRef.current.pause();
        shiverAudioRef.current = null;
      }
    };
  }, []);

  const playBackground = async () => {
    // Solo mostrar logs cuando hay cambios importantes
    if (!backgroundPlaying) {
      console.log('🔊 PLAY BACKGROUND - Iniciando música de fondo');
    }
    
    if (backgroundAudioRef.current && !backgroundPlaying && soundEnabled) {
      try {
        
        backgroundAudioRef.current.volume = volume * 0.3; // 30% del volumen general
        backgroundAudioRef.current.loop = true;
        await backgroundAudioRef.current.play();
        setBackgroundPlaying(true);
        console.log('🔊 PLAY BACKGROUND - Música iniciada correctamente');
      } catch (error) {
        // Solo mostrar error si no es el error de interacción del usuario o formato no soportado
        if ((error as Error).name !== 'NotAllowedError' && (error as Error).name !== 'NotSupportedError') {
          console.warn('🔊 AUDIO - Error al reproducir música de fondo:', error);
        }
        // Si falla, intentar de nuevo en el próximo clic
      }
    }
  };

  const pauseBackground = () => {
    if (backgroundAudioRef.current && backgroundPlaying) {
      backgroundAudioRef.current.pause();
      setBackgroundPlaying(false);
    }
  };

  const playItemSearch = async () => {
    console.log(`PLAY ITEM SEARCH - Función llamada, itemSearchPlaying: ${itemSearchPlaying}`);
    
    if (itemSearchAudioRef.current && !itemSearchPlaying) {
      try {
        console.log('PLAY ITEM SEARCH - Reproduciendo sonido de búsqueda de items...');
        // Asegurar que el audio esté en el inicio
        itemSearchAudioRef.current.currentTime = 0;
        await itemSearchAudioRef.current.play();
        setItemSearchPlaying(true);
        console.log('PLAY ITEM SEARCH - Sonido de búsqueda iniciado correctamente');
      } catch (error) {
        console.log('PLAY ITEM SEARCH - Error al reproducir sonido de búsqueda:', error);
      }
    } else {
      console.log('PLAY ITEM SEARCH - No se puede reproducir:', {
        hasAudio: !!itemSearchAudioRef.current,
        alreadyPlaying: itemSearchPlaying
      });
    }
  };

  const pauseItemSearch = () => {
    console.log('PAUSE ITEM SEARCH - Función llamada');
    console.log(`PAUSE ITEM SEARCH - itemSearchAudioRef: ${!!itemSearchAudioRef.current}, itemSearchPlaying: ${itemSearchPlaying}`);
    
    if (itemSearchAudioRef.current) {
      console.log('PAUSE ITEM SEARCH - Pausando sonido de búsqueda...');
      itemSearchAudioRef.current.pause();
      itemSearchAudioRef.current.currentTime = 0; // Resetear al inicio
      setItemSearchPlaying(false);
      console.log('PAUSE ITEM SEARCH - Sonido de búsqueda pausado correctamente');
    } else {
      console.log('PAUSE ITEM SEARCH - No hay audio disponible');
    }
  };

  const setBackgroundVolume = (volume: number) => {
    if (backgroundAudioRef.current) {
      // El fondo siempre tiene un volumen base más bajo
      backgroundAudioRef.current.volume = volume * 0.3;
    }
  };

  const setItemSearchVolume = (volume: number) => {
    if (itemSearchAudioRef.current) {
      // El sonido de items tiene volumen más alto
      itemSearchAudioRef.current.volume = volume * 0.4; // Reducido para que no tape la música de fondo
    }
  };

  const playBatHit = async () => {
    console.log('PLAY BAT HIT - Función llamada');
    console.log(`PLAY BAT HIT - soundEnabled: ${soundEnabled}, volume: ${volume}`);
    console.log(`PLAY BAT HIT - batHitAudioRef: ${!!batHitAudioRef.current}`);
    
    if (batHitAudioRef.current) {
      console.log('PLAY BAT HIT - Audio details:', {
        src: batHitAudioRef.current.src,
        readyState: batHitAudioRef.current.readyState,
        networkState: batHitAudioRef.current.networkState,
        error: batHitAudioRef.current.error,
        paused: batHitAudioRef.current.paused,
        ended: batHitAudioRef.current.ended,
        duration: batHitAudioRef.current.duration
      });
    }
    
    if (batHitAudioRef.current && soundEnabled) {
      try {
        console.log('PLAY BAT HIT - Reproduciendo sonido de bate...');
        // Reiniciar el audio si ya está reproduciéndose
        batHitAudioRef.current.currentTime = 0;
        batHitAudioRef.current.volume = volume * 0.5; // Reducido para que no tape la música de fondo
        console.log('PLAY BAT HIT - Audio configurado, intentando play()...');
        await batHitAudioRef.current.play();
        console.log('PLAY BAT HIT - Sonido de bate reproducido correctamente');
      } catch (error) {
        console.log('PLAY BAT HIT - Error al reproducir sonido de bate:', error);
        console.log('PLAY BAT HIT - Error details:', {
          name: (error as Error).name,
          message: (error as Error).message
        });
        
        // Intentar cargar el audio de nuevo si hay error
        if (batHitAudioRef.current) {
          console.log('PLAY BAT HIT - Intentando recargar audio...');
          batHitAudioRef.current.load();
        }
      }
    } else {
      console.log('PLAY BAT HIT - No se puede reproducir:', {
        hasAudio: !!batHitAudioRef.current,
        soundEnabled: soundEnabled
      });
    }
  };

  const setBatHitVolume = (volume: number) => {
    if (batHitAudioRef.current) {
      batHitAudioRef.current.volume = volume * 0.5; // Reducido para que no tape la música de fondo
    }
  };

  const playEat = async () => {
    if (eatAudioRef.current) {
      try {
        console.log('Reproduciendo sonido de comer...');
        eatAudioRef.current.currentTime = 0;
        await eatAudioRef.current.play();
        console.log('Sonido de comer reproducido');
      } catch (error) {
        console.log('Error al reproducir sonido de comer:', error);
      }
    }
  };

  const playDrink = async () => {
    if (drinkAudioRef.current) {
      try {
        console.log('Reproduciendo sonido de beber...');
        drinkAudioRef.current.currentTime = 0;
        await drinkAudioRef.current.play();
        console.log('Sonido de beber reproducido');
      } catch (error) {
        console.log('Error al reproducir sonido de beber:', error);
      }
    }
  };

  const playPill = async () => {
    if (pillAudioRef.current) {
      try {
        console.log('Reproduciendo sonido de pastilla...');
        pillAudioRef.current.currentTime = 0;
        await pillAudioRef.current.play();
        console.log('Sonido de pastilla reproducido');
      } catch (error) {
        console.log('Error al reproducir sonido de pastilla:', error);
      }
    }
  };

  const playHit = async () => {
    if (hitAudioRef.current) {
      try {
        console.log('Reproduciendo sonido de golpe...');
        hitAudioRef.current.currentTime = 0;
        await hitAudioRef.current.play();
        console.log('Sonido de golpe reproducido');
      } catch (error) {
        console.log('Error al reproducir sonido de golpe:', error);
      }
    }
  };

  const playZombieBat = async () => {
    if (zombieBatAudioRef.current) {
      try {
        console.log('Reproduciendo sonido de bate zombie...');
        zombieBatAudioRef.current.currentTime = 0;
        await zombieBatAudioRef.current.play();
        console.log('Sonido de bate zombie reproducido');
      } catch (error) {
        console.log('Error al reproducir sonido de bate zombie:', error);
      }
    }
  };

  const playRat = async () => {
    if (ratAudioRef.current) {
      try {
        console.log('Reproduciendo sonido de rata...');
        ratAudioRef.current.currentTime = 0;
        await ratAudioRef.current.play();
        console.log('Sonido de rata reproducido');
      } catch (error) {
        console.log('Error al reproducir sonido de rata:', error);
      }
    }
  };

  const playMinigameStart = async () => {
    if (minigameStartAudioRef.current) {
      try {
        console.log('Reproduciendo sonido de inicio de minijuego...');
        minigameStartAudioRef.current.currentTime = 0;
        await minigameStartAudioRef.current.play();
        console.log('Sonido de inicio de minijuego reproducido');
      } catch (error) {
        console.log('Error al reproducir sonido de inicio de minijuego:', error);
      }
    }
  };

  const playZombieMinigame = async () => {
    if (zombieMinigameAudioRef.current) {
      try {
        console.log('Reproduciendo sonido de minijuego de zombie...');
        zombieMinigameAudioRef.current.currentTime = 0;
        await zombieMinigameAudioRef.current.play();
        console.log('Sonido de minijuego de zombie reproducido');
      } catch (error) {
        console.log('Error al reproducir sonido de minijuego de zombie:', error);
      }
    }
  };

  const playHouseCard = async () => {
    if (houseCardAudioRef.current) {
      try {
        console.log('Reproduciendo sonido de carta-casa...');
        houseCardAudioRef.current.currentTime = 0;
        await houseCardAudioRef.current.play();
        console.log('Sonido de carta-casa reproducido');
      } catch (error) {
        console.log('Error al reproducir sonido de carta-casa:', error);
      }
    }
  };

  const playShiver = async () => {
    if (shiverAudioRef.current) {
      try {
        console.log('Reproduciendo sonido de tiritar...');
        shiverAudioRef.current.currentTime = 0;
        await shiverAudioRef.current.play();
        console.log('Sonido de tiritar reproducido');
      } catch (error) {
        console.log('Error al reproducir sonido de tiritar:', error);
      }
    }
  };

  const setEatVolume = (volume: number) => {
    if (eatAudioRef.current) {
      eatAudioRef.current.volume = volume * 0.4; // Reducido para que no tape la música de fondo
    }
  };

  const setDrinkVolume = (volume: number) => {
    if (drinkAudioRef.current) {
      drinkAudioRef.current.volume = volume * 0.4; // Reducido para que no tape la música de fondo
    }
  };

  const setPillVolume = (volume: number) => {
    if (pillAudioRef.current) {
      pillAudioRef.current.volume = volume * 0.4; // Reducido para que no tape la música de fondo
    }
  };

  const setHitVolume = (volume: number) => {
    if (hitAudioRef.current) {
      hitAudioRef.current.volume = volume * 0.5; // Reducido para que no tape la música de fondo
    }
  };

  const setZombieBatVolume = (volume: number) => {
    if (zombieBatAudioRef.current) {
      zombieBatAudioRef.current.volume = volume * 0.5; // Reducido para que no tape la música de fondo
    }
  };

  const setRatVolume = (volume: number) => {
    if (ratAudioRef.current) {
      ratAudioRef.current.volume = volume * 0.4; // Reducido para que no tape la música de fondo
    }
  };

  const setMinigameStartVolume = (volume: number) => {
    if (minigameStartAudioRef.current) {
      minigameStartAudioRef.current.volume = volume * 0.4; // Reducido para que no tape la música de fondo
    }
  };

  const setHouseCardVolume = (volume: number) => {
    if (houseCardAudioRef.current) {
      houseCardAudioRef.current.volume = volume * 0.4; // Reducido para que no tape la música de fondo
    }
  };

  const setShiverVolume = (volume: number) => {
    if (shiverAudioRef.current) {
      shiverAudioRef.current.volume = volume * 0.3; // Reducido para que no tape la música de fondo
    }
  };

  return {
    playBackground,
    pauseBackground,
    playItemSearch,
    pauseItemSearch,
    playBatHit,
    playEat,
    playDrink,
    playPill,
    playHit,
    playZombieBat,
    playRat,
    playMinigameStart,
    playZombieMinigame,
    playHouseCard,
    playShiver,
    setBackgroundVolume,
    setItemSearchVolume,
    setBatHitVolume,
    setEatVolume,
    setDrinkVolume,
    setPillVolume,
    setHitVolume,
    setZombieBatVolume,
    setRatVolume,
    setMinigameStartVolume,
    setHouseCardVolume,
    setShiverVolume,
    backgroundPlaying,
    itemSearchPlaying
  };
};
