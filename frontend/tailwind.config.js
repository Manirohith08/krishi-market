/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        green: {
          50:'#f0fdf4',100:'#dcfce7',200:'#bbf7d0',300:'#86efac',
          400:'#4ade80',500:'#22c55e',600:'#16a34a',700:'#15803d',
          800:'#166534',900:'#14532d',950:'#052e16',
        },
        earth: {
          50:'#fdf8f1',100:'#faefd9',200:'#f4daa9',300:'#ebbf6e',
          400:'#e29e3e',500:'#d97b20',600:'#c25d17',700:'#a14315',
        },
        stone: {
          50:'#fafaf9',100:'#f5f5f4',200:'#e7e5e4',300:'#d6d3d1',
          400:'#a8a29e',500:'#78716c',600:'#57534e',700:'#44403c',
          800:'#292524',900:'#1c1917',
        },
      },
      fontFamily: {
        display: ['Lora', 'Georgia', 'serif'],
        body: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease',
        'slide-up': 'slideUp 0.4s ease',
      },
      keyframes: {
        fadeIn: { from:{opacity:'0'}, to:{opacity:'1'} },
        slideUp: { from:{transform:'translateY(16px)',opacity:'0'}, to:{transform:'translateY(0)',opacity:'1'} },
      },
      boxShadow: {
        'green': '0 4px 20px rgba(21,128,61,0.30)',
        'green-lg': '0 8px 32px rgba(21,128,61,0.38)',
      },
    },
  },
  plugins: [],
}
