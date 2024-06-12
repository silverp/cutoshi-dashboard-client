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
        inter: ['Inter', 'sans-serif'],
        playfair: ['Playfair Display', 'serif'],
      },
      colors: {
        dark: '#1F1F1F',
        primary: '#fc5796',
        black: '#1E1E1E',
        gray_border: '#E4E3E3',
        background: '#f7a3c3',
        background_1: '#282828',
        background_card: '#ffe2f0',

        text_description: '#867F75',
        line: '#E6E5EA',
        red: '#e74c3c',
        green: '#27ae60',
      },
      maxWidth: {
        figma: '90rem',
      },
    },
  },
  plugins: [require('tailwind-scrollbar')({ nocompatible: true })],
};
