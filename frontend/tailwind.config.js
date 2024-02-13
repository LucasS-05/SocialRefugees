const defaultTheme = require('tailwindcss/defaultTheme')
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'main-red': "#CD5D7D",
        'main-gray': "#F6ECF0",
        'main-blue': "#A7C5EB",
        'main-purple': "#949CDF"
      },
      fontFamily: {
        'sans': ['Open Sans', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
