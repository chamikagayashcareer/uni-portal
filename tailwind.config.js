module.exports = {
  content: ['./app/**/*.{js,jsx}', './components/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        forest: { DEFAULT: '#12332B', soft: '#1D4A3E', line: '#2C6354' },
        gold: { DEFAULT: '#D9A441', dark: '#B5832A' },
        paper: '#F3F4F1',
      },
      fontFamily: { display: ['var(--font-display)', 'Georgia', 'serif'], sans: ['var(--font-body)', 'system-ui', 'sans-serif'] },
    },
  },
  plugins: [],
};
