/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Nunito', 'sans-serif'],
      },
      colors: {
        kid: {
          red: '#FF4B4B',
          blue: '#4B9FFF',
          green: '#4CAF50',
          yellow: '#FFC107',
          purple: '#9C27B0',
          orange: '#FF9800',
        }
      }
    },
  },
  plugins: [],
}
