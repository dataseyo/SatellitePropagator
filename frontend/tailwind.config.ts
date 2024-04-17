import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    colors: {
      'black': {
        100: "#d6d7d8",
        200: "#adb0b1",
        300: "#83888a",
        400: "#5a6163",
        500: "#31393c",
        600: "#272e30",
        700: "#1d2224",
        800: "#141718",
        900: "#0a0b0c"
      },
      'blue': {
          100: "#dde9e5",
          200: "#bad3cb",
          300: "#98bdb2",
          400: "#75a798",
          500: "#53917e",
          600: "#427465",
          700: "#32574c",
          800: "#213a32",
          900: "#111d19"
      },
      'white': {
          100: "#fcfcfd",
          200: "#f9f9fb",
          300: "#f6f5f8",
          400: "#f3f2f6",
          500: "#f0eff4",
          600: "#c0bfc3",
          700: "#908f92",
          800: "#606062",
          900: "#303031"
      },
    },
    extend: {
      colors: {
        "green": "#53917e",
        "red": "#880808"
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [require("daisyui")],
};
export default config;
