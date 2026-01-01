/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'grey-primary': "#706A85",
        'purple-brand': "#5622FF",
        'red-light': "#FCF2F3",
        'red-dark': "#BF1A2F",
        'blue-light': "#EBF5FB",
        'blue-dark': "#2D7BB9",
        'black-soft': "#41395C",
      },
    },
  },
  plugins: [],
};
