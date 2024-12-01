/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./docs/**/*.{html,js}"],
  theme: {
    fontFamily:{
      'inter': ["Inter"]
    },
    extend: {
      colors: {
        'primary':{
          100: '#c9f0f8',
          200: '#8fe1ef',
          300: '#0072ed',
          400: '#03045e'
        },
        'white': '#fff'
        },
    },
  },
  plugins: [],
}

