/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Mwasalati official brand palette
        brand: {
          brown: "#6D4C41", // primary dark
          cream: "#F2E8D5", // page ground
          gold: "#C7A35A", // accent
          white: "#FAF9F6", // surfaces
        },
      },
      fontFamily: {
        en: ["Montserrat", "system-ui", "sans-serif"],
        ar: ["'Noto Sans Arabic'", "system-ui", "sans-serif"],
      },
      borderRadius: {
        ticket: "0.75rem",
      },
    },
  },
  plugins: [],
};
