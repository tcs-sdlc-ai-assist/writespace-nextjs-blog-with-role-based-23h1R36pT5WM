/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f5f3ff",
          100: "#ede9fe",
          200: "#ddd6fe",
          300: "#c4b5fd",
          400: "#a78bfa",
          500: "#8b5cf6",
          600: "#7c3aed",
          700: "#6d28d9",
          800: "#5b21b6",
          900: "#4c1d95",
          950: "#2e1065",
        },
        accent: {
          50: "#eef2ff",
          100: "#e0e7ff",
          200: "#c7d2fe",
          300: "#a5b4fc",
          400: "#818cf8",
          500: "#6366f1",
          600: "#4f46e5",
          700: "#4338ca",
          800: "#3730a3",
          900: "#312e81",
          950: "#1e1b4e",
        },
        surface: {
          50: "#fafafa",
          100: "#f4f4f5",
          200: "#e4e4e7",
          300: "#d4d4d8",
          400: "#a1a1aa",
          500: "#71717a",
          600: "#52525b",
          700: "#3f3f46",
          800: "#27272a",
          900: "#18181b",
          950: "#09090b",
        },
        badge: {
          admin: "#7c3aed",
          editor: "#4f46e5",
          author: "#6366f1",
          reader: "#a78bfa",
        },
      },
      backgroundImage: {
        "gradient-brand": "linear-gradient(135deg, #7c3aed 0%, #4f46e5 50%, #6366f1 100%)",
        "gradient-brand-hover": "linear-gradient(135deg, #6d28d9 0%, #4338ca 50%, #4f46e5 100%)",
        "gradient-subtle": "linear-gradient(135deg, #ede9fe 0%, #e0e7ff 100%)",
        "gradient-dark": "linear-gradient(135deg, #4c1d95 0%, #312e81 100%)",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
        serif: ["Merriweather", "Georgia", "serif"],
        mono: ["JetBrains Mono", "Fira Code", "monospace"],
      },
      boxShadow: {
        "brand-sm": "0 1px 2px 0 rgba(124, 58, 237, 0.05)",
        "brand": "0 1px 3px 0 rgba(124, 58, 237, 0.1), 0 1px 2px -1px rgba(124, 58, 237, 0.1)",
        "brand-md": "0 4px 6px -1px rgba(124, 58, 237, 0.1), 0 2px 4px -2px rgba(124, 58, 237, 0.1)",
        "brand-lg": "0 10px 15px -3px rgba(124, 58, 237, 0.1), 0 4px 6px -4px rgba(124, 58, 237, 0.1)",
      },
      borderRadius: {
        "4xl": "2rem",
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-in-out",
        "slide-up": "slideUp 0.3s ease-out",
        "slide-down": "slideDown 0.3s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideDown: {
          "0%": { opacity: "0", transform: "translateY(-10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};