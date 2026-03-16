/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        sage: { 600: '#6B705C', 700: '#5A5F4E' },
        sand: { 100: '#F5EDE6', 200: '#E8DED5' },
        terracotta: { 500: '#B08968' },
      },
    },
  },
  plugins: [],
};
