/** @type {import('tailwindcss').Config} */

const plugin = require('tailwindcss/plugin');

module.exports = {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{ts,tsx,js,jsx}'],
  theme: {
    extend: {
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      // version - 3
      fontSize: {
        xs: ['clamp(0.375rem, 0.6vw, 0.375rem)', '1.2'], // 6px
        sm: ['clamp(0.5rem, 0.8vw, 0.5625rem)', '1.2'], // 8px → 9px
        base: ['clamp(0.5rem, 0.9vw, 0.5625rem)', '1.2'], // 8px → 9px
        lg: ['clamp(0.5625rem, 1vw, 0.6875rem)', '1.25'], // 9px → 11px
        xl: ['clamp(0.6875rem, 1.2vw, 0.8125rem)', '1.25'], // 11px → 13px
        '2xl': ['clamp(0.8125rem, 1.5vw, 0.875rem)', '1.25'], // 13px → 14px
        '3xl': ['clamp(0.875rem, 1.8vw, 1.125rem)', '1.25'], // 14px → 18px
        '4xl': ['clamp(1.125rem, 2.2vw, 1.3125rem)', '1.25'], // 18px → 21px
        '5xl': ['clamp(1.3125rem, 3vw, 1.5rem)', '1.25'], // 21px → 24px
        '6xl': ['clamp(1.5rem, 4vw, 1.875rem)', '1.25'], // 24px → 30px
        '7xl': ['clamp(1.875rem, 5vw, 2.25rem)', '1.25'], // 30px → 36px
      },
      // version - 2
      // fontSize: {
      //   xs: ['clamp(0.4375rem, 0.7vw, 0.4375rem)', '1.2'], // 7px
      //   sm: ['clamp(0.625rem, 0.9vw, 0.6875rem)', '1.2'], // 10px → 11px
      //   base: ['clamp(0.625rem, 1vw, 0.6875rem)', '1.2'], // 10px → 11px
      //   lg: ['clamp(0.6875rem, 1.2vw, 0.8125rem)', '1.25'], // 11px → 13px
      //   xl: ['clamp(0.8125rem, 1.4vw, 0.9375rem)', '1.25'], // 13px → 15px
      //   '2xl': ['clamp(0.9375rem, 1.8vw, 1rem)', '1.25'], // 15px → 16px
      //   '3xl': ['clamp(1rem, 2.2vw, 1.25rem)', '1.25'], // 16px → 20px
      //   '4xl': ['clamp(1.25rem, 2.7vw, 1.5rem)', '1.25'], // 20px → 24px
      //   '5xl': ['clamp(1.5rem, 3.5vw, 1.75rem)', '1.25'], // 24px → 28px
      //   '6xl': ['clamp(1.75rem, 4.5vw, 2.25rem)', '1.25'], // 28px → 36px
      //   '7xl': ['clamp(2.25rem, 5.5vw, 2.75rem)', '1.25'], // 36px → 44px
      // }

      // version - 1
      // fontSize: {
      //   xs: ['clamp(0.5rem, 0.8vw, 0.5rem)', '1.2'], // 8px
      //   sm: ['clamp(0.6875rem, 1vw, 0.75rem)', '1.2'], // 11px → 12px
      //   base: ['clamp(0.6875rem, 1.1vw, 0.75rem)', '1.2'], // 11px → 12px
      //   lg: ['clamp(0.75rem, 1.3vw, 0.875rem)', '1.25'], // 12px → 14px
      //   xl: ['clamp(0.875rem, 1.6vw, 1rem)', '1.25'], // 14px → 16px
      //   '2xl': ['clamp(1rem, 2vw, 1.125rem)', '1.25'], // 16px → 18px
      //   '3xl': ['clamp(1.125rem, 2.5vw, 1.375rem)', '1.25'], // 18px → 22px
      //   '4xl': ['clamp(1.375rem, 3vw, 1.625rem)', '1.25'], // 22px → 26px
      //   '5xl': ['clamp(1.625rem, 4vw, 2rem)', '1.25'], // 26px → 32px
      //   '6xl': ['clamp(2rem, 5vw, 2.5rem)', '1.25'], // 32px → 40px
      //   '7xl': ['clamp(2.5rem, 6vw, 3rem)', '1.25'], // 40px → 48px
      // },

      fontFamily: {
        custom: ['Inter'],
      },
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          1: 'hsl(var(--chart-1))',
          2: 'hsl(var(--chart-2))',
          3: 'hsl(var(--chart-3))',
          4: 'hsl(var(--chart-4))',
          5: 'hsl(var(--chart-5))',
        },
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))',
        },
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
    plugin(function ({ addVariant }) {
      addVariant('light', '.light &');
    }),
  ],
};
