import type { Config } from 'tailwindcss';
import defaultTheme from 'tailwindcss/defaultTheme';

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        black: '#000000',
        white: '#FFFFFF',
        gold: {
          50: '#fff9f0',
          100: '#fce9c7',
          200: '#f9d88a',
          300: '#f6c94d',
          400: '#f3b910',
          500: '#d4a017',
          600: '#a37711',
          700: '#6f4e0b',
          800: '#3b2605',
          900: '#0a0a01',
        },
      },
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
        serif: ['Merriweather', ...defaultTheme.fontFamily.serif],
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        zoomIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.6s ease-out forwards',
        zoomIn: 'zoomIn 0.8s ease-out forwards',
      },
    },
  },

  plugins: [],
};

export default config;

