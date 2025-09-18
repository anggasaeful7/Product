import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/**/*.{ts,tsx,mdx}',
    './components/**/*.{ts,tsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        primary: '#60A5FA',
        secondary: '#3B82F6',
        accent: '#F59E0B',
        dark: '#0F172A',
        light: '#F8FAFC'
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif']
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        glow: 'glow 2s ease-in-out infinite alternate',
        'slide-up': 'slideUp 0.8s ease-out',
        'fade-in': 'fadeIn 1s ease-out'
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' }
        },
        glow: {
          from: { boxShadow: '0 0 20px #60A5FA40' },
          to: { boxShadow: '0 0 30px #60A5FA80, 0 0 40px #60A5FA40' }
        },
        slideUp: {
          from: { transform: 'translateY(30px)', opacity: '0' },
          to: { transform: 'translateY(0)', opacity: '1' }
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' }
        }
      }
    }
  },
  plugins: []
};

export default config;
