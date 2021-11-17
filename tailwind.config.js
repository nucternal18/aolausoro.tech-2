module.exports = {
  mode: "jit",
  darkMode: 'class',
  purge: {
    layers: ['utilities'],
    content: [
      './pages/**/*.{js,ts,jsx,tsx}',
      './components/**/*.{js,ts,jsx,tsx}',
    ],
  },
  theme: {
    typography: (theme) => ({}),
    extend: {},
  },
  variants: {
    extend: {
      textOpacity: ['dark'],
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
