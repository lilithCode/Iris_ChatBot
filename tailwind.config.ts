import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        aesthetic: {
          lavender: "#DCD0FF",
          purple: "#B19CD9",
          darkPurple: "#7A5C91",
          sakura: "#FFD1DC",
          cloud: "#F8F9FF",
          navy: "#1A1B35", 
        },
      },
      borderRadius: {
        "xl-plus": "2rem",
      },
    },
  },
  plugins: [],
};
export default config;
