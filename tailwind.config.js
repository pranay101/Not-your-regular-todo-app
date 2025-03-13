/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './src/renderer/index.html'
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#FF4545',
          light: '#FF6B6B',
          dark: '#E03C3C',
        },
        secondary: {
          dark: '#1A1A2E',
          DEFAULT: '#222236',
          light: '#2A2A3C',
        },
        accent: '#4D79FF',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}; 