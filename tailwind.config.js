const defaultTheme = require("tailwindcss/defaultTheme");
const { blackA, blue, jade, slate } = require("@radix-ui/colors");

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    colors: {
      ...slate,

      ...jade,
      myColor: {
        50: "#f4f6f7",
        100: "#e4e8e9",
        200: "#cbd2d6",
        300: "#a7b2b9",
        400: "#7c8a94",
        500: "#616f79",
        600: "#535d67",
        700: "#474e57",
        800: "#3f454b",
        900: "#363a3f",
        950: "#22262a",
      },
      blue: {
        1: "#0D1520",
        2: "#111927",
        3: "#0D2847",
        4: "#003362",
        5: "#004074",
        6: "#104D87",
        7: "#205D9E",
        8: "#2870BD",
        9: "#3B9EFF",
        10: "#70B8FF",
        11: "#C2E6FF",
      },
      "picton-blue": {
        50: "#eff9ff",
        100: "#def1ff",
        200: "#b6e5ff",
        300: "#75d2ff",
        400: "#2cbcff",
        500: "#02a9ff",
        600: "#0082d4",
        700: "#0067ab",
        800: "#00578d",
        900: "#064974",
        950: "#042e4d",
      },
      stone: {
        50: "#fafaf9",
        100: "#f5f5f4",
        200: "#e7e5e4",
        300: "#d6d3d1",
        400: "#a8a29e",
        500: "#78716c",
        600: "#57534e",
        700: "#44403c",
        800: "#292524",
        900: "#1c1917",
        950: "#0c0a09",
      },
      black: "#000000",
      white: "#ffffff",
    },
    extend: {
      fontFamily: {
        brand: ["bmwHelvetica", ...defaultTheme.fontFamily.sans],
        //   brand: ["Consolas", ...defaultTheme.fontFamily.sans],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        //  background: "black",
        //   foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },

      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],

};
