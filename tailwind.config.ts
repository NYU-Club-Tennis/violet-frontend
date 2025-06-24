/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "nyu-purple": "#57068c",
        "nyu-purple-light": "#87189D",
        "nyu-blue": "#0f2d5e",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        serif: ["Merriweather", "serif"],

        // Add your custom font families:
        montserrat: ["Montserrat", "sans-serif"],
        poppins: ["Poppins", "sans-serif"],
        fugaz: ["Fugaz One", "sans-serif"],
        lexend: ["Lexend", "sans-serif"],
        raleway: ["Raleway", "sans-serif"],

        // NYU Perstare Font Families
        "nyu-perstare": ["NYU Perstare", "sans-serif"],
        "nyu-perstare-vf": ["NYU Perstare VF", "sans-serif"],
        "nyu-perstare-condensed": ["NYU Perstare Condensed", "sans-serif"],
        "nyu-perstare-condensed-vf": [
          "NYU Perstare Condensed VF",
          "sans-serif",
        ],
      },
      animation: {
        "fade-in": "fadeIn 1s ease-in",
        "scale-in": "scaleIn 1s ease-in",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        scaleIn: {
          "0%": { transform: "scale(0.8)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};
