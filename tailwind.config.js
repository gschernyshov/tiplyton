// tailwind.config.js
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { heroui } = require("@heroui/theme")

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./node_modules/@heroui/theme/dist/components/(alert|avatar|button|card|checkbox|chip|form|input|modal|navbar|popover|skeleton|snippet|spinner|ripple).js"
],
  theme: {
    extend: {},
  },
  darkMode: "class",
  plugins: [
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require('tailwind-scrollbar-hide'), 
    heroui()
  ],
}