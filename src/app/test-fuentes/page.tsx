'use client';

import React, { useState } from 'react';

export default function TestFuentes() {
  const [fuenteSeleccionada, setFuenteSeleccionada] = useState('Comic Sans MS');

  const fuentes = [
    { nombre: 'Comic Sans MS', familia: 'Comic Sans MS, cursive' },
    { nombre: 'Impact', familia: 'Impact, sans-serif' },
    { nombre: 'Arial Black', familia: 'Arial Black, sans-serif' },
    { nombre: 'Bebas Neue', familia: 'Bebas Neue, sans-serif' },
    { nombre: 'Oswald', familia: 'Oswald, sans-serif' },
    { nombre: 'Roboto Condensed', familia: 'Roboto Condensed, sans-serif' },
    { nombre: 'Bangers', familia: 'Bangers, cursive' },
    { nombre: 'Creepster', familia: 'Creepster, cursive' },
    { nombre: 'Nosifer', familia: 'Nosifer, cursive' },
    { nombre: 'Butcherman', familia: 'Butcherman, cursive' },
    { nombre: 'Fascinate Inline', familia: 'Fascinate Inline, cursive' },
    { nombre: 'Fascinate', familia: 'Fascinate, cursive' },
    { nombre: 'Finger Paint', familia: 'Finger Paint, cursive' },
    { nombre: 'Freckle Face', familia: 'Freckle Face, cursive' },
    { nombre: 'Knewave', familia: 'Knewave, cursive' },
    { nombre: 'Londrina Solid', familia: 'Londrina Solid, cursive' },
    { nombre: 'Londrina Shadow', familia: 'Londrina Shadow, cursive' },
    { nombre: 'Londrina Sketch', familia: 'Londrina Sketch, cursive' },
    { nombre: 'Londrina Outline', familia: 'Londrina Outline, cursive' },
    { nombre: 'Permanent Marker', familia: 'Permanent Marker, cursive' },
    { nombre: 'Righteous', familia: 'Righteous, cursive' },
    { nombre: 'Russo One', familia: 'Russo One, sans-serif' },
    { nombre: 'Staatliches', familia: 'Staatliches, cursive' },
    { nombre: 'Ultra', familia: 'Ultra, serif' },
    { nombre: 'Vampiro One', familia: 'Vampiro One, cursive' },
    { nombre: 'Wendy One', familia: 'Wendy One, sans-serif' },
    { nombre: 'Zilla Slab Highlight', familia: 'Zilla Slab Highlight, cursive' },
    { nombre: 'Zilla Slab', familia: 'Zilla Slab, serif' }
  ];

  const textosEjemplo = [
    "¡EMPEZAR A SOBREVIVIR!",
    "¡AL LÍO!",
    "¡CORREEE! QUE VIENEN ZOMBIS!",
    "¡COGE TODO LO QUE PUEDAS!",
    "¡A VER CUÁNTO SOBREVIVO!",
    "🧟 ¡BIENVENIDO AL APOCALIPSIS!",
    "🎒 ¡COGE LO MÁS IMPORTANTE!",
    "¿CÓMO SOBREVIVIR?",
    "¡VOLVER AL JUEGO! 🎮"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">
          🎮 Test de Fuentes para "Un Día Más"
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {fuentes.map((fuente) => (
            <div 
              key={fuente.nombre}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                fuenteSeleccionada === fuente.nombre 
                  ? 'border-yellow-400 bg-yellow-400 bg-opacity-20' 
                  : 'border-gray-600 bg-gray-800'
              }`}
              onClick={() => setFuenteSeleccionada(fuente.nombre)}
            >
              <h3 className="text-white text-sm mb-2">{fuente.nombre}</h3>
              <div 
                className="text-yellow-400 text-lg font-bold"
                style={{ fontFamily: fuente.familia }}
              >
                ¡EMPEZAR A SOBREVIVIR!
              </div>
            </div>
          ))}
        </div>

        <div className="bg-black bg-opacity-70 rounded-xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            Vista Previa: {fuenteSeleccionada}
          </h2>
          
          <div className="space-y-6">
            {textosEjemplo.map((texto, index) => (
              <div key={index} className="text-center">
                <div 
                  className="text-yellow-400 font-black text-2xl sm:text-3xl mb-2"
                  style={{ 
                    fontFamily: fuentes.find(f => f.nombre === fuenteSeleccionada)?.familia,
                    textShadow: '3px 3px 0px #000'
                  }}
                >
                  {texto}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <button
              className="bg-yellow-400 text-black px-8 py-4 rounded-xl text-xl font-black hover:bg-yellow-300 transition-colors shadow-2xl border-4 border-black transform hover:scale-105"
              style={{ 
                fontFamily: fuentes.find(f => f.nombre === fuenteSeleccionada)?.familia,
                textShadow: '2px 2px 0px #000',
                boxShadow: '4px 4px 0px #000'
              }}
            >
              ¡BOTÓN DE EJEMPLO!
            </button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-white text-sm">
              Fuente seleccionada: <span className="text-yellow-400 font-bold">{fuenteSeleccionada}</span>
            </p>
            <p className="text-gray-400 text-xs mt-2">
              CSS: <code className="bg-gray-800 px-2 py-1 rounded">{fuentes.find(f => f.nombre === fuenteSeleccionada)?.familia}</code>
            </p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <a 
            href="/" 
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            ← Volver al Juego
          </a>
        </div>
      </div>
    </div>
  );
}
