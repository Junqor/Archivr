/** @type {import('tailwindcss').Config} */
import plugin from "tailwindcss/plugin";
export const darkMode = ["class"];
export const content = ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"];
export const theme = {
  extend: {
    colors: {
      white: {
        DEFAULT: "#f2f2f0",
      },
      blue: {
        DEFAULT: "#163ba6",
      },
      gray: {
        DEFAULT: "#7f7f7e",
      },
      black: {
        DEFAULT: "#0d0d0d",
      },
      purple: {
        DEFAULT: "#5616EC",
      },
      dark: "#242424",
      pill: "#242424",
    },
    borderRadius: {
      lg: "var(--radius)",
      md: "calc(var(--radius) - 2px)",
      sm: "calc(var(--radius) - 4px)",
    },
    backgroundImage: {
      "login-bg":
        "linear-gradient(rgba(13, 13, 13, 0.35), rgba(13, 13, 13, 0.35)), url('../assets/login-bg.png')",
    },
    aspectRatio: {
      "2/3": "2 / 3",
    },
  },
};
export const plugins = [
  require("tailwindcss-animate"),
  plugin(function ({ addUtilities }) {
    addUtilities({
      /* Hide scrollbar for Chrome, Safari and Opera */
      ".no-scrollbar::-webkit-scrollbar": {
        display: "none",
      },

      /* Hide scrollbar for IE, Edge and Firefox */
      ".no-scrollbar": {
        "-ms-overflow-style": "none" /* IE and Edge */,
        "scrollbar-width": "none" /* Firefox */,
      },
    });
  }),
];
