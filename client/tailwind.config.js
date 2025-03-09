const {
  default: flattenColorPalette,
} = require("tailwindcss/lib/util/flattenColorPalette");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}",
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "node_modules/shadcn-ui/**/*.js",
  ],
  darkMode: "class",
  theme: {
    extend: {
      animation: {
        fadeIn: "fadeIn 0.8s ease-out forwards",
        shake: "shake 0.5s cubic-bezier(.36,.07,.19,.97) both",
        pulse: "pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        fadeInModal: "fadeInModal 0.3s ease-out forwards",
        scaleIn: "scaleIn 0.3s ease-out forwards",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shake: {
          "0%, 100%": { transform: "translateX(0)" },
          "10%, 30%, 50%, 70%, 90%": { transform: "translateX(-5px)" },
          "20%, 40%, 60%, 80%": { transform: "translateX(5px)" }
        },
        pulse: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" }
        },
        fadeInModal: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" }
        },
        scaleIn: {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" }
        }
      },
    },
  },
  plugins: [
    require("flowbite/plugin"),
    require("tailwind-scrollbar"),
    addVariablesForColors, // Adding the custom plugin
  ],
};

// This plugin adds each Tailwind color as a global CSS variable, e.g., var(--gray-200).
function addVariablesForColors({ addBase, theme }) {
  let allColors = flattenColorPalette(theme("colors"));
  let newVars = Object.fromEntries(
    Object.entries(allColors).map(([key, val]) => [`--${key}`, val])
  );

  addBase({
    ":root": newVars,
  });
}