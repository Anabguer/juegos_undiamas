'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';

export const SettingsModal: React.FC = () => {
  const { showSettings, setShowSettings, resumeGame, setShowRegister, volume, setVolume, soundEnabled, setSoundEnabled } = useGameStore();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');

  if (!showSettings) return null;

  const handleClose = () => {
    setShowSettings(false);
    resumeGame();
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseInt(e.target.value) / 100; // Convertir de 0-100 a 0-1
    setVolume(newVolume);
  };

  const handleSoundToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isDisabled = e.target.checked;
    setSoundEnabled(!isDisabled); // Si está marcado como "desactivado", entonces soundEnabled = false
    console.log('SOUND TOGGLE - isDisabled:', isDisabled, 'soundEnabled:', !isDisabled);
  };

  const handleLogin = () => {
    // Aquí iría la lógica de login
    setIsLoggedIn(true);
    setUserName('Usuario');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserName('');
  };

  const handleRegister = () => {
    // Abrir modal de registro
    setShowRegister(true);
    setShowSettings(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black flex items-center justify-center z-50 p-4"
      onClick={handleClose}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="relative w-full h-full sm:max-w-lg sm:h-[500px] sm:mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Fondo de configuración */}
        <div
          className="absolute inset-0 bg-cover bg-center sm:rounded-lg"
          style={{
            backgroundImage: 'url(/images/bg_usuario.png)',
            backgroundSize: '120%',
            backgroundPosition: 'center',
            filter: 'blur(2px)'
          }}
        />
        <div className="absolute inset-0 sm:rounded-lg">
          {/* Contenido del modal */}
          <div className="relative z-10 p-4 sm:p-6 h-full flex flex-col" style={{ marginTop: '15%' }}>
            {/* Título */}
            <div className="text-center mb-8">
                  <h2 className="text-3xl sm:text-4xl font-black text-yellow-400 flex items-center justify-center space-x-3" style={{
                    fontFamily: 'Comic Sans MS, cursive',
                    textShadow: '4px 4px 0px #000, -3px -3px 0px #000, 3px -3px 0px #000, -3px 3px 0px #000'
                  }}>
                    <img src="/images/configuracion.png" alt="Configuración" className="w-8 h-8" />
                    <span>CONFIGURACIÓN</span>
                  </h2>
            </div>

            {/* Sección de Sonido */}
            <div className="mb-4 bg-black bg-opacity-85 rounded-lg p-4" style={{ marginTop: '70px', minHeight: '180px' }}>
              <h3 className="text-base sm:text-lg font-bold text-white mb-2 flex items-center space-x-2" style={{ fontFamily: 'Comic Sans MS, cursive' }}>
                <img src="/images/sonido.png" alt="Sonido" className="w-8 h-8" />
                <span>SONIDO</span>
              </h3>
              <div style={{ marginTop: '25px' }}>
                <div className="flex items-center space-x-4">
                  <span className="text-white text-sm sm:text-base" style={{ fontFamily: 'Comic Sans MS, cursive' }}>
                    Volumen:
                  </span>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={Math.round(volume * 100)}
                    onChange={handleVolumeChange}
                    disabled={!soundEnabled}
                    className={`flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider ${!soundEnabled ? 'opacity-50' : ''}`}
                    style={{
                      background: `linear-gradient(to right, #fbbf24 0%, #fbbf24 ${Math.round(volume * 100)}%, #374151 ${Math.round(volume * 100)}%, #374151 100%)`
                    }}
                  />
                  <span className={`font-bold text-sm sm:text-base ${!soundEnabled ? 'text-gray-500' : 'text-yellow-400'}`} style={{ fontFamily: 'Comic Sans MS, cursive' }}>
                    {Math.round(volume * 100)}%
                  </span>
                </div>
                <div className="mt-3 flex items-center space-x-3">
                  <div className="relative">
                    <input
                      type="checkbox"
                      id="soundDisabled"
                      checked={!soundEnabled}
                      onChange={handleSoundToggle}
                      className="w-5 h-5 text-yellow-400 bg-black border-2 border-yellow-400 rounded focus:ring-yellow-400 focus:ring-2 appearance-none cursor-pointer"
                      style={{
                        boxShadow: '2px 2px 0px #000, 0 0 10px rgba(255, 255, 0, 0.3)',
                        border: '2px solid #fbbf24'
                      }}
                    />
                    <div className="absolute inset-0 pointer-events-none">
                      <div
                        className="w-full h-full rounded"
                        style={{
                          background: 'linear-gradient(45deg, rgba(255, 255, 0, 0.2) 0%, rgba(255, 255, 0, 0.1) 50%, rgba(255, 255, 0, 0.2) 100%)',
                          filter: 'blur(0.5px)',
                          animation: 'pulse 2s ease-in-out infinite'
                        }}
                      />
                    </div>
                  </div>
                  <label htmlFor="soundDisabled" className="text-yellow-400 text-sm font-bold cursor-pointer" style={{ 
                    fontFamily: 'Comic Sans MS, cursive',
                    textShadow: '2px 2px 0px #000'
                  }}>
                    DESACTIVADO
                  </label>
                </div>
              </div>
            </div>

            {/* Sección de Usuario */}
            <div className="mb-4 bg-black bg-opacity-85 rounded-lg p-4" style={{ marginTop: '40px', minHeight: '180px' }}>
              <h3 className="text-base sm:text-lg font-bold text-white mb-2 flex items-center space-x-2" style={{ fontFamily: 'Comic Sans MS, cursive' }}>
                <img src="/images/usuario.png" alt="Usuario" className="w-8 h-8" />
                <span>USUARIO</span>
              </h3>
              <div>
                {isLoggedIn ? (
                  <div className="space-y-2">
                    <div className="text-white text-sm" style={{ fontFamily: 'Comic Sans MS, cursive' }}>
                      Conectado como: <span className="text-yellow-400 font-bold">{userName}</span>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-bold transition-colors relative"
                      style={{ 
                        fontFamily: 'Comic Sans MS, cursive',
                        textShadow: '2px 2px 0px #000',
                        boxShadow: '2px 2px 0px #000, 0 0 15px rgba(220, 38, 38, 0.5), 0 0 30px rgba(220, 38, 38, 0.2)',
                        border: '2px solid #000'
                      }}
                    >
                      {/* Efecto de resplandor sucio */}
                      <div 
                        className="absolute inset-0 rounded-lg pointer-events-none"
                        style={{
                          background: 'linear-gradient(45deg, rgba(220, 38, 38, 0.3) 0%, rgba(220, 38, 38, 0.1) 50%, rgba(220, 38, 38, 0.3) 100%)',
                          filter: 'blur(0.5px)',
                          animation: 'pulse 2s ease-in-out infinite'
                        }}
                      />
                      Cerrar Sesión
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="text-white text-sm" style={{ fontFamily: 'Comic Sans MS, cursive' }}>
                      No estás conectado
                    </div>
                        <div className="flex space-x-2" style={{ marginTop: '20px' }}>
                      <button
                        onClick={handleLogin}
                        className="bg-amber-700 hover:bg-amber-800 text-white px-3 py-2 rounded-lg font-bold transition-colors relative text-sm"
                        style={{ 
                          fontFamily: 'Comic Sans MS, cursive',
                          textShadow: '2px 2px 0px #000',
                          boxShadow: '2px 2px 0px #000, 0 0 15px rgba(180, 83, 9, 0.5), 0 0 30px rgba(180, 83, 9, 0.2)',
                          border: '2px solid #000'
                        }}
                      >
                        {/* Efecto de resplandor sucio */}
                        <div 
                          className="absolute inset-0 rounded-lg pointer-events-none"
                          style={{
                            background: 'linear-gradient(45deg, rgba(180, 83, 9, 0.3) 0%, rgba(180, 83, 9, 0.1) 50%, rgba(180, 83, 9, 0.3) 100%)',
                            filter: 'blur(0.5px)',
                            animation: 'pulse 2s ease-in-out infinite'
                          }}
                        />
                        Iniciar Sesión
                      </button>
                      <button
                        onClick={handleRegister}
                        className="bg-stone-600 hover:bg-stone-700 text-white px-3 py-2 rounded-lg font-bold transition-colors relative text-sm"
                        style={{ 
                          fontFamily: 'Comic Sans MS, cursive',
                          textShadow: '2px 2px 0px #000',
                          boxShadow: '2px 2px 0px #000, 0 0 15px rgba(87, 83, 78, 0.5), 0 0 30px rgba(87, 83, 78, 0.2)',
                          border: '2px solid #000'
                        }}
                      >
                        {/* Efecto de resplandor sucio */}
                        <div 
                          className="absolute inset-0 rounded-lg pointer-events-none"
                          style={{
                            background: 'linear-gradient(45deg, rgba(87, 83, 78, 0.3) 0%, rgba(87, 83, 78, 0.1) 50%, rgba(87, 83, 78, 0.3) 100%)',
                            filter: 'blur(0.5px)',
                            animation: 'pulse 2s ease-in-out infinite'
                          }}
                        />
                        Registrarse
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Botón de cerrar */}
                <div className="text-center" style={{ marginTop: '4rem' }}>
              <button
                onClick={handleClose}
                className="bg-yellow-400 text-black px-6 py-3 sm:px-8 sm:py-4 rounded-xl text-lg sm:text-xl font-black hover:bg-yellow-300 transition-colors touch-manipulation shadow-2xl border-4 border-black transform hover:scale-105 relative"
                style={{ 
                  minHeight: '50px',
                  fontFamily: 'Comic Sans MS, cursive',
                  textShadow: '2px 2px 0px #000',
                  boxShadow: '4px 4px 0px #000, 0 0 20px rgba(255, 255, 0, 0.6), 0 0 40px rgba(255, 255, 0, 0.3)',
                  border: '4px solid #000, 2px solid rgba(255, 255, 0, 0.8)'
                }}
              >
                {/* Efecto de resplandor sucio */}
                <div 
                  className="absolute inset-0 rounded-xl pointer-events-none"
                  style={{
                    background: 'linear-gradient(45deg, rgba(255, 255, 0, 0.3) 0%, rgba(255, 255, 0, 0.1) 50%, rgba(255, 255, 0, 0.3) 100%)',
                    filter: 'blur(1px)',
                    animation: 'pulse 2s ease-in-out infinite'
                  }}
                />
                CERRAR
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
