/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        bgPrimary: '#080B14',
        bgSurface: '#0E1420',
        bgCard: '#111827',
        gold: '#C9A84C',
        goldLight: '#E8C96A',
        goldDark: '#A07830',
        cyan: '#00D4FF',
        textPrimary: '#F0F2F8',
        textMuted: '#6B7A99',
        textDim: '#3D4A66',
      },
      fontFamily: {
        body: ['Inter', 'sans-serif'],
        display: ['Playfair Display', 'serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'fade-up': 'fadeInUp 0.8s ease forwards',
        'fade-left': 'fadeInLeft 0.8s ease forwards',
        'fade-right': 'fadeInRight 0.8s ease forwards',
        'float': 'float 4s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'spin-slow': 'spin-slow 8s linear infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'slide-down': 'slideInDown 0.5s ease forwards',
      },
      keyframes: {
        fadeInUp: {
          from: { opacity: '0', transform: 'translateY(30px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInLeft: {
          from: { opacity: '0', transform: 'translateX(-30px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        fadeInRight: {
          from: { opacity: '0', transform: 'translateX(30px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(201,168,76,0.2)' },
          '50%': { boxShadow: '0 0 40px rgba(201,168,76,0.5), 0 0 60px rgba(201,168,76,0.2)' },
        },
        'spin-slow': {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        slideInDown: {
          from: { opacity: '0', transform: 'translateY(-20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      backgroundImage: {
        'gradient-gold': 'linear-gradient(135deg, #C9A84C, #A07830)',
        'gradient-gold-light': 'linear-gradient(135deg, #E8C96A, #C9A84C)',
        'gradient-hero': 'radial-gradient(ellipse 80% 80% at 50% -10%, rgba(201,168,76,0.12) 0%, transparent 60%)',
      },
    },
  },
  plugins: [],
};
