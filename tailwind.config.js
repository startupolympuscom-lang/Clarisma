/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './App.tsx', './index.tsx', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
      colors: {
        clarisma: {
          red: '#450a0a', // Deep Red (Red 950 base) - Replaces Navy
          gold: '#fbbf24', // Amber 400
          orange: '#d97706', // Amber 600
          cream: '#fffbeb', // Amber 50
        },
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInDown: {
          '0%': { opacity: '0', transform: 'translateY(-30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        popIn: {
          '0%': { opacity: '0', transform: 'scale(0.8) translateY(10px)' },
          '100%': { opacity: '1', transform: 'scale(1) translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '200% center' },
          '100%': { backgroundPosition: '-200% center' },
        },
      },
      animation: {
        'fade-in-up': 'fadeInUp 1s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'fade-in-down': 'fadeInDown 1s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'pop-in': 'popIn 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
        shimmer: 'shimmer 6s linear infinite',
      },
    },
  },
  plugins: [],
};
