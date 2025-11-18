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
        coral: {
          DEFAULT: '#FF6B6B',
          light: '#FF8787',
          dark: '#FA5252',
        },
        navy: {
          DEFAULT: '#1A1D3A',
          light: '#2D3250',
          dark: '#0F1123',
        },
        cyan: {
          DEFAULT: '#00D9FF',
          light: '#4DFFFF',
        },
        cream: '#FFF8F0',
        sand: '#F4E8D8',
      },
      fontFamily: {
        display: ['Outfit', 'system-ui', 'sans-serif'],
        body: ['Manrope', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
