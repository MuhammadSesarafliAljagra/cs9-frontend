/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class", // Enable dark mode with class strategy
  theme: {
    extend: {
      colors: {
        // Custom color palette that works well in both light/dark modes
        primary: {
          50: "#f0f9ff",
          100: "#e0f2fe",
          200: "#bae6fd",
          300: "#7dd3fc",
          400: "#38bdf8",
          500: "#0ea5e9",
          600: "#0284c7",
          700: "#0369a1",
          800: "#075985",
          900: "#0c4a6e",
        },
        // Additional color variations for dark mode
        dark: {
          bg: "#121212",
          card: "#1e1e1e",
          border: "#2e2e2e",
          text: "#e0e0e0",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        smooth: "0 2px 10px rgba(0, 0, 0, 0.05)",
        "smooth-dark": "0 2px 10px rgba(0, 0, 0, 0.2)",
      },
      animation: {
        skeleton: "skeleton 1.5s ease-in-out infinite",
      },
      keyframes: {
        skeleton: {
          "0%, 100%": { opacity: 0.5 },
          "50%": { opacity: 1 },
        },
      },
    },
  },
  plugins: [],
};