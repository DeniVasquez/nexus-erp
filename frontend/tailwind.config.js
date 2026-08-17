/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    borderRadius: {
      none: '0px',
      sm: '0px',
      DEFAULT: '0px',
      md: '0px',
      lg: '0px',
      xl: '0px',
      '2xl': '0px',
      '3xl': '0px',
      full: '9999px',
    },
    extend: {
      colors: {
        coral: { DEFAULT: '#F2686C', 50: '#FDECEC', 600: '#E2484D' },
        mint: { DEFAULT: '#3ED6B5', 600: '#2BB89D', 700: '#0F7A64' },
        vuexy: { DEFAULT: '#696CFF', 600: '#5F61E6' },
        night: { 900: '#1B1C28', 800: '#262A3D', 700: '#2F3349', 600: '#3B3F57', 400: '#A0A3BD' },
      },
    },
  },
  plugins: [],
}