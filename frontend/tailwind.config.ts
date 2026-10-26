import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef8f6",
          100: "#d4eeea",
          500: "#188f80",
          600: "#117568",
          700: "#105e55"
        }
      }
    }
  },
  plugins: []
};

export default config;
