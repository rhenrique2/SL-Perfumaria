export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        night: '#121212',
        surface: '#1E1E1E',
        line: '#2D2D2D',
        gold: { DEFAULT: '#D4AF37', hover: '#C5A059' },
        ink: { DEFAULT: '#F5F5F5', muted: '#A3A3A3' },
        success: '#4ADE80',
        alert: '#FBBF24',
        danger: '#F87171'
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif']
      }
    }
  },
  plugins: []
}
