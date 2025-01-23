import withMT from '@material-tailwind/react/utils/withMT'

/** @type {import('tailwindcss').Config} */
export default withMT({
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      backdropBlur: {
        sm: '4px',
      }
      // colors: {
      //   customGreen: {
      //     50: '#e4f2f1',
      //     100: '#c9e4e2',
      //     200: '#8fcbc6',
      //     300: '#5593a0',
      //     400: '#1b5d6d',
      //     500: '#106861', // base color
      //     600: '#0f6057',
      //     700: '#0e564d',
      //     800: '#0b433e',
      //     900: '#08332f',
      //   },
      // },
    },
  },
  plugins: [],
})
