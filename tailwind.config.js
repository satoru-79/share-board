/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'header': '#FFA500'
      },
      backgroundImage: theme => ({
        'court-img' : "url('../public/images/court.png')",
        'half-court-img' : "url('../public/images/half-court.png')"
      })
    },
  },
  plugins: [],
}

