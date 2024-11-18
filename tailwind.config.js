/** @type {import('tailwindcss').Config} */

export default {
  content: ['./src/**/resources/**/*.(edge|js)', './src/**/inertia/**/*.vue'],
  theme: {
    extend: {},
  },
  plugins: [require('daisyui')],
}
