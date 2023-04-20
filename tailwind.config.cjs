/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
      },
    },
    fontFamily: {
      inter: ['Inter', 'sans-serif'],
      manrope: ['Manrope', 'sans-serif'],
    },
    extend: {
      colors: {
        primary: {
          DEFAULT: '#5542F6',
          2: '#E666E5',
          3: '#C8C2FC',
        },
        secondary: {
          DEFAULT: '#00A5FF',
          2: '#A7E0FF',
          3: '#D7F1FF',
        },
        error: {
          DEFAULT: '#FC3400',
          2: '#FA699D',
          3: '#FFD5E4',
        },
        success: {
          DEFAULT: '#14B13B',
          2: '#20C9AC',
          3: '#A7FFF0',
        },
        warning: {
          DEFAULT: '#FFA043',
          2: '#FFDFC0',
          3: '#FFF5EB',
        },
        black: {
          DEFAULT: '#2E2C34',
          2: '#504F54',
          3: '#84818A',
          4: '#64748B',
        },
        grey: {
          DEFAULT: '#B6B4BA',
          2: '#E3E1E5',
          3: '#EBEAED',
          4: '#FBFAFC',
          5: '#F9FBFF',
          6: '#E2E8F0',
          7: '#94A3B8',
          8: '#EBEAED',
          9: '#5F6874',
        },
        green: {
          3: '#A7FFF0',
        },
        red: {
          1: '#FFD4E4',
        },
        blue: {
          1: '#00A5FF',
        },
        purple: {
          1: '#5542F6',
        },
      },
    },
  },
  plugins: [],
};
