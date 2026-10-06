/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./public/index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        residence: {
          amber: '#F59E0B',
          dark: '#1F2937',
        }
      }
    },
  },
  plugins: [],
}
