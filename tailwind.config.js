/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Oswald', 'sans-serif'],
      },
      colors: {
        afro: {
          primary: '#F59E0B', // Amber 500
          secondary: '#166534', // Green 800
          dark: '#111827', // Gray 900
          light: '#F9FAFB', // Gray 50
        }
      }
    },
  },
  plugins: [],
}

