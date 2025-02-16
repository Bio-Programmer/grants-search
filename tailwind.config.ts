import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
    colors: {
      'transparent': 'transparent',
      'current': 'currentColor',
      'cool-grey': '#53565a',
      'black': {
        1000: '#1e1d19',
        900: '#2e2d29',
        800: '#43423E',
        700: '#585754',
        600: '#6D6C69',
        500: '#767674',
        400: '#979694',
        300: '#ABABA9',
        200: '#C0C0BF',
        100: '#D5D5D4',
        50: '#EAEAEA',
        25: '#F4F4F4',
      },
      'white': '#ffffff',
      'cardinal-red': '#8c1515',
      'cardinal-red-light': '#b83a4b',
      'cardinal-red-dark': '#820000',
      'digital-red': '#B1040E',
      'digital-red-light': '#E50808',
      'digital-red-dark': '#820000',
      'digital-blue': '#006CB8',
      'digital-blue-light': '#6FC3FF',
      'digital-blue-dark': '#00548f',
      'digital-green': '#008566',
      'digital-green-light': '#1AECBA',
      'digital-green-dark': '#006F54',
      'illuminated': '#FEDD5C',
      'illuminated-light': '#FFE781',
      'illuminated-dark': '#FEC51D'
    }
  },
  plugins: [],
};
export default config;