/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Colores del juego
        'apocalypse': {
          'dark': '#0b132b',
          'medium': '#13315c',
          'light': '#1e3a8a',
          'accent': '#ffd447',
          'secondary': '#7cf5ff',
          'danger': '#ff6bcb',
        },
        'status': {
          'hunger': '#ff4444',
          'thirst': '#4444ff',
          'health': '#44ff44',
          'infected': '#44ff44',
        }
      },
      animation: {
        'pulse-red': 'pulse-red 2s infinite',
        'pulse-blue': 'pulse-blue 2s infinite',
        'shake': 'shake 0.5s ease-in-out',
        'fade-in': 'fade-in 0.3s ease-in-out',
        'slide-up': 'slide-up 0.3s ease-out',
      },
      keyframes: {
        'pulse-red': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        'pulse-blue': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        'shake': {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-5px)' },
          '75%': { transform: 'translateX(5px)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
