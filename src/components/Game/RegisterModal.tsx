'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';

export const RegisterModal: React.FC = () => {
  const { showRegister, setShowRegister, setShowSettings, isPaused, resumeGame } = useGameStore();
  const [formData, setFormData] = useState({
    nick: '',
    nombre: '',
    correo: '',
    contraseña: '',
    confirmarContraseña: ''
  });
  const [errors, setErrors] = useState<string[]>([]);

  if (!showRegister) return null;

  const handleClose = () => {
    setShowRegister(false);
    // Si el juego estaba pausado por el prompt de registro, reanudarlo
    if (isPaused) {
      resumeGame();
    } else {
      setShowSettings(true);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    const newErrors: string[] = [];
    
    if (!formData.nick.trim()) newErrors.push('El nick es obligatorio');
    if (!formData.nombre.trim()) newErrors.push('El nombre es obligatorio');
    if (!formData.correo.trim()) newErrors.push('El correo es obligatorio');
    if (!formData.contraseña.trim()) newErrors.push('La contraseña es obligatoria');
    if (formData.contraseña !== formData.confirmarContraseña) {
      newErrors.push('Las contraseñas no coinciden');
    }
    if (formData.contraseña.length < 6) {
      newErrors.push('La contraseña debe tener al menos 6 caracteres');
    }
    
    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Aquí iría la lógica de registro
      console.log('Registrando usuario:', formData);
      alert('¡Registro exitoso! (Funcionalidad pendiente)');
      handleClose();
    }
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
        {/* Fondo de registro */}
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
            <div className="text-center mb-6">
              <h2 className="text-3xl sm:text-4xl font-black text-yellow-400 flex items-center justify-center space-x-3" style={{
                fontFamily: 'Comic Sans MS, cursive',
                textShadow: '4px 4px 0px #000, -3px -3px 0px #000, 3px -3px 0px #000, -3px 3px 0px #000'
              }}>
                <img src="/images/usuario.png" alt="Usuario" className="w-8 h-8" />
                <span>REGISTRARSE</span>
              </h2>
            </div>

            {/* Formulario */}
            <form onSubmit={handleSubmit} className="flex-1">
              <div className="space-y-2">
                {/* Nick */}
                <div className="bg-black bg-opacity-70 p-3 rounded-lg">
                  <label className="block text-white text-xs sm:text-sm font-bold mb-1" style={{ fontFamily: 'Comic Sans MS, cursive' }}>
                    Nick:
                  </label>
                  <input
                    type="text"
                    name="nick"
                    value={formData.nick}
                    onChange={handleInputChange}
                    className="w-full px-2 py-1.5 bg-black bg-opacity-50 border-2 border-yellow-400 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-300 text-sm"
                    placeholder="Tu nick de jugador"
                    style={{ fontFamily: 'Comic Sans MS, cursive' }}
                  />
                </div>

                {/* Nombre */}
                <div className="bg-black bg-opacity-70 p-3 rounded-lg">
                  <label className="block text-white text-xs sm:text-sm font-bold mb-1" style={{ fontFamily: 'Comic Sans MS, cursive' }}>
                    Nombre:
                  </label>
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    className="w-full px-2 py-1.5 bg-black bg-opacity-50 border-2 border-yellow-400 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-300 text-sm"
                    placeholder="Tu nombre real"
                    style={{ fontFamily: 'Comic Sans MS, cursive' }}
                  />
                </div>

                {/* Correo */}
                <div className="bg-black bg-opacity-70 p-3 rounded-lg">
                  <label className="block text-white text-xs sm:text-sm font-bold mb-1" style={{ fontFamily: 'Comic Sans MS, cursive' }}>
                    Correo:
                  </label>
                  <input
                    type="email"
                    name="correo"
                    value={formData.correo}
                    onChange={handleInputChange}
                    className="w-full px-2 py-1.5 bg-black bg-opacity-50 border-2 border-yellow-400 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-300 text-sm"
                    placeholder="tu@email.com"
                    style={{ fontFamily: 'Comic Sans MS, cursive' }}
                  />
                </div>

                {/* Contraseña */}
                <div className="bg-black bg-opacity-70 p-3 rounded-lg">
                  <label className="block text-white text-xs sm:text-sm font-bold mb-1" style={{ fontFamily: 'Comic Sans MS, cursive' }}>
                    Contraseña:
                  </label>
                  <input
                    type="password"
                    name="contraseña"
                    value={formData.contraseña}
                    onChange={handleInputChange}
                    className="w-full px-2 py-1.5 bg-black bg-opacity-50 border-2 border-yellow-400 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-300 text-sm"
                    placeholder="Mínimo 6 caracteres"
                    style={{ fontFamily: 'Comic Sans MS, cursive' }}
                  />
                </div>

                {/* Confirmar Contraseña */}
                <div className="bg-black bg-opacity-70 p-3 rounded-lg">
                  <label className="block text-white text-xs sm:text-sm font-bold mb-1" style={{ fontFamily: 'Comic Sans MS, cursive' }}>
                    Confirmar Contraseña:
                  </label>
                  <input
                    type="password"
                    name="confirmarContraseña"
                    value={formData.confirmarContraseña}
                    onChange={handleInputChange}
                    className="w-full px-2 py-1.5 bg-black bg-opacity-50 border-2 border-yellow-400 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-300 text-sm"
                    placeholder="Repite tu contraseña"
                    style={{ fontFamily: 'Comic Sans MS, cursive' }}
                  />
                </div>

                {/* Errores */}
                {errors.length > 0 && (
                  <div className="bg-red-600 bg-opacity-50 border-2 border-red-400 rounded-lg p-3">
                    <ul className="text-white text-sm" style={{ fontFamily: 'Comic Sans MS, cursive' }}>
                      {errors.map((error, index) => (
                        <li key={index}>• {error}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Botones */}
              <div className="flex space-x-3 mt-3">
                {isPaused ? (
                  // Si es el prompt del día 3, mostrar "Más tarde"
                  <button
                    type="button"
                    onClick={handleClose}
                    className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-xl font-bold transition-colors relative text-sm"
                    style={{ 
                      fontFamily: 'Comic Sans MS, cursive',
                      textShadow: '2px 2px 0px #000',
                      boxShadow: '2px 2px 0px #000, 0 0 15px rgba(234, 88, 12, 0.5), 0 0 30px rgba(234, 88, 12, 0.2)',
                      border: '2px solid #000'
                    }}
                  >
                    {/* Efecto de resplandor sucio */}
                    <div 
                      className="absolute inset-0 rounded-xl pointer-events-none"
                      style={{
                        background: 'linear-gradient(45deg, rgba(234, 88, 12, 0.3) 0%, rgba(234, 88, 12, 0.1) 50%, rgba(234, 88, 12, 0.3) 100%)',
                        filter: 'blur(0.5px)',
                        animation: 'pulse 2s ease-in-out infinite'
                      }}
                    />
                    MÁS TARDE
                  </button>
                ) : (
                  // Si es desde configuración, mostrar "Cancelar"
                  <button
                    type="button"
                    onClick={handleClose}
                    className="bg-slate-600 hover:bg-slate-700 text-white px-4 py-2 rounded-xl font-bold transition-colors relative text-sm"
                    style={{ 
                      fontFamily: 'Comic Sans MS, cursive',
                      textShadow: '2px 2px 0px #000',
                      boxShadow: '2px 2px 0px #000, 0 0 15px rgba(71, 85, 105, 0.5), 0 0 30px rgba(71, 85, 105, 0.2)',
                      border: '2px solid #000'
                    }}
                  >
                    {/* Efecto de resplandor sucio */}
                    <div 
                      className="absolute inset-0 rounded-xl pointer-events-none"
                      style={{
                        background: 'linear-gradient(45deg, rgba(71, 85, 105, 0.3) 0%, rgba(71, 85, 105, 0.1) 50%, rgba(71, 85, 105, 0.3) 100%)',
                        filter: 'blur(0.5px)',
                        animation: 'pulse 2s ease-in-out infinite'
                      }}
                    />
                    CANCELAR
                  </button>
                )}
                <button
                  type="submit"
                  className="bg-yellow-400 text-black px-4 py-2 rounded-xl font-black hover:bg-yellow-300 transition-colors shadow-2xl border-4 border-black transform hover:scale-105 relative text-sm"
                  style={{ 
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
                  REGISTRARSE
                </button>
              </div>
            </form>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
