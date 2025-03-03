/* eslint-disable @typescript-eslint/no-require-imports */
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-geist-sans)"],
        mono: ["var(--font-geist-mono)"],
      },
      colors: {
        primary: {
          DEFAULT: "#6200EA",
          50: "#F2E7FF",
          100: "#D1C4E9",
          200: "#B39DDB",
          300: "#9575CD",
          400: "#7E57C2",
          500: "#6200EA",
          600: "#5E35B1",
          700: "#512DA8",
          800: "#4527A0",
          900: "#311B92",
        },
        secondary: {
          DEFAULT: "#00BFA5",
          50: "#E0F2F1",
          100: "#B2DFDB",
          200: "#80CBC4",
          300: "#4DB6AC",
          400: "#26A69A",
          500: "#00BFA5",
          600: "#00897B",
          700: "#00796B",
          800: "#00695C",
          900: "#004D40",
        },
        accent: {
          DEFAULT: "#FF6D00",
          50: "#FFF3E0",
          100: "#FFE0B2",
          200: "#FFCC80",
          300: "#FFB74D",
          400: "#FFA726",
          500: "#FF6D00",
          600: "#FB8C00",
          700: "#F57C00",
          800: "#EF6C00",
          900: "#E65100",
        },
        background: {
          light: "#FFFFFF",
          dark: "#0a0a0a",
        },
        surface: {
          light: "#F5F5F5",
          dark: "#1E1E1E",
        },
        foreground: {
          light: "#171717",
          dark: "#ededed",
        },
      },
      fontSize: {
        "2xs": "0.625rem",
      },
      animation: {
        "spin-slow": "spin 3s linear infinite",
        "pulse-subtle": "pulse 4s ease-in-out infinite",
        float: "float 3s ease-in-out infinite",
        shimmer: "shimmer 1.5s infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-500px 0" },
          "100%": { backgroundPosition: "500px 0" },
        },
      },
      boxShadow: {
        glow: "0 0 15px rgba(98, 0, 234, 0.5)",
        neon: "0 0 10px rgba(0, 191, 165, 0.7), 0 0 20px rgba(0, 191, 165, 0.5)",
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
    require("@tailwindcss/forms")({ strategy: "class" }),
  ],
};

export default config;
