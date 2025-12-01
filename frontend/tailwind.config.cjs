/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      boxShadow: {
        glow: "0 0 25px 2px rgba(56,189,248,0.4)",
        soft: "0 4px 30px rgba(0,0,0,0.05)",
      },
      backgroundImage: {
        "gradient-premium": "linear-gradient(135deg, #0ea5e9 0%, #10b981 100%)",
      },
      animation: {
        float: "float 6s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-6px)" },
        },
      },
    },
  },
  plugins: [],
};
