/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      screens: {
        tablet: '810px',
        desktop: '1200px',
      },
      colors: {
        dark: {
          canvas: '#0b0b0b',
          card: '#121212',
          elevated: '#181818',
          pure: '#050505',
        },
        orange: {
          accent: '#ff4500',
          hover: '#e63e00',
        },
        gray: {
          canvas: '#e9e9e9',
          light: '#f4f4f4',
          muted: '#d8d8d8',
        },
        lime: {
          accent: '#c7ff97',
        },
      },
      fontFamily: {
        sans: ['"Geist"', '"Inter"', 'system-ui', 'sans-serif'],
        mono: ['"Geist Mono"', 'monospace'],
      },
      maxWidth: {
        content: '1440px',
      },
      animation: {
        marquee: 'marquee 28s linear infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
    },
  },
  plugins: [],
};
