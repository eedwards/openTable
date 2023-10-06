// /** @type {import('tailwindcss').Config} */
// module.exports = {
//   content: ['./app/**/*.{js, ts, jsx, tsx}'],
//   theme: {
//     extend: {},
//     fontSize: {
//       '2xsm': '10px',
//       xsm: '12px',
//       sm: '15px',
//       md: '18px',
//       lg: '15px',
//       xlg: '18px',
//       '2xlg': '22px',
//       '3xlg': '25px',
//       '4xlg': '32px',
//       '5xlg': '40px',
//       '6xlg': '50px',
//       '7xlg': '70px',
//     },
//   },
//   plugins: [],
// };

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',

    // Or if using `src` directory:
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {},
    fontSize: {
      '2xsm': '10px',
      xsm: '12px',
      sm: '15px',
      md: '18px',
      lg: '15px',
      xlg: '18px',
      '2xl': '22px',
      '3xl': '25px',
      '4xl': '32px',
      '5xl': '40px',
      '6xl': '50px',
      '7xl': '70px',
    },
  },
  plugins: [],
};
