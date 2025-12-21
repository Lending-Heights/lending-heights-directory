/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'lh-blue': '#0058A9',
        'lh-red': '#FF2260',
        'lh-yellow': '#E2C20A',
        'lh-light-blue': '#00B0FF',
        'lh-dark-blue': '#002547',
        'lh-text': '#1E1E1E',
        'lh-secondary-text': '#667085',
        'lh-border': '#E5E7EB',
        'lh-bg': '#F8FAFC',
      },
      fontFamily: {
        poppins: ['Poppins', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
      backgroundImage: {
        'lh-gradient': 'linear-gradient(90deg, #0058A9, #FF2260)',
        'lh-gradient-secondary': 'linear-gradient(90deg, #FAA819, #FF2260)',
      },
    },
  },
  plugins: [],
}
