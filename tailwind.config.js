/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "surface-dim": "#121414",
        "inverse-primary": "#00696f",
        "inverse-surface": "#e2e2e2",
        "primary-fixed-dim": "#00dce6",
        "on-error": "#690005",
        "error": "#ffb4ab",
        "on-background": "#e2e2e2",
        "on-primary": "#00373a",
        "on-secondary": "#133057",
        "surface-container": "#1e2020",
        "background": "#121414",
        "on-primary-container": "#006a70",
        "secondary": "#adc7f7",
        "primary": "#e0fdff",
        "surface-bright": "#37393a",
        "secondary-container": "#2f4a72",
        "surface-container-low": "#1a1c1c",
        "on-surface-variant": "#b9cacb",
        "on-surface": "#e2e2e2",
        "surface-container-highest": "#333535",
        "surface": "#121414",
        "surface-tint": "#00dce6",
        "primary-fixed": "#6ff6ff",
        "primary-container": "#00f2fe",
        "outline": "#849495",
        "outline-variant": "#3a494b"
      },
      borderRadius: {
        "DEFAULT": "0.25rem",
        "lg": "0.5rem",
        "xl": "0.75rem",
        "full": "9999px"
      },
      spacing: {
        "gutter": "1.5rem",
        "glass-padding": "1.5rem",
        "container-margin": "2rem",
        "section-gap": "3rem"
      },
      fontFamily: {
        body: ["Inter", "sans-serif"],
        display: ["Outfit", "sans-serif"]
      }
    },
  },
  plugins: [],
}
