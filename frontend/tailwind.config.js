/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'hostel-orange': '#FF6B35',
        'hostel-orange-dark': '#E55A2B',
        'hostel-grey': '#6B7280',
        'hostel-grey-light': '#F3F4F6',
        'hostel-grey-dark': '#374151',
        'hostel-taupe': '#D4C5B9',
      },
    },
  },
  plugins: [],
}

