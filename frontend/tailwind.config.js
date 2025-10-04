/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        zusOrange: 'rgb(255,179,79)',     // #FFB34F
        zusGreen: 'rgb(0,153,63)',        // #00993F
        zusGray: 'rgb(190,195,206)',      // #BEC3CE
        zusBlue: 'rgb(63,132,210)',       // #3F84D2
        zusDarkBlue: 'rgb(0,65,110)',     // #00416E
        zusRed: 'rgb(240,94,94)',         // #F05E5E
        zusBlack: 'rgb(0,0,0)',           // #000000
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
