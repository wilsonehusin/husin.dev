const defaults = require("tailwindcss/defaultTheme");
const mono = ["Iosevka", "Iosevka Variable", defaults.fontFamily.mono];

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './layouts/**/*.html',
    './assets/js/*.js',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        // modernfontstacks.com: Industrial
        display: [
          'Bahnschrift',
          '"DIN Alternate"',
          '"Franklin Gothic Medium"',
          '"Nimbus Sans Narrow"',
          'sans-serif-condensed',
          'sans-serif',
        ],
        mono: mono,
      },
    },
  },
  plugins: [],
};
