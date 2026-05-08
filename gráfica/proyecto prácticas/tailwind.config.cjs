/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Manrope', 'Inter', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: '#007BFF',
        'primary-dark': '#0056B3',
        accent: '#17A2B8',
        background: '#F0F2F5',
        surface: '#FFFFFF',
        'text-primary': '#212529',
        'text-secondary': '#6C757D',
        border: '#DEE2E6',
        success: '#28A745',
        error: '#DC3545',
        warning: '#FFC107',
        dark: {
          primary: '#4DA6FF',
          'primary-darker': '#007BFF',
          accent: '#20C997',
          background: '#1A202C',
          surface: '#2D3748',
          'text-primary': '#E2E8F0',
          'text-secondary': '#A0AEC0',
          border: '#4A5568',
        },
      },
      boxShadow: {
        card: '0 4px 12px rgba(0, 123, 255, 0.08)',
        'card-hover': '0 8px 20px rgba(0, 123, 255, 0.15)',
        pop: '0 10px 30px rgba(0, 123, 255, 0.2)',
      },
      borderRadius: {
        xl: '12px',
        '2xl': '16px',
      },
    },
  },
  plugins: [],
};

