/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        sage: {
          50: "#f4f3ee",
          100: "#e8e6dc",
          200: "#d5d1c1",
          300: "#c2bda6",
          400: "#B2AC88",
          500: "#9a946e",
          600: "#7d7857",
          700: "#605c43",
          800: "#43412f",
          900: "#26251b",
        },
        cream: {
          50: "#FFFEF8",
          100: "#FFFDD0",
          200: "#FFF9B0",
          300: "#FFF590",
        },
        charcoal: {
          DEFAULT: "#2D2D2D",
          light: "#4A4A4A",
          muted: "#6B6B6B",
        },
      },
      fontFamily: {
        serif: ['"DM Serif Display"', "Georgia", "serif"],
        sans: ['"Plus Jakarta Sans"', "system-ui", "sans-serif"],
      },
      animation: {
        "pulse-heart": "pulseHeart 2s ease-in-out infinite",
        "fade-up": "fadeUp 0.8s ease-out forwards",
      },
      keyframes: {
        pulseHeart: {
          "0%, 100%": { transform: "scale(1)", opacity: "0.8" },
          "50%": { transform: "scale(1.15)", opacity: "1" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
}
