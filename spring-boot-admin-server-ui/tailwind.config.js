const {colors: defaultColors} = require('tailwindcss/defaultTheme')

const colors = {
  ...defaultColors,
  ...{
    'orange': {
      DEFAULT: '#ED8936',
      '50': '#FCECDF',
      '100': '#FAE1CC',
      '200': '#F7CBA6',
      '300': '#F4B581',
      '400': '#F09F5B',
      '500': '#ED8936',
      '600': '#D86C13',
      '700': '#A4520F',
      '800': '#71390A',
      '900': '#3D1F05'
    },
    'teal': {
      DEFAULT: '#38B2AC',
      '50': '#B9E9E7',
      '100': '#A9E4E1',
      '200': '#8ADAD6',
      '300': '#6BD0CB',
      '400': '#4CC7C1',
      '500': '#38B2AC',
      '600': '#2B8783',
      '700': '#1D5D5A',
      '800': '#103230',
      '900': '#020707'
    },
  },
}
module.exports = {
  purge: [],
  darkMode: 'class',
  theme: {
    colors,
    extend: {
      columns: {
        '2': '14rem',
      },
      fontSize: {
        '9xl': '7rem',
      }
    }
  },
  variants: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}
