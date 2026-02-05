import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#EF641C",
        "dark-brown": "#411600",
        earthy: "#411600",
        "corporate-blue": "#00486B",
        grey: "#838385",
        "neutral-light": "#F9F8F6",
        "neutral-accent": "#E5E7EB",
        "background-light": "#f8f6f6",
        "background-dark": "#221610",
        "brown-deep": "#411600",
        "neutral-grey": "#838385",
      },
      fontFamily: {
        sans: ["var(--font-manrope)", "sans-serif"],
        serif: ["var(--font-playfair)", "serif"],
      },
    },
  },
  plugins: [],
};

export default config;
