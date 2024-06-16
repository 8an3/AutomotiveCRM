
const defaultTheme = require("tailwindcss/defaultTheme");
const { blackA, blue, jade, slate, red, yellow, green } = require("@radix-ui/colors");
const { extendedTheme } = require('./app/utils/extended-theme.ts')

/** @type {import('tailwindcss').Config} */
module.exports = {
  plugins: [
    require("tailwindcss-animate"),
  ],

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
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px',
      },
    },
    colors: {
      ...slate,
      ...blackA,
      ...blue,
      ...red,
      ...jade,
      ...yellow,
      ...green,
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
      border: 'hsl(var(--border))',
      input: {
        DEFAULT: 'hsl(var(--input))',
        invalid: 'hsl(var(--input-invalid))',
      },
      ring: {
        DEFAULT: 'hsl(var(--ring))',
        invalid: 'hsl(var(--foreground-destructive))',
      },
      background: 'hsl(var(--background))',
      foreground: {
        DEFAULT: 'hsl(var(--foreground))',
        destructive: 'hsl(var(--foreground-destructive))',
      },
      primary: {
        DEFAULT: 'hsl(var(--primary))',
        foreground: 'hsl(var(--primary-foreground))',
      },
      secondary: {
        DEFAULT: 'hsl(var(--secondary))',
        foreground: 'hsl(var(--secondary-foreground))',
      },
      destructive: {
        DEFAULT: 'hsl(var(--destructive))',
        foreground: 'hsl(var(--destructive-foreground))',
      },
      muted: {
        DEFAULT: 'hsl(var(--muted))',
        foreground: 'hsl(var(--muted-foreground))',
      },
      accent: {
        DEFAULT: 'hsl(var(--accent))',
        foreground: 'hsl(var(--accent-foreground))',
      },

      card: {
        DEFAULT: 'hsl(var(--card))',
        foreground: 'hsl(var(--card-foreground))',
      },
    },
    /** fontSize: {
      // 1rem = 16px
      80px size / 84px high / bold */
    //   mega: ['5rem', { lineHeight: '5.25rem', fontWeight: '700' }],
    /** 56px size / 62px high / bold */
    ///  h1: ['3.5rem', { lineHeight: '3.875rem', fontWeight: '700' }],
    /** 40px size / 48px high / bold */
    //  h2: ['2.5rem', { lineHeight: '3rem', fontWeight: '700' }],
    /** 32px size / 36px high / bold */
    //   h3: ['2rem', { lineHeight: '2.25rem', fontWeight: '700' }],
    /** 28px size / 36px high / bold */
    //  h4: ['1.75rem', { lineHeight: '2.25rem', fontWeight: '700' }],
    /** 24px size / 32px high / bold */
    //   h5: ['1.5rem', { lineHeight: '2rem', fontWeight: '700' }],
    /** 16px size / 20px high / bold */
    //    h6: ['1rem', { lineHeight: '1.25rem', fontWeight: '700' }],

    /** 32px size / 36px high / normal */
    //    'body-2xl': ['2rem', { lineHeight: '2.25rem' }],
    /** 28px size / 36px high / normal */
    //     'body-xl': ['1.75rem', { lineHeight: '2.25rem' }],
    /** 24px size / 32px high / normal */
    ///     'body-lg': ['1.5rem', { lineHeight: '2rem' }],
    /** 20px size / 28px high / normal */
    //    'body-md': ['1.25rem', { lineHeight: '1.75rem' }],
    /** 16px size / 20px high / normal */
    //   'body-sm': ['1rem', { lineHeight: '1.25rem' }],
    /** 14px size / 18px high / normal */
    //    'body-xs': ['0.875rem', { lineHeight: '1.125rem' }],
    /** 12px size / 16px high / normal */
    //     'body-2xs': ['0.75rem', { lineHeight: '1rem' }],

    /** 18px size / 24px high / semibold */
    //    caption: ['1.125rem', { lineHeight: '1.5rem', fontWeight: '600' }],
    /** 12px size / 16px high / bold */
    //     button: ['0.75rem', { lineHeight: '1rem', fontWeight: '700' }],
    //  },
    keyframes: {
      'caret-blink': {
        '0%,70%,100%': { opacity: '1' },
        '20%,50%': { opacity: '0' },
      },
    },
    animation: {
      'caret-blink': 'caret-blink 1.25s ease-out infinite',
    },
    borderColor: {
      DEFAULT: 'hsl(var(--border))',
    },
    borderRadius: {
      lg: 'var(--radius)',
      md: 'calc(var(--radius) - 4px)',
      sm: 'calc(var(--radius) - 6px)',
    },
    extend: {
      fontFamily: {
        brand: ["bmwHelvetica", ...defaultTheme.fontFamily.sans],
        //   brand: ["Consolas", ...defaultTheme.fontFamily.sans],
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
        'caret-blink': {
          '0%,70%,100%': { opacity: '1' },
          '20%,50%': { opacity: '0' },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        'caret-blink': 'caret-blink 1.25s ease-out infinite',

      },
    },

  },

};

/**      colors: {
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
 */
