/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
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
          DEFAULT: "#242424",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        dark: "#242424",
        pill: "#242424",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
