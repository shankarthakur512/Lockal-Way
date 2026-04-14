/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ['"DM Sans"', "sans-serif"],
        display: ['"Playfair Display"', "serif"],
      },
      backgroundImage: {
        "local-guide-bg": "url('/guideimage.jpg')",
        "login-page-bg": "url('/signInbg.jpg')",
      },
      colors: {
        sand: "#F5F0E8",
        "sand-dark": "#E8DFC8",
        clay: "#C9956A",
        "clay-dark": "#A8754A",
        forest: "#2C4A3E",
        "forest-light": "#3D6B5A",
        ink: "#1A1A1A",
        slate: "#4A4A4A",
        mist: "#8A8A8A",
        cream: "#FDFAF5",
        gold: "#D4A24C",
        terracotta: "#C4603B",
        sage: "#7A9E8A",
        charcoal: "#2D2D2D",
        "warm-white": "#FFFDF9",
        primary: "#2C4A3E",
        secondary: "#C9956A",
        dark: "#ffcf22",
        button: "#2D2D2D",
      },
      boxShadow: {
        soft: "0 12px 40px rgba(26, 26, 26, 0.08)",
        luxury: "0 24px 80px rgba(26, 26, 26, 0.14)",
      },
      borderRadius: {
        "4xl": "2rem",
      },
      container: {
        center: true,
        padding: {
          DEFAULT: "1rem",
          sm: "2rem",
          lg: "4rem",
          xl: "5rem",
          "2xl": "6rem",
        },
      },
    },
  },
  plugins: [],
};
