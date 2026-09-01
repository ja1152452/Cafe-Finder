/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        coffee: {
          50: '#FDFBF7',
          100: '#F7F2EA',
          200: '#EFE5D5',
          300: '#DCC7A7',
          400: '#C2A176',
          500: '#9E7444',
          600: '#7B542B',
          700: '#5F3D1C',
          800: '#432810',
          900: '#2A1708',
          950: '#170B03',
        },
        brand: {
          primary: '#D97706',
          hover: '#B45309',
          light: '#FEF3C7',
          dark: '#78350F',
        },
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
        'card': '0 10px 30px -5px rgba(0, 0, 0, 0.08)',
        'glow': '0 0 25px rgba(217, 119, 6, 0.25)',
      },
      keyframes: {
        'heart-burst': {
          '0%': { transform: 'scale(1)' },
          '40%': { transform: 'scale(1.35)' },
          '70%': { transform: 'scale(0.9)' },
          '100%': { transform: 'scale(1)' },
        },
        'pulse-subtle': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
      },
      animation: {
        'heart-burst': 'heart-burst 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        'pulse-subtle': 'pulse-subtle 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
}
