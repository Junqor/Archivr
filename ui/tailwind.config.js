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
        secondary: "#595958",
      },
      black: {
        DEFAULT: "#0d0d0d",
      },
      purple: {
        DEFAULT: "#5616EC",
      },
      primary: "#5616EC",
      dark: "#242424",
      pill: "#242424",
      muted: "#7F7F7E",
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
      auto: "auto",
      square: "1 / 1",
      video: "16 / 9",
      1: "1",
      2: "2",
      3: "3",
      4: "4",
      5: "5",
      6: "6",
      7: "7",
      8: "8",
      9: "9",
      10: "10",
      11: "11",
      12: "12",
      13: "13",
      14: "14",
      15: "15",
      16: "16",
    },
    textShadow: {
      sm: "0 1px 2px var(--tw-shadow-color)",
      DEFAULT: "0 2px 4px var(--tw-shadow-color)",
      lg: "0 8px 16px var(--tw-shadow-color)",
    },
  },
};
export const plugins = [
  require("tailwindcss-animate"),
  require("@tailwindcss/aspect-ratio"),
  plugin(function ({ addUtilities, matchUtilities, theme }) {
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

      ".flip-y": {
        transform: "scaleY(-1)",
      },
      ".flip-x": {
        transform: "scaleX(-1)",
      },
    });
    matchUtilities({
      "text-shadow": (value) => ({
        textShadow: value,
      }),
      values: theme("textShadow"),
    });
  }),
];
