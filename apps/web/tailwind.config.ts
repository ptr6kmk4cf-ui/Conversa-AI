import type { Config } from 'tailwindcss';

export default {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fff1f4',
          100: '#ffe0e8',
          200: '#ffc6d5',
          300: '#ff9bb4',
          400: '#ff5f88',
          500: '#f8306a',
          600: '#e51456',
          700: '#c10a48',
          800: '#a10c42',
          900: '#890f3d',
        },
        ink: {
          900: '#0f0d17',
          800: '#17141f',
          700: '#211d2c',
          600: '#2d2839',
          500: '#4a4458',
          400: '#7a7389',
          300: '#a9a3b6',
          200: '#d6d2de',
        },
      },
      fontFamily: {
        sans: ['ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config;
