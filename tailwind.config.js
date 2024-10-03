/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        main: "#0E1D31",
        secondary: "#F9F9F9",
        accent: "#EE4865",
      },
    },
  },
  plugins: [],
};
