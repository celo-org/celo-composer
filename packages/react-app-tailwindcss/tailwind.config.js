/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "celo-green": "#35D07F",
        "celo-yellow": "#FBCC5C",
        "celo-black": "#111214"
      }
    },
  },
  plugins: [],
}
