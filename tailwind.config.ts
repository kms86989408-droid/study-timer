import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/features/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#1f2933",
        paper: "#f7f5ef",
        moss: "#28604f",
        leaf: "#4d8d65",
        peach: "#d97757",
        wheat: "#e8d6a8",
      },
      boxShadow: {
        soft: "0 18px 50px rgb(31 41 51 / 0.08)",
      },
    },
  },
  plugins: [],
};

export default config;
