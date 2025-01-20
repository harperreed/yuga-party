/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      perspective: {
        '1000': '1000px',
      }
    },
  },
  plugins: [],
}
