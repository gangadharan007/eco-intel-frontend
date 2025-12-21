/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // ✅ YOUR FONTS (DM Sans + Playfair Display)
      fontFamily: {
        'sans': ['DM Sans', 'system-ui', 'sans-serif'],
        'display': ['Playfair Display', 'serif'],
      },
      
      // ✅ YOUR ECO SHADOWS
      boxShadow: {
        'eco-lg': '0 25px 50px -12px rgba(0, 0, 0, 0.1)',
        'eco-xl': '0 35px 60px -12px rgba(0, 0, 0, 0.15)',
      },
      
      // ✅ YOUR ANIMATIONS
      animation: {
        'fade-up': 'fade-up 0.6s ease-out forwards',
        'pulse-soft': 'pulse-soft 3s ease-in-out infinite',
        'leaf-fall': 'leaf-fall 10s linear infinite',
      },
      
      // ✅ YOUR COLORS (CSS Variables)
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        eco: {
          leaf: 'hsl(var(--eco-leaf))',
          sky: 'hsl(var(--eco-sky))',
          sun: 'hsl(var(--eco-sun))',
        },
      },
      
      // ✅ CUSTOM BACKGROUND SIZES
      backgroundSize: {
        'dots': '20px 20px',
      },
    },
  },
  plugins: [],
}
