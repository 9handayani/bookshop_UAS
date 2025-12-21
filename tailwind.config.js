/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pastelBlue: "#E8F0FF",
        pastelBlueSoft: "#DFEAFF",
        pastelBlueLight: "#F7FAFF",
      },
    },
  },
  plugins: [],
};
