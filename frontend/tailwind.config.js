/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          light: '#d4b96a',
          DEFAULT: '#C9A84C',
          dark:  '#a8882a',
        },
        navy: {
          light: '#252b4a',
          DEFAULT: '#1a1f3a',
        },
      },
    },
  },
  plugins: [],
};
