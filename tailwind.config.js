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
       animation: {
        bounce200: "bounce 1s infinite 200ms",
        bounce400: "bounce 1s infinite 400ms",
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
