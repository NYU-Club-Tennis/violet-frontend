/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "nyu-purple": "#57068c",
        "nyu-purple-light": "#87189D",
        "nyu-blue": "#0f2d5e",
        // Primary and secondary colors for Ant Design theme
        primary: "#57068c",
        secondary: "#0f2d5e",
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
      boxShadow: {
        "3xl": "0 35px 60px -12px rgba(0, 0, 0, 0.25)",
        glass: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
        "glass-lg": "0 12px 40px 0 rgba(31, 38, 135, 0.37)",
        "glass-xl": "0 16px 48px 0 rgba(31, 38, 135, 0.37)",
        "purple-glow": "0 0 20px rgba(139, 92, 246, 0.3)",
        "purple-glow-lg": "0 0 30px rgba(139, 92, 246, 0.4)",
      },
      animation: {
        "fade-in": "fadeIn 1s ease-in",
        "scale-in": "scaleIn 1s ease-in",
        float: "float 6s ease-in-out infinite",
        glow: "glow 2s ease-in-out infinite alternate",
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
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        glow: {
          "0%": { boxShadow: "0 0 20px rgba(139, 92, 246, 0.3)" },
          "100%": { boxShadow: "0 0 30px rgba(139, 92, 246, 0.6)" },
        },
      },
    },
  },
  plugins: [],
};

// Export colors for use in other files
export const themeColors = {
  primary: "#57068c",
  secondary: "#0f2d5e",
  purple: "#57068c",
  purpleLight: "#87189D",
  blue: "#0f2d5e",
  // Ant Design theme colors
  success: "#52c41a",
  warning: "#faad14",
  error: "#ff4d4f",
  info: "#0f2d5e",
} as const;
