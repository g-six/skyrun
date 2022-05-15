const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],

  theme: {
    extend: {
      fontFamily: {
        sans: ['Graphik', 'Rubik', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [],
}
