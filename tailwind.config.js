module.exports = {
  purge: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      black: {
        DEFAULT: '#000',
      },
      spacing: {
        '3/4': '56.25%',
        '3/4m': '34%',
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
